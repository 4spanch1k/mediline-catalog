import { existsSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import ExcelJS from "exceljs";
import type {
  CategoryId,
  LocalizedText,
  ProductFeature,
  ProductSeed,
} from "../src/types";
import { specificationSchema } from "../src/data/specSchema";

const categories = new Set<CategoryId>([
  "lighting",
  "televisions",
  "plumbing",
  "medical",
]);
const sourcePath = process.argv[2];
const dryRun = process.argv.includes("--dry-run");

function cellText(
  row: ExcelJS.Row,
  column: Map<string, number>,
  key: string,
): string {
  const index = column.get(key);
  return index ? row.getCell(index).text.trim() : "";
}

function localizedText(
  row: ExcelJS.Row,
  column: Map<string, number>,
  prefix: string,
): LocalizedText {
  return {
    ru: cellText(row, column, `${prefix}_ru`),
    kz: cellText(row, column, `${prefix}_kz`),
    en: cellText(row, column, `${prefix}_en`),
  };
}

function parseNumber(value: string, label: string, rowNumber: number): number {
  const number = Number(value.replace(/[\s,]/g, ""));
  if (!Number.isFinite(number))
    throw new Error(`Строка ${rowNumber}: неверное поле ${label}`);
  return number;
}

function parseStock(value: string, rowNumber: number): boolean {
  if (["1", "true", "yes", "да"].includes(value.toLowerCase())) return true;
  if (["0", "false", "no", "нет"].includes(value.toLowerCase())) return false;
  throw new Error(
    `Строка ${rowNumber}: inStock должен быть true/false, 1/0, yes/no или да/нет`,
  );
}

function parseSpecifications(
  row: ExcelJS.Row,
  columns: Map<string, number>,
  category: CategoryId,
  rowNumber: number,
): ProductFeature[] {
  const categoryKeys = new Set(
    specificationSchema[category].flatMap((group) =>
      group.specifications.map((definition) => definition.key),
    ),
  );
  const specificationColumns = [...columns.keys()].filter((key) =>
    key.startsWith("spec."),
  );
  const invalidColumn = specificationColumns.find((column) => {
    const key = column.match(/^spec\.(.+)_(ru|kz|en)$/)?.[1];
    return !key || !categoryKeys.has(key);
  });
  if (invalidColumn) {
    throw new Error(
      `Строка ${rowNumber}: неверный столбец характеристики ${invalidColumn} для категории ${category}`,
    );
  }

  return [...categoryKeys].flatMap((key) => {
    const value: LocalizedText = {
      ru: cellText(row, columns, `spec.${key}_ru`),
      kz: cellText(row, columns, `spec.${key}_kz`),
      en: cellText(row, columns, `spec.${key}_en`),
    };
    const translations = Object.values(value);
    if (translations.every((part) => !part)) return [];
    if (translations.some((part) => !part)) {
      throw new Error(
        `Строка ${rowNumber}: spec.${key} заполните на ru, kz и en`,
      );
    }
    return [{ key, value }];
  });
}

async function readWorksheet(filePath: string): Promise<ExcelJS.Worksheet> {
  const workbook = new ExcelJS.Workbook();
  if (path.extname(filePath).toLowerCase() === ".csv") {
    return workbook.csv.readFile(filePath);
  }
  await workbook.xlsx.readFile(filePath);
  const sheet = workbook.worksheets[0];
  if (!sheet) throw new Error("В файле Excel нет листа с товарами");
  return sheet;
}

async function main() {
  if (!sourcePath || !existsSync(sourcePath)) {
    throw new Error(
      "Укажите путь к CSV или XLSX: npm run products:import -- products.csv",
    );
  }

  const sheet = await readWorksheet(sourcePath);
  const header = sheet.getRow(1);
  const columns = new Map<string, number>();
  header.eachCell((cell, columnNumber) =>
    columns.set(cell.text.trim(), columnNumber),
  );

  const required = [
    "category",
    "brand",
    "model",
    "kind_ru",
    "kind_kz",
    "kind_en",
    "price",
    "inStock",
    "rating",
  ];
  const missing = required.filter((key) => !columns.has(key));
  if (missing.length)
    throw new Error(`Не найдены столбцы: ${missing.join(", ")}`);

  const seeds: ProductSeed[] = [];
  const seenProducts = new Set<string>();
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    const category = cellText(row, columns, "category") as CategoryId;
    const brand = cellText(row, columns, "brand");
    const model = cellText(row, columns, "model");
    if (!categories.has(category))
      throw new Error(`Строка ${rowNumber}: неизвестная категория ${category}`);
    if (!brand || !model)
      throw new Error(`Строка ${rowNumber}: brand и model обязательны`);

    const uniqueKey = `${category}:${brand}:${model}`.toLocaleLowerCase();
    if (seenProducts.has(uniqueKey))
      throw new Error(
        `Строка ${rowNumber}: повторяется товар ${brand} ${model}`,
      );
    seenProducts.add(uniqueKey);

    const price = parseNumber(
      cellText(row, columns, "price"),
      "price",
      rowNumber,
    );
    const oldPriceText = cellText(row, columns, "oldPrice");
    const oldPrice = oldPriceText
      ? parseNumber(oldPriceText, "oldPrice", rowNumber)
      : undefined;
    const ratingText = cellText(row, columns, "rating");
    const rating = ratingText
      ? parseNumber(ratingText, "rating", rowNumber)
      : 0;
    if (price <= 0 || (oldPrice !== undefined && oldPrice <= price))
      throw new Error(`Строка ${rowNumber}: проверьте цену и oldPrice`);
    if (rating < 0 || rating > 5)
      throw new Error(`Строка ${rowNumber}: рейтинг должен быть от 0 до 5`);

    const photos = cellText(row, columns, "photos").split("|").filter(Boolean);
    for (const photo of photos) {
      const localPath = path.join("public", photo.replace(/^\//, ""));
      if (!photo.startsWith("/assets/products/") || !existsSync(localPath)) {
        throw new Error(
          `Строка ${rowNumber}: фото должно существовать локально в public/assets/products`,
        );
      }
    }

    const name = localizedText(row, columns, "name");
    const description = localizedText(row, columns, "description");
    seeds.push({
      category,
      brand,
      model,
      kind: localizedText(row, columns, "kind"),
      name: Object.values(name).every(Boolean) ? name : undefined,
      description: Object.values(description).every(Boolean)
        ? description
        : undefined,
      price,
      oldPrice,
      inStock: parseStock(cellText(row, columns, "inStock"), rowNumber),
      rating,
      reviews: cellText(row, columns, "reviews")
        ? parseNumber(cellText(row, columns, "reviews"), "reviews", rowNumber)
        : undefined,
      addedAt: new Date().toISOString().slice(0, 10),
      isDemo: false,
      photos,
      specifications: parseSpecifications(row, columns, category, rowNumber),
    });
  });

  if (seeds.length === 0) throw new Error("Файл не содержит строк товаров");
  if (dryRun) {
    process.stdout.write(
      `Проверено товаров: ${seeds.length}. Файл данных не изменён.\n`,
    );
    return;
  }

  await writeFile(
    "src/data/imported-products.json",
    `${JSON.stringify(seeds, null, 2)}\n`,
  );
  process.stdout.write(
    `Импортировано товаров: ${seeds.length} → src/data/imported-products.json\n`,
  );
}

main().catch((error: unknown) => {
  process.stderr.write(
    `${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exitCode = 1;
});

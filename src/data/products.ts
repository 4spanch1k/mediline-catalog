import type {
  CategoryId,
  LocalizedText,
  Product,
  ProductFeature,
  ProductSeed,
} from "../types";
import importedSeeds from "./imported-products.json";
import { siteConfig } from "../config/site";
import { specificationKeyFromLabel } from "./specSchema";

const text = (ru: string, kz: string, en: string): LocalizedText => ({
  ru,
  kz,
  en,
});
const feature = (key: LocalizedText, value: LocalizedText): ProductFeature => ({
  key: specificationKeyFromLabel(key.ru),
  value,
});

const product = (seed: ProductSeed, index: number): Product => {
  const slug = `${seed.brand}-${seed.model}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const name =
    seed.name ??
    text(
      `${seed.brand} ${seed.model}`,
      `${seed.brand} ${seed.model}`,
      `${seed.brand} ${seed.model}`,
    );
  const description =
    seed.description ??
    text(
      `${seed.kind.ru} ${seed.model} для дома и повседневного использования. Основные параметры указаны в характеристиках.`,
      `${seed.kind.kz} ${seed.model} үйде және күнделікті пайдалануға арналған. Негізгі параметрлері сипаттамаларда көрсетілген.`,
      `${seed.kind.en} ${seed.model} for home and everyday use. Key details are listed in the specifications.`,
    );

  return {
    id: `${seed.category}-${slug}`,
    slug,
    category: seed.category,
    subcategory: seed.kind,
    brand: seed.brand,
    name,
    description,
    price: seed.price,
    oldPrice: seed.oldPrice,
    inStock: seed.inStock,
    rating: seed.rating,
    specifications: seed.specifications,
    photos: seed.photos ?? [
      `/assets/products/${seed.category}/${slug}-front.jpg`,
      `/assets/products/${seed.category}/${slug}-angle.jpg`,
    ],
    tags:
      seed.isDemo === false
        ? []
        : [text("Демо-товар", "Демо тауар", "Demo product")],
    addedAt:
      seed.addedAt ??
      new Date(Date.UTC(2026, 8, 30 - index)).toISOString().slice(0, 10),
    isDemo: seed.isDemo ?? true,
    reviews: seed.reviews ?? 26 + ((index * 47) % 3200),
  };
};

const seeds: ProductSeed[] = [
  // Lighting
  {
    category: "lighting",
    brand: "Philips",
    model: "LED Classic 9W E27",
    kind: text("светодиодная лампа", "жарықдиодты шам", "LED bulb"),
    price: 1890,
    oldPrice: 2290,
    inStock: true,
    rating: 4.8,
    specifications: [
      feature(text("Мощность", "Қуат", "Power"), text("9 Вт", "9 Вт", "9 W")),
      feature(text("Цоколь", "Цоколь", "Base"), text("E27", "E27", "E27")),
      feature(
        text("Температура света", "Жарық температурасы", "Color temperature"),
        text("2700 К", "2700 К", "2700 K"),
      ),
    ],
  },
  {
    category: "lighting",
    brand: "Gauss",
    model: "A60 12W E27",
    kind: text("светодиодная лампа", "жарықдиодты шам", "LED bulb"),
    price: 2450,
    inStock: true,
    rating: 4.7,
    specifications: [
      feature(
        text("Мощность", "Қуат", "Power"),
        text("12 Вт", "12 Вт", "12 W"),
      ),
      feature(text("Цоколь", "Цоколь", "Base"), text("E27", "E27", "E27")),
      feature(
        text("Температура света", "Жарық температурасы", "Color temperature"),
        text("4000 К", "4000 К", "4000 K"),
      ),
    ],
  },
  {
    category: "lighting",
    brand: "Navigator",
    model: "NLL-P-GX53-10W",
    kind: text("светодиодная лампа", "жарықдиодты шам", "LED bulb"),
    price: 2150,
    inStock: true,
    rating: 4.5,
    specifications: [
      feature(
        text("Мощность", "Қуат", "Power"),
        text("10 Вт", "10 Вт", "10 W"),
      ),
      feature(text("Цоколь", "Цоколь", "Base"), text("GX53", "GX53", "GX53")),
      feature(
        text("Температура света", "Жарық температурасы", "Color temperature"),
        text("4000 К", "4000 К", "4000 K"),
      ),
    ],
  },
  {
    category: "lighting",
    brand: "Feron",
    model: "AL530 7W GU10",
    kind: text("лампа-спот", "спот-шам", "spotlight bulb"),
    price: 1680,
    inStock: false,
    rating: 4.4,
    specifications: [
      feature(text("Мощность", "Қуат", "Power"), text("7 Вт", "7 Вт", "7 W")),
      feature(text("Цоколь", "Цоколь", "Base"), text("GU10", "GU10", "GU10")),
      feature(
        text("Температура света", "Жарық температурасы", "Color temperature"),
        text("3000 К", "3000 К", "3000 K"),
      ),
    ],
  },
  {
    category: "lighting",
    brand: "Yeelight",
    model: "Mesh Spotlight M2",
    kind: text("умный спот", "ақылды спот", "smart spotlight"),
    price: 18900,
    oldPrice: 21900,
    inStock: true,
    rating: 4.6,
    specifications: [
      feature(text("Мощность", "Қуат", "Power"), text("4 Вт", "4 Вт", "4 W")),
      feature(text("Цоколь", "Цоколь", "Base"), text("GU10", "GU10", "GU10")),
      feature(text("Тип", "Түрі", "Type"), text("умный", "ақылды", "smart")),
    ],
  },
  {
    category: "lighting",
    brand: "Arlight",
    model: "Slim Panel 36W 600x600",
    kind: text("светодиодная панель", "жарықдиодты панель", "LED panel"),
    price: 25900,
    inStock: true,
    rating: 4.7,
    specifications: [
      feature(
        text("Мощность", "Қуат", "Power"),
        text("36 Вт", "36 Вт", "36 W"),
      ),
      feature(text("Тип", "Түрі", "Type"), text("панель", "панель", "panel")),
      feature(
        text("Температура света", "Жарық температурасы", "Color temperature"),
        text("4000 К", "4000 К", "4000 K"),
      ),
    ],
  },
  {
    category: "lighting",
    brand: "Eglo",
    model: "Fueva 5 Ceiling Light",
    kind: text("потолочный светильник", "төбелік шам", "ceiling light"),
    price: 45900,
    inStock: true,
    rating: 4.8,
    specifications: [
      feature(
        text("Мощность", "Қуат", "Power"),
        text("20 Вт", "20 Вт", "20 W"),
      ),
      feature(
        text("Тип", "Түрі", "Type"),
        text("потолочный", "төбелік", "ceiling"),
      ),
      feature(text("Цвет", "Түсі", "Color"), text("белый", "ақ", "white")),
    ],
  },
  {
    category: "lighting",
    brand: "Feron",
    model: "Светильник AL300 12W",
    kind: text(
      "встраиваемый светильник",
      "кіріктірілген шам",
      "recessed light",
    ),
    price: 3950,
    inStock: true,
    rating: 4.3,
    specifications: [
      feature(
        text("Мощность", "Қуат", "Power"),
        text("12 Вт", "12 Вт", "12 W"),
      ),
      feature(
        text("Тип", "Түрі", "Type"),
        text("встраиваемый", "кіріктірілген", "recessed"),
      ),
      feature(
        text("Температура света", "Жарық температурасы", "Color temperature"),
        text("4000 К", "4000 К", "4000 K"),
      ),
    ],
  },
  {
    category: "lighting",
    brand: "Eglo",
    model: "Pasteri Floor Lamp",
    kind: text("напольный светильник", "едендік шам", "floor lamp"),
    price: 69900,
    inStock: true,
    rating: 4.6,
    specifications: [
      feature(
        text("Мощность", "Қуат", "Power"),
        text("60 Вт", "60 Вт", "60 W"),
      ),
      feature(text("Цоколь", "Цоколь", "Base"), text("E27", "E27", "E27")),
      feature(
        text("Тип", "Түрі", "Type"),
        text("напольный", "едендік", "floor"),
      ),
    ],
  },
  {
    category: "lighting",
    brand: "Gauss",
    model: "Downlight 18W",
    kind: text(
      "встраиваемый светильник",
      "кіріктірілген шам",
      "recessed light",
    ),
    price: 6900,
    inStock: true,
    rating: 4.5,
    specifications: [
      feature(
        text("Мощность", "Қуат", "Power"),
        text("18 Вт", "18 Вт", "18 W"),
      ),
      feature(
        text("Тип", "Түрі", "Type"),
        text("встраиваемый", "кіріктірілген", "recessed"),
      ),
      feature(
        text("Температура света", "Жарық температурасы", "Color temperature"),
        text("6500 К", "6500 К", "6500 K"),
      ),
    ],
  },
  {
    category: "lighting",
    brand: "Arlight",
    model: "RT 2-5000 24V",
    kind: text("светодиодная лента", "жарықдиодты таспа", "LED strip"),
    price: 11900,
    inStock: true,
    rating: 4.6,
    specifications: [
      feature(
        text("Мощность", "Қуат", "Power"),
        text("14,4 Вт/м", "14,4 Вт/м", "14.4 W/m"),
      ),
      feature(text("Тип", "Түрі", "Type"), text("лента", "таспа", "strip")),
      feature(
        text("Напряжение", "Кернеу", "Voltage"),
        text("24 В", "24 В", "24 V"),
      ),
    ],
  },
  {
    category: "lighting",
    brand: "Yeelight",
    model: "Lightstrip Pro 2m",
    kind: text("умная LED-лента", "ақылды LED-таспа", "smart LED strip"),
    price: 32900,
    inStock: true,
    rating: 4.7,
    specifications: [
      feature(
        text("Мощность", "Қуат", "Power"),
        text("24 Вт", "24 Вт", "24 W"),
      ),
      feature(
        text("Тип", "Түрі", "Type"),
        text("умная лента", "ақылды таспа", "smart strip"),
      ),
      feature(text("Длина", "Ұзындығы", "Length"), text("2 м", "2 м", "2 m")),
    ],
  },
  {
    category: "lighting",
    brand: "Feron",
    model: "LL-921 50W IP65",
    kind: text("уличный прожектор", "көше прожекторы", "outdoor floodlight"),
    price: 10900,
    oldPrice: 12900,
    inStock: true,
    rating: 4.5,
    specifications: [
      feature(
        text("Мощность", "Қуат", "Power"),
        text("50 Вт", "50 Вт", "50 W"),
      ),
      feature(
        text("Тип", "Түрі", "Type"),
        text("прожектор", "прожектор", "floodlight"),
      ),
      feature(
        text("Защита", "Қорғаныс", "Protection"),
        text("IP65", "IP65", "IP65"),
      ),
    ],
  },
  {
    category: "lighting",
    brand: "Navigator",
    model: "NFL-M-100 100W",
    kind: text("уличный прожектор", "көше прожекторы", "outdoor floodlight"),
    price: 17900,
    inStock: true,
    rating: 4.4,
    specifications: [
      feature(
        text("Мощность", "Қуат", "Power"),
        text("100 Вт", "100 Вт", "100 W"),
      ),
      feature(
        text("Тип", "Түрі", "Type"),
        text("прожектор", "прожектор", "floodlight"),
      ),
      feature(
        text("Защита", "Қорғаныс", "Protection"),
        text("IP65", "IP65", "IP65"),
      ),
    ],
  },
  {
    category: "lighting",
    brand: "Eglo",
    model: "Townshend 5 Pendant",
    kind: text("подвесной светильник", "аспалы шам", "pendant light"),
    price: 82900,
    inStock: true,
    rating: 4.9,
    specifications: [
      feature(
        text("Мощность", "Қуат", "Power"),
        text("5 × 10 Вт", "5 × 10 Вт", "5 × 10 W"),
      ),
      feature(text("Цоколь", "Цоколь", "Base"), text("E27", "E27", "E27")),
      feature(
        text("Тип", "Түрі", "Type"),
        text("подвесной", "аспалы", "pendant"),
      ),
    ],
  },

  // Televisions
  {
    category: "televisions",
    brand: "Samsung",
    model: "UE43DU7100UXCE",
    kind: text(
      "телевизор Crystal UHD",
      "Crystal UHD теледидары",
      "Crystal UHD television",
    ),
    price: 219990,
    inStock: true,
    rating: 4.7,
    specifications: [
      feature(
        text("Диагональ", "Диагональ", "Screen size"),
        text("43 дюйма", "43 дюйм", "43 inch"),
      ),
      feature(
        text("Разрешение", "Ажыратымдылық", "Resolution"),
        text("4K UHD", "4K UHD", "4K UHD"),
      ),
      feature(
        text("Smart TV", "Smart TV", "Smart TV"),
        text("Tizen", "Tizen", "Tizen"),
      ),
      feature(text("Матрица", "Матрица", "Panel"), text("LED", "LED", "LED")),
    ],
  },
  {
    category: "televisions",
    brand: "LG",
    model: "43UR78006LK",
    kind: text("телевизор UHD", "UHD теледидары", "UHD television"),
    price: 239990,
    oldPrice: 259990,
    inStock: true,
    rating: 4.8,
    specifications: [
      feature(
        text("Диагональ", "Диагональ", "Screen size"),
        text("43 дюйма", "43 дюйм", "43 inch"),
      ),
      feature(
        text("Разрешение", "Ажыратымдылық", "Resolution"),
        text("4K UHD", "4K UHD", "4K UHD"),
      ),
      feature(
        text("Smart TV", "Smart TV", "Smart TV"),
        text("webOS", "webOS", "webOS"),
      ),
      feature(text("Матрица", "Матрица", "Panel"), text("LED", "LED", "LED")),
    ],
  },
  {
    category: "televisions",
    brand: "TCL",
    model: "50P635",
    kind: text(
      "телевизор Google TV",
      "Google TV теледидары",
      "Google TV television",
    ),
    price: 259990,
    inStock: true,
    rating: 4.6,
    specifications: [
      feature(
        text("Диагональ", "Диагональ", "Screen size"),
        text("50 дюймов", "50 дюйм", "50 inch"),
      ),
      feature(
        text("Разрешение", "Ажыратымдылық", "Resolution"),
        text("4K UHD", "4K UHD", "4K UHD"),
      ),
      feature(
        text("Smart TV", "Smart TV", "Smart TV"),
        text("Google TV", "Google TV", "Google TV"),
      ),
      feature(text("Матрица", "Матрица", "Panel"), text("LED", "LED", "LED")),
    ],
  },
  {
    category: "televisions",
    brand: "Xiaomi",
    model: "TV A Pro 55 2025",
    kind: text("QLED телевизор", "QLED теледидары", "QLED television"),
    price: 329990,
    inStock: true,
    rating: 4.7,
    specifications: [
      feature(
        text("Диагональ", "Диагональ", "Screen size"),
        text("55 дюймов", "55 дюйм", "55 inch"),
      ),
      feature(
        text("Разрешение", "Ажыратымдылық", "Resolution"),
        text("4K UHD", "4K UHD", "4K UHD"),
      ),
      feature(
        text("Smart TV", "Smart TV", "Smart TV"),
        text("Google TV", "Google TV", "Google TV"),
      ),
      feature(
        text("Матрица", "Матрица", "Panel"),
        text("QLED", "QLED", "QLED"),
      ),
    ],
  },
  {
    category: "televisions",
    brand: "Hisense",
    model: "55A6K",
    kind: text("телевизор UHD", "UHD теледидары", "UHD television"),
    price: 299990,
    inStock: true,
    rating: 4.5,
    specifications: [
      feature(
        text("Диагональ", "Диагональ", "Screen size"),
        text("55 дюймов", "55 дюйм", "55 inch"),
      ),
      feature(
        text("Разрешение", "Ажыратымдылық", "Resolution"),
        text("4K UHD", "4K UHD", "4K UHD"),
      ),
      feature(
        text("Smart TV", "Smart TV", "Smart TV"),
        text("VIDAA", "VIDAA", "VIDAA"),
      ),
      feature(text("Матрица", "Матрица", "Panel"), text("LED", "LED", "LED")),
    ],
  },
  {
    category: "televisions",
    brand: "Samsung",
    model: "UE50DU8000UXCE",
    kind: text(
      "телевизор Crystal UHD",
      "Crystal UHD теледидары",
      "Crystal UHD television",
    ),
    price: 339990,
    inStock: true,
    rating: 4.8,
    specifications: [
      feature(
        text("Диагональ", "Диагональ", "Screen size"),
        text("50 дюймов", "50 дюйм", "50 inch"),
      ),
      feature(
        text("Разрешение", "Ажыратымдылық", "Resolution"),
        text("4K UHD", "4K UHD", "4K UHD"),
      ),
      feature(
        text("Smart TV", "Smart TV", "Smart TV"),
        text("Tizen", "Tizen", "Tizen"),
      ),
      feature(text("Матрица", "Матрица", "Panel"), text("LED", "LED", "LED")),
    ],
  },
  {
    category: "televisions",
    brand: "LG",
    model: "55QNED80T6A",
    kind: text("телевизор QNED", "QNED теледидары", "QNED television"),
    price: 529990,
    inStock: true,
    rating: 4.8,
    specifications: [
      feature(
        text("Диагональ", "Диагональ", "Screen size"),
        text("55 дюймов", "55 дюйм", "55 inch"),
      ),
      feature(
        text("Разрешение", "Ажыратымдылық", "Resolution"),
        text("4K UHD", "4K UHD", "4K UHD"),
      ),
      feature(
        text("Smart TV", "Smart TV", "Smart TV"),
        text("webOS", "webOS", "webOS"),
      ),
      feature(
        text("Матрица", "Матрица", "Panel"),
        text("QNED", "QNED", "QNED"),
      ),
    ],
  },
  {
    category: "televisions",
    brand: "TCL",
    model: "55C645",
    kind: text("QLED телевизор", "QLED теледидары", "QLED television"),
    price: 369990,
    inStock: true,
    rating: 4.7,
    specifications: [
      feature(
        text("Диагональ", "Диагональ", "Screen size"),
        text("55 дюймов", "55 дюйм", "55 inch"),
      ),
      feature(
        text("Разрешение", "Ажыратымдылық", "Resolution"),
        text("4K UHD", "4K UHD", "4K UHD"),
      ),
      feature(
        text("Smart TV", "Smart TV", "Smart TV"),
        text("Google TV", "Google TV", "Google TV"),
      ),
      feature(
        text("Матрица", "Матрица", "Panel"),
        text("QLED", "QLED", "QLED"),
      ),
    ],
  },
  {
    category: "televisions",
    brand: "Xiaomi",
    model: "TV A 43 2025",
    kind: text(
      "телевизор Google TV",
      "Google TV теледидары",
      "Google TV television",
    ),
    price: 199990,
    inStock: true,
    rating: 4.5,
    specifications: [
      feature(
        text("Диагональ", "Диагональ", "Screen size"),
        text("43 дюйма", "43 дюйм", "43 inch"),
      ),
      feature(
        text("Разрешение", "Ажыратымдылық", "Resolution"),
        text("Full HD", "Full HD", "Full HD"),
      ),
      feature(
        text("Smart TV", "Smart TV", "Smart TV"),
        text("Google TV", "Google TV", "Google TV"),
      ),
      feature(text("Матрица", "Матрица", "Panel"), text("LED", "LED", "LED")),
    ],
  },
  {
    category: "televisions",
    brand: "Hisense",
    model: "65A6K",
    kind: text("телевизор UHD", "UHD теледидары", "UHD television"),
    price: 429990,
    inStock: false,
    rating: 4.6,
    specifications: [
      feature(
        text("Диагональ", "Диагональ", "Screen size"),
        text("65 дюймов", "65 дюйм", "65 inch"),
      ),
      feature(
        text("Разрешение", "Ажыратымдылық", "Resolution"),
        text("4K UHD", "4K UHD", "4K UHD"),
      ),
      feature(
        text("Smart TV", "Smart TV", "Smart TV"),
        text("VIDAA", "VIDAA", "VIDAA"),
      ),
      feature(text("Матрица", "Матрица", "Panel"), text("LED", "LED", "LED")),
    ],
  },
  {
    category: "televisions",
    brand: "Samsung",
    model: "QE55Q60DAUXCE",
    kind: text("QLED телевизор", "QLED теледидары", "QLED television"),
    price: 499990,
    inStock: true,
    rating: 4.8,
    specifications: [
      feature(
        text("Диагональ", "Диагональ", "Screen size"),
        text("55 дюймов", "55 дюйм", "55 inch"),
      ),
      feature(
        text("Разрешение", "Ажыратымдылық", "Resolution"),
        text("4K UHD", "4K UHD", "4K UHD"),
      ),
      feature(
        text("Smart TV", "Smart TV", "Smart TV"),
        text("Tizen", "Tizen", "Tizen"),
      ),
      feature(
        text("Матрица", "Матрица", "Panel"),
        text("QLED", "QLED", "QLED"),
      ),
    ],
  },
  {
    category: "televisions",
    brand: "LG",
    model: "65UR78006LK",
    kind: text("телевизор UHD", "UHD теледидары", "UHD television"),
    price: 399990,
    inStock: true,
    rating: 4.6,
    specifications: [
      feature(
        text("Диагональ", "Диагональ", "Screen size"),
        text("65 дюймов", "65 дюйм", "65 inch"),
      ),
      feature(
        text("Разрешение", "Ажыратымдылық", "Resolution"),
        text("4K UHD", "4K UHD", "4K UHD"),
      ),
      feature(
        text("Smart TV", "Smart TV", "Smart TV"),
        text("webOS", "webOS", "webOS"),
      ),
      feature(text("Матрица", "Матрица", "Panel"), text("LED", "LED", "LED")),
    ],
  },
  {
    category: "televisions",
    brand: "TCL",
    model: "65C745",
    kind: text("QLED телевизор", "QLED теледидары", "QLED television"),
    price: 599990,
    inStock: true,
    rating: 4.9,
    specifications: [
      feature(
        text("Диагональ", "Диагональ", "Screen size"),
        text("65 дюймов", "65 дюйм", "65 inch"),
      ),
      feature(
        text("Разрешение", "Ажыратымдылық", "Resolution"),
        text("4K UHD", "4K UHD", "4K UHD"),
      ),
      feature(
        text("Smart TV", "Smart TV", "Smart TV"),
        text("Google TV", "Google TV", "Google TV"),
      ),
      feature(
        text("Матрица", "Матрица", "Panel"),
        text("QLED", "QLED", "QLED"),
      ),
    ],
  },
  {
    category: "televisions",
    brand: "Sony",
    model: "XR-65X90L",
    kind: text(
      "телевизор Full Array LED",
      "Full Array LED теледидары",
      "Full Array LED television",
    ),
    price: 1099990,
    inStock: true,
    rating: 4.9,
    specifications: [
      feature(
        text("Диагональ", "Диагональ", "Screen size"),
        text("65 дюймов", "65 дюйм", "65 inch"),
      ),
      feature(
        text("Разрешение", "Ажыратымдылық", "Resolution"),
        text("4K UHD", "4K UHD", "4K UHD"),
      ),
      feature(
        text("Smart TV", "Smart TV", "Smart TV"),
        text("Google TV", "Google TV", "Google TV"),
      ),
      feature(
        text("Матрица", "Матрица", "Panel"),
        text("Full Array LED", "Full Array LED", "Full Array LED"),
      ),
    ],
  },
  {
    category: "televisions",
    brand: "Hisense",
    model: "75A6K",
    kind: text("телевизор UHD", "UHD теледидары", "UHD television"),
    price: 699990,
    inStock: true,
    rating: 4.6,
    specifications: [
      feature(
        text("Диагональ", "Диагональ", "Screen size"),
        text("75 дюймов", "75 дюйм", "75 inch"),
      ),
      feature(
        text("Разрешение", "Ажыратымдылық", "Resolution"),
        text("4K UHD", "4K UHD", "4K UHD"),
      ),
      feature(
        text("Smart TV", "Smart TV", "Smart TV"),
        text("VIDAA", "VIDAA", "VIDAA"),
      ),
      feature(text("Матрица", "Матрица", "Panel"), text("LED", "LED", "LED")),
    ],
  },

  // Plumbing
  {
    category: "plumbing",
    brand: "Grohe",
    model: "BauEdge 23760000",
    kind: text(
      "смеситель для раковины",
      "қолжуғышқа арналған араластырғыш",
      "basin mixer",
    ),
    price: 39900,
    inStock: true,
    rating: 4.8,
    specifications: [
      feature(
        text("Тип", "Түрі", "Type"),
        text("для раковины", "қолжуғышқа арналған", "basin"),
      ),
      feature(
        text("Материал", "Материал", "Material"),
        text("латунь", "жез", "brass"),
      ),
      feature(
        text("Покрытие", "Жабыны", "Finish"),
        text("хром", "хром", "chrome"),
      ),
    ],
  },
  {
    category: "plumbing",
    brand: "Hansgrohe",
    model: "Logis 71070000",
    kind: text(
      "смеситель для раковины",
      "қолжуғышқа арналған араластырғыш",
      "basin mixer",
    ),
    price: 69900,
    inStock: true,
    rating: 4.9,
    specifications: [
      feature(
        text("Тип", "Түрі", "Type"),
        text("для раковины", "қолжуғышқа арналған", "basin"),
      ),
      feature(
        text("Материал", "Материал", "Material"),
        text("латунь", "жез", "brass"),
      ),
      feature(
        text("Покрытие", "Жабыны", "Finish"),
        text("хром", "хром", "chrome"),
      ),
    ],
  },
  {
    category: "plumbing",
    brand: "Roca",
    model: "Victoria-N 5A3125C00",
    kind: text(
      "смеситель для кухни",
      "асүйге арналған араластырғыш",
      "kitchen mixer",
    ),
    price: 45900,
    inStock: true,
    rating: 4.6,
    specifications: [
      feature(
        text("Тип", "Түрі", "Type"),
        text("для кухни", "асүйге арналған", "kitchen"),
      ),
      feature(
        text("Материал", "Материал", "Material"),
        text("латунь", "жез", "brass"),
      ),
      feature(
        text("Покрытие", "Жабыны", "Finish"),
        text("хром", "хром", "chrome"),
      ),
    ],
  },
  {
    category: "plumbing",
    brand: "AM.PM",
    model: "Gem F90A02100",
    kind: text(
      "смеситель для душа",
      "душқа арналған араластырғыш",
      "shower mixer",
    ),
    price: 64900,
    inStock: true,
    rating: 4.7,
    specifications: [
      feature(
        text("Тип", "Түрі", "Type"),
        text("для душа", "душқа арналған", "shower"),
      ),
      feature(
        text("Материал", "Материал", "Material"),
        text("латунь", "жез", "brass"),
      ),
      feature(
        text("Покрытие", "Жабыны", "Finish"),
        text("хром", "хром", "chrome"),
      ),
    ],
  },
  {
    category: "plumbing",
    brand: "Cersanit",
    model: "Crea 55 Washbasin",
    kind: text("раковина", "қолжуғыш", "washbasin"),
    price: 54900,
    inStock: true,
    rating: 4.5,
    specifications: [
      feature(
        text("Тип", "Түрі", "Type"),
        text("накладная", "үстінен орнатылатын", "countertop"),
      ),
      feature(
        text("Материал", "Материал", "Material"),
        text("санфарфор", "санфарфор", "vitreous china"),
      ),
      feature(text("Цвет", "Түсі", "Color"), text("белый", "ақ", "white")),
    ],
  },
  {
    category: "plumbing",
    brand: "Roca",
    model: "The Gap 60 Basin",
    kind: text("раковина", "қолжуғыш", "washbasin"),
    price: 79900,
    inStock: true,
    rating: 4.8,
    specifications: [
      feature(
        text("Тип", "Түрі", "Type"),
        text("подвесная", "аспалы", "wall-hung"),
      ),
      feature(
        text("Материал", "Материал", "Material"),
        text("санфарфор", "санфарфор", "vitreous china"),
      ),
      feature(text("Цвет", "Түсі", "Color"), text("белый", "ақ", "white")),
    ],
  },
  {
    category: "plumbing",
    brand: "Cersanit",
    model: "Parva Clean On",
    kind: text("унитаз-компакт", "едендік унитаз", "close-coupled toilet"),
    price: 89900,
    inStock: true,
    rating: 4.6,
    specifications: [
      feature(
        text("Тип", "Түрі", "Type"),
        text("компакт", "едендік", "close-coupled"),
      ),
      feature(
        text("Материал", "Материал", "Material"),
        text("санфарфор", "санфарфор", "vitreous china"),
      ),
      feature(text("Цвет", "Түсі", "Color"), text("белый", "ақ", "white")),
    ],
  },
  {
    category: "plumbing",
    brand: "Roca",
    model: "Debba Rimless",
    kind: text("подвесной унитаз", "аспалы унитаз", "wall-hung toilet"),
    price: 119900,
    inStock: true,
    rating: 4.8,
    specifications: [
      feature(
        text("Тип", "Түрі", "Type"),
        text("подвесной", "аспалы", "wall-hung"),
      ),
      feature(
        text("Материал", "Материал", "Material"),
        text("санфарфор", "санфарфор", "vitreous china"),
      ),
      feature(text("Цвет", "Түсі", "Color"), text("белый", "ақ", "white")),
    ],
  },
  {
    category: "plumbing",
    brand: "Grohe",
    model: "Tempesta 250 Shower System",
    kind: text("душевая система", "душ жүйесі", "shower system"),
    price: 219900,
    inStock: true,
    rating: 4.9,
    specifications: [
      feature(
        text("Тип", "Түрі", "Type"),
        text("душевая система", "душ жүйесі", "shower system"),
      ),
      feature(
        text("Материал", "Материал", "Material"),
        text("латунь и пластик", "жез және пластик", "brass and plastic"),
      ),
      feature(
        text("Покрытие", "Жабыны", "Finish"),
        text("хром", "хром", "chrome"),
      ),
    ],
  },
  {
    category: "plumbing",
    brand: "Hansgrohe",
    model: "Crometta E 240",
    kind: text("душевая система", "душ жүйесі", "shower system"),
    price: 189900,
    inStock: true,
    rating: 4.7,
    specifications: [
      feature(
        text("Тип", "Түрі", "Type"),
        text("душевая система", "душ жүйесі", "shower system"),
      ),
      feature(
        text("Материал", "Материал", "Material"),
        text("металл и пластик", "металл және пластик", "metal and plastic"),
      ),
      feature(
        text("Покрытие", "Жабыны", "Finish"),
        text("хром", "хром", "chrome"),
      ),
    ],
  },
  {
    category: "plumbing",
    brand: "Aquanet",
    model: "Dalia 150x70",
    kind: text("акриловая ванна", "акрил ванна", "acrylic bathtub"),
    price: 169900,
    inStock: false,
    rating: 4.5,
    specifications: [
      feature(
        text("Тип", "Түрі", "Type"),
        text("прямоугольная ванна", "тікбұрышты ванна", "rectangular bathtub"),
      ),
      feature(
        text("Материал", "Материал", "Material"),
        text("акрил", "акрил", "acrylic"),
      ),
      feature(text("Цвет", "Түсі", "Color"), text("белый", "ақ", "white")),
    ],
  },
  {
    category: "plumbing",
    brand: "Zehnder",
    model: "Aura 500x1200",
    kind: text("полотенцесушитель", "сүлгі кептіргіш", "heated towel rail"),
    price: 119900,
    inStock: true,
    rating: 4.6,
    specifications: [
      feature(
        text("Тип", "Түрі", "Type"),
        text("водяной", "сулы", "water-heated"),
      ),
      feature(
        text("Материал", "Материал", "Material"),
        text("нержавеющая сталь", "тот баспайтын болат", "stainless steel"),
      ),
      feature(
        text("Покрытие", "Жабыны", "Finish"),
        text("хром", "хром", "chrome"),
      ),
    ],
  },
  {
    category: "plumbing",
    brand: "Grohe",
    model: "Eurosmart 33300003",
    kind: text(
      "смеситель для кухни",
      "асүйге арналған араластырғыш",
      "kitchen mixer",
    ),
    price: 59900,
    oldPrice: 69900,
    inStock: true,
    rating: 4.8,
    specifications: [
      feature(
        text("Тип", "Түрі", "Type"),
        text("для кухни", "асүйге арналған", "kitchen"),
      ),
      feature(
        text("Материал", "Материал", "Material"),
        text("латунь", "жез", "brass"),
      ),
      feature(
        text("Покрытие", "Жабыны", "Finish"),
        text("хром", "хром", "chrome"),
      ),
    ],
  },
  {
    category: "plumbing",
    brand: "AM.PM",
    model: "Like F8010000",
    kind: text("раковина", "қолжуғыш", "washbasin"),
    price: 94900,
    inStock: true,
    rating: 4.6,
    specifications: [
      feature(
        text("Тип", "Түрі", "Type"),
        text("накладная", "үстінен орнатылатын", "countertop"),
      ),
      feature(
        text("Материал", "Материал", "Material"),
        text("санфарфор", "санфарфор", "vitreous china"),
      ),
      feature(text("Цвет", "Түсі", "Color"), text("белый", "ақ", "white")),
    ],
  },
  {
    category: "plumbing",
    brand: "Ravak",
    model: "Chrome 150x70",
    kind: text("акриловая ванна", "акрил ванна", "acrylic bathtub"),
    price: 289900,
    inStock: true,
    rating: 4.8,
    specifications: [
      feature(
        text("Тип", "Түрі", "Type"),
        text("прямоугольная ванна", "тікбұрышты ванна", "rectangular bathtub"),
      ),
      feature(
        text("Материал", "Материал", "Material"),
        text("акрил", "акрил", "acrylic"),
      ),
      feature(text("Цвет", "Түсі", "Color"), text("белый", "ақ", "white")),
    ],
  },
  // Medical equipment only
  {
    category: "medical",
    brand: "Omron",
    model: "M3 Comfort HEM-7155-E",
    kind: text(
      "автоматический тонометр",
      "автоматты тонометр",
      "automatic blood pressure monitor",
    ),
    price: 39900,
    inStock: true,
    rating: 4.9,
    specifications: [
      feature(
        text("Тип устройства", "Құрылғы түрі", "Device type"),
        text("тонометр", "тонометр", "blood pressure monitor"),
      ),
      feature(
        text("Тип измерения", "Өлшеу түрі", "Measurement"),
        text("плечо", "иық", "upper arm"),
      ),
      feature(
        text("Память", "Жады", "Memory"),
        text("2 × 60 измерений", "2 × 60 өлшем", "2 × 60 readings"),
      ),
    ],
  },
  {
    category: "medical",
    brand: "AND",
    model: "UA-777AC",
    kind: text(
      "автоматический тонометр",
      "автоматты тонометр",
      "automatic blood pressure monitor",
    ),
    price: 28900,
    inStock: true,
    rating: 4.7,
    specifications: [
      feature(
        text("Тип устройства", "Құрылғы түрі", "Device type"),
        text("тонометр", "тонометр", "blood pressure monitor"),
      ),
      feature(
        text("Тип измерения", "Өлшеу түрі", "Measurement"),
        text("плечо", "иық", "upper arm"),
      ),
      feature(
        text("Память", "Жады", "Memory"),
        text("90 измерений", "90 өлшем", "90 readings"),
      ),
    ],
  },
  {
    category: "medical",
    brand: "B.Well",
    model: "PRO-33",
    kind: text(
      "автоматический тонометр",
      "автоматты тонометр",
      "automatic blood pressure monitor",
    ),
    price: 17900,
    inStock: true,
    rating: 4.6,
    specifications: [
      feature(
        text("Тип устройства", "Құрылғы түрі", "Device type"),
        text("тонометр", "тонометр", "blood pressure monitor"),
      ),
      feature(
        text("Тип измерения", "Өлшеу түрі", "Measurement"),
        text("плечо", "иық", "upper arm"),
      ),
      feature(
        text("Питание", "Қуат көзі", "Power"),
        text(
          "батарейки или адаптер",
          "батарея немесе адаптер",
          "batteries or adapter",
        ),
      ),
    ],
  },
  {
    category: "medical",
    brand: "Microlife",
    model: "BP B2 Basic",
    kind: text(
      "автоматический тонометр",
      "автоматты тонометр",
      "automatic blood pressure monitor",
    ),
    price: 24900,
    inStock: true,
    rating: 4.7,
    specifications: [
      feature(
        text("Тип устройства", "Құрылғы түрі", "Device type"),
        text("тонометр", "тонометр", "blood pressure monitor"),
      ),
      feature(
        text("Тип измерения", "Өлшеу түрі", "Measurement"),
        text("плечо", "иық", "upper arm"),
      ),
      feature(
        text("Память", "Жады", "Memory"),
        text("30 измерений", "30 өлшем", "30 readings"),
      ),
    ],
  },
  {
    category: "medical",
    brand: "Little Doctor",
    model: "LD-220C",
    kind: text(
      "компрессорный ингалятор",
      "компрессорлық ингалятор",
      "compressor nebulizer",
    ),
    price: 22900,
    inStock: true,
    rating: 4.6,
    specifications: [
      feature(
        text("Тип устройства", "Құрылғы түрі", "Device type"),
        text("ингалятор", "ингалятор", "nebulizer"),
      ),
      feature(
        text("Тип измерения", "Өлшеу түрі", "Measurement"),
        text("небулайзерная терапия", "небулайзерлік терапия", "nebulization"),
      ),
      feature(
        text("Комплектация", "Жиынтық", "Included"),
        text(
          "маски для взрослых и детей",
          "ересектер мен балаларға арналған маскалар",
          "adult and child masks",
        ),
      ),
    ],
  },
  {
    category: "medical",
    brand: "Omron",
    model: "CompAIR C28P",
    kind: text(
      "компрессорный ингалятор",
      "компрессорлық ингалятор",
      "compressor nebulizer",
    ),
    price: 45900,
    inStock: true,
    rating: 4.8,
    specifications: [
      feature(
        text("Тип устройства", "Құрылғы түрі", "Device type"),
        text("ингалятор", "ингалятор", "nebulizer"),
      ),
      feature(
        text("Тип измерения", "Өлшеу түрі", "Measurement"),
        text("небулайзерная терапия", "небулайзерлік терапия", "nebulization"),
      ),
      feature(
        text("Комплектация", "Жиынтық", "Included"),
        text(
          "маски и мундштук",
          "маскалар және мундштук",
          "masks and mouthpiece",
        ),
      ),
    ],
  },
  {
    category: "medical",
    brand: "Accu-Chek",
    model: "Instant Kit",
    kind: text("глюкометр", "глюкометр", "blood glucose meter"),
    price: 18900,
    inStock: true,
    rating: 4.8,
    specifications: [
      feature(
        text("Тип устройства", "Құрылғы түрі", "Device type"),
        text("глюкометр", "глюкометр", "blood glucose meter"),
      ),
      feature(
        text("Тип измерения", "Өлшеу түрі", "Measurement"),
        text("уровень глюкозы", "глюкоза деңгейі", "blood glucose"),
      ),
      feature(
        text("Память", "Жады", "Memory"),
        text("720 результатов", "720 нәтиже", "720 results"),
      ),
    ],
  },
  {
    category: "medical",
    brand: "Contour",
    model: "Plus One Kit",
    kind: text("глюкометр", "глюкометр", "blood glucose meter"),
    price: 21900,
    inStock: true,
    rating: 4.7,
    specifications: [
      feature(
        text("Тип устройства", "Құрылғы түрі", "Device type"),
        text("глюкометр", "глюкометр", "blood glucose meter"),
      ),
      feature(
        text("Тип измерения", "Өлшеу түрі", "Measurement"),
        text("уровень глюкозы", "глюкоза деңгейі", "blood glucose"),
      ),
      feature(
        text("Подключение", "Байланыс", "Connectivity"),
        text("Bluetooth", "Bluetooth", "Bluetooth"),
      ),
    ],
  },
  {
    category: "medical",
    brand: "B.Well",
    model: "WT-03 Base",
    kind: text(
      "электронный термометр",
      "электрондық термометр",
      "digital thermometer",
    ),
    price: 3900,
    inStock: true,
    rating: 4.5,
    specifications: [
      feature(
        text("Тип устройства", "Құрылғы түрі", "Device type"),
        text("термометр", "термометр", "thermometer"),
      ),
      feature(
        text("Тип измерения", "Өлшеу түрі", "Measurement"),
        text("температура тела", "дене температурасы", "body temperature"),
      ),
      feature(
        text("Время измерения", "Өлшеу уақыты", "Reading time"),
        text("до 60 секунд", "60 секундқа дейін", "up to 60 seconds"),
      ),
    ],
  },
  {
    category: "medical",
    brand: "Omron",
    model: "Eco Temp Basic",
    kind: text(
      "электронный термометр",
      "электрондық термометр",
      "digital thermometer",
    ),
    price: 4900,
    inStock: true,
    rating: 4.6,
    specifications: [
      feature(
        text("Тип устройства", "Құрылғы түрі", "Device type"),
        text("термометр", "термометр", "thermometer"),
      ),
      feature(
        text("Тип измерения", "Өлшеу түрі", "Measurement"),
        text("температура тела", "дене температурасы", "body temperature"),
      ),
      feature(
        text("Память", "Жады", "Memory"),
        text("последнее измерение", "соңғы өлшем", "last reading"),
      ),
    ],
  },
  {
    category: "medical",
    brand: "Beurer",
    model: "FT 85",
    kind: text(
      "бесконтактный термометр",
      "жанаспайтын термометр",
      "non-contact thermometer",
    ),
    price: 29900,
    inStock: true,
    rating: 4.7,
    specifications: [
      feature(
        text("Тип устройства", "Құрылғы түрі", "Device type"),
        text("термометр", "термометр", "thermometer"),
      ),
      feature(
        text("Тип измерения", "Өлшеу түрі", "Measurement"),
        text("инфракрасное", "инфрақызыл", "infrared"),
      ),
      feature(
        text("Память", "Жады", "Memory"),
        text("60 измерений", "60 өлшем", "60 readings"),
      ),
    ],
  },
  {
    category: "medical",
    brand: "Beurer",
    model: "MG 40 Infrared",
    kind: text("ручной массажёр", "қол массажері", "handheld massager"),
    price: 16900,
    inStock: true,
    rating: 4.5,
    specifications: [
      feature(
        text("Тип устройства", "Құрылғы түрі", "Device type"),
        text("массажёр", "массажер", "massager"),
      ),
      feature(
        text("Режимы", "Режимдер", "Modes"),
        text(
          "2 уровня интенсивности",
          "2 қарқындылық деңгейі",
          "2 intensity levels",
        ),
      ),
      feature(
        text("Питание", "Қуат көзі", "Power"),
        text("от сети", "желіден", "mains powered"),
      ),
    ],
  },
  {
    category: "medical",
    brand: "Omron",
    model: "E3 Intense HV-F021",
    kind: text("электростимулятор", "электростимулятор", "electrostimulator"),
    price: 39900,
    inStock: true,
    rating: 4.7,
    specifications: [
      feature(
        text("Тип устройства", "Құрылғы түрі", "Device type"),
        text("электростимулятор", "электростимулятор", "electrostimulator"),
      ),
      feature(
        text("Тип измерения", "Өлшеу түрі", "Measurement"),
        text(
          "электрическая стимуляция",
          "электрлік стимуляция",
          "electrical stimulation",
        ),
      ),
      feature(
        text("Режимы", "Режимдер", "Modes"),
        text("6 программ", "6 бағдарлама", "6 programs"),
      ),
    ],
  },
  {
    category: "medical",
    brand: "Orlett",
    model: "RWA 5100",
    kind: text(
      "ортопедический бандаж",
      "ортопедиялық бандаж",
      "orthopedic support",
    ),
    price: 12900,
    inStock: true,
    rating: 4.6,
    specifications: [
      feature(
        text("Тип устройства", "Құрылғы түрі", "Device type"),
        text("ортопедия", "ортопедия", "orthopedic support"),
      ),
      feature(
        text("Материал", "Материал", "Material"),
        text("эластичный текстиль", "серпімді тоқыма", "stretch textile"),
      ),
      feature(
        text("Размер", "Өлшем", "Size"),
        text("универсальный", "әмбебап", "universal"),
      ),
    ],
  },
  {
    category: "medical",
    brand: "B.Well",
    model: "MED-325 Compressor",
    kind: text(
      "компрессорный ингалятор",
      "компрессорлық ингалятор",
      "compressor nebulizer",
    ),
    price: 19900,
    inStock: false,
    rating: 4.5,
    specifications: [
      feature(
        text("Тип устройства", "Құрылғы түрі", "Device type"),
        text("ингалятор", "ингалятор", "nebulizer"),
      ),
      feature(
        text("Тип измерения", "Өлшеу түрі", "Measurement"),
        text("небулайзерная терапия", "небулайзерлік терапия", "nebulization"),
      ),
      feature(
        text("Комплектация", "Жиынтық", "Included"),
        text(
          "маски и мундштук",
          "маскалар және мундштук",
          "masks and mouthpiece",
        ),
      ),
    ],
  },
];

const categoryIndexes = new Map<CategoryId, number>();
export const products: Product[] = [
  ...(siteConfig.showDemoProducts ? seeds : []),
  ...(importedSeeds as ProductSeed[]),
].map((seed) => {
  const index = categoryIndexes.get(seed.category) ?? 0;
  categoryIndexes.set(seed.category, index + 1);
  return product(seed, index);
});

export const categories: {
  id: CategoryId;
  slug: string;
  label: LocalizedText;
  description: LocalizedText;
  subcategories: LocalizedText[];
}[] = [
  {
    id: "lighting",
    slug: "lighting",
    label: text("Освещение", "Жарықтандыру", "Lighting"),
    description: text(
      "Лампы, светильники, споты, LED-ленты и прожекторы",
      "Шамдар, жарықшамдар, споттар, LED-таспалар мен прожекторлар",
      "Bulbs, fixtures, spotlights, LED strips and floodlights",
    ),
    subcategories: [
      text("Лампы", "Шамдар", "Bulbs"),
      text("Светильники", "Жарықшамдар", "Fixtures"),
      text("Споты", "Споттар", "Spotlights"),
      text("LED-ленты", "LED-таспалар", "LED strips"),
      text("Прожекторы", "Прожекторлар", "Floodlights"),
    ],
  },
  {
    id: "televisions",
    slug: "televisions",
    label: text("Телевизоры", "Теледидарлар", "Televisions"),
    description: text(
      "LED, QLED и UHD телевизоры для дома",
      "Үйге арналған LED, QLED және UHD теледидарлары",
      "LED, QLED and UHD televisions for your home",
    ),
    subcategories: [
      text("LED", "LED", "LED"),
      text("QLED", "QLED", "QLED"),
      text("QNED", "QNED", "QNED"),
      text("OLED", "OLED", "OLED"),
    ],
  },
  {
    id: "plumbing",
    slug: "plumbing",
    label: text("Сантехника", "Сантехника", "Plumbing"),
    description: text(
      "Смесители, раковины, унитазы, душевые системы и полотенцесушители",
      "Араластырғыштар, қолжуғыштар, унитаздар, душ жүйелері мен сүлгі кептіргіштер",
      "Mixers, basins, toilets, shower systems and heated towel rails",
    ),
    subcategories: [
      text("Смесители", "Араластырғыштар", "Mixers"),
      text("Раковины", "Қолжуғыштар", "Basins"),
      text("Унитазы", "Унитаздар", "Toilets"),
      text("Душевые системы", "Душ жүйелері", "Shower systems"),
      text("Ванны", "Ванналар", "Bathtubs"),
      text("Полотенцесушители", "Сүлгі кептіргіштер", "Heated towel rails"),
    ],
  },
  {
    id: "medical",
    slug: "medical",
    label: text("Медтехника", "Медициналық техника", "Medical equipment"),
    description: text(
      "Медицинская техника и изделия. Лекарств в каталоге нет.",
      "Медициналық техника мен бұйымдар. Каталогта дәрі-дәрмек жоқ.",
      "Medical equipment and devices. No medicines are sold here.",
    ),
    subcategories: [
      text("Тонометры", "Тонометрлер", "Blood pressure monitors"),
      text("Ингаляторы", "Ингаляторлар", "Nebulizers"),
      text("Глюкометры", "Глюкометрлер", "Blood glucose meters"),
      text("Термометры", "Термометрлер", "Thermometers"),
      text("Массажёры", "Массажерлер", "Massagers"),
      text("Ортопедия", "Ортопедия", "Orthopedic products"),
    ],
  },
];

export const brands = [...new Set(products.map((item) => item.brand))].sort(
  (a, b) => a.localeCompare(b),
);

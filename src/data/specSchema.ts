import type {
  CategoryId,
  LocalizedText,
  SpecificationDefinition,
  SpecificationGroup,
} from "../types";

const text = (ru: string, kz: string, en: string): LocalizedText => ({
  ru,
  kz,
  en,
});

function field(
  key: string,
  label: LocalizedText,
  order: number,
  isKey = false,
  filterable = false,
  unit?: LocalizedText,
): SpecificationDefinition {
  return { key, label, order, isKey, filterable, unit };
}

function group(
  id: string,
  label: LocalizedText,
  specifications: SpecificationDefinition[],
): SpecificationGroup {
  return { id, label, specifications };
}

export const specificationSchema: Record<CategoryId, SpecificationGroup[]> = {
  televisions: [
    group("screen", text("Экран", "Экран", "Screen"), [
      field(
        "diagonal",
        text("Диагональ", "Диагональ", "Screen size"),
        1,
        true,
        true,
        text("″", "″", "″"),
      ),
      field(
        "resolution",
        text("Разрешение", "Ажыратымдылық", "Resolution"),
        2,
        true,
        true,
      ),
      field("matrix", text("Матрица", "Матрица", "Panel type"), 3, true, true),
    ]),
    group(
      "smart",
      text(
        "Smart и подключение",
        "Smart және қосылым",
        "Smart and connectivity",
      ),
      [
        field(
          "smart-tv",
          text("Smart TV", "Smart TV", "Smart TV"),
          4,
          true,
          true,
        ),
        field(
          "connectivity",
          text("Подключение", "Қосылым", "Connectivity"),
          5,
        ),
      ],
    ),
    group("sound", text("Звук", "Дыбыс", "Sound"), [
      field(
        "speaker-power",
        text("Мощность звука", "Дыбыс қуаты", "Speaker power"),
        6,
        false,
        false,
        text("Вт", "Вт", "W"),
      ),
      field(
        "audio-format",
        text("Формат звука", "Дыбыс пішімі", "Audio format"),
        7,
      ),
    ]),
    group("general", text("Общие", "Жалпы", "General"), [
      field("model-year", text("Год модели", "Модель жылы", "Model year"), 8),
    ]),
  ],
  lighting: [
    group("electrical", text("Электрические", "Электрлік", "Electrical"), [
      field(
        "power",
        text("Мощность", "Қуат", "Power"),
        1,
        true,
        true,
        text("Вт", "Вт", "W"),
      ),
      field("base", text("Цоколь", "Цоколь", "Base"), 2, true, true),
      field(
        "voltage",
        text("Напряжение", "Кернеу", "Voltage"),
        3,
        false,
        true,
        text("В", "В", "V"),
      ),
    ]),
    group("light", text("Световые", "Жарық сипаттары", "Light output"), [
      field(
        "color-temperature",
        text("Температура света", "Жарық температурасы", "Color temperature"),
        4,
        true,
        true,
        text("К", "К", "K"),
      ),
      field(
        "luminous-flux",
        text("Световой поток", "Жарық ағыны", "Luminous flux"),
        5,
        false,
        true,
        text("лм", "лм", "lm"),
      ),
    ]),
    group("construction", text("Конструкция", "Құрылымы", "Construction"), [
      field("type", text("Тип", "Түрі", "Type"), 6, true, true),
      field("color", text("Цвет", "Түсі", "Color"), 7, false, true),
      field(
        "length",
        text("Длина", "Ұзындығы", "Length"),
        8,
        false,
        true,
        text("м", "м", "m"),
      ),
      field(
        "protection",
        text("Защита", "Қорғаныс", "Protection rating"),
        9,
        false,
        true,
      ),
    ]),
  ],
  plumbing: [
    group("basics", text("Основные", "Негізгі", "General"), [
      field("type", text("Тип", "Түрі", "Type"), 1, true, true),
      field(
        "material",
        text("Материал", "Материал", "Material"),
        2,
        true,
        true,
      ),
    ]),
    group(
      "finish",
      text(
        "Материал и покрытие",
        "Материал және жабыны",
        "Material and finish",
      ),
      [
        field("finish", text("Покрытие", "Жабыны", "Finish"), 3, true, true),
        field("color", text("Цвет", "Түсі", "Color"), 4, false, true),
      ],
    ),
    group("mounting", text("Монтаж", "Орнату", "Installation"), [
      field(
        "installation",
        text("Установка", "Орнату түрі", "Installation type"),
        5,
        false,
        true,
      ),
    ]),
  ],
  medical: [
    group("measurement", text("Измерение", "Өлшеу", "Measurement"), [
      field(
        "device-type",
        text("Тип устройства", "Құрылғы түрі", "Device type"),
        1,
        true,
        true,
      ),
      field(
        "measurement-type",
        text("Тип измерения", "Өлшеу түрі", "Measurement type"),
        2,
        true,
        true,
      ),
      field("memory", text("Память", "Жад", "Memory"), 3, true),
      field(
        "measurement-time",
        text("Время измерения", "Өлшеу уақыты", "Measurement time"),
        4,
        false,
        false,
        text("с", "с", "sec"),
      ),
      field("modes", text("Режимы", "Режимдер", "Modes"), 5),
    ]),
    group("power", text("Питание", "Қуат", "Power"), [
      field(
        "power-source",
        text("Питание", "Қуат көзі", "Power source"),
        6,
        true,
        true,
      ),
      field("connectivity", text("Подключение", "Қосылым", "Connectivity"), 7),
    ]),
    group("kit", text("Комплектация", "Жиынтық", "Package contents"), [
      field("kit", text("Комплектация", "Жиынтық", "Package contents"), 8),
      field("material", text("Материал", "Материал", "Material"), 9),
      field("size", text("Размер", "Өлшемі", "Size"), 10),
    ]),
  ],
};

export const specificationDefinitions = Object.values(specificationSchema)
  .flatMap((groups) => groups.flatMap((item) => item.specifications))
  .filter(
    (definition, index, definitions) =>
      definitions.findIndex((item) => item.key === definition.key) === index,
  );

export function getSpecificationDefinition(key: string) {
  return specificationDefinitions.find((definition) => definition.key === key);
}

export function specificationKeyFromLabel(label: string): string {
  const definition = specificationDefinitions.find(
    (item) => item.label.ru === label,
  );
  if (!definition) throw new Error(`Unknown specification label: ${label}`);
  return definition.key;
}

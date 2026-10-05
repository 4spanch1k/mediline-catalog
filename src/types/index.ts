export type Locale = "ru" | "kz" | "en";
export type LocalizedText = Record<Locale, string>;
export type CategoryId = "lighting" | "televisions" | "plumbing" | "medical";

export interface ProductFeature {
  key: string;
  value: LocalizedText;
}

export interface SpecificationDefinition {
  key: string;
  label: LocalizedText;
  unit?: LocalizedText;
  order: number;
  isKey: boolean;
  filterable: boolean;
}

export interface SpecificationGroup {
  id: string;
  label: LocalizedText;
  specifications: SpecificationDefinition[];
}

export interface Product {
  id: string;
  slug: string;
  category: CategoryId;
  subcategory: LocalizedText;
  brand: string;
  name: LocalizedText;
  description: LocalizedText;
  price: number;
  oldPrice?: number;
  inStock: boolean;
  rating: number;
  reviews?: number;
  specifications: ProductFeature[];
  photos: string[];
  tags: LocalizedText[];
  addedAt: string;
  isDemo: boolean;
}

export interface ProductSeed {
  category: CategoryId;
  brand: string;
  model: string;
  name?: LocalizedText;
  description?: LocalizedText;
  kind: LocalizedText;
  price: number;
  oldPrice?: number;
  inStock: boolean;
  rating: number;
  reviews?: number;
  addedAt?: string;
  isDemo?: boolean;
  photos?: string[];
  specifications: ProductFeature[];
}

export interface CatalogFilters {
  query: string;
  brands: string[];
  minPrice?: number;
  maxPrice?: number;
  availableOnly: boolean;
  specifications: Record<string, string[]>;
  sort: string;
  view: "grid" | "list";
  page: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

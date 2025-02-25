export interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
};

export interface Comp {
  id: string;
  name: string;
  type: string;
  description: string;
  images: string[];
  isActive: boolean;
  price: number;
  stock: number;
  categories: string[];
  datasheet: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  stock: number;
  rating: number;
  name: string;
  description: string;
  price?: Price;
  isBestSeller: boolean;
  leadTime: number;
  image?: string;
  imageBlur?: string;
  discount?: Discount;
  usedPrice?: UsedPrice;
  type: string;
  images: string[];
  isActive: boolean;
  categories: string[];
  datasheet?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Price {
  id: string;
  amount: number;
  currency?: Currency;
  scale: number;
  product: Product;
  productId: string;
}

export interface Currency {
  id: string;
  code: string;
  base: number;
  exponent: number;
  price: Price;
  priceId: string;
  usedPrice: UsedPrice;
  usedPriceId: string;
}

export interface Discount {
  id: string;
  percent: number;
  expires?: number;
  product: Product;
  productId: string;
}

export interface UsedPrice {
  id: string;
  amount: number;
  currency?: Currency;
  scale: number;
  product: Product;
  productId: string;
}
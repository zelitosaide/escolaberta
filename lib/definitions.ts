export interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
};

export interface Product {
  id: string;
  stock: number;
  rating: number;
  name: string;
  description: string;
  price: Price;
  isBestSeller: boolean;
  leadTime: number;
  image?: string;
  imageBlur?: string;
  discount?: Discount;
  usedPrice?: UsedPrice;
};

interface Price {
  amount: number;
  currency: Currency;
  scale: number;
};

interface Currency {
  code: string;
  base: number;
  exponent: number;
};

interface Discount {
  percent: number;
  expires?: number;
};

interface UsedPrice {
  amount: number;
  currency: Currency;
  scale: number;
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
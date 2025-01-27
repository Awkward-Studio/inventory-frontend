export type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  quantity: number;
  location: string;
  supplier: string;
  description: string;
  created_at: string;
  updated_at: string;
};

export type ProductResponse = {
  results: Product[];
  count: number;
  next: string | null;
  previous: string | null;
};

export type FetchProductsParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  ordering?: string;
};
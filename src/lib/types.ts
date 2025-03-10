export interface Product {
  id?: string;
  name: string;
  itemCode?: string;
  sku?: string;
  hsn?: string;
  category?: string;
  quantity: number;
  itemLocation?: string;
  description?: string;
  price: number;
  msp?: number | string;
  mrp: number;
  gst: number;
  cgst?: string;
  sgst?: string;
  igst?: string;
  vendorCode?: string;
  vendorName?: string;
  purchasePrice?: number;
  purchaseLocation?: string;
  purchaseDate?: string; // ISO 8601 Date string
  purchaseOrderDate?: string; // ISO 8601 Date string
  purchaseOrderId?: string;
  lastUpdatedDate?: string; // ISO 8601 Date string
  warrantyPeriod?: string;
  media?: ProductMedia[];
  created_at?: string; // ISO 8601 Date string
  updated_at?: string; // ISO 8601 Date string
}

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

export interface OrderCard {
  id: string;
  order_number: number;
  customer_name: string;
  customer_address: string;
  customer_phone: string;
  customer_gst: string;
  progress_status: number;
  otp_generated_at?: string;
  status: string;
  created_at: string;
  updated_at: string;
  order_parts?: any[];
}

export interface OrderPart {
  id: string;
  order: string; // OrderCard ID
  part_id: string; // Product ID
  part_name: string;
  part_number: string;
  hsn?: string;
  quantity: number;
  
  // Pricing and tax details
  mrp: number;
  discount: number;
  discount_amount?: number;
  sub_total: number;
  total_tax: number;
  total_amount: number;
  
  // Fixed GST values from the original product
  gst: number;
  cgst: number;
  sgst: number;
  cgst_amount?: number;
  sgst_amount?: number;
  
  created_at?: string; // ISO 8601 Date string
}

export interface CurrentOrderPart {
  id?: string;
  order?: string; // OrderCard ID
  part_id: string; // Product ID
  part_name: string;
  part_number: string;
  hsn?: string;
  quantity: number;
  
  // Pricing and tax details
  mrp: number;
  sub_total: number;
  total_tax: number;
  total_amount: number;
  
  // Fixed GST values from the original product
  gst: number;
  cgst: number;
  sgst: number;
  cgstAmt: number;
  sgstAmt: number;

  discount?: number;
  discountAmt?: number;
}

export interface ProductMedia {
  id: string; // UUID of the media file
  product: string; // Product ID (Foreign Key)
  media_type: "image" | "video"; // Defines if it's an image or video
  appwrite_file_id: string; // Appwrite Storage File ID
  created_at?: string; // ISO 8601 timestamp
}

import axios from "axios";
import { Product } from "@/lib/types";

// API interface class
class ProductAPI {
  private baseURL: string;

  constructor() {
    this.baseURL = "http://127.0.0.1:8000/api"; // Replace with your backend API base URL
  }

  /**
   * Fetch products with optional query parameters
   */
  async getProducts(filters: {
    search?: string;
    category?: string;
    ordering?: string;
    page?: number;
    pageSize?: number;
  }): Promise<Product[]> {
    const response = await axios.get(`${this.baseURL}/products/`, {
      params: filters,
    });
    return response.data;
  }

  /**
   * Fetch a single product by its ID
   */
  async getProductById(id: String): Promise<Product> {
    const response = await axios.get(`${this.baseURL}/products/${id}/`);
    return response.data;
  }

  /**
   * Delete a product by its ID
   */
  async deleteProduct(id: String): Promise<void> {
    await axios.delete(`${this.baseURL}/products/${id}/delete/`);
  }

  /**
   * Edit a product by its ID
   */
  async editProduct(id: String, updatedData: Partial<Product>): Promise<Product> {
    const response = await axios.patch(`${this.baseURL}/products/${id}/update/`, updatedData);
    return response.data;
  }

  /**
   * Create a new product
   */
  async createProduct(product: {
    name: string;
    sku?: string;
    category?: string;
    quantity: number;
    price: number;
    supplier?: string;
    location?: string;
    description?: string;
  }): Promise<void> {
    await axios.post(`${this.baseURL}/products/create/`, product, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

export default new ProductAPI();

import axios from "axios";
import { Product, OrderCard, OrderPart, CurrentOrderPart } from "@/lib/types";

// API interface class for Products
class ProductAPI {
  private baseURL: string;

  constructor() {
    this.baseURL = "http://127.0.0.1:8000/api"; // Replace with your backend API base URL
  }

  /**
   * Fetch products with optional query parameters
   */
  async getProducts(filters: { search?: string; category?: string; ordering?: string; page?: number; pageSize?: number; }): Promise<Product[]> {
    try {
      const response = await axios.get(`${this.baseURL}/products/`, { params: filters });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch products!", error);
      return [];
    }
  }

  /**
   * Fetch a single product by its ID
   */
  async getProductById(id: string): Promise<Product> {
    try {
      const response = await axios.get(`${this.baseURL}/products/${id}/`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch product!", error);
      throw error;
    }
  }

  /**
   * Delete a product by its ID
   */
  async deleteProduct(id: string): Promise<void> {
    try {
      await axios.delete(`${this.baseURL}/products/${id}/delete/`);
    } catch (error) {
      console.error("Failed to delete product!", error);
    }
  }

  /**
   * Edit a product by its ID
   */
  async editProduct(id: string, updatedData: Partial<Product>): Promise<Product> {
    try {
      const response = await axios.patch(`${this.baseURL}/products/${id}/update/`, updatedData);
      return response.data;
    } catch (error) {
      console.error("Failed to edit product!", error);
      throw error;
    }
  }

  /**
   * Create a new product
   */
  async createProduct(product: Product): Promise<void> {
    try {
      await axios.post(`${this.baseURL}/products/create/`, product, { headers: { "Content-Type": "application/json" } });
    } catch (error) {
      console.error("Failed to create product!", error);
    }
  }
}

// API interface class for Orders
class OrderAPI {
  private baseURL: string;

  constructor() {
    this.baseURL = "http://127.0.0.1:8000/api"; // Replace with your backend API base URL
  }

  /**
   * Fetch all order cards
   */
  async getOrderCards(): Promise<OrderCard[]> {
    try {
      const response = await axios.get(`${this.baseURL}/orders/`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch orders!", error);
      return [];
    }
  }

  /**
   * Fetch a specific order by its ID
   */
  async getOrderCardById(orderId: string): Promise<OrderCard> {
    try {
      const response = await axios.get(`${this.baseURL}/orders/${orderId}/`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch order!", error);
      throw error;
    }
  }

  /**
   * Create a new order card
   */
  async createOrderCard(orderData: Partial<OrderCard>): Promise<any> {
    try {
      const response = await axios.post(`${this.baseURL}/orders/create/`, orderData, { headers: { "Content-Type": "application/json" } });
      return response;
    } catch (error) {
      console.error("Failed to create order!", error);
      throw error;
    }
  }

  /**
   * Add parts to an order
   */
  async addPartsToOrder(orderId: string, partsData: Partial<CurrentOrderPart>[]): Promise<any> {
    try {
      const response = await axios.post(`${this.baseURL}/orders/${orderId}/add-parts/`, { parts: partsData }, { headers: { "Content-Type": "application/json" } });
      return response;
    } catch (error) {
      console.error("Failed to add parts!", error);
      return [];
    }
  }

  /**
   * Update an order card
   */
  async updateOrderCard(orderId: string, updatedData: Partial<OrderCard>): Promise<any> {
    try {
      const response = await axios.put(`${this.baseURL}/orders/${orderId}/update/`, updatedData);
      return response;
    } catch (error) {
      console.error("Failed to update order!", error);
      throw error;
    }
  }

  /**
   * Update order status
   */
  async updateOrderCardStatus(orderId: string, status: number): Promise<any> {
    try {
      const res = await this.updateOrderCard(orderId, { progress_status: status });
      return res;
    } catch (error) {
      console.error("Failed to update order status!", error);
      return null;
    }
  }

  /**
   * Update order parts
   */
  async updateOrderCardParts(orderId: string, currentParts: Partial<OrderPart>[]): Promise<any> {
    try {
      return await this.addPartsToOrder(orderId, currentParts);
    } catch (error) {
      console.error("Failed to update order parts!", error);
      return [];
    }
  }

  /**
   * Update order customer details
   */
  async updateOrderCardCustomerDetails(orderId: string, field: string, value: any): Promise<void> {
    try {
      const payload = { [field]: value };
      await axios.put(`${this.baseURL}/orders/${orderId}/update/`, payload);
    } catch (error) {
      console.error("Failed to update customer details!", error);
    }
  }

  /**
   * Delete an order card
   */
  async deleteOrderCard(orderId: string): Promise<any> {
    try {
      const res = await axios.delete(`${this.baseURL}/orders/${orderId}/delete/`);
      return res;
    } catch (error) {
      console.error("Failed to delete order!", error);
    }
  }

  /**
   * Search products by name
   */
  async searchProducts(filters: { search?: string }): Promise<Product[]> {
    try {
      const response = await axios.get(`${this.baseURL}/products/`, { params: filters });
      return response.data;
    } catch (error) {
      console.error("Failed to search products!", error);
      return [];
    }
  }
}

class InvoiceAPI {
  private baseURL: string;

  constructor() {
    this.baseURL = "http://127.0.0.1:8000/api";
  }

  async getNextInvoiceNumber(orderId: string, invoiceType: string): Promise<number> {
    try {
      const response = await axios.get(`${this.baseURL}/invoices/next/${orderId}/${invoiceType}/`);
      return response.data.invoice_number;
    } catch (error) {
      console.error("Failed to fetch next invoice number!", error);
      throw error;
    }
  }

  async getInvoices(): Promise<any[]> {
    try {
      const response = await axios.get(`${this.baseURL}/invoices/`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch invoices!", error);
      return [];
    }
  }

  async getInvoiceById(invoiceId: string): Promise<any> {
    try {
      const response = await axios.get(`${this.baseURL}/invoices/${invoiceId}/`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch invoice!", error);
      throw error;
    }
  }

  async createInvoice(orderId: string, invoiceType: string, invoiceUrl: string): Promise<any> {
    try {
      const invoiceNumber = await this.getNextInvoiceNumber(orderId, invoiceType);

      const response = await axios.post(`${this.baseURL}/invoices/create/`, {
        order_card: orderId,
        invoice_type: invoiceType,
        invoice_number: invoiceNumber,
        invoice_url: invoiceUrl
      });

      return response.data;
    } catch (error) {
      console.error("Failed to create invoice!", error);
      throw error;
    }
  }

  async updateInvoice(invoiceId: string, invoiceUrl: string): Promise<any> {
    try {
      const response = await axios.put(`${this.baseURL}/invoices/${invoiceId}/update/`, { invoice_url: invoiceUrl });
      return response.data;
    } catch (error) {
      console.error("Failed to update invoice!", error);
      throw error;
    }
  }

  async deleteInvoice(invoiceId: string): Promise<any> {
    try {
      const res = await axios.delete(`${this.baseURL}/invoices/${invoiceId}/`);
      return res;
    } catch (error) {
      console.error("Failed to delete invoice!", error);
    }
  }
}

export const productAPI = new ProductAPI();
export const orderAPI = new OrderAPI();
export const invoiceAPI = new InvoiceAPI();



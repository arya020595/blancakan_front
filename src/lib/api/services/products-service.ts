/**
 * Products API Service
 * Handles product-related API calls
 */

import { BaseApiService } from '../base-service';
import { API_CONFIG } from '../config';
import {
    ApiResponse,
    Category,
    CreateProductRequest,
    ListQueryParams,
    PaginatedResponse,
    Product
} from '../types';

class ProductsApiService extends BaseApiService {
  constructor() {
    super('');
  }

  // Products CRUD
  async getProducts(params?: ListQueryParams): Promise<PaginatedResponse<Product>> {
    return this.getList<Product>(API_CONFIG.ENDPOINTS.PRODUCTS.LIST, params);
  }

  async getProduct(id: string | number): Promise<ApiResponse<Product>> {
    return this.getById<Product>(API_CONFIG.ENDPOINTS.PRODUCTS.DETAIL, id);
  }

  async createProduct(data: CreateProductRequest): Promise<ApiResponse<Product>> {
    return this.create<Product, CreateProductRequest>(
      API_CONFIG.ENDPOINTS.PRODUCTS.CREATE, 
      data
    );
  }

  async updateProduct(
    id: string | number, 
    data: Partial<CreateProductRequest>
  ): Promise<ApiResponse<Product>> {
    return this.update<Product, Partial<CreateProductRequest>>(
      API_CONFIG.ENDPOINTS.PRODUCTS.UPDATE, 
      id, 
      data
    );
  }

  async deleteProduct(id: string | number): Promise<ApiResponse<void>> {
    return this.delete(API_CONFIG.ENDPOINTS.PRODUCTS.DELETE, id);
  }

  // Categories
  async getCategories(params?: ListQueryParams): Promise<ApiResponse<Category[]>> {
    return this.customAction<Category[]>(
      'GET',
      API_CONFIG.ENDPOINTS.PRODUCTS.CATEGORIES,
      undefined,
      undefined,
      params
    );
  }

  // Product images upload
  async uploadProductImage(
    productId: string | number, 
    file: File
  ): Promise<ApiResponse<{ url: string }>> {
    return this.uploadFile<{ url: string }>(
      '/products/:id/images',
      file,
      { id: String(productId) }
    );
  }

  // Custom actions
  async updateProductStatus(
    id: string | number, 
    status: 'active' | 'inactive' | 'out_of_stock'
  ): Promise<ApiResponse<Product>> {
    return this.customAction<Product, { status: string }>(
      'PATCH',
      '/products/:id/status',
      { status },
      { id: String(id) }
    );
  }
}

export const productsApiService = new ProductsApiService();

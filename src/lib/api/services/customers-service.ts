/**
 * Customers API Service
 * Handles customer-related API calls
 */

import { BaseApiService } from '../base-service';
import { API_CONFIG } from '../config';
import {
    ApiResponse,
    Customer,
    ListQueryParams,
    PaginatedResponse
} from '../types';

class CustomersApiService extends BaseApiService {
  constructor() {
    super('');
  }

  // Customers CRUD
  async getCustomers(params?: ListQueryParams): Promise<PaginatedResponse<Customer>> {
    return this.getList<Customer>(API_CONFIG.ENDPOINTS.CUSTOMERS.LIST, params);
  }

  async getCustomer(id: string | number): Promise<ApiResponse<Customer>> {
    return this.getById<Customer>(API_CONFIG.ENDPOINTS.CUSTOMERS.DETAIL, id);
  }

  async createCustomer(data: Partial<Customer>): Promise<ApiResponse<Customer>> {
    return this.create<Customer, Partial<Customer>>(
      API_CONFIG.ENDPOINTS.CUSTOMERS.CREATE, 
      data
    );
  }

  async updateCustomer(
    id: string | number, 
    data: Partial<Customer>
  ): Promise<ApiResponse<Customer>> {
    return this.update<Customer, Partial<Customer>>(
      API_CONFIG.ENDPOINTS.CUSTOMERS.UPDATE, 
      id, 
      data
    );
  }

  // Customer search
  async searchCustomers(
    searchTerm: string, 
    params?: Omit<ListQueryParams, 'search'>
  ): Promise<PaginatedResponse<Customer>> {
    return this.getCustomers({
      ...params,
      search: searchTerm
    });
  }

  // Customer statistics
  async getCustomerStats(id: string | number): Promise<ApiResponse<{
    total_orders: number;
    total_spent: number;
    average_order_value: number;
    last_order_date: string;
  }>> {
    return this.customAction<{
      total_orders: number;
      total_spent: number;
      average_order_value: number;
      last_order_date: string;
    }>(
      'GET',
      '/customers/:id/stats',
      undefined,
      { id: String(id) }
    );
  }
}

export const customersApiService = new CustomersApiService();

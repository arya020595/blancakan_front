/**
 * Orders API Service
 * Handles order-related API calls
 */

import { BaseApiService } from '../base-service';
import { API_CONFIG } from '../config';
import {
    ApiResponse,
    ListQueryParams,
    Order,
    OrderStatus,
    PaginatedResponse
} from '../types';

class OrdersApiService extends BaseApiService {
  constructor() {
    super('');
  }

  // Orders CRUD
  async getOrders(params?: ListQueryParams): Promise<PaginatedResponse<Order>> {
    return this.getList<Order>(API_CONFIG.ENDPOINTS.ORDERS.LIST, params);
  }

  async getOrder(id: string | number): Promise<ApiResponse<Order>> {
    return this.getById<Order>(API_CONFIG.ENDPOINTS.ORDERS.DETAIL, id);
  }

  async updateOrder(
    id: string | number, 
    data: Partial<Order>
  ): Promise<ApiResponse<Order>> {
    return this.update<Order, Partial<Order>>(
      API_CONFIG.ENDPOINTS.ORDERS.UPDATE, 
      id, 
      data
    );
  }

  // Order status management
  async updateOrderStatus(
    id: string | number, 
    status: OrderStatus
  ): Promise<ApiResponse<Order>> {
    return this.customAction<Order, { status: OrderStatus }>(
      'PATCH',
      '/orders/:id/status',
      { status },
      { id: String(id) }
    );
  }

  async cancelOrder(id: string | number): Promise<ApiResponse<Order>> {
    return this.customAction<Order>(
      'POST',
      API_CONFIG.ENDPOINTS.ORDERS.CANCEL,
      undefined,
      { id: String(id) }
    );
  }

  // Order filtering helpers
  async getOrdersByStatus(
    status: OrderStatus, 
    params?: Omit<ListQueryParams, 'filters'>
  ): Promise<PaginatedResponse<Order>> {
    return this.getOrders({
      ...params,
      filters: { status }
    });
  }

  async getOrdersByCustomer(
    customerId: string | number, 
    params?: Omit<ListQueryParams, 'filters'>
  ): Promise<PaginatedResponse<Order>> {
    return this.getOrders({
      ...params,
      filters: { customer_id: customerId }
    });
  }

  // Order analytics
  async getOrdersRevenue(
    startDate?: string, 
    endDate?: string
  ): Promise<ApiResponse<{ total_revenue: number; orders_count: number }>> {
    const queryParams: Record<string, any> = {};
    if (startDate) queryParams.start_date = startDate;
    if (endDate) queryParams.end_date = endDate;

    return this.customAction<{ total_revenue: number; orders_count: number }>(
      'GET',
      '/orders/revenue',
      undefined,
      undefined,
      queryParams as ListQueryParams
    );
  }
}

export const ordersApiService = new OrdersApiService();

/**
 * Products Hooks
 * Custom hooks for product-related operations
 */

import { productsApiService } from "@/lib/api/services";
import {
  CreateProductRequest,
  ListQueryParams,
  Product,
} from "@/lib/api/types";
import { useFetch, useMutation, usePaginatedFetch } from "./api-hooks";

// Products list hook
export const useProducts = (initialParams?: ListQueryParams) => {
  return usePaginatedFetch(
    (params) => productsApiService.getProducts(params),
    initialParams
  );
};

// Single product hook
export const useProduct = (id: string | number) => {
  return useFetch(() => productsApiService.getProduct(id), [id]);
};

// Categories hook
export const useCategories = () => {
  return useFetch(() => productsApiService.getCategories(), []);
};

// Create product hook
export const useCreateProduct = () => {
  return useMutation<Product, CreateProductRequest>((data) =>
    productsApiService.createProduct(data)
  );
};

// Update product hook
export const useUpdateProduct = () => {
  return useMutation<
    Product,
    { id: string | number; data: Partial<CreateProductRequest> }
  >(({ id, data }) => productsApiService.updateProduct(id, data));
};

// Delete product hook
export const useDeleteProduct = () => {
  return useMutation<void, string | number>((id) =>
    productsApiService.deleteProduct(id)
  );
};

// Upload product image hook
export const useUploadProductImage = () => {
  return useMutation<
    { url: string },
    { productId: string | number; file: File }
  >(({ productId, file }) =>
    productsApiService.uploadProductImage(productId, file)
  );
};

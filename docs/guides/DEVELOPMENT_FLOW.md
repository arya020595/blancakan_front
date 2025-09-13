# Complete Development Flow Guide

This guide provides a step-by-step process for developing features from UI creation to API integration using our established patterns.

## 🎯 Overview

Our development follows a structured, layered approach:
1. **UI Layer** - Create the component and page
2. **Type Layer** - Define TypeScript interfaces
3. **Service Layer** - Implement API service
4. **Hook Layer** - Create custom hooks
5. **Integration Layer** - Connect UI to API
6. **Testing Layer** - Verify functionality

## 📋 Development Flow

### Phase 1: Planning & Setup

#### 1.1 Define Requirements
```bash
# Example: Creating a Products Management feature
- List products with pagination
- Create new product
- Edit existing product
- Delete product
- Filter/search products
```

#### 1.2 API Endpoint Analysis
```bash
# Analyze your backend API endpoints
GET    /products           # List products
POST   /products           # Create product
GET    /products/:id       # Get product details
PUT    /products/:id       # Update product
DELETE /products/:id       # Delete product
```

### Phase 2: Type Definitions

#### 2.1 Create API Types
```typescript
// File: src/lib/api/types.ts

// Add to existing types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  stock: number;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ProductRequest {
  product: {
    name: string;
    description: string;
    price: number;
    category_id: string;
    stock: number;
    image_url?: string;
  };
}

export interface ProductResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  stock: number;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ProductsListResponse {
  products: Product[];
  meta: PaginationMeta;
}
```

#### 2.2 Update API Configuration
```typescript
// File: src/lib/api/config.ts

// Add to ENDPOINTS.PRODUCTS
PRODUCTS: {
  LIST: "/products",
  DETAIL: "/products/:id",
  CREATE: "/products", 
  UPDATE: "/products/:id",
  DELETE: "/products/:id",
  CATEGORIES: "/products/categories",
  SEARCH: "/products/search", // Add if needed
},
```

### Phase 3: Service Layer Implementation

#### 3.1 Create API Service
```typescript
// File: src/lib/api/services/products-service.ts

import { BaseApiService } from "@/lib/api/base-service";
import { API_CONFIG } from "@/lib/api/config";
import { 
  ApiResponse, 
  Product, 
  ProductRequest, 
  ProductResponse,
  ProductsListResponse,
  PaginatedResponse 
} from "../types";
import { createLogger } from "@/lib/utils/logger";

export class ProductsApiService extends BaseApiService {
  private readonly logger = createLogger("PRODUCTS SERVICE");

  constructor() {
    super("");
  }

  // List products with pagination
  async getProducts(page = 1, perPage = 10): Promise<ProductsListResponse | null> {
    try {
      this.logger.info("Fetching products", { page, perPage });
      
      const response = await this.get<PaginatedResponse<Product>>(
        `${API_CONFIG.ENDPOINTS.PRODUCTS.LIST}?page=${page}&per_page=${perPage}`
      );

      if (response.status === "success") {
        return {
          products: response.data,
          meta: response.meta
        };
      }

      this.logger.warn("Failed to fetch products", response);
      return null;
    } catch (error) {
      this.logger.error("Error fetching products", error);
      throw error;
    }
  }

  // Get single product
  async getProduct(id: string): Promise<Product | null> {
    try {
      this.logger.info("Fetching product", { id });
      
      const response = await this.get<ProductResponse>(
        API_CONFIG.ENDPOINTS.PRODUCTS.DETAIL.replace(':id', id)
      );

      if (response.status === "success") {
        return response.data;
      }

      return null;
    } catch (error) {
      this.logger.error("Error fetching product", error);
      throw error;
    }
  }

  // Create product
  async createProduct(productData: ProductRequest): Promise<Product | null> {
    try {
      this.logger.info("Creating product", { name: productData.product.name });
      
      const response = await this.post<ProductResponse>(
        API_CONFIG.ENDPOINTS.PRODUCTS.CREATE,
        productData
      );

      if (response.status === "success") {
        this.logger.info("Product created successfully", response.data);
        return response.data;
      }

      return null;
    } catch (error) {
      this.logger.error("Error creating product", error);
      throw error;
    }
  }

  // Update product
  async updateProduct(id: string, productData: ProductRequest): Promise<Product | null> {
    try {
      this.logger.info("Updating product", { id, name: productData.product.name });
      
      const response = await this.put<ProductResponse>(
        API_CONFIG.ENDPOINTS.PRODUCTS.UPDATE.replace(':id', id),
        productData
      );

      if (response.status === "success") {
        this.logger.info("Product updated successfully", response.data);
        return response.data;
      }

      return null;
    } catch (error) {
      this.logger.error("Error updating product", error);
      throw error;
    }
  }

  // Delete product
  async deleteProduct(id: string): Promise<boolean> {
    try {
      this.logger.info("Deleting product", { id });
      
      const response = await this.delete<void>(
        API_CONFIG.ENDPOINTS.PRODUCTS.DELETE.replace(':id', id)
      );

      if (response.status === "success") {
        this.logger.info("Product deleted successfully", { id });
        return true;
      }

      return false;
    } catch (error) {
      this.logger.error("Error deleting product", error);
      throw error;
    }
  }
}

// Export singleton instance
export const productsApiService = new ProductsApiService();
```

#### 3.2 Export Service
```typescript
// File: src/lib/api/services/index.ts

export { authApiService } from "./auth-service";
export { dashboardApiService } from "./dashboard-service"; 
export { productsApiService } from "./products-service"; // Add this line
// ... other exports
```

### Phase 4: Custom Hooks Layer

#### 4.1 Create Product Hooks
```typescript
// File: src/hooks/products-hooks.ts

import { productsApiService } from "@/lib/api/services";
import { ApiError, Product, ProductRequest } from "@/lib/api/types";
import { createLogger } from "@/lib/utils/logger";
import { useCallback, useState } from "react";

const logger = createLogger("PRODUCTS HOOKS");

// Hook for fetching products list
export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    perPage: 10
  });

  const fetchProducts = useCallback(async (page = 1, perPage = 10) => {
    try {
      setIsLoading(true);
      setError(null);
      
      logger.info("Fetching products", { page, perPage });
      
      const response = await productsApiService.getProducts(page, perPage);
      
      if (response) {
        setProducts(response.products);
        setPagination({
          currentPage: response.meta.current_page,
          totalPages: response.meta.total_pages,
          total: response.meta.total,
          perPage: response.meta.per_page
        });
        logger.info("Products fetched successfully", { count: response.products.length });
      }
    } catch (err) {
      logger.error("Error fetching products", err);
      setError(err as ApiError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshProducts = useCallback(() => {
    fetchProducts(pagination.currentPage, pagination.perPage);
  }, [fetchProducts, pagination.currentPage, pagination.perPage]);

  return {
    products,
    isLoading,
    error,
    pagination,
    fetchProducts,
    refreshProducts,
  };
};

// Hook for single product operations
export const useProduct = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchProduct = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await productsApiService.getProduct(id);
      setProduct(response);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    product,
    isLoading,
    error,
    fetchProduct,
  };
};

// Hook for product creation
export const useCreateProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const createProduct = useCallback(async (productData: ProductRequest): Promise<Product | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      logger.info("Creating product", { name: productData.product.name });
      
      const response = await productsApiService.createProduct(productData);
      
      if (response) {
        logger.info("Product created successfully", response);
        return response;
      }
      
      return null;
    } catch (err) {
      logger.error("Error creating product", err);
      setError(err as ApiError);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    createProduct,
    isLoading,
    error,
    clearError,
  };
};

// Hook for product updates
export const useUpdateProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const updateProduct = useCallback(async (id: string, productData: ProductRequest): Promise<Product | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await productsApiService.updateProduct(id, productData);
      
      if (response) {
        logger.info("Product updated successfully", response);
        return response;
      }
      
      return null;
    } catch (err) {
      logger.error("Error updating product", err);
      setError(err as ApiError);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    updateProduct,
    isLoading,
    error,
  };
};

// Hook for product deletion
export const useDeleteProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const deleteProduct = useCallback(async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const success = await productsApiService.deleteProduct(id);
      
      if (success) {
        logger.info("Product deleted successfully", { id });
      }
      
      return success;
    } catch (err) {
      logger.error("Error deleting product", err);
      setError(err as ApiError);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    deleteProduct,
    isLoading,
    error,
  };
};
```

#### 4.2 Export Hooks
```typescript
// File: src/hooks/index.ts

export * from "./auth-hooks";
export * from "./products-hooks"; // Add this line
// ... other exports
```

### Phase 5: UI Components

#### 5.1 Create Product Components
```typescript
// File: src/components/products/product-list.tsx

"use client";

import { useProducts } from "@/hooks/products-hooks";
import { createLogger } from "@/lib/utils/logger";
import { useEffect, useState } from "react";

const logger = createLogger("PRODUCT LIST");

export default function ProductList() {
  const { products, isLoading, error, pagination, fetchProducts } = useProducts();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    logger.info("ProductList mounted, fetching products");
    fetchProducts(currentPage);
  }, [fetchProducts, currentPage]);

  const handlePageChange = (page: number) => {
    logger.info("Page changed", { page });
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-red-800">
          <h3 className="font-medium">Error loading products</h3>
          <p className="text-sm mt-1">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          onClick={() => {/* Navigate to create product */}}>
          Add Product
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {products.map((product) => (
            <li key={product.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {product.image_url && (
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={product.image_url}
                          alt={product.name}
                        />
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {product.description}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-900">
                      ${product.price}
                    </div>
                    <div className="text-sm text-gray-500">
                      Stock: {product.stock}
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-700">
          Showing {((currentPage - 1) * pagination.perPage) + 1} to{" "}
          {Math.min(currentPage * pagination.perPage, pagination.total)} of{" "}
          {pagination.total} results
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded-md disabled:opacity-50">
            Previous
          </button>
          <span className="px-3 py-1">
            Page {currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === pagination.totalPages}
            className="px-3 py-1 border rounded-md disabled:opacity-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
```

#### 5.2 Create Product Form Component
```typescript
// File: src/components/products/product-form.tsx

"use client";

import { useCreateProduct, useUpdateProduct } from "@/hooks/products-hooks";
import { Product, ProductRequest } from "@/lib/api/types";
import { createLogger } from "@/lib/utils/logger";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const logger = createLogger("PRODUCT FORM");

interface ProductFormProps {
  product?: Product; // For editing
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    category_id: "",
    stock: 0,
    image_url: "",
  });

  const { createProduct, isLoading: isCreating, error: createError } = useCreateProduct();
  const { updateProduct, isLoading: isUpdating, error: updateError } = useUpdateProduct();
  const router = useRouter();

  const isEditing = !!product;
  const isLoading = isCreating || isUpdating;
  const error = createError || updateError;

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category_id: product.category_id,
        stock: product.stock,
        image_url: product.image_url || "",
      });
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData: ProductRequest = {
      product: formData
    };

    logger.info("Submitting product form", { isEditing, data: formData });

    let result;
    if (isEditing && product) {
      result = await updateProduct(product.id, productData);
    } else {
      result = await createProduct(productData);
    }

    if (result) {
      logger.info("Product operation successful");
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/dashboard/products");
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            {isEditing ? "Edit Product" : "Create New Product"}
          </h3>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
              <div className="text-red-800">
                <h4 className="font-medium">Error</h4>
                <p className="text-sm mt-1">{error.message}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                disabled={isLoading}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
                disabled={isLoading}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price ($)
                </label>
                <input
                  type="number"
                  name="price"
                  id="price"
                  min="0"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  id="stock"
                  min="0"
                  required
                  value={formData.stock}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
                Category ID
              </label>
              <input
                type="text"
                name="category_id"
                id="category_id"
                required
                value={formData.category_id}
                onChange={handleInputChange}
                disabled={isLoading}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">
                Image URL (optional)
              </label>
              <input
                type="url"
                name="image_url"
                id="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                disabled={isLoading}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isEditing ? "Updating..." : "Creating..."}
                  </span>
                ) : (
                  isEditing ? "Update Product" : "Create Product"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
```

### Phase 6: Page Integration

#### 6.1 Create Products Page
```typescript
// File: src/app/dashboard/products/page.tsx

import ProductList from "@/components/products/product-list";

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ProductList />
    </div>
  );
}
```

#### 6.2 Create Product Create Page
```typescript
// File: src/app/dashboard/products/create/page.tsx

import ProductForm from "@/components/products/product-form";

export default function CreateProductPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ProductForm />
    </div>
  );
}
```

### Phase 7: Testing & Validation

#### 7.1 Test API Integration
```bash
# Start development server
npm run dev

# Test the endpoints:
# 1. Navigate to /dashboard/products
# 2. Try creating a product
# 3. Try editing a product
# 4. Try deleting a product
# 5. Test pagination
# 6. Test error handling (disconnect network)
```

#### 7.2 Check Console Logs
```javascript
// Verify logging works correctly
// Check browser console for:
// - API calls being made
// - Loading states
// - Error handling
// - Success notifications
```

## 🎯 Key Patterns to Follow

### 1. **Consistent Error Handling**
```typescript
// Always use try-catch in services
try {
  const response = await api.call();
  return response.data;
} catch (error) {
  logger.error("Operation failed", error);
  throw error;
}

// Always handle errors in hooks
catch (err) {
  setError(err as ApiError);
  logger.error("Hook operation failed", err);
}
```

### 2. **Consistent Logging**
```typescript
// Service level
logger.info("Starting operation", { params });
logger.error("Operation failed", error);

// Hook level  
logger.info("Hook called", { params });
logger.warn("Validation failed", validation);

// Component level
logger.debug("Component rendered", { props });
```

### 3. **Type Safety**
```typescript
// Always define proper interfaces
interface ApiRequest {
  // ... properties
}

interface ApiResponse {
  // ... properties  
}

// Use generics for reusable patterns
async function apiCall<T>(endpoint: string): Promise<T> {
  // ...
}
```

### 4. **Loading States**
```typescript
// Always manage loading states
const [isLoading, setIsLoading] = useState(false);

// Set loading before API call
setIsLoading(true);
try {
  await apiCall();
} finally {
  setIsLoading(false);
}
```

### 5. **Consistent UI Patterns**
```typescript
// Loading components
if (isLoading) {
  return <LoadingSpinner />;
}

// Error components
if (error) {
  return <ErrorDisplay error={error} />;
}

// Empty states
if (data.length === 0) {
  return <EmptyState />;
}
```

## 📚 Quick Reference

### Commands
```bash
# Create new component
mkdir -p src/components/feature-name
touch src/components/feature-name/component-name.tsx

# Create new page
mkdir -p src/app/feature-name
touch src/app/feature-name/page.tsx

# Create new service
touch src/lib/api/services/feature-service.ts

# Create new hooks
touch src/hooks/feature-hooks.ts
```

### File Structure
```
src/
├── components/feature/     # UI components
├── hooks/feature-hooks.ts  # Custom hooks
├── lib/api/
│   ├── services/feature-service.ts  # API service
│   └── types.ts           # Type definitions
└── app/feature/           # Next.js pages
```

This guide ensures consistency across all features and makes development predictable and maintainable.

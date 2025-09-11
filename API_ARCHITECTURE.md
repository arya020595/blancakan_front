# E-commerce Dashboard API Architecture

This document outlines the comprehensive API architecture for the e-commerce dashboard, supporting both Server-Side Rendering (SSR) and Client-Side Rendering (CSR) approaches.

## 🏗️ Architecture Overview

The API architecture is designed with the following principles:
- **Clean separation** between client and server API calls
- **Type safety** throughout the application
- **Reusable patterns** for common operations
- **Centralized configuration** and error handling
- **JWT token management** with automatic refresh
- **Middleware protection** for authenticated routes

## 📁 Folder Structure

```
src/
├── lib/
│   ├── api/
│   │   ├── config.ts                 # API configuration and endpoints
│   │   ├── types.ts                  # TypeScript interfaces
│   │   ├── http-client.ts            # Axios client for CSR
│   │   ├── server-client.ts          # Axios client for SSR
│   │   ├── base-service.ts           # Base service class
│   │   ├── server-actions.ts         # Server-side functions
│   │   ├── services/
│   │   │   ├── auth-service.ts       # Authentication API
│   │   │   ├── dashboard-service.ts  # Dashboard API
│   │   │   ├── products-service.ts   # Products API
│   │   │   ├── orders-service.ts     # Orders API
│   │   │   ├── customers-service.ts  # Customers API
│   │   │   └── index.ts             # Services export
│   │   └── index.ts                 # Main API export
│   └── auth/
│       └── token-manager.ts         # JWT token management
├── hooks/
│   ├── api-hooks.ts                 # Generic API hooks
│   ├── auth-hooks.ts                # Authentication hooks
│   ├── dashboard-hooks.ts           # Dashboard hooks
│   ├── products-hooks.ts            # Products hooks
│   └── index.ts                     # Hooks export
├── store/
│   ├── auth-store.ts                # Authentication state
│   └── index.ts                     # Store export
├── app/
│   ├── login/
│   │   └── page.tsx                 # Login page
│   └── dashboard/
│       ├── layout.tsx               # Dashboard layout
│       ├── page.tsx                 # Dashboard SSR page
│       ├── dashboard-client.tsx     # Dashboard client component
│       └── products/
│           └── page.tsx             # Products CSR page
└── middleware.ts                    # Route protection
```

## 🔧 Key Components

### 1. API Configuration (`src/lib/api/config.ts`)
Centralized configuration for all API endpoints and settings:
- Base URL configuration
- Endpoint definitions
- HTTP status codes
- Environment-specific settings

### 2. Type Definitions (`src/lib/api/types.ts`)
Comprehensive TypeScript interfaces for:
- API request/response structures
- Business entities (User, Product, Order, etc.)
- Pagination metadata
- Error handling types

### 3. HTTP Clients
- **Client-side** (`http-client.ts`): Axios instance with interceptors for CSR
- **Server-side** (`server-client.ts`): Axios instance configured for SSR

### 4. Base Service Class (`src/lib/api/base-service.ts`)
Abstract base class providing:
- Common CRUD operations
- URL building utilities
- Query parameter handling
- Error handling patterns

### 5. Service Classes (`src/lib/api/services/`)
Feature-specific API services extending the base service:
- **AuthApiService**: Login, logout, profile management
- **DashboardApiService**: Dashboard statistics and data
- **ProductsApiService**: Product CRUD operations
- **OrdersApiService**: Order management
- **CustomersApiService**: Customer management

### 6. Custom Hooks (`src/hooks/`)
React hooks for different use cases:
- **useFetch**: Generic data fetching
- **usePaginatedFetch**: Paginated data with controls
- **useMutation**: Create/update/delete operations
- **Feature-specific hooks**: Login, dashboard stats, etc.

### 7. Authentication System
- **Token Manager**: JWT storage, validation, refresh
- **Auth Store**: Zustand store for authentication state
- **Middleware**: Route protection and redirects
- **Auth Hooks**: Login, logout, profile management

## 🚀 Usage Examples

### Server-Side Rendering (SSR)

```typescript
// app/dashboard/page.tsx
import { getServerDashboardStats } from '@/lib/api/server-actions';

export default async function DashboardPage() {
  const stats = await getServerDashboardStats();
  
  return <DashboardComponent stats={stats} />;
}
```

### Client-Side Rendering (CSR)

```typescript
// components/ProductsList.tsx
import { useProducts } from '@/hooks/products-hooks';

export default function ProductsList() {
  const { data, isLoading, error, search, goToPage } = useProducts();
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return <ProductsTable products={data} onPageChange={goToPage} />;
}
```

### API Service Usage

```typescript
// Direct service usage
import { productsApiService } from '@/lib/api/services';

const createProduct = async (productData) => {
  try {
    const response = await productsApiService.createProduct(productData);
    if (response.success) {
      console.log('Product created:', response.data);
    }
  } catch (error) {
    console.error('Failed to create product:', error.message);
  }
};
```

### Authentication

```typescript
// Login component
import { useLogin } from '@/hooks/auth-hooks';

export default function LoginForm() {
  const { login, isLoading, error } = useLogin();
  
  const handleSubmit = async (credentials) => {
    const success = await login(credentials);
    if (success) {
      router.push('/dashboard');
    }
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

## 🔒 Authentication Flow

1. **Login**: User credentials sent to `/auth/login`
2. **Token Storage**: JWT tokens stored in secure cookies
3. **Request Interceptor**: Automatically adds Bearer token to requests
4. **Token Validation**: Middleware checks token validity on protected routes
5. **Auto Refresh**: Expired tokens automatically refreshed
6. **Logout**: Tokens cleared and user redirected to login

## 🛡️ Security Features

- **JWT Token Management**: Secure storage and automatic refresh
- **Route Protection**: Middleware guards protected pages
- **Request Interceptors**: Automatic token attachment
- **Error Handling**: Centralized error processing
- **Type Safety**: Full TypeScript coverage

## 🔄 State Management

- **Zustand Store**: Lightweight state management for auth
- **Server State**: Managed by React hooks and server functions
- **Local State**: Component-level state for UI interactions

## 📱 Responsive Design

- **Tailwind CSS**: Utility-first styling
- **Mobile-First**: Responsive grid and components
- **Accessibility**: Semantic HTML and ARIA labels

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install axios js-cookie @types/js-cookie zustand
   ```

2. **Environment Setup**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API base URL
   ```

3. **Usage**:
   ```typescript
   // For SSR
   import { getServerProducts } from '@/lib/api/server-actions';
   
   // For CSR
   import { useProducts } from '@/hooks/products-hooks';
   ```

## 🔧 Customization

### Adding New Endpoints

1. **Update Config**: Add endpoint to `API_CONFIG.ENDPOINTS`
2. **Add Types**: Define request/response interfaces
3. **Create Service**: Extend `BaseApiService`
4. **Create Hooks**: Add corresponding React hooks
5. **Add Server Actions**: For SSR support

### Adding New Features

1. **Define Types**: Add to `types.ts`
2. **Create Service**: New service class
3. **Add Hooks**: Feature-specific hooks
4. **Create Components**: UI components
5. **Add Routes**: Next.js pages

## 📈 Performance Considerations

- **Server-Side Rendering**: Faster initial page loads
- **Client-Side Caching**: Reduced API calls
- **Optimistic Updates**: Better user experience
- **Error Boundaries**: Graceful error handling
- **Code Splitting**: Smaller bundle sizes

## 🔍 Monitoring and Debugging

- **Request Logging**: Development mode logging
- **Error Tracking**: Centralized error handling
- **Performance Metrics**: Request timing
- **Type Checking**: Runtime type validation

This architecture provides a solid foundation for building scalable e-commerce applications with clean separation of concerns, type safety, and excellent developer experience.

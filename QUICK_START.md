# E-commerce Dashboard - Quick Start Guide

## 🎯 Overview

You now have a complete, production-ready API architecture for your e-commerce dashboard with:

✅ **Clean Architecture**: Separation between SSR and CSR approaches  
✅ **Type Safety**: Full TypeScript coverage  
✅ **Authentication**: JWT token management with auto-refresh  
✅ **Route Protection**: Middleware-based access control  
✅ **Reusable Patterns**: Generic hooks and services  
✅ **Error Handling**: Centralized error management  
✅ **State Management**: Zustand for lightweight state  

## 🚀 Quick Start

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Create environment file**:
   ```bash
   cp .env.example .env.local
   ```
   
3. **Update API configuration** in `.env.local`:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://your-api-url.com/api
   ```

## 📋 Available Routes

- `/login` - Authentication page
- `/dashboard` - Main dashboard (SSR example)
- `/dashboard/products` - Products management (CSR example)
- `/dashboard/orders` - Orders management (protected)
- `/dashboard/customers` - Customers management (protected)

## 🔧 API Integration Examples

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
  const { data, isLoading, error, search } = useProducts();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>{/* Render products */}</div>;
}
```

### Authentication
```typescript
// components/LoginForm.tsx
import { useLogin } from '@/hooks/auth-hooks';

export default function LoginForm() {
  const { login, isLoading, error } = useLogin();
  
  const handleSubmit = async (credentials) => {
    const success = await login(credentials);
    if (success) router.push('/dashboard');
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Direct API Calls
```typescript
import { productsApiService } from '@/lib/api/services';

// Create product
const product = await productsApiService.createProduct(productData);

// Get products with pagination
const products = await productsApiService.getProducts({
  page: 1,
  per_page: 10,
  search: 'laptop'
});
```

## 🔒 Authentication Flow

1. User logs in at `/login`
2. JWT tokens stored in secure cookies
3. Middleware protects `/dashboard/*` routes
4. Tokens automatically attached to API requests
5. Auto-refresh on token expiration
6. Redirect to login if authentication fails

## 🎨 Customization Guide

### Adding New API Endpoints

1. **Update configuration** (`src/lib/api/config.ts`):
   ```typescript
   ENDPOINTS: {
     INVENTORY: {
       LIST: '/inventory',
       DETAIL: '/inventory/:id',
     }
   }
   ```

2. **Add types** (`src/lib/api/types.ts`):
   ```typescript
   export interface InventoryItem {
     id: number;
     name: string;
     quantity: number;
   }
   ```

3. **Create service** (`src/lib/api/services/inventory-service.ts`):
   ```typescript
   class InventoryApiService extends BaseApiService {
     async getInventory() {
       return this.getList<InventoryItem>(API_CONFIG.ENDPOINTS.INVENTORY.LIST);
     }
   }
   ```

4. **Create hooks** (`src/hooks/inventory-hooks.ts`):
   ```typescript
   export const useInventory = () => {
     return usePaginatedFetch(
       (params) => inventoryApiService.getInventory(params)
     );
   };
   ```

### Adding Server-Side Functions

```typescript
// src/lib/api/server-actions.ts
export const getServerInventory = async (): Promise<InventoryItem[]> => {
  try {
    const response = await serverHttpClient.get<InventoryItem[]>('/inventory');
    return response.success ? response.data : [];
  } catch (error) {
    console.error('Failed to fetch inventory:', error);
    return [];
  }
};
```

## 📊 Key Features

### Pagination
```typescript
const { data, meta, goToPage, changePageSize } = useProducts();

// Go to specific page
goToPage(2);

// Change items per page
changePageSize(20);
```

### Search & Filtering
```typescript
const { search, filter, sort } = useProducts();

// Search products
search('laptop');

// Filter by category
filter({ category_id: 1 });

// Sort by price
sort('price', 'desc');
```

### Mutations
```typescript
const { mutate: createProduct, isLoading, error } = useCreateProduct();

const handleCreate = async (productData) => {
  const result = await createProduct(productData);
  if (result) {
    // Success! Product created
  }
};
```

## 🛠️ File Structure Reference

```
src/
├── lib/api/                 # API layer
│   ├── services/           # API services
│   ├── config.ts          # Configuration
│   ├── types.ts           # TypeScript types
│   ├── http-client.ts     # Client-side HTTP
│   ├── server-client.ts   # Server-side HTTP
│   └── server-actions.ts  # SSR functions
├── hooks/                  # React hooks
├── store/                  # State management
├── app/                    # Next.js pages
└── middleware.ts          # Route protection
```

## 🔍 Debugging Tips

1. **Check browser dev tools** for request/response logs
2. **Verify tokens** in Application > Cookies
3. **Review middleware logs** for route protection
4. **Use TypeScript errors** to catch issues early
5. **Check API responses** match expected types

## 📦 Dependencies Installed

- `axios` - HTTP client
- `js-cookie` - Cookie management
- `@types/js-cookie` - TypeScript definitions
- `zustand` - State management

## 🔗 Key Files to Customize

1. **API Base URL**: `.env.local`
2. **Endpoints**: `src/lib/api/config.ts`
3. **Types**: `src/lib/api/types.ts`
4. **Authentication**: `src/lib/auth/token-manager.ts`
5. **Route Protection**: `middleware.ts`

Your e-commerce dashboard is now ready for development! 🎉

For detailed documentation, see `API_ARCHITECTURE.md`.

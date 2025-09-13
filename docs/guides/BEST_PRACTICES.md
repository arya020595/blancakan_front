# Best Practices Guide

This document outlines the coding standards, patterns, and best practices for the E-commerce Dashboard project.

## 🎯 Core Principles

### 1. **SOLID Principles**
- **Single Responsibility**: Each class/function has one reason to change
- **Open/Closed**: Open for extension, closed for modification
- **Liskov Substitution**: Objects should be replaceable with their subtypes
- **Interface Segregation**: Clients shouldn't depend on unused interfaces
- **Dependency Inversion**: Depend on abstractions, not concretions

### 2. **Clean Code**
- Clear, descriptive naming
- Small, focused functions
- Minimal complexity
- Self-documenting code

### 3. **Type Safety**
- Use TypeScript strictly
- Define interfaces for all data structures
- Avoid `any` type
- Use generics for reusable patterns

## 📝 Naming Conventions

### Files and Folders
```bash
# Use kebab-case for files and folders
my-component.tsx
user-service.ts
auth-hooks.ts

# Use PascalCase for React components
UserProfile.tsx
ProductList.tsx

# Use camelCase for utilities
formatDate.ts
validateEmail.ts
```

### Variables and Functions
```typescript
// Use camelCase for variables and functions
const userName = "john";
const isLoading = false;

function getUserProfile() { }
const handleSubmit = () => { };

// Use PascalCase for React components
function UserProfile() { }
const ProductCard = () => { };

// Use UPPER_SNAKE_CASE for constants
const API_BASE_URL = "https://api.example.com";
const MAX_RETRY_ATTEMPTS = 3;
```

### Interfaces and Types
```typescript
// Use PascalCase with descriptive names
interface UserProfile {
  id: string;
  email: string;
}

type ApiResponse<T> = {
  data: T;
  status: string;
};

// Prefix interfaces with 'I' only for abstractions
interface IUserService {
  getUser(id: string): Promise<User>;
}
```

## 🏗️ Component Structure

### Component File Organization
```typescript
/**
 * Component documentation
 * Purpose: What this component does
 * Usage: How to use it
 */

"use client"; // Only if needed

import { /* React imports */ } from "react";
import { /* Third-party imports */ } from "library";
import { /* Internal imports */ } from "@/path";

// Types specific to this component
interface ComponentProps {
  // ...
}

// Main component
export default function ComponentName({ prop1, prop2 }: ComponentProps) {
  // 1. Hooks (state, effects, custom hooks)
  const [state, setState] = useState();
  const { data, isLoading } = useCustomHook();
  
  // 2. Event handlers
  const handleClick = () => {
    // implementation
  };
  
  // 3. Computed values
  const computedValue = useMemo(() => {
    return someExpensiveCalculation(data);
  }, [data]);
  
  // 4. Effects
  useEffect(() => {
    // side effects
  }, [dependencies]);
  
  // 5. Early returns (loading, error states)
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;
  
  // 6. Main render
  return (
    <div className="component-container">
      {/* JSX content */}
    </div>
  );
}

// Export any related types or utilities
export type { ComponentProps };
```

### Component Design Principles

#### 1. **Single Responsibility**
```typescript
// ❌ Bad: Component doing too many things
function UserDashboard() {
  // Fetching user data
  // Handling authentication
  // Managing user preferences
  // Rendering profile
  // Handling notifications
}

// ✅ Good: Separate responsibilities
function UserProfile() { /* Just profile display */ }
function UserPreferences() { /* Just preferences */ }
function NotificationCenter() { /* Just notifications */ }
```

#### 2. **Composition over Inheritance**
```typescript
// ✅ Good: Use composition
function Modal({ children, isOpen, onClose }) {
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content">
        {children}
      </div>
    </div>
  );
}

// Usage
<Modal isOpen={isModalOpen} onClose={handleClose}>
  <UserForm onSubmit={handleSubmit} />
</Modal>
```

#### 3. **Props Interface Design**
```typescript
// ✅ Good: Clear, specific props
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

// ❌ Bad: Vague or overly complex props
interface ButtonProps {
  data?: any; // Too vague
  config?: {
    style?: any;
    behavior?: any;
    // ... too complex
  };
}
```

## 🔧 Hook Patterns

### Custom Hook Structure
```typescript
// Template for custom hooks
export const useFeature = (initialParams?: FeatureParams) => {
  // 1. State management
  const [data, setData] = useState<FeatureData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  
  // 2. Logger
  const logger = createLogger("USE_FEATURE");
  
  // 3. Main operations
  const fetchData = useCallback(async (params: FeatureParams) => {
    try {
      setIsLoading(true);
      setError(null);
      
      logger.info("Fetching feature data", params);
      
      const result = await featureService.getData(params);
      setData(result);
      
      logger.info("Feature data fetched successfully");
    } catch (err) {
      logger.error("Failed to fetch feature data", err);
      setError(err as ApiError);
    } finally {
      setIsLoading(false);
    }
  }, [logger]);
  
  // 4. Utility functions
  const refreshData = useCallback(() => {
    if (initialParams) {
      fetchData(initialParams);
    }
  }, [fetchData, initialParams]);
  
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  // 5. Initial data loading
  useEffect(() => {
    if (initialParams) {
      fetchData(initialParams);
    }
  }, [fetchData, initialParams]);
  
  // 6. Return interface
  return {
    // Data
    data,
    isLoading,
    error,
    
    // Actions
    fetchData,
    refreshData,
    clearError,
  };
};
```

### Hook Best Practices

#### 1. **Consistent Return Interface**
```typescript
// ✅ Good: Consistent naming and structure
export const useUsers = () => ({
  users: data,
  isLoading,
  error,
  fetchUsers,
  refreshUsers,
});

export const useProducts = () => ({
  products: data,
  isLoading,
  error,
  fetchProducts,
  refreshProducts,
});
```

#### 2. **Error Handling**
```typescript
// ✅ Good: Comprehensive error handling
const useApiCall = () => {
  const [error, setError] = useState<ApiError | null>(null);
  
  const makeCall = async () => {
    try {
      setError(null);
      const result = await apiService.call();
      return result;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      logger.error("API call failed", apiError);
      throw apiError; // Re-throw for component handling
    }
  };
  
  return { makeCall, error };
};
```

## 🔌 API Integration Patterns

### Service Layer Structure
```typescript
export class FeatureApiService extends BaseApiService {
  private readonly logger = createLogger("FEATURE_SERVICE");
  
  constructor() {
    super(""); // Base path if needed
  }
  
  // CRUD operations
  async getItems(params?: QueryParams): Promise<Item[]> {
    try {
      this.logger.info("Fetching items", params);
      
      const response = await this.get<PaginatedResponse<Item>>(
        `/items${this.buildQueryString(params)}`
      );
      
      if (response.status === "success") {
        this.logger.info("Items fetched successfully", { 
          count: response.data.length 
        });
        return response.data;
      }
      
      throw new Error(`Failed to fetch items: ${response.message}`);
    } catch (error) {
      this.logger.error("Error fetching items", error);
      throw error;
    }
  }
  
  async createItem(itemData: CreateItemRequest): Promise<Item> {
    try {
      this.logger.info("Creating item", { name: itemData.name });
      
      const response = await this.post<ItemResponse>(
        "/items",
        itemData
      );
      
      if (response.status === "success") {
        this.logger.info("Item created successfully", response.data);
        return response.data;
      }
      
      throw new Error(`Failed to create item: ${response.message}`);
    } catch (error) {
      this.logger.error("Error creating item", error);
      throw error;
    }
  }
  
  // Helper methods
  private buildQueryString(params?: QueryParams): string {
    if (!params) return "";
    
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    
    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : "";
  }
}
```

### API Error Handling
```typescript
// ✅ Good: Structured error handling
try {
  const result = await apiService.operation();
  return result;
} catch (error) {
  // 1. Log the error
  logger.error("Operation failed", {
    operation: "specific-operation",
    error: error.message,
    stack: error.stack,
  });
  
  // 2. Transform error if needed
  if (error.status === 401) {
    // Handle authentication error
    authStore.logout();
    router.push("/login");
    return;
  }
  
  // 3. Re-throw for component handling
  throw error;
}
```

## 🎨 UI/UX Patterns

### Loading States
```typescript
// ✅ Good: Specific loading states
function ProductList() {
  const { products, isLoading, error } = useProducts();
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }
  
  // Rest of component
}

// Skeleton component
function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
    </div>
  );
}
```

### Error States
```typescript
// ✅ Good: User-friendly error handling
function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  const getErrorMessage = (error: ApiError) => {
    switch (error.status) {
      case 404:
        return "The requested resource was not found.";
      case 500:
        return "Server error. Please try again later.";
      case 401:
        return "You are not authorized to perform this action.";
      default:
        return error.message || "An unexpected error occurred.";
    }
  };
  
  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            Error
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{getErrorMessage(error)}</p>
          </div>
          {onRetry && (
            <div className="mt-4">
              <button
                onClick={onRetry}
                className="bg-red-100 px-3 py-1 rounded text-sm text-red-800 hover:bg-red-200">
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

### Form Handling
```typescript
// ✅ Good: Comprehensive form handling
function ProductForm({ product, onSubmit }: ProductFormProps) {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const validateForm = (data: FormData): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    if (!data.name.trim()) {
      errors.name = "Name is required";
    }
    
    if (!data.price || data.price <= 0) {
      errors.price = "Price must be greater than 0";
    }
    
    return errors;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Validate
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    
    // 2. Submit
    try {
      setIsSubmitting(true);
      await onSubmit(formData);
    } catch (error) {
      // Handle submission errors
      if (error.errors) {
        setErrors(error.errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <FormField
        label="Product Name"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        error={errors.name}
        disabled={isSubmitting}
      />
      
      <FormField
        label="Price"
        name="price"
        type="number"
        value={formData.price}
        onChange={handleInputChange}
        error={errors.price}
        disabled={isSubmitting}
      />
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary">
        {isSubmitting ? "Saving..." : "Save Product"}
      </button>
    </form>
  );
}
```

## 📊 State Management

### Local State
```typescript
// ✅ Good: Use local state for component-specific data
function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialData);
  
  // Component logic
}
```

### Global State (Zustand)
```typescript
// ✅ Good: Use global state for shared data
interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setIsAuthenticated: (isAuth: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  clearAuth: () => set({ user: null, isAuthenticated: false }),
}));
```

## 🔍 Testing Patterns

### Component Testing
```typescript
// ✅ Good: Test component behavior, not implementation
describe("ProductList", () => {
  it("displays loading state while fetching products", async () => {
    render(<ProductList />);
    
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
  
  it("displays products after successful fetch", async () => {
    const mockProducts = [
      { id: "1", name: "Product 1", price: 100 },
      { id: "2", name: "Product 2", price: 200 },
    ];
    
    jest.mocked(useProducts).mockReturnValue({
      products: mockProducts,
      isLoading: false,
      error: null,
    });
    
    render(<ProductList />);
    
    expect(screen.getByText("Product 1")).toBeInTheDocument();
    expect(screen.getByText("Product 2")).toBeInTheDocument();
  });
});
```

### Hook Testing
```typescript
// ✅ Good: Test hook logic
describe("useProducts", () => {
  it("fetches products successfully", async () => {
    const mockProducts = [{ id: "1", name: "Product 1" }];
    jest.mocked(productsService.getProducts).mockResolvedValue(mockProducts);
    
    const { result } = renderHook(() => useProducts());
    
    await act(async () => {
      await result.current.fetchProducts();
    });
    
    expect(result.current.products).toEqual(mockProducts);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
```

## 📏 Performance Best Practices

### React Optimization
```typescript
// ✅ Good: Memoize expensive calculations
const ExpensiveComponent = ({ data }: Props) => {
  const expensiveValue = useMemo(() => {
    return data.reduce((acc, item) => acc + item.value, 0);
  }, [data]);
  
  return <div>{expensiveValue}</div>;
};

// ✅ Good: Memoize callbacks to prevent unnecessary re-renders
const ParentComponent = () => {
  const [count, setCount] = useState(0);
  
  const handleClick = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);
  
  return <ChildComponent onClick={handleClick} />;
};

// ✅ Good: Use React.memo for pure components
const PureComponent = React.memo(({ name, value }: Props) => {
  return <div>{name}: {value}</div>;
});
```

### Bundle Optimization
```typescript
// ✅ Good: Dynamic imports for code splitting
const LazyComponent = lazy(() => import("./heavy-component"));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <LazyComponent />
    </Suspense>
  );
}

// ✅ Good: Barrel exports for better tree shaking
// utils/index.ts
export { formatDate } from "./date";
export { validateEmail } from "./validation";
// Don't export everything from a large library
```

## 🔒 Security Best Practices

### Input Validation
```typescript
// ✅ Good: Validate and sanitize inputs
function validateUserInput(input: string): string {
  // 1. Trim whitespace
  const trimmed = input.trim();
  
  // 2. Check length
  if (trimmed.length === 0 || trimmed.length > 255) {
    throw new Error("Invalid input length");
  }
  
  // 3. Sanitize (remove potentially dangerous characters)
  const sanitized = trimmed.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  
  return sanitized;
}
```

### API Security
```typescript
// ✅ Good: Always include authentication checks
class SecureApiService extends BaseApiService {
  private ensureAuthenticated(): void {
    const token = this.tokenManager.getToken();
    if (!token) {
      throw new Error("Authentication required");
    }
  }
  
  async secureOperation(): Promise<Data> {
    this.ensureAuthenticated();
    return this.post("/secure-endpoint", data);
  }
}
```

## 📱 Accessibility

### Semantic HTML
```typescript
// ✅ Good: Use semantic HTML elements
function ProductCard({ product }: Props) {
  return (
    <article className="product-card">
      <header>
        <h2>{product.name}</h2>
      </header>
      <main>
        <p>{product.description}</p>
        <data value={product.price}>
          ${product.price.toFixed(2)}
        </data>
      </main>
      <footer>
        <button aria-label={`Add ${product.name} to cart`}>
          Add to Cart
        </button>
      </footer>
    </article>
  );
}
```

### Keyboard Navigation
```typescript
// ✅ Good: Support keyboard navigation
function Modal({ isOpen, onClose, children }: ModalProps) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="modal-overlay">
      <div className="modal-content">
        <button
          aria-label="Close modal"
          onClick={onClose}
          className="close-button">
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
```

## 🔍 Debugging

### Logging Best Practices
```typescript
// ✅ Good: Structured logging with context
const logger = createLogger("COMPONENT_NAME");

// Include relevant context
logger.info("User action performed", {
  action: "product_purchase",
  userId: user.id,
  productId: product.id,
  timestamp: new Date().toISOString(),
});

// Log errors with full context
logger.error("API call failed", {
  endpoint: "/products",
  method: "POST",
  statusCode: error.status,
  message: error.message,
  requestData: sanitizedRequestData,
});
```

### Development Tools
```typescript
// ✅ Good: Use React DevTools and browser tools
function DebugComponent({ data }: Props) {
  // Add debug logging in development
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.group("DebugComponent");
      console.log("Props:", { data });
      console.log("Render time:", new Date().toISOString());
      console.groupEnd();
    }
  });
  
  return <div>{/* component content */}</div>;
}
```

## 📋 Code Review Checklist

### Before Submitting
- [ ] Code follows naming conventions
- [ ] Components have single responsibility
- [ ] Error handling is comprehensive
- [ ] Loading states are implemented
- [ ] TypeScript types are properly defined
- [ ] Logging is added where appropriate
- [ ] No console.log statements in production code
- [ ] Accessibility considerations are addressed
- [ ] Performance optimizations are applied where needed

### Review Points
- [ ] Logic is easy to understand
- [ ] Edge cases are handled
- [ ] Error messages are user-friendly
- [ ] API calls have proper error handling
- [ ] State management is appropriate
- [ ] Component composition is logical
- [ ] Code is testable
- [ ] Documentation is sufficient

Following these patterns and practices will ensure consistent, maintainable, and scalable code across the entire project.

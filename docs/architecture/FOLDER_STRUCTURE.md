# Project Folder Structure

This document explains the organization and purpose of each folder in the E-commerce Dashboard project.

## 🏗️ Root Structure

```
blancakan_frontend/
├── docs/                          # 📚 Documentation
├── public/                        # 🌐 Static assets
├── src/                          # 💻 Source code
├── .env.local                    # 🔧 Environment variables
├── next.config.ts                # ⚙️ Next.js configuration
├── package.json                  # 📦 Project dependencies
├── tailwind.config.ts            # 🎨 Tailwind CSS config
├── tsconfig.json                 # 📝 TypeScript configuration
└── README.md                     # 📖 Project overview
```

## 📚 Documentation Structure (`/docs`)

```
docs/
├── README.md                     # Documentation overview
├── guides/                       # Step-by-step guides
│   ├── DEVELOPMENT_FLOW.md      # Complete development workflow
│   ├── QUICK_START.md           # Getting started guide
│   └── BEST_PRACTICES.md        # Coding standards
├── architecture/                 # Technical documentation
│   ├── API_ARCHITECTURE.md     # API layer design
│   ├── AUTH_SYSTEM.md          # Authentication system
│   └── FOLDER_STRUCTURE.md     # This file
└── examples/                    # Code examples and templates
    ├── COMPONENT_EXAMPLES.md   # Component patterns
    └── API_EXAMPLES.md         # API integration examples
```

## 💻 Source Code Structure (`/src`)

### Overview
```
src/
├── app/                         # 🚀 Next.js App Router
├── components/                  # 🧩 Reusable UI components
├── hooks/                       # 🎣 Custom React hooks
├── lib/                         # 🔧 Core utilities and services
├── providers/                   # 🌐 React context providers
├── store/                       # 🗄️ Global state management
└── styles/                      # 🎨 Global styles
```

### App Directory (`/src/app`)
Next.js 13+ App Router structure with file-based routing.

```
app/
├── globals.css                  # Global styles
├── layout.tsx                   # Root layout component
├── page.tsx                     # Home page (auth guard)
├── favicon.ico                  # App icon
├── (auth)/                      # Route group for auth pages
│   ├── login/
│   │   └── page.tsx            # Login page
│   └── register/
│       └── page.tsx            # Registration page
└── dashboard/                   # Protected dashboard routes
    ├── layout.tsx              # Dashboard layout
    ├── page.tsx                # Dashboard home
    ├── products/               # Products management
    │   ├── page.tsx           # Products list
    │   ├── create/
    │   │   └── page.tsx       # Create product
    │   └── [id]/
    │       ├── page.tsx       # Product details
    │       └── edit/
    │           └── page.tsx   # Edit product
    ├── orders/                 # Orders management
    │   ├── page.tsx
    │   └── [id]/
    │       └── page.tsx
    └── customers/              # Customers management
        ├── page.tsx
        └── [id]/
            └── page.tsx
```

#### Routing Conventions
- **Route Groups**: `(auth)` - Groups routes without affecting URL structure
- **Dynamic Routes**: `[id]` - Captures URL parameters
- **Nested Layouts**: Each level can have its own `layout.tsx`
- **Page Files**: `page.tsx` defines the UI for a route

### Components Directory (`/src/components`)
Reusable UI components organized by feature or type.

```
components/
├── ui/                          # Basic UI building blocks
│   ├── button.tsx              # Button component
│   ├── input.tsx               # Input component
│   ├── modal.tsx               # Modal component
│   ├── loading-spinner.tsx     # Loading indicator
│   └── error-display.tsx       # Error message component
├── auth/                        # Authentication components
│   ├── login-form.tsx          # Login form
│   ├── register-form.tsx       # Registration form
│   └── auth-guard.tsx          # Route protection
├── dashboard/                   # Dashboard-specific components
│   ├── sidebar.tsx             # Navigation sidebar
│   ├── header.tsx              # Dashboard header
│   └── stats-card.tsx          # Statistics display
├── products/                    # Product management components
│   ├── product-list.tsx        # Products table/grid
│   ├── product-form.tsx        # Create/edit form
│   ├── product-card.tsx        # Product display card
│   └── product-filters.tsx     # Search/filter controls
├── orders/                      # Order management components
│   ├── order-list.tsx
│   ├── order-details.tsx
│   └── order-status.tsx
├── customers/                   # Customer management components
│   ├── customer-list.tsx
│   ├── customer-form.tsx
│   └── customer-profile.tsx
└── layout/                      # Layout components
    ├── navbar.tsx              # Main navigation
    ├── footer.tsx              # Page footer
    └── breadcrumbs.tsx         # Navigation breadcrumbs
```

#### Component Organization Principles
- **Feature-based**: Group by business domain (products, orders, etc.)
- **Reusability**: Common UI elements in `/ui`
- **Single Responsibility**: Each component has one clear purpose
- **Composition**: Build complex UIs from simple components

### Hooks Directory (`/src/hooks`)
Custom React hooks for business logic and API integration.

```
hooks/
├── index.ts                     # Hook exports
├── auth-hooks.ts               # Authentication hooks
│   ├── useLogin()              # Login functionality
│   ├── useRegister()           # Registration functionality
│   ├── useLogout()             # Logout functionality
│   └── useProfile()            # User profile management
├── api-hooks.ts                # Generic API hooks
│   ├── useApi()                # Generic API calls
│   ├── usePagination()         # Pagination logic
│   └── useInfiniteScroll()     # Infinite scrolling
├── products-hooks.ts           # Product management hooks
│   ├── useProducts()           # Fetch products list
│   ├── useProduct()            # Single product operations
│   ├── useCreateProduct()      # Product creation
│   ├── useUpdateProduct()      # Product updates
│   └── useDeleteProduct()      # Product deletion
├── orders-hooks.ts             # Order management hooks
├── customers-hooks.ts          # Customer management hooks
└── ui-hooks.ts                 # UI-related hooks
    ├── useModal()              # Modal state management
    ├── useLocalStorage()       # Local storage operations
    └── useDebounce()           # Input debouncing
```

#### Hook Patterns
- **Consistent Naming**: `use[Feature][Action]()`
- **Return Interface**: Always return object with consistent structure
- **Error Handling**: Include loading states and error management
- **Logging**: Add appropriate logging for debugging

### Library Directory (`/src/lib`)
Core utilities, services, and business logic.

```
lib/
├── api/                         # API layer
│   ├── config.ts               # API configuration
│   ├── types.ts                # TypeScript interfaces
│   ├── base-service.ts         # Base API service class
│   ├── http-client.ts          # HTTP client (CSR)
│   ├── server-client.ts        # HTTP client (SSR)
│   ├── interceptors/           # Request/response interceptors
│   │   └── auth-interceptor.ts # Authentication interceptor
│   └── services/               # API services
│       ├── index.ts           # Services export
│       ├── auth-service.ts    # Authentication API
│       ├── products-service.ts # Products API
│       ├── orders-service.ts   # Orders API
│       └── customers-service.ts # Customers API
├── auth/                        # Authentication utilities
│   ├── token-manager.ts        # JWT token management
│   ├── client-auth-guard.ts    # Client-side protection
│   ├── server-auth-guard.ts    # Server-side protection
│   └── middleware.ts           # Route protection middleware
├── utils/                       # General utilities
│   ├── logger.ts               # Logging utility
│   ├── date.ts                 # Date formatting
│   ├── validation.ts           # Input validation
│   ├── formatting.ts           # Data formatting
│   └── constants.ts            # Application constants
└── interfaces/                  # TypeScript interfaces
    ├── auth.interfaces.ts      # Authentication interfaces
    ├── api.interfaces.ts       # API interfaces
    └── common.interfaces.ts    # Common interfaces
```

#### Library Organization
- **API Layer**: Centralized API communication
- **Authentication**: Complete auth system
- **Utilities**: Reusable helper functions
- **Interfaces**: TypeScript type definitions

### Providers Directory (`/src/providers`)
React context providers for global state management.

```
providers/
├── auth-provider.tsx           # Authentication context
├── theme-provider.tsx          # Theme/styling context
├── notification-provider.tsx   # Global notifications
└── index.ts                    # Provider exports
```

### Store Directory (`/src/store`)
Global state management using Zustand.

```
store/
├── index.ts                    # Store exports
├── auth-store.ts              # Authentication state
├── ui-store.ts                # UI state (modals, etc.)
├── products-store.ts          # Products state (if needed)
└── notifications-store.ts     # Notifications state
```

#### State Management Strategy
- **Local State**: Component-specific state with `useState`
- **Global State**: Shared state with Zustand
- **Server State**: API data with React Query (if implemented)
- **URL State**: Route parameters and search params

### Styles Directory (`/src/styles`)
Global styling and CSS utilities.

```
styles/
├── globals.css                 # Global styles and Tailwind imports
├── components.css              # Component-specific styles
└── utilities.css               # Custom utility classes
```

## 🌐 Public Directory (`/public`)
Static assets served directly by Next.js.

```
public/
├── images/                     # Image assets
│   ├── logo.png               # App logo
│   ├── placeholder.jpg        # Placeholder images
│   └── icons/                 # Icon files
├── favicon.ico                # Browser favicon
├── robots.txt                 # SEO crawler instructions
└── manifest.json              # PWA manifest (if applicable)
```

## 📋 Configuration Files

### TypeScript Configuration (`tsconfig.json`)
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]                    // Path alias for cleaner imports
    },
    "strict": true,                         // Strict TypeScript checking
    "noUnusedLocals": true,                // Prevent unused variables
    "noUnusedParameters": true             // Prevent unused parameters
  }
}
```

### Next.js Configuration (`next.config.ts`)
```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,                          // Enable App Router
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,    // Expose env variables
  },
  images: {
    domains: ['example.com'],              // Allowed image domains
  },
}

export default nextConfig
```

### Tailwind Configuration (`tailwind.config.ts`)
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',      // Content sources
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#3B82F6',              // Custom brand colors
          secondary: '#10B981',
        },
      },
    },
  },
  plugins: [],
}

export default config
```

## 🔧 Import Path Aliases

### Configured Aliases
```typescript
// Instead of relative imports
import { Button } from "../../../components/ui/button";
import { useAuth } from "../../../../hooks/auth-hooks";

// Use clean absolute imports
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/auth-hooks";
```

### Import Organization
```typescript
// 1. React imports
import { useState, useEffect } from "react";

// 2. Third-party library imports
import { format } from "date-fns";
import { toast } from "react-hot-toast";

// 3. Internal imports (grouped by type)
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/products-hooks";
import { ProductService } from "@/lib/api/services/products-service";
import { Product } from "@/lib/api/types";
```

## 📱 Responsive Design Structure

### Breakpoint Strategy
```typescript
// Tailwind breakpoints used throughout
sm: '640px',     // Small devices
md: '768px',     // Medium devices  
lg: '1024px',    // Large devices
xl: '1280px',    // Extra large devices
2xl: '1536px',   // 2X Extra large devices
```

### Component Responsiveness
```typescript
// Mobile-first approach
<div className="
  p-4              // Mobile: 16px padding
  md:p-6           // Medium+: 24px padding
  lg:p-8           // Large+: 32px padding
  grid             // Grid layout
  grid-cols-1      // Mobile: 1 column
  md:grid-cols-2   // Medium+: 2 columns
  lg:grid-cols-3   // Large+: 3 columns
">
```

## 🔍 File Naming Conventions

### React Components
```bash
# PascalCase for component files
UserProfile.tsx
ProductCard.tsx
NavigationMenu.tsx

# kebab-case for non-component files
auth-service.ts
date-utils.ts
api-types.ts
```

### Folders
```bash
# kebab-case for all folders
user-management/
product-catalog/
order-processing/
```

### Constants and Enums
```typescript
// UPPER_SNAKE_CASE for constants
const API_BASE_URL = "https://api.example.com";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// PascalCase for enums
enum OrderStatus {
  Pending = "pending",
  Processing = "processing",
  Shipped = "shipped",
  Delivered = "delivered",
}
```

This folder structure provides a scalable, maintainable foundation that separates concerns clearly and makes the codebase easy to navigate and understand.

# Quick Start Guide

Get up and running with the E-commerce Dashboard project in minutes.

## 🚀 Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

## 📋 Installation

### 1. Clone and Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd blancakan_frontend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
```

### 2. Environment Configuration
```bash
# Edit .env.local
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:3000
NEXT_PUBLIC_API_TIMEOUT=10000
NODE_ENV=development
```

### 3. Start Development Server
```bash
# Start the development server
npm run dev

# Open browser
open http://localhost:3000
```

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── (auth)/            # Authentication pages
│   └── dashboard/         # Dashboard pages
├── components/            # Reusable UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Core utilities and services
│   ├── api/              # API layer
│   ├── auth/             # Authentication utilities
│   └── utils/            # General utilities
├── providers/            # React context providers
├── store/                # State management
└── styles/               # Global styles
```

## 🔐 Authentication Flow

### Login Process
1. User enters credentials on `/login`
2. API call to `/auth/sign_in`
3. Token stored in localStorage
4. Redirect to `/dashboard`

### Registration Process
1. User fills form on `/register`
2. API call to `/auth/register`
3. Auto-login after successful registration
4. Redirect to `/dashboard`

### Protected Routes
- Middleware protects dashboard routes
- Automatic redirect to login if not authenticated
- Reverse protection for auth pages

## 🛠️ Development Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server

# Code Quality
npm run lint            # Run ESLint
npm run type-check      # TypeScript checking

# Testing
npm run test            # Run tests (if configured)
```

## 📱 Available Pages

### Public Pages
- `/` - Home/Landing (redirects based on auth)
- `/login` - User login
- `/register` - User registration

### Protected Pages
- `/dashboard` - Main dashboard
- `/dashboard/products` - Products management
- `/dashboard/orders` - Orders management
- `/dashboard/customers` - Customers management

## 🔧 Key Features

### Authentication System
- JWT token management
- Automatic token refresh
- Session persistence
- Route protection

### API Integration
- Centralized HTTP client
- Type-safe API calls
- Error handling
- Request/response logging

### UI Components
- Tailwind CSS styling
- Responsive design
- Loading states
- Error boundaries

## 🚀 Making Your First Feature

### Example: Adding a new dashboard section

1. **Create the types**
```typescript
// src/lib/api/types.ts
export interface MyFeature {
  id: string;
  name: string;
  description: string;
}
```

2. **Create the service**
```typescript
// src/lib/api/services/my-feature-service.ts
export class MyFeatureService extends BaseApiService {
  async getFeatures(): Promise<MyFeature[]> {
    // Implementation
  }
}
```

3. **Create the hook**
```typescript
// src/hooks/my-feature-hooks.ts
export const useMyFeatures = () => {
  // Hook implementation
};
```

4. **Create the component**
```typescript
// src/components/my-feature/feature-list.tsx
export default function FeatureList() {
  const { features, isLoading } = useMyFeatures();
  // Component implementation
}
```

5. **Create the page**
```typescript
// src/app/dashboard/my-feature/page.tsx
import FeatureList from "@/components/my-feature/feature-list";

export default function MyFeaturePage() {
  return <FeatureList />;
}
```

## 📚 Next Steps

1. **Read the full guide**: [DEVELOPMENT_FLOW.md](./DEVELOPMENT_FLOW.md)
2. **Check examples**: [../examples/](../examples/)
3. **Understand architecture**: [../architecture/](../architecture/)

## 🐛 Troubleshooting

### Common Issues

**Port already in use**
```bash
# Kill process using port 3000
lsof -ti:3000 | xargs kill -9
```

**API connection issues**
- Check your backend server is running
- Verify API_BASE_URL in .env.local
- Check CORS configuration

**Authentication not working**
- Clear localStorage and cookies
- Check token format in network tab
- Verify API endpoints match backend

**Build failures**
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

## 💡 Pro Tips

1. **Use the logger** - Always use `createLogger()` for debugging
2. **Follow patterns** - Stick to the established patterns in the codebase
3. **Type everything** - Use TypeScript for better development experience
4. **Error handling** - Always handle loading and error states
5. **Responsive design** - Test on different screen sizes

## 📞 Need Help?

- Check the [DEVELOPMENT_FLOW.md](./DEVELOPMENT_FLOW.md) for detailed workflows
- Review existing components for patterns
- Look at the API architecture documentation
- Use the browser dev tools for debugging

Happy coding! 🎉

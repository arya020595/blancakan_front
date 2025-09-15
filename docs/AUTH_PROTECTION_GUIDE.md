# Authentication Protection Utilities

This document explains how to use the authentication protection utilities to secure your components and layouts.

## Overview

We've extracted authentication logic into reusable utilities to keep components clean and maintainable:

- **`useAuthProtection`** - Hook for authentication logic
- **`ProtectedLayout`** - Component wrapper for protected routes
- **`withAuthProtection`** - HOC for protecting components

## 1. useAuthProtection Hook

### Basic Usage

```tsx
import { useAuthProtection } from "@/hooks/use-auth-protection";

function MyComponent() {
  const {
    shouldShowLoading,
    shouldShowContent,
    loadingMessage,
    isAuthenticated,
  } = useAuthProtection();

  if (shouldShowLoading) {
    return <div>Loading: {loadingMessage}</div>;
  }

  if (!shouldShowContent) {
    return <div>Redirecting: {loadingMessage}</div>;
  }

  return <div>Protected content!</div>;
}
```

### With Options

```tsx
const auth = useAuthProtection({
  redirectTo: "/custom-login",
  enableLogging: false,
  loadingMessages: {
    hydrating: "Initializing...",
    checking: "Verifying credentials...",
    redirecting: "Taking you to login...",
  },
});
```

### Return Values

| Property            | Type      | Description                        |
| ------------------- | --------- | ---------------------------------- |
| `isAuthenticated`   | `boolean` | Whether user is authenticated      |
| `isLoading`         | `boolean` | Whether auth check is in progress  |
| `hasHydrated`       | `boolean` | Whether store has been hydrated    |
| `hasInitialized`    | `boolean` | Whether initialization is complete |
| `isRedirecting`     | `boolean` | Whether currently redirecting      |
| `user`              | `any`     | Current user data                  |
| `loadingMessage`    | `string`  | Current loading message            |
| `shouldShowLoading` | `boolean` | Whether to show loading UI         |
| `shouldShowContent` | `boolean` | Whether to show protected content  |

## 2. ProtectedLayout Component

### Basic Usage

```tsx
import { ProtectedLayout } from "@/components/protected-layout";

function MyLayout({ children }) {
  return (
    <ProtectedLayout>
      <div className="my-layout">{children}</div>
    </ProtectedLayout>
  );
}
```

### With Custom Options

```tsx
<ProtectedLayout
  redirectTo="/custom-login"
  enableLogging={false}
  loadingComponent={CustomLoadingSpinner}
  redirectingComponent={CustomRedirectScreen}>
  <MyContent />
</ProtectedLayout>
```

### Custom Components

```tsx
function CustomLoadingSpinner({ message }) {
  return (
    <div className="custom-loading">
      <Spinner />
      <p>{message}</p>
    </div>
  );
}

function CustomRedirectScreen({ message }) {
  return (
    <div className="custom-redirect">
      <p>{message}</p>
    </div>
  );
}
```

## 3. withAuthProtection HOC

### Basic Usage

```tsx
import { withAuthProtection } from "@/hooks/use-auth-protection";

function MyComponent({ title }) {
  return <h1>{title}</h1>;
}

const ProtectedComponent = withAuthProtection(MyComponent);

// Usage
<ProtectedComponent title="Protected Page" />;
```

### With Options

```tsx
const ProtectedComponent = withAuthProtection(MyComponent, {
  redirectTo: "/custom-login",
  enableLogging: false,
});
```

## 4. Migration Examples

### Before (Complex Layout)

```tsx
function DashboardLayout({ children }) {
  const { isAuthenticated, checkAuth, isLoading, hasHydrated } = useAuthStore();
  const router = useRouter();
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (hasHydrated) {
      checkAuth();
      setHasInitialized(true);
    }
  }, [hasHydrated, checkAuth]);

  useEffect(() => {
    if (hasInitialized && !isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, hasInitialized, router]);

  if (!hasHydrated || !hasInitialized || isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <RedirectingScreen />;
  }

  return <div className="dashboard">{children}</div>;
}
```

### After (Clean Layout)

```tsx
function DashboardLayout({ children }) {
  return (
    <ProtectedLayout>
      <div className="dashboard">{children}</div>
    </ProtectedLayout>
  );
}
```

## 5. Pattern Examples

### Pattern 1: Simple Protected Page

```tsx
function SettingsPage() {
  const { shouldShowLoading, shouldShowContent, loadingMessage } =
    useAuthProtection();

  if (shouldShowLoading) return <div>{loadingMessage}</div>;
  if (!shouldShowContent) return null; // Will redirect

  return <SettingsForm />;
}
```

### Pattern 2: Protected Layout with Profile

```tsx
function DashboardLayout({ children }) {
  return (
    <ProtectedLayout>
      <DashboardContent>{children}</DashboardContent>
    </ProtectedLayout>
  );
}

function DashboardContent({ children }) {
  const { setUser } = useAuthStore();
  const { profile, fetchProfile } = useProfile();

  useEffect(() => {
    fetchProfile(); // Safe to call - user is authenticated
  }, [fetchProfile]);

  useEffect(() => {
    if (profile) setUser(profile);
  }, [profile, setUser]);

  return (
    <div className="dashboard">
      <Header profile={profile} />
      <main>{children}</main>
    </div>
  );
}
```

### Pattern 3: Conditional Auth (Optional Protection)

```tsx
function HomePage() {
  const { isAuthenticated, hasHydrated } = useAuthStore();

  if (!hasHydrated) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header />
      {isAuthenticated ? <Dashboard /> : <LandingPage />}
    </div>
  );
}
```

## 6. Best Practices

### ✅ Do:

- Use `ProtectedLayout` for simple protection needs
- Use `useAuthProtection` hook for custom logic
- Keep business logic separate from auth logic
- Always check `hasHydrated` before auth decisions
- Use the HOC for component-level protection

### ❌ Don't:

- Mix auth logic with business logic
- Skip hydration checks
- Create multiple auth checks in one component
- Ignore loading states

## 7. Loading States

The utilities provide three distinct loading states:

1. **Hydrating**: Store is loading from localStorage
2. **Checking**: Verifying authentication token
3. **Redirecting**: Sending user to login page

Each state has appropriate messaging and can be customized.

## 8. Error Handling

The utilities handle common auth errors:

- Invalid tokens (automatic logout)
- Expired tokens (automatic refresh if available)
- Network errors (graceful degradation)
- Hydration mismatches (proper sequencing)

## Summary

These utilities provide:

- **Clean separation** of auth and business logic
- **Consistent UX** across all protected routes
- **Proper hydration** handling for SSR
- **Flexible customization** options
- **Type safety** throughout

Use `ProtectedLayout` for most cases, `useAuthProtection` for custom needs, and `withAuthProtection` for component-level protection.

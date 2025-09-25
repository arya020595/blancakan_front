# Hydration in Authentication System

## What is Hydration?

**Hydration** is the process where client-side React takes over a server-rendered HTML page and makes it interactive. In the context of Zustand persistence, hydration refers to the process of restoring the store state from localStorage/sessionStorage when the application loads.

## Why Hydration Matters in Authentication

### The Problem Without Proper Hydration Handling

```javascript
// ❌ Without hydration check
function Dashboard() {
  const { isAuthenticated } = useAuthStore();

  // This could be false during SSR but true after hydration
  if (!isAuthenticated) {
    return <LoginPage />; // Wrong decision!
  }

  return <DashboardContent />;
}
```

### Issues This Causes:

1. **SSR/Client Mismatch**: Server renders with default state, client hydrates with persisted state
2. **Flash of Wrong Content**: Users see login page briefly before dashboard appears
3. **Inconsistent Redirects**: Authentication decisions made before store is fully loaded
4. **Race Conditions**: Components make auth decisions with incomplete data

## How Our Authentication System Uses Hydration

### 1. Store Configuration

```typescript
// In auth-store.ts
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasHydrated: boolean; // 👈 Tracks hydration status
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state - always start with false
      user: null,
      isAuthenticated: false,
      isLoading: false,
      hasHydrated: false, // 👈 Starts as false

      // ... actions
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        // 👈 Don't persist isAuthenticated - always check token
      }),
      onRehydrateStorage: () => (_persistedState) => {
        // 👇 Defer to the next tick and use the real store API
        // to avoid synchronous mutations during rehydrate
        setTimeout(() => {
          useAuthStore.setState({ hasHydrated: true }); // 👈 Mark as hydrated
          const s = useAuthStore.getState();
          s.checkAuth?.(); // 👈 Force fresh auth check
        }, 0);
      },
    }
  )
);
```

### 2. Component Usage

```typescript
// In dashboard/layout.tsx
function DashboardLayout() {
  const { isAuthenticated, hasHydrated, checkAuth } = useAuthStore();

  useEffect(() => {
    // 👈 Only check auth AFTER hydration (optional)
    // Note: the store already triggers checkAuth() on rehydrate.
    // Keeping this is harmless as checkAuth is idempotent and cheap.
    if (hasHydrated) {
      checkAuth();
    }
  }, [hasHydrated, checkAuth]);

  // 👈 Show loading until hydrated
  if (!hasHydrated) {
    return <LoadingSpinner message="Loading..." />;
  }

  // Now safe to make auth decisions
  if (!isAuthenticated) {
    return <RedirectToLogin />;
  }

  return <DashboardContent />;
}
```

## Hydration Flow Timeline

```
1. Server Side Rendering (SSR)
   ├── hasHydrated: false
   ├── isAuthenticated: false (default)
   └── user: null

2. HTML Sent to Browser
   ├── Static HTML with loading state
   └── No auth decisions made yet

3. JavaScript Loads
   ├── Zustand persist middleware activates
   └── onRehydrateStorage callback fires

4. Hydration Complete
   ├── hasHydrated: true ✅
   ├── user: restored from localStorage
   ├── checkAuth() called automatically
   └── isAuthenticated: determined from fresh token check

5. UI Updates
   ├── Components re-render with correct state
   └── Proper redirects/content shown
```

## Benefits of Our Hydration Strategy

### ✅ Prevents Flash of Wrong Content

```typescript
// Before hydration: Shows loading spinner
// After hydration: Shows correct content based on actual auth state
if (!hasHydrated) {
  return <LoadingSpinner />; // Consistent experience
}
```

### ✅ Ensures Fresh Authentication Checks

```typescript
onRehydrateStorage: () => (_persistedState) => {
  // Defer and use the real store API to avoid rehydrate races
  setTimeout(() => {
    useAuthStore.setState({ hasHydrated: true });
    const s = useAuthStore.getState();
    s.checkAuth?.(); // 👈 Always verify token on startup
  }, 0);
};
```

### ℹ️ Why defer with setTimeout?

- Avoids mutating state synchronously during the persist middleware's rehydrate phase, which can cause subtle hydration mismatches.
- Guarantees `useAuthStore` is fully created before we call `setState/getState`.
- Keeps SSR markup stable; client-side changes happen after hydration is complete.

### ✅ Prevents Race Conditions

```typescript
// Only make auth decisions after hydration
useEffect(() => {
  if (hasHydrated && !isLoading && !isAuthenticated) {
    router.push("/login");
  }
}, [hasHydrated, isLoading, isAuthenticated]);
```

### ✅ Separates Concerns

- **hasHydrated**: "Is the store ready?"
- **isAuthenticated**: "Is the user logged in?"
- **isLoading**: "Are we checking auth right now?"

## Common Patterns

### Pattern 1: Protected Route Component

```typescript
function ProtectedRoute({ children }) {
  const { hasHydrated, isAuthenticated, isLoading } = useAuthStore();

  // Step 1: Wait for hydration
  if (!hasHydrated) {
    return <div>Loading application...</div>;
  }

  // Step 2: Wait for auth check
  if (isLoading) {
    return <div>Checking authentication...</div>;
  }

  // Step 3: Make auth decision
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Step 4: Render protected content
  return children;
}
```

### Pattern 2: Conditional Rendering

```typescript
function Header() {
  const { hasHydrated, isAuthenticated } = useAuthStore();

  // Don't show auth-specific UI until hydrated
  if (!hasHydrated) {
    return <HeaderSkeleton />;
  }

  return <header>{isAuthenticated ? <UserMenu /> : <LoginButton />}</header>;
}
```

### Pattern 3: Auth Guard with Hydration

```typescript
function AuthGuard() {
  const { hasHydrated, isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Only redirect after hydration and auth check
    if (hasHydrated && !isLoading) {
      if (isAuthenticated) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    }
  }, [hasHydrated, isLoading, isAuthenticated]);

  return <div>Determining destination...</div>;
}
```

## Best Practices

### ✅ Do:

- Always check `hasHydrated` before making auth decisions
- Use loading states during hydration
- Force fresh auth checks after hydration
- Don't persist critical auth state like `isAuthenticated`

### ❌ Don't:

- Make redirects before hydration completes
- Trust persisted auth state without verification
- Show authenticated content before hydration
- Ignore hydration in protected components

## Debugging Hydration Issues

### Add Debug Logging

```typescript
useEffect(() => {
  console.log("Hydration Debug:", {
    hasHydrated,
    isAuthenticated,
    isLoading,
    timestamp: new Date().toISOString(),
  });
}, [hasHydrated, isAuthenticated, isLoading]);
```

### Common Issues and Solutions

| Issue               | Symptom                                | Solution                                  |
| ------------------- | -------------------------------------- | ----------------------------------------- |
| Flash of login page | User sees login briefly then dashboard | Check `hasHydrated` before redirects      |
| Persistent logout   | User stays logged out after refresh    | Ensure `checkAuth()` runs after hydration |
| Double redirects    | Page redirects twice                   | Don't redirect until `hasHydrated: true`  |
| Wrong initial state | Component renders with wrong data      | Use loading state until hydrated          |

## Summary

Hydration in our auth system ensures that:

1. **Server and client rendering are consistent**
2. **Authentication state is fresh and verified**
3. **Users get smooth, predictable experiences**
4. **No flash of wrong content occurs**
5. **All auth decisions are made with complete data**

The `hasHydrated` flag is your safety net - it tells you when it's safe to trust the store state and make authentication decisions.

## Official shadcn/ui Button Component

We're now using the official shadcn/ui Button component. This provides better consistency with the shadcn/ui design system.

### Installation

The button component was installed using:

```bash
pnpm dlx shadcn@latest add button
```

### Basic Usage

```tsx
import { Button } from "@/components/ui/button";

// Default button (primary)
<Button onClick={handleClick}>Save</Button>

// Outline button
<Button variant="outline" onClick={handleCancel}>Cancel</Button>

// Destructive button
<Button variant="destructive" onClick={handleDelete}>Delete</Button>

// Secondary button
<Button variant="secondary">Secondary</Button>

// Ghost button
<Button variant="ghost">Ghost</Button>

// Link style button
<Button variant="link">Link</Button>
```

### Adding More shadcn/ui Components

To add more components:

```bash
# Add input component
pnpm dlx shadcn@latest add input

# Add card component
pnpm dlx shadcn@latest add card

# Add dialog component
pnpm dlx shadcn@latest add dialog

# List all available components
pnpm dlx shadcn@latest add
```

### Sizes

```tsx
// Small button
<Button size="sm">Small</Button>

// Default size
<Button>Default</Button>

// Large button
<Button size="lg">Large</Button>

// Icon button
<Button size="icon">
  <IconComponent />
</Button>
```

### With Loading State

```tsx
<Button disabled={isLoading}>
  {isLoading ? (
    <span className="inline-flex items-center gap-2">
      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      Saving...
    </span>
  ) : (
    "Save"
  )}
</Button>
```

### Custom Styling

```tsx
<Button className="w-full">Full Width</Button>
<Button className="min-w-32">Custom Width</Button>
```

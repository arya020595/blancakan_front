# Global Modal + Field-only Form Pattern

A standard way to build all modals and forms so UI is consistent, logic is separated, and contributions are predictable.

- UI-only Modal (global, single look/feel)
- Shared FormShell (react-hook-form wrapper: submit/cancel/error/busy)
- Feature forms are fields-only (no API calls or modal markup)
- Pages/hooks own data fetching, optimistic updates, and handlers

This guide explains the contracts, folder layout, and steps to add a new feature form using this pattern.

## Libraries

- react-hook-form (required)
- @radix-ui/react-dialog (Modal base, shadcn-compatible)
- zod (optional for client validation; backend validation remains source of truth)

## Folder layout (relevant parts)

- `src/components/ui/modal.tsx` — global Modal (Radix Dialog)
- `src/components/forms/form-shell.tsx` — shared RHF shell (no fields)
- `src/components/<feature>/forms/<feature>-form.tsx` — fields-only
- `src/components/<feature>/forms/<feature>-delete-content.tsx` — confirm body (no buttons)
- `src/app/<area>/<page>/page.tsx` — wires hooks + Modal + FormShell + fields

## Contracts (keep these stable)

Modal (UI-only)

- Props: `isOpen: boolean; onClose: () => void; title?: ReactNode; children: ReactNode; footer?: ReactNode; size?: 'sm'|'md'|'lg'`
- Responsibilities: a11y, overlay, animations, close on ESC/overlay via Radix Dialog
- No forms, no API calls inside

FormShell (shared behavior)

- Props: `defaultValues?: DefaultValues<T>; onSubmit: SubmitHandler<T>; isSubmitting?: boolean; submitLabel?: string; cancelLabel?: string; onCancel?: () => void; error?: string | null;`
- Responsibilities: create RHF context, render error, footer buttons, disabled/busy state
- No fields or business logic inside

Feature Form (fields-only)

- Example: `RoleForm` uses `useFormContext<RoleFormValues>()`
- Props: minimal (e.g., `mode`, `isSubmitting`)
- Responsibilities: render inputs + display local required errors
- No modal markup, no API calls, no buttons

Page/Hooks (data + handlers)

- Own API calls and optimistic updates (see `useRoles`, `useCreateRole`, etc.)
- Pass handlers and `isSubmitting` states into FormShell
- Control when Modal opens/closes

## Implementation steps (new feature)

1. Create field-only form

- Path: `src/components/<feature>/forms/<feature>-form.tsx`
- Use `useFormContext<YourValues>()`
- Render only inputs and small validation hints (required, etc.)

2. (Optional) Create delete confirmation body

- Path: `src/components/<feature>/forms/<feature>-delete-content.tsx`
- Render just the text body (no buttons, no API calls)

3. Wire up in the page

- Open/close modal with local state
- Wrap fields with `FormShell<YourValues>` and place inside `Modal`
- Provide `defaultValues`, `onSubmit`, `isSubmitting`, labels, and `onCancel`

4. Keep logic in hooks

- Use existing hooks (create/update/delete) for network and optimistic updates
- Forms never import services directly

## Example: Roles

Files (already implemented):

- `src/components/ui/modal.tsx`
- `src/components/forms/form-shell.tsx`
- `src/components/roles/forms/role-form.tsx`
- `src/components/roles/forms/delete-role-content.tsx`
- `src/app/dashboard/roles/page.tsx`

Page usage summary:

- Create: `Modal -> FormShell<RoleFormValues> -> RoleForm({ mode: 'create' })`
- Edit: `Modal -> FormShell<RoleFormValues> -> RoleForm({ mode: 'edit' })`
- Delete: `Modal -> DeleteRoleContent` + footer buttons in page

## zod (optional now)

When/if client validation is desired:

- Install `@hookform/resolvers`
- Provide resolver in `FormShell` (or a variant):
  - `useForm({ defaultValues, resolver: zodResolver(yourSchema) })`
- Keep server-side validation authoritative; client is for early feedback only

## Acceptance checklist (PRs must follow)

- Modal contains no business logic or fields
- FormShell contains no feature fields or API calls
- Feature form contains no modal markup, buttons, or API calls
- Page/hook own all data fetching/mutations and modal state
- Naming and paths follow the layout above

## Anti-patterns (do not do)

- Calling API services from inside feature form components
- Adding arbitrary CSS or new modal variants in feature code
- Placing submit/cancel buttons inside field-only forms
- Mixing modal markup inside page or field components

## Notes

- We’re using Radix Dialog in `Modal` so we can later drop in shadcn/ui Dialog components with no feature changes.
- If you need a new modal elsewhere, copy the Roles wiring pattern and keep forms field-only.

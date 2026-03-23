# UI Components

All UI elements in this app are built exclusively with **shadcn/ui**. No custom component primitives may be created; no other UI component libraries may be added.

## Rules

- Always use shadcn/ui components — `Button`, `Input`, `Card`, `Dialog`, `Form`, etc.
- Never build custom primitive components (buttons, inputs, modals, badges, etc.) from scratch.
- Do not install or use any other UI component library (e.g. Radix standalone, MUI, Chakra, Headless UI directly).
- shadcn/ui components live in `components/ui/`. Do not modify generated files unless necessary to fix a bug.

## Adding a New Component

Use the shadcn CLI to add components — do not copy/paste or hand-write them:

```bash
npx shadcn@latest add <component-name>
```

Example:

```bash
npx shadcn@latest add dialog
npx shadcn@latest add form
```

## Usage Example

```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function MyForm() {
  return (
    <form>
      <Input placeholder="Enter a URL" />
      <Button type="submit">Shorten</Button>
    </form>
  );
}
```

## Styling

- Use Tailwind utility classes for layout and spacing around shadcn/ui components.
- Do not override shadcn/ui component internals with arbitrary CSS unless there is no Tailwind alternative.

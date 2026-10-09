# Project Structure

React 19 + Vite 8 + TypeScript + Zustand + Tailwind CSS 4 + shadcn/ui.

```
tw-assessments/
├── docs/                      # brief, PRD, tech spec, this file
├── README.md
├── src/
│   ├── main.tsx               # starts the app
│   ├── App.tsx                # page layout
│   ├── types.ts               # Product, CartItem, ProductFetcher
│   ├── api/products.ts        # dummy products + image seeds (swap for a real API later)
│   ├── lib/
│   │   ├── format.ts          # formatPrice, formatItems
│   │   ├── image.ts           # imageUrl (Picsum, WebP, any size)
│   │   └── utils.ts           # shadcn's cn() helper
│   ├── stores/
│   │   ├── productsStore.ts   # list, status, search text, filtered selector
│   │   ├── cartStore.ts       # cart lines, totals, saved to localStorage
│   │   ├── uiStore.ts         # cart open/closed
│   │   ├── confirmStore.ts    # pending confirmation
│   │   └── __tests__/         # cart and products store tests
│   ├── hooks/
│   │   ├── useAddToCart.ts
│   │   ├── useRemoveWithConfirm.ts
│   │   ├── useCheckout.ts
│   │   ├── useDebouncedValue.ts
│   │   ├── useSyncCartWithProducts.ts
│   │   └── __tests__/         # one test file per hook
│   ├── components/
│   │   ├── AppHeader.tsx
│   │   ├── SearchBox.tsx
│   │   ├── CartButton.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductImage.tsx   # optimized <img> shared by the card and the cart row
│   │   ├── CartSidebar.tsx
│   │   ├── CartItemRow.tsx
│   │   ├── ConfirmDialog.tsx
│   │   ├── __tests__/         # one test file per component
│   │   └── ui/                # shadcn: button, input, badge, sheet, alert-dialog, sonner
│   ├── __tests__/App.test.tsx # whole-page tests
│   ├── test/setup.ts          # Testing Library setup for Vitest
│   └── styles/index.css       # Tailwind + shadcn theme variables
├── components.json            # shadcn config
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts             # React, Tailwind, `@` alias, Vitest (jsdom)
```

## Conventions
- Imports go one way: components → hooks → stores → api/lib.
- Use the `@/` alias for imports from `src`. Files in the same folder can use `./`.
- One component per file, named exports. Hooks start with `use`, stores end with `Store`.
- Presentational components (`ProductCard`, `CartItemRow`, `ProductImage`) take props and don't import stores.
- Every component and hook gets a test file in a `__tests__` folder next to it.
- Style with Tailwind classes. Add new shadcn parts with `npx shadcn@latest add <name>`.
- No barrel files and no catch-all `utils` folder.

## Commands
```bash
npm install
npm run dev      # start the app
npm run build    # type-check and build
npm test         # run all the tests (components, hooks, stores)
```

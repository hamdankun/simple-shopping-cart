# Tech Spec: Shopping Cart Storefront

This explains how we build what the PRD asks for.

## Stack

| Need | Choice | Why |
|------|--------|-----|
| UI | React 19 | Hooks, function components |
| Build | Vite 8 | Fast and nearly zero config |
| Language | TypeScript, strict | Catches data mistakes early |
| Design system | Tailwind CSS 4 + shadcn/ui | Ready-made accessible parts, styled with utilities, no custom CSS files |
| State | Zustand 5 | Tiny, no providers, components subscribe to just what they need |
| Toasts | Sonner (via shadcn) | Does stacking and auto-dismiss for us |
| Tests | Vitest + Testing Library (jsdom) | Test components the way a user uses them, plus store and hook logic |

Versions were the latest on npm on 2026-10-09. Dependencies are installed with `@latest`.

### shadcn parts in use
`Button`, `Input`, `Badge`, `Sheet` (the cart panel), `AlertDialog` (confirmations), `Sonner` (toasts). They live in `src/components/ui/` and we treat them as our own code: we use them as they are and don't wrap them again.

## How the screen is put together

```
App
├─ AppHeader ─ SearchBox, CartButton
├─ ProductGrid ─ ProductCard (many)
├─ CartSidebar (a Sheet) ─ CartItemRow (many)
├─ ConfirmDialog (one for the whole app)
└─ Toaster
```

Data flows one way: a click calls a hook or store action, the store updates, and components that read that data redraw. `ProductCard` and `CartItemRow` only take props and don't touch stores.

## Data

```ts
Product  { id, name, price, imageSeed }
CartItem { product, quantity }
ProductFetcher = () => Promise<Product[]>
```

`api/products.ts` holds 12 dummy products and returns them after a short delay to mimic a network call. Each product has an `imageSeed` (like `headphones`); Picsum returns the same picture for the same seed, so a product always keeps its picture.

## Stores (one small store for each job)

- **productsStore:** the product list, a loading/error status, and the search text. `load(fetcher)` takes the fetcher as an argument, so tests can pass a fake. `selectFilteredProducts` works out the visible list on the fly instead of storing it.
- **cartStore:** the cart lines, saved to `localStorage` under the key `cart` with Zustand's built-in `persist` middleware. `partialize` limits what is saved to just the items, and the store reloads them on startup, so there's no extra code or library. Actions are `add`, `setQuantity` (whole numbers, kept between 1 and 99, ignores invalid input), `remove`, `clear`, and `syncProducts` (swaps in the current product details from the catalog and drops products that no longer exist, so a cart saved last week can't hold an old price). `selectTotalQuantity` and `selectTotalPrice` are plain functions.
- **uiStore:** whether the cart panel is open.
- **confirmStore:** the pending confirmation. `ask({ title, message })` returns a promise that resolves to true or false, so any code can write `if (await ask(...))`.

## Hooks

| Hook | Job |
|------|-----|
| `useAddToCart` | Adds to the cart and shows the toast |
| `useRemoveWithConfirm` | Asks first, then removes |
| `useCheckout` | Confirm, then a short fake payment, then clear the cart, close the panel, and show a success toast. Ignores double clicks. |
| `useDebouncedValue` | Waits until the value stops changing |
| `useSyncCartWithProducts` | Once the products have loaded, refreshes the saved cart against them (calls `cartStore.syncProducts`). Used once, in `App`. |

## How each feature works

0. **Persistence:** see `cartStore` above. The product list is not saved because it comes from the API each time.

1. **Dialogs:** `ConfirmDialog` is a shadcn `AlertDialog` driven by `confirmStore`. Cancel, Esc, and an outside click all answer "no".
2. **Toast:** `useAddToCart` calls Sonner's `toast.success`.
3. **Total quantity:** the badge and the cart header both read `selectTotalQuantity`.
4. **Search:** `SearchBox` keeps the typed text locally and writes it to the store 200ms after the user stops typing. `ProductGrid` shows the filtered list.
5. **Quantity:**
   - The cart is a `Sheet`, which closes only on its own backdrop or close button, so redrawing rows can no longer close it.
   - Each row has `−`, a number input, `+`, and quick `+5` / `+10` buttons (the steps live in one `BULK_STEPS` list). While you type, the row keeps your raw text and only applies it on blur or Enter. Empty or invalid goes back to the old value, 0 asks to remove, anything else is saved.

## Images
Pictures come from Picsum: `https://picsum.photos/seed/<seed>/<width>/<height>.webp`. `lib/image.ts` builds that URL, and `ProductImage` is the one component that renders it, used by both the product card and the cart row (so the rules live in one place).

| Optimization | How |
|--------------|-----|
| Right size | The URL asks for the exact size. `srcSet` + `sizes` offer a 1x and a 2x file, so high-density screens get a sharp one and others don't download extra |
| Small files | WebP |
| No layout jump | `width` and `height` are set, and the card uses a 4:3 aspect ratio, so space is reserved before the picture arrives |
| Faster first view | The first row of products (4) loads eagerly with high priority; everything else is `loading="lazy"` and decodes off the main thread (`decoding="async"`) |
| Failure | If a picture fails to load (offline, blocked), it swaps to a plain grey block of the same size |
| Accessibility | `alt=""` because the name is right next to the picture, so screen readers don't read it twice |

Because the cart is saved in `localStorage` and the product shape changed, the saved cart is versioned: an older shape is dropped on load instead of showing broken lines.

## Styling
Tailwind utility classes on the elements, and shadcn's theme variables in `src/styles/index.css`. The grid is `repeat(auto-fill, minmax(220px, 1fr))`, the page has a max width, and the cart is full width on phones. Hover motion respects the reduced-motion setting. Toasts appear at the top of the screen so they never cover the Checkout button.

## Rules we follow in the code
- Function components and hooks only. No `any`.
- Values that can be worked out (like the filtered list) are computed, not stored.
- `useEffect` only for syncing with something outside React (loading data, the debounce timer).
- Stable `key`s, no `dangerouslySetInnerHTML`.
- Components subscribe to small selectors, so the cart badge changing doesn't redraw the grid.
- Import from `src` with the `@/` alias (files in the same folder can use `./`). One component per file with a named export.
- Don't add an abstraction until something needs it twice.

## Edge cases
- Product load fails: show a message and a Retry button.
- Empty cart: Checkout is disabled.
- Double-clicking Confirm: ignored while processing.
- Quantity above 99 is capped at 99; prices are whole US dollars.

## Testing
Vitest with Testing Library in a jsdom browser-like environment (set up in `vite.config.ts` and `src/test/setup.ts`). Run with `npm test`. Every component and hook has its own test file next to it in a `__tests__` folder, and `App` has a few whole-page tests.

- **Stores:** adding the same product twice makes one line; totals count units, not lines; `setQuantity` caps at 99, floors at 1 and ignores NaN; remove and clear; `syncProducts` updates prices and drops missing products; search is case-insensitive; a failing fetcher puts the store in the error state.
- **Hooks:** `useDebouncedValue` waits and restarts on new input; `useAddToCart` adds and toasts; `useRemoveWithConfirm` removes only after a yes; `useCheckout` asks first, shows the right count and total, clears the cart and closes the panel only after the fake payment, and ignores a second click while processing.
- **Components:** each one is rendered and used like a person would use it (clicking, typing, pressing Esc). For example the cart row's typed quantity, 0, empty and `+5`/`+10` cases; the search box's debounce and clear button; the product grid's loading, error, empty and retry states; the cart panel's totals, remove and checkout confirmations, and staying open while quantities change; the confirm dialog's confirm, cancel and Esc.
- **App:** adding products updates the cart count with every unit, search filters and shows the empty state, and a saved cart is refreshed with current prices.

To check that the tests can really fail, we broke the code on purpose (counting lines instead of units, raising the 99 cap, ignoring Cancel at checkout, making search case-sensitive) and each change made tests fail.

We also checked the real page in a browser: adding, reloading to confirm the cart comes back, toasts, badge, search, typing a quantity, the remove and checkout dialogs, that the cart stays open while quantities change, and the layout at 320px and 375px wide.

## Risks
If `localStorage` is blocked (private mode, for example), Zustand skips saving and the cart just works for that visit only.
The brief's wording for feature 5 is ambiguous, so we handled both readings. TypeScript 7 doesn't allow `baseUrl`, so the `@/` alias uses a relative path in `tsconfig.json`.

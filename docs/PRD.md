# PRD: Shopping Cart Storefront

## What this is
The starting point is the original `index.html` from the assessment, a one-file product page with a slide-out cart. It works, but the layout breaks on small screens, the code is hard to maintain, and a few things are missing. We're rebuilding it in React, adding five features, and fixing the problems that the original file's own comments point out. The full task is in `docs/project-brief.md`.

We only have about 30 minutes, so the scope stays small on purpose.

## Goals
- Rebuild the page in React with hooks and a small state library.
- Build the five features from the brief, plus a cart that survives a refresh and optimized product images.
- Fix the layout and logic problems in the original.
- Keep the code clean: easy to read, no extra layers.

## Not doing
A real backend or payment, login, routing, syncing the cart across devices, multiple languages (the UI is English only), and real product photography. The product data is dummy data, and the pictures are placeholder images from [Picsum](https://picsum.photos/).

## Features

| # | Feature | What "done" looks like |
|---|---------|------------------------|
| 1 | Confirm dialogs | Clicking Checkout asks "are you sure?" and shows the item count and total. Removing an item asks the same, naming the product. Cancel, Esc, or clicking outside closes the dialog and changes nothing. No more browser `alert()`. Checkout is disabled when the cart is empty. |
| 2 | Add-to-cart notification | Every add shows a short toast ("Added to cart: …") that goes away by itself. Toasts stack if you add quickly. |
| 3 | Total quantity | The cart badge in the header and the cart panel both show the total number of items, counting every unit (2 headphones + 1 watch = 3). |
| 4 | Search box | Type to filter products by name, ignoring case. The filter waits a moment after typing stops. If nothing matches, show "No products found". A clear button resets it. |
| 5 | Quantity updates | See below. |
| 6 | Cart survives a refresh | The cart is saved in the browser's `localStorage`, so reloading the page or coming back later shows the same items. Only the cart is saved. Products, search text, and open dialogs are not. When the products load, the saved cart is refreshed against them, so names and prices are current and products that no longer exist are dropped. |
| 7 | Product images | Each product shows a picture, on its card and in the cart. Pictures are optimized: the right size for the screen (with a sharper version for high-density displays), WebP format, lazy loading below the fold, reserved space so the page doesn't jump while they load, and a plain placeholder if one fails to load. |

### About feature 5
The brief says "quantity couldn't update by multiples", which isn't very specific. We found a real bug and also filled a gap:

1. **The bug.** In the original, pressing `+` or `−` redraws the cart, and the "click outside to close" handler then thinks you clicked outside, so the cart closes after every click. You can't change a quantity more than once. Now the cart only closes when you click the dark backdrop or the close button.
2. **The gap.** Quantity could only move by 1. Each cart row now has a number field, so you can type any amount from 1 to 99, plus `+5` and `+10` buttons for bigger jumps. Typing 0 asks to remove the item, and typing something invalid puts the old number back.

The brief doesn't say which kind of "multiples" it means, so the cart row covers both: type any amount, or jump by 5 or 10.

## Problems fixed from the original

| Problem | Fix |
|---------|-----|
| Fixed 1200px width | Fluid width with a max |
| Float-based header breaks on phones | Flex layout that wraps |
| 4-column grid breaks on phones | Grid that fits as many columns as there's room for |
| Cart panel always 400px | Full width on phones, capped on larger screens |
| Messy nested CSS | Tailwind utilities and shadcn components |
| Global variables, no modules | ES modules, typed stores |
| No error handling when loading | Error message with a Retry button |
| Two copies of the product-rendering code | One grid component |
| Building HTML from strings | JSX, which escapes text for us |
| No feedback on add or checkout | Toasts and a "processing" state |
| Search fired on every keystroke | Debounced |

## Quality bar
- Works from 320px phones up to desktop.
- Keyboard and screen-reader friendly: dialogs trap focus and close with Esc, icon buttons have labels, toasts are announced.
- No console errors.
- Every component, hook, and store has unit tests, and the main flows (add to cart, search, checkout, saved cart) are tested end to end in the app.

## How we keep the code clean
- **Single responsibility:** components draw things, hooks run flows (checkout, add to cart), stores hold data, `api/` fetches.
- **Open/closed:** the confirm dialog takes its text from the caller, so a new confirmation needs no change to the dialog.
- **Liskov:** anything shaped like a `Product` works in a product card, and any function that returns `Promise<Product[]>` can replace the dummy API.
- **Interface segregation:** components get only the props they use. Store reads use small selectors.
- **Dependency inversion:** the products store accepts a fetcher function, so tests and a real API can plug in.
- **DRY:** one product grid, one confirm dialog for every confirmation, one price formatter.
- **KISS and YAGNI:** native-feeling shadcn parts instead of custom ones, no router, no `memo` or `useCallback` unless something is actually slow, nothing from the "Not doing" list.

## Done when
All seven features work in the browser, layout holds at 320, 768, and 1200px, tests pass, the build is clean, and the README shows how AI was used.

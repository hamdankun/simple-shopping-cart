# Boutique Store

A little online shop built with React. You can look through the products, search for something, drop items in your cart, change how many you want, and "check out". It's a rebuild of an older single-file HTML page, made for the frontend architecture assessment in `docs/project-brief.md`.

Nothing here is real: the products are made-up, checkout is pretend, and there's no backend.

## What you can do

- Browse 12 products. If loading fails, you'll see a message and a Retry button.
- Search by name. It ignores upper and lower case and waits a moment after you stop typing.
- Add things to your cart and get a small pop-up confirming each one.
- Open the cart from the top right. It slides in from the side.
- See how many items you have in total, both on the cart button and inside the cart.
- Change a quantity with the `−` and `+` buttons, or just type a number from 1 to 99.
- Get asked "are you sure?" before removing something or checking out.
- Refresh the page and find your cart still there, since it's saved in your browser.
- See a picture for every product, loaded in a way that keeps the page fast.
- Use it on a phone or a big screen. The layout adjusts.

## Built with

- React 19 and TypeScript
- Vite 8 for the dev server and build
- Tailwind CSS 4 and shadcn/ui for the look and the ready-made parts (buttons, cart panel, dialogs, toasts)
- Zustand 5 for state, including saving the cart
- Vitest for tests

## Run it yourself

You'll need Node.js 20.19 or newer (or 22.12+).

```bash
npm install
npm run dev      # starts the app at http://localhost:5173
npm run build    # checks types and builds for production
npm test         # runs the unit tests
```

## Where things live

```
src/
├── api/          # the made-up product data (swap in a real API later)
├── stores/       # Zustand stores for products, cart, cart panel, and confirmations
├── hooks/        # the "do something" logic: add to cart, remove, checkout
├── components/   # the pieces of the page; components/ui has the shadcn parts
├── lib/          # small helpers, like formatting prices
└── types.ts
```

A few habits we stuck to while writing it:

- Components show things, hooks handle what happens, and stores keep the data. Components don't fetch or make decisions.
- Each store does one job, and a component only listens to the bits it needs.
- There's one confirm dialog for the whole app. Any code can ask a question and wait for a yes or no.
- The product store is handed a function that gets the products. That means a real API, or a fake one in a test, can take the place of the dummy data without changing the store.
- We kept things simple on purpose: no router, no extra layers on top of shadcn, and no speed tricks until something is actually slow.

If you want the full story, the docs go deeper:

- [`docs/PRD.md`](docs/PRD.md) explains what we're building and why.
- [`docs/tech-spec.md`](docs/tech-spec.md) explains how it works.
- [`docs/project-structure.md`](docs/project-structure.md) covers the folders and conventions.

## Choices worth explaining

- **Zustand over Context or Redux.** The cart, the product list, and the dialogs each need to be read from different parts of the page. Zustand lets a component subscribe to just one value (like the total quantity) without wrapping the app in providers, and it has a built-in way to save to `localStorage`.
- **shadcn parts instead of my own modal and toast.** Focus handling, the Esc key, and screen-reader support come with them, so the code I wrote stays about the app and not about re-making dialogs.
- **One confirm dialog, driven by a promise.** Removing an item and checking out both use `await ask(...)`, which keeps each flow readable top to bottom.
- **Picsum for pictures.** The original pointed to image files that don't exist, so the products use placeholder photos from Picsum. One `ProductImage` component handles the optimizations: right-sized WebP with a sharper 2x version, lazy loading below the first row, reserved space so nothing jumps, and a plain placeholder if a picture fails.
- **Not done on purpose:** no router, no real API, no cross-device cart. The brief is a 30-minute task, so I kept to what it asks for.

## What we fixed from the original

- The cart used to close every time you changed a quantity, because the "click outside to close" code mistook those clicks for outside clicks. It stays open now.
- The page was stuck at 1200px wide. It now fits whatever screen it's on.
- The old code built HTML out of text strings, which isn't safe for product names. React handles that for us now.
- Two near-identical chunks of product-drawing code are now one component.
- Browser `alert()` pop-ups are gone, replaced by proper dialogs and toasts.

## Tests

`npm test` runs the whole suite: every component and hook has its own test file, the stores are tested, and a few whole-page tests cover adding to the cart, searching, and refreshing a saved cart. They use Vitest with Testing Library, so components are tested by clicking and typing like a person would. To check the tests aren't just passing for show, I broke the code on purpose in four places and each break made tests fail.

## How AI was used

I built this with Claude Code. It read the brief and the old page, wrote the docs, built the app, and then tried it in a real browser: adding items, toasts, search, typing a quantity, the dialogs, checkout, and reloading with a saved cart.

The requests I gave it, in order:

1. Write a PRD, tech spec, and project structure from the brief.
2. Use React, and follow SOLID, DRY, KISS, and YAGNI.
3. Use the latest React and Vite.
4. Use dummy data and make sure the cart works.
5. Don't over-engineer it, and keep the code clean.
6. Use Tailwind CSS and shadcn as the design system.
7. Keep the cart after a refresh using `localStorage`.
8. Make the UI English.

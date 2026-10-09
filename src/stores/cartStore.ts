import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MAX_QTY } from '@/lib/limits'
import type { CartItem, Product } from '@/types'

interface CartState {
  items: CartItem[]
  add: (product: Product) => void
  setQuantity: (id: number, qty: number) => void
  remove: (id: number) => void
  clear: () => void
  syncProducts: (catalog: Product[]) => void
}

const clamp = (n: number) => Math.min(MAX_QTY, Math.max(1, Math.floor(n)))
const round2 = (n: number) => Math.round(n * 100) / 100

const isProduct = (p: unknown): p is Product => {
  const x = p as Product | null
  return !!x && Number.isFinite(x.id) && typeof x.name === 'string' && Number.isFinite(x.price) && typeof x.imageSeed === 'string'
}

// localStorage can hold anything (old versions, hand edits), so only keep lines that look right.
export function sanitizeItems(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return []
  return raw
    .filter((i): i is CartItem => !!i && isProduct(i.product) && Number.isFinite(i.quantity))
    .map((i) => ({ product: i.product, quantity: clamp(i.quantity) }))
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (product) =>
        set(({ items }) =>
          items.some((i) => i.product.id === product.id)
            ? { items: items.map((i) => (i.product.id === product.id ? { ...i, quantity: clamp(i.quantity + 1) } : i)) }
            : { items: [...items, { product, quantity: 1 }] },
        ),
      setQuantity: (id, qty) => {
        if (!Number.isFinite(qty)) return
        set(({ items }) => ({ items: items.map((i) => (i.product.id === id ? { ...i, quantity: clamp(qty) } : i)) }))
      },
      remove: (id) => set(({ items }) => ({ items: items.filter((i) => i.product.id !== id) })),
      clear: () => set({ items: [] }),
      // A saved cart can be stale: use the current name/price, and drop products that no longer exist.
      syncProducts: (catalog) =>
        set((state) => {
          const items = state.items.flatMap((item) => {
            const current = catalog.find((p) => p.id === item.product.id)
            return current ? [{ product: current, quantity: clamp(item.quantity) }] : []
          })
          const unchanged =
            items.length === state.items.length &&
            items.every(
              (item, i) =>
                item.quantity === state.items[i].quantity &&
                item.product.name === state.items[i].product.name &&
                item.product.price === state.items[i].product.price &&
                item.product.imageSeed === state.items[i].product.imageSeed,
            )
          return unchanged ? state : { items } // same state back = no re-render and no extra write to localStorage
        }),
    }),
    {
      name: 'cart',
      version: 2,
      migrate: () => ({ items: [] }), // the saved shape changed in version 2
      merge: (saved, current) => ({ ...current, items: sanitizeItems((saved as { items?: unknown } | undefined)?.items) }),
      partialize: ({ items }) => ({ items }), // only the items go to localStorage
    },
  ),
)

type Items = Pick<CartState, 'items'>
export const selectTotalQuantity = ({ items }: Items) => items.reduce((n, i) => n + i.quantity, 0)
export const selectTotalPrice = ({ items }: Items) => round2(items.reduce((n, i) => n + i.quantity * i.product.price, 0))

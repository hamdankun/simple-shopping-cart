import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Product } from '@/types'

const MAX_QTY = 99

interface CartState {
  items: CartItem[]
  add: (product: Product) => void
  setQuantity: (id: number, qty: number) => void
  remove: (id: number) => void
  syncProducts: (catalog: Product[]) => void
  clear: () => void
}

const clamp = (n: number) => Math.min(MAX_QTY, Math.max(1, Math.floor(n)))

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
        set(({ items }) => ({
          items: items.flatMap((item) => {
            const current = catalog.find((p) => p.id === item.product.id)
            return current ? [{ ...item, product: current }] : []
          }),
        })),
    }),
    { name: 'cart', version: 2, migrate: () => ({ items: [] }), partialize: ({ items }) => ({ items }) }, // only the items go to localStorage
  ),
)

type Items = Pick<CartState, 'items'>
export const selectTotalQuantity = ({ items }: Items) => items.reduce((n, i) => n + i.quantity, 0)
export const selectTotalPrice = ({ items }: Items) => items.reduce((n, i) => n + i.quantity * i.product.price, 0)

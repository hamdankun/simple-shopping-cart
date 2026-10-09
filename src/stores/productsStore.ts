import { create } from 'zustand'
import { fetchProducts } from '@/api/products'
import type { Product, ProductFetcher } from '@/types'

interface ProductsState {
  items: Product[]
  status: 'idle' | 'loading' | 'error' | 'ready'
  query: string
  load: (fetcher?: ProductFetcher) => Promise<void>
  setQuery: (q: string) => void
}

export const useProductsStore = create<ProductsState>()((set, get) => ({
  items: [],
  status: 'idle',
  query: '',
  load: async (fetcher = fetchProducts) => {
    if (get().status === 'loading') return // already on its way (e.g. React StrictMode runs effects twice in dev)
    set({ status: 'loading' })
    try {
      set({ items: await fetcher(), status: 'ready' })
    } catch (error) {
      console.error('Could not load products', error)
      set({ status: 'error' })
    }
  },
  setQuery: (query) => set({ query }),
}))

export const selectFilteredProducts = ({ items, query }: Pick<ProductsState, 'items' | 'query'>) => {
  const q = query.trim().toLowerCase()
  return q ? items.filter((p) => p.name.toLowerCase().includes(q)) : items
}

import { renderHook } from '@testing-library/react'
import { toast } from 'sonner'
import { beforeEach, expect, test, vi } from 'vitest'
import { useCartStore } from '@/stores/cartStore'
import { useProductsStore } from '@/stores/productsStore'
import { useSyncCartWithProducts } from '../useSyncCartWithProducts'

vi.mock('sonner', () => ({ toast: { info: vi.fn() } }))

const mouse = { id: 1, name: 'Mouse', price: 29, imageSeed: 'mouse' }
const keyboard = { id: 2, name: 'Keyboard', price: 129, imageSeed: 'keyboard' }

beforeEach(() => {
  vi.mocked(toast.info).mockClear()
  useProductsStore.setState({ items: [], status: 'idle', query: '' })
  useCartStore.setState({ items: [{ product: { ...mouse, price: 1 }, quantity: 2 }, { product: keyboard, quantity: 1 }] })
})

test('does nothing until the products have loaded', () => {
  renderHook(() => useSyncCartWithProducts())
  expect(useCartStore.getState().items[0].product.price).toBe(1)
})

test('refreshes saved prices once the products are ready', () => {
  useProductsStore.setState({ items: [mouse, keyboard], status: 'ready' })
  renderHook(() => useSyncCartWithProducts())
  expect(useCartStore.getState().items[0].product.price).toBe(29)
  expect(toast.info).not.toHaveBeenCalled()
})

test('tells the user when items are no longer sold and were removed', () => {
  useProductsStore.setState({ items: [mouse], status: 'ready' })
  renderHook(() => useSyncCartWithProducts())
  expect(useCartStore.getState().items).toHaveLength(1)
  expect(toast.info).toHaveBeenCalledWith('An item in your cart is no longer available and was removed.')
})

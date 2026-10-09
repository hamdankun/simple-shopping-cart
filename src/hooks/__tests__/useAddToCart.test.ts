import { renderHook } from '@testing-library/react'
import { toast } from 'sonner'
import { beforeEach, expect, test, vi } from 'vitest'
import { useCartStore } from '@/stores/cartStore'
import { useAddToCart } from '../useAddToCart'

vi.mock('sonner', () => ({ toast: { success: vi.fn() } }))

const mouse = { id: 4, name: 'Mouse', price: 29, imageSeed: 'seed' }

beforeEach(() => {
  useCartStore.getState().clear()
  vi.mocked(toast.success).mockClear()
})

test('adds the product and shows a toast naming it', () => {
  const { result } = renderHook(() => useAddToCart())
  result.current(mouse)
  expect(useCartStore.getState().items).toEqual([{ product: mouse, quantity: 1 }])
  expect(toast.success).toHaveBeenCalledWith('Added to cart: Mouse')
})

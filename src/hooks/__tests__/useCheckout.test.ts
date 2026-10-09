import { act, renderHook } from '@testing-library/react'
import { toast } from 'sonner'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { useCartStore } from '@/stores/cartStore'
import { useConfirmStore } from '@/stores/confirmStore'
import { useProductsStore } from '@/stores/productsStore'
import { useUiStore } from '@/stores/uiStore'
import { useCheckout } from '../useCheckout'

vi.mock('sonner', () => ({ toast: { success: vi.fn() } }))

const mouse = { id: 4, name: 'Mouse', price: 29, imageSeed: 'seed' }

beforeEach(() => {
  vi.useFakeTimers()
  vi.mocked(toast.success).mockClear()
  useCartStore.setState({ items: [{ product: mouse, quantity: 2 }] })
  useConfirmStore.setState({ request: null })
  useUiStore.setState({ cartOpen: true })
  useProductsStore.setState({ status: 'ready' })
})
afterEach(() => vi.useRealTimers())

test('is disabled when the cart is empty', () => {
  useCartStore.setState({ items: [] })
  const { result } = renderHook(() => useCheckout())
  expect(result.current.disabled).toBe(true)
})

test('is disabled, and asks nothing, until the prices have been checked against the loaded products', () => {
  useProductsStore.setState({ status: 'loading' })
  const { result } = renderHook(() => useCheckout())
  expect(result.current.disabled).toBe(true)
  expect(result.current.pricesChecked).toBe(false)
  act(() => { void result.current.checkout() })
  expect(useConfirmStore.getState().request).toBeNull()
})

test('asks with the item count and total before doing anything', () => {
  const { result } = renderHook(() => useCheckout())
  act(() => { void result.current.checkout() })
  expect(useConfirmStore.getState().request?.message).toBe('2 items, total $58.')
  expect(useCartStore.getState().items).toHaveLength(1)
})

test('cancelling leaves the cart alone', async () => {
  const { result } = renderHook(() => useCheckout())
  let done!: Promise<void>
  act(() => { done = result.current.checkout() })
  await act(async () => { useConfirmStore.getState().answer(false); await done })
  expect(useCartStore.getState().items).toHaveLength(1)
  expect(toast.success).not.toHaveBeenCalled()
})

test('confirming processes, then clears the cart, closes the panel and shows a toast', async () => {
  const { result } = renderHook(() => useCheckout())
  let done!: Promise<void>
  act(() => { done = result.current.checkout() })
  await act(async () => { useConfirmStore.getState().answer(true) })
  expect(result.current.isProcessing).toBe(true)
  expect(result.current.disabled).toBe(true)
  await act(async () => { await vi.advanceTimersByTimeAsync(1500); await done })
  expect(result.current.isProcessing).toBe(false)
  expect(useCartStore.getState().items).toHaveLength(0)
  expect(useUiStore.getState().cartOpen).toBe(false)
  expect(toast.success).toHaveBeenCalledOnce()
})

test('ignores a second checkout while one is processing', async () => {
  const { result } = renderHook(() => useCheckout())
  act(() => { void result.current.checkout() })
  await act(async () => { useConfirmStore.getState().answer(true) })
  const before = useConfirmStore.getState().request
  act(() => { void result.current.checkout() })
  expect(useConfirmStore.getState().request).toBe(before) // no new question asked
})

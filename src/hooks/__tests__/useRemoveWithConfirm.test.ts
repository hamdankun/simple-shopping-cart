import { act, renderHook } from '@testing-library/react'
import { beforeEach, expect, test } from 'vitest'
import { useCartStore } from '@/stores/cartStore'
import { useConfirmStore } from '@/stores/confirmStore'
import { useRemoveWithConfirm } from '../useRemoveWithConfirm'

const mouse = { id: 4, name: 'Mouse', price: 29, imageSeed: 'seed' }

beforeEach(() => {
  useCartStore.setState({ items: [{ product: mouse, quantity: 1 }] })
  useConfirmStore.setState({ request: null })
})

async function removeAndAnswer(answer: boolean) {
  const { result } = renderHook(() => useRemoveWithConfirm())
  let done!: Promise<void>
  act(() => { done = result.current(mouse) })
  expect(useConfirmStore.getState().request?.message).toContain('Mouse')
  await act(async () => { useConfirmStore.getState().answer(answer); await done })
}

test('removes the item when the user confirms', async () => {
  await removeAndAnswer(true)
  expect(useCartStore.getState().items).toHaveLength(0)
})

test('keeps the item when the user cancels', async () => {
  await removeAndAnswer(false)
  expect(useCartStore.getState().items).toHaveLength(1)
})

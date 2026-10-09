import { expect, test } from 'vitest'
import { useUiStore } from '../uiStore'

test('opens and closes the cart', () => {
  useUiStore.getState().openCart()
  expect(useUiStore.getState().cartOpen).toBe(true)
  useUiStore.getState().closeCart()
  expect(useUiStore.getState().cartOpen).toBe(false)
})

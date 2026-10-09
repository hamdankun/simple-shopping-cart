import { beforeEach, expect, test } from 'vitest'
import { selectTotalPrice, selectTotalQuantity, useCartStore } from '../cartStore'

const a = { id: 1, name: 'A', price: 100, imageSeed: 'seed' }
const b = { id: 2, name: 'B', price: 50, imageSeed: 'seed' }
const s = () => useCartStore.getState()

beforeEach(() => s().clear())

test('add increments existing line', () => {
  s().add(a); s().add(a)
  expect(s().items).toHaveLength(1)
  expect(s().items[0].quantity).toBe(2)
})

test('totals sum quantities, not lines', () => {
  s().add(a); s().add(a); s().add(b)
  expect(selectTotalQuantity(s())).toBe(3)
  expect(selectTotalPrice(s())).toBe(250)
})

test('setQuantity clamps and ignores NaN', () => {
  s().add(a)
  s().setQuantity(1, 500); expect(s().items[0].quantity).toBe(99)
  s().setQuantity(1, 0); expect(s().items[0].quantity).toBe(1)
  s().setQuantity(1, NaN); expect(s().items[0].quantity).toBe(1)
  s().setQuantity(1, 10); expect(s().items[0].quantity).toBe(10)
})

test('remove and clear', () => {
  s().add(a); s().add(b)
  s().remove(1); expect(s().items).toHaveLength(1)
  s().clear(); expect(s().items).toHaveLength(0)
})

test('syncProducts updates prices and drops products that no longer exist', () => {
  s().add(a); s().add(b)
  s().syncProducts([{ ...a, price: 120 }])
  expect(s().items).toHaveLength(1)
  expect(s().items[0].product.price).toBe(120)
  expect(s().items[0].quantity).toBe(1)
})

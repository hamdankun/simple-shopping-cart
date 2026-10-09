import { beforeEach, expect, test } from 'vitest'
import { sanitizeItems, selectTotalPrice, selectTotalQuantity, useCartStore } from '../cartStore'

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

test('syncProducts leaves the state untouched when nothing changed', () => {
  s().add(a)
  const before = s()
  s().syncProducts([{ ...a }])
  expect(s()).toBe(before)
})

test('syncProducts keeps quantities inside 1-99', () => {
  useCartStore.setState({ items: [{ product: a, quantity: 500 }] })
  s().syncProducts([a])
  expect(s().items[0].quantity).toBe(99)
})

test('total price is rounded to cents', () => {
  useCartStore.setState({ items: [{ product: { ...a, price: 0.1 }, quantity: 3 }] })
  expect(selectTotalPrice(s())).toBe(0.3) // 0.1 * 3 is 0.30000000000000004 as a raw float
})

test('sanitizeItems keeps good lines and drops or fixes bad saved data', () => {
  expect(sanitizeItems(null)).toEqual([])
  expect(sanitizeItems('nope')).toEqual([])
  expect(
    sanitizeItems([
      { product: a, quantity: 2 },
      { product: null, quantity: 1 },
      { product: { ...b, price: 'free' }, quantity: 1 },
      { product: b, quantity: 'abc' },
      { product: b, quantity: -5 },
      null,
    ]),
  ).toEqual([
    { product: a, quantity: 2 },
    { product: b, quantity: 1 },
  ])
})

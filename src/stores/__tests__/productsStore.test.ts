import { expect, test } from 'vitest'
import { selectFilteredProducts, useProductsStore } from '../productsStore'

const items = [
  { id: 1, name: 'Wireless Mouse', price: 1, imageSeed: 'seed' },
  { id: 2, name: 'Keyboard', price: 1, imageSeed: 'seed' },
]

test('filter is case-insensitive; empty query returns all', () => {
  expect(selectFilteredProducts({ items, query: 'MOUSE' })).toHaveLength(1)
  expect(selectFilteredProducts({ items, query: '  ' })).toHaveLength(2)
})

test('load failure sets error status (injected fetcher)', async () => {
  await useProductsStore.getState().load(() => Promise.reject(new Error('x')))
  expect(useProductsStore.getState().status).toBe('error')
})

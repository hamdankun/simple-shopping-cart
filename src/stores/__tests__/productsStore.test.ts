import { beforeEach, expect, test, vi } from 'vitest'
import { selectFilteredProducts, useProductsStore } from '../productsStore'

const items = [
  { id: 1, name: 'Wireless Mouse', price: 1, imageSeed: 'seed' },
  { id: 2, name: 'Keyboard', price: 1, imageSeed: 'seed' },
]

test('filter is case-insensitive; empty query returns all', () => {
  expect(selectFilteredProducts({ items, query: 'MOUSE' })).toHaveLength(1)
  expect(selectFilteredProducts({ items, query: '  ' })).toHaveLength(2)
})

beforeEach(() => useProductsStore.setState({ items: [], status: 'idle', query: '' }))

test('load failure sets error status (injected fetcher)', async () => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
  await useProductsStore.getState().load(() => Promise.reject(new Error('x')))
  expect(useProductsStore.getState().status).toBe('error')
})

test('a second load while one is running does not fetch again', async () => {
  const fetcher = vi.fn(() => new Promise<typeof items>((resolve) => setTimeout(() => resolve(items), 10)))
  await Promise.all([useProductsStore.getState().load(fetcher), useProductsStore.getState().load(fetcher)])
  expect(fetcher).toHaveBeenCalledOnce()
  expect(useProductsStore.getState().status).toBe('ready')
})

test('after a failure, loading again works (retry)', async () => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
  await useProductsStore.getState().load(() => Promise.reject(new Error('x')))
  await useProductsStore.getState().load(() => Promise.resolve(items))
  expect(useProductsStore.getState().status).toBe('ready')
})

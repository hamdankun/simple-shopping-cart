import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, expect, test, vi } from 'vitest'
import { useCartStore } from '@/stores/cartStore'
import { useProductsStore } from '@/stores/productsStore'
import { ProductGrid } from '../ProductGrid'

const items = [
  { id: 1, name: 'Wireless Mouse', price: 29, imageSeed: 'seed' },
  { id: 2, name: 'Keyboard', price: 129, imageSeed: 'seed' },
  { id: 3, name: 'Webcam', price: 79, imageSeed: 'seed' },
]

// Replace the real (delayed) loader so each test controls the state it needs.
const load = vi.fn()

beforeEach(() => {
  load.mockReset()
  useCartStore.getState().clear()
  useProductsStore.setState({ items: [], status: 'idle', query: '', load })
})

test('shows a loading message while products load', () => {
  useProductsStore.setState({ status: 'loading' })
  render(<ProductGrid />)
  expect(screen.getByText('Loading products...')).toBeInTheDocument()
})

test('asks the store to load products when it first appears', () => {
  render(<ProductGrid />)
  expect(load).toHaveBeenCalledOnce()
})

test('shows an error with a retry button that loads again', async () => {
  useProductsStore.setState({ status: 'error' })
  render(<ProductGrid />)
  load.mockClear()
  await userEvent.click(screen.getByRole('button', { name: 'Retry' }))
  expect(load).toHaveBeenCalledOnce()
})

test('lists products and filters them by the search query', () => {
  useProductsStore.setState({ status: 'ready', items, query: 'MOUSE' })
  render(<ProductGrid />)
  expect(screen.getAllByRole('article')).toHaveLength(1)
  expect(screen.getByText('Wireless Mouse')).toBeInTheDocument()
})

test('shows an empty state when nothing matches', () => {
  useProductsStore.setState({ status: 'ready', items, query: 'zzz' })
  render(<ProductGrid />)
  expect(screen.getByText('No products found')).toBeInTheDocument()
})

test('adding a product puts it in the cart', async () => {
  useProductsStore.setState({ status: 'ready', items })
  render(<ProductGrid />)
  await userEvent.click(screen.getAllByRole('button', { name: 'Add to cart' })[1])
  expect(useCartStore.getState().items).toEqual([{ product: items[1], quantity: 1 }])
})

test('only the first two pictures skip lazy loading', () => {
  useProductsStore.setState({ status: 'ready', items })
  const { container } = render(<ProductGrid />)
  const loading = [...container.querySelectorAll('img')].map((img) => img.getAttribute('loading'))
  expect(loading).toEqual(['eager', 'eager', 'lazy'])
})

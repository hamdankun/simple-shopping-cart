import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, expect, test } from 'vitest'
import { App } from '../App'
import { useCartStore } from '../stores/cartStore'
import { useProductsStore } from '../stores/productsStore'

beforeEach(() => {
  useCartStore.getState().clear()
  useProductsStore.setState({ items: [], status: 'idle', query: '' })
})

async function renderLoadedApp() {
  render(<App />)
  await screen.findByText('Wireless Mouse', {}, { timeout: 3000 })
}

test('adding products updates the cart count with every unit', async () => {
  const user = userEvent.setup()
  await renderLoadedApp()
  const [first, second] = screen.getAllByRole('button', { name: 'Add to cart' })
  await user.click(first)
  await user.click(first)
  await user.click(second)
  expect(screen.getByRole('button', { name: 'Cart, 3 items' })).toBeInTheDocument()
})

test('search filters the products and shows an empty state', async () => {
  const user = userEvent.setup()
  await renderLoadedApp()
  await user.type(screen.getByLabelText('Search products'), 'mouse')
  await waitFor(() => expect(screen.getAllByRole('article')).toHaveLength(1))
  await user.clear(screen.getByLabelText('Search products'))
  await user.type(screen.getByLabelText('Search products'), 'zzz')
  expect(await screen.findByText('No products found')).toBeInTheDocument()
})

test('a saved cart is refreshed with the current catalog prices', async () => {
  useCartStore.setState({ items: [{ product: { id: 4, name: 'Old name', price: 1, imageSeed: 'seed' }, quantity: 2 }] })
  await renderLoadedApp()
  await waitFor(() => expect(useCartStore.getState().items[0].product.price).toBe(29))
})

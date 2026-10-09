import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, expect, test } from 'vitest'
import { useCartStore } from '@/stores/cartStore'
import { useConfirmStore } from '@/stores/confirmStore'
import { useProductsStore } from '@/stores/productsStore'
import { useUiStore } from '@/stores/uiStore'
import { CartSidebar } from '../CartSidebar'
import { ConfirmDialog } from '../ConfirmDialog'

const mouse = { id: 4, name: 'Mouse', price: 29, imageSeed: 'seed' }
const keyboard = { id: 5, name: 'Keyboard', price: 129, imageSeed: 'seed' }

beforeEach(() => {
  useCartStore.getState().clear()
  useConfirmStore.setState({ request: null })
  useUiStore.setState({ cartOpen: true })
  useProductsStore.setState({ status: 'ready' })
})

function renderCart() {
  return render(<><CartSidebar /><ConfirmDialog /></>)
}

test('shows an empty message and disables checkout when there is nothing in the cart', () => {
  renderCart()
  expect(screen.getByText('Your cart is empty')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Checkout' })).toBeDisabled()
})

test('lists the items with the total quantity and total price', () => {
  useCartStore.setState({ items: [{ product: mouse, quantity: 2 }, { product: keyboard, quantity: 1 }] })
  renderCart()
  expect(screen.getByText('Mouse')).toBeInTheDocument()
  expect(screen.getByText('Keyboard')).toBeInTheDocument()
  expect(screen.getByText('3 items')).toBeInTheDocument()
  expect(screen.getByText('Total: $187')).toBeInTheDocument()
})

test('changing a quantity keeps the cart open', async () => {
  useCartStore.setState({ items: [{ product: mouse, quantity: 1 }] })
  renderCart()
  await userEvent.click(screen.getByRole('button', { name: 'Increase quantity' }))
  await userEvent.click(screen.getByRole('button', { name: 'Increase quantity' }))
  expect(useCartStore.getState().items[0].quantity).toBe(3)
  expect(useUiStore.getState().cartOpen).toBe(true)
})

test('removing an item asks first, and cancelling keeps it', async () => {
  useCartStore.setState({ items: [{ product: mouse, quantity: 1 }] })
  renderCart()
  await userEvent.click(screen.getByRole('button', { name: 'Remove Mouse' }))
  expect(await screen.findByText('Remove "Mouse" from your cart?')).toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
  expect(useCartStore.getState().items).toHaveLength(1)
})

test('removing an item and confirming takes it out of the cart', async () => {
  useCartStore.setState({ items: [{ product: mouse, quantity: 1 }] })
  renderCart()
  await userEvent.click(screen.getByRole('button', { name: 'Remove Mouse' }))
  await userEvent.click(await screen.findByRole('button', { name: 'Remove' }))
  expect(useCartStore.getState().items).toHaveLength(0)
})

test('checkout asks first, and cancelling keeps the cart', async () => {
  useCartStore.setState({ items: [{ product: mouse, quantity: 2 }] })
  renderCart()
  await userEvent.click(screen.getByRole('button', { name: 'Checkout' }))
  expect(await screen.findByText('2 items, total $58.')).toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
  expect(useCartStore.getState().items).toHaveLength(1)
})

test('closing the panel updates the ui store', async () => {
  renderCart()
  await userEvent.click(screen.getByRole('button', { name: 'Close' }))
  expect(useUiStore.getState().cartOpen).toBe(false)
})

test('checkout is paused, with a note, until the latest prices are known', () => {
  useProductsStore.setState({ status: 'loading' })
  useCartStore.setState({ items: [{ product: mouse, quantity: 1 }] })
  renderCart()
  expect(screen.getByRole('button', { name: 'Checkout' })).toBeDisabled()
  expect(screen.getByText('Checking the latest prices...')).toBeInTheDocument()
})

test('while an order is processing, the cart cannot be edited or closed', async () => {
  useCartStore.setState({ items: [{ product: mouse, quantity: 2 }] })
  renderCart()
  await userEvent.click(screen.getByRole('button', { name: 'Checkout' }))
  await userEvent.click(await screen.findByRole('button', { name: 'Place order' }))

  expect(await screen.findByRole('button', { name: 'Processing...' })).toBeDisabled()
  expect(screen.getByRole('button', { name: 'Increase quantity' })).toBeDisabled()
  expect(screen.getByRole('button', { name: 'Remove Mouse' })).toBeDisabled()
  await userEvent.click(screen.getByRole('button', { name: 'Close' }))
  expect(useUiStore.getState().cartOpen).toBe(true)

  await waitFor(() => expect(useCartStore.getState().items).toHaveLength(0), { timeout: 3000 })
  expect(useUiStore.getState().cartOpen).toBe(false)
})

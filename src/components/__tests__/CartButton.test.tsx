import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, expect, test } from 'vitest'
import { useCartStore } from '@/stores/cartStore'
import { useUiStore } from '@/stores/uiStore'
import { CartButton } from '../CartButton'

const mouse = { id: 4, name: 'Mouse', price: 29, imageSeed: 'seed' }

beforeEach(() => {
  useCartStore.getState().clear()
  useUiStore.setState({ cartOpen: false })
})

test('has no count badge when the cart is empty', () => {
  render(<CartButton />)
  expect(screen.getByRole('button', { name: 'Cart, 0 items' })).toBeInTheDocument()
  expect(screen.queryByText('0')).not.toBeInTheDocument()
})

test('shows the total number of units, not the number of lines', () => {
  useCartStore.setState({ items: [{ product: mouse, quantity: 3 }, { product: { ...mouse, id: 5 }, quantity: 2 }] })
  render(<CartButton />)
  expect(screen.getByRole('button', { name: 'Cart, 5 items' })).toBeInTheDocument()
  expect(screen.getByText('5')).toBeInTheDocument()
})

test('uses the singular for one item', () => {
  useCartStore.setState({ items: [{ product: mouse, quantity: 1 }] })
  render(<CartButton />)
  expect(screen.getByRole('button', { name: 'Cart, 1 item' })).toBeInTheDocument()
})

test('clicking it opens the cart', async () => {
  render(<CartButton />)
  await userEvent.click(screen.getByRole('button'))
  expect(useUiStore.getState().cartOpen).toBe(true)
})

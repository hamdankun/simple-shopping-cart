import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import { ProductCard } from '../ProductCard'

const product = { id: 7, name: 'USB Flash Drive', price: 19, imageSeed: 'seed' }

test('shows the name and formatted price', () => {
  render(<ProductCard product={product} onAdd={() => {}} />)
  expect(screen.getByRole('heading', { name: 'USB Flash Drive' })).toBeInTheDocument()
  expect(screen.getByText('$19')).toBeInTheDocument()
})

test('clicking the button hands the product to onAdd', async () => {
  const onAdd = vi.fn()
  render(<ProductCard product={product} onAdd={onAdd} />)
  await userEvent.click(screen.getByRole('button', { name: 'Add to cart' }))
  expect(onAdd).toHaveBeenCalledWith(product)
})

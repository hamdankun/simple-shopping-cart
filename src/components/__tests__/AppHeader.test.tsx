import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { AppHeader } from '../AppHeader'

test('shows the store name, the search box and the cart button', () => {
  render(<AppHeader />)
  expect(screen.getByRole('heading', { name: 'Boutique Store' })).toBeInTheDocument()
  expect(screen.getByLabelText('Search products')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /^Cart/ })).toBeInTheDocument()
})

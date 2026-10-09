import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, expect, test } from 'vitest'
import { useProductsStore } from '@/stores/productsStore'
import { SearchBox } from '../SearchBox'

beforeEach(() => useProductsStore.setState({ query: '' }))

test('typing updates the search query', async () => {
  render(<SearchBox />)
  await userEvent.type(screen.getByLabelText('Search products'), 'mouse')
  await waitFor(() => expect(useProductsStore.getState().query).toBe('mouse'))
})

test('does not push every keystroke straight to the store', async () => {
  render(<SearchBox />)
  await userEvent.type(screen.getByLabelText('Search products'), 'k', { delay: null })
  expect(useProductsStore.getState().query).toBe('')
})

test('the clear button resets the field and the query', async () => {
  render(<SearchBox />)
  const input = screen.getByLabelText('Search products')
  await userEvent.type(input, 'mouse')
  await waitFor(() => expect(useProductsStore.getState().query).toBe('mouse'))
  await userEvent.click(screen.getByRole('button', { name: 'Clear search' }))
  expect(input).toHaveValue('')
  await waitFor(() => expect(useProductsStore.getState().query).toBe(''))
})

test('no clear button while the field is empty', () => {
  render(<SearchBox />)
  expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument()
})

test('clearing is immediate and puts the cursor back in the field', async () => {
  render(<SearchBox />)
  const input = screen.getByLabelText('Search products')
  await userEvent.type(input, 'mouse')
  await waitFor(() => expect(useProductsStore.getState().query).toBe('mouse'))
  await userEvent.click(screen.getByRole('button', { name: 'Clear search' }))
  expect(useProductsStore.getState().query).toBe('') // checked right away, not after the delay
  expect(input).toHaveFocus()
})

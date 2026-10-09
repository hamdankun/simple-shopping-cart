import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import { CartItemRow } from '../CartItemRow'

const item = { product: { id: 1, name: 'Mouse', price: 29, imageSeed: 'seed' }, quantity: 3 }

function setup() {
  const onQuantity = vi.fn()
  const onRemove = vi.fn()
  render(<ul><CartItemRow item={item} onQuantity={onQuantity} onRemove={onRemove} /></ul>)
  return { onQuantity, onRemove, input: screen.getByLabelText('Mouse quantity'), user: userEvent.setup() }
}

test('typing a quantity saves it when the field loses focus', async () => {
  const { user, input, onQuantity } = setup()
  await user.clear(input)
  await user.type(input, '25')
  await user.tab()
  expect(onQuantity).toHaveBeenCalledWith(25)
})

test('typing 0 asks to remove the item', async () => {
  const { user, input, onQuantity, onRemove } = setup()
  await user.clear(input)
  await user.type(input, '0')
  await user.tab()
  expect(onRemove).toHaveBeenCalledOnce()
  expect(onQuantity).not.toHaveBeenCalled()
})

test('an empty field goes back to the old quantity', async () => {
  const { user, input, onQuantity } = setup()
  await user.clear(input)
  await user.tab()
  expect(onQuantity).not.toHaveBeenCalled()
  expect(input).toHaveValue(3)
})

test('+1, +5 and +10 add to the current quantity', async () => {
  const { user, onQuantity } = setup()
  await user.click(screen.getByLabelText('Increase quantity'))
  await user.click(screen.getByLabelText('Add 5 more'))
  await user.click(screen.getByLabelText('Add 10 more'))
  expect(onQuantity.mock.calls).toEqual([[4], [8], [13]])
})

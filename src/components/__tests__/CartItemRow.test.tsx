import { useState } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import { CartItemRow } from '../CartItemRow'

const product = { id: 1, name: 'Mouse', price: 29, imageSeed: 'mouse' }

// Behaves like the real cart: the number we're told about becomes the quantity (capped at 99).
function setup({ start = 3, disabled = false } = {}) {
  const onQuantity = vi.fn()
  const onRemove = vi.fn()
  function Harness() {
    const [quantity, setQuantity] = useState(start)
    return (
      <ul>
        <CartItemRow
          item={{ product, quantity }}
          onQuantity={(n) => { onQuantity(n); setQuantity(Math.min(99, n)) }}
          onRemove={onRemove}
          disabled={disabled}
        />
      </ul>
    )
  }
  render(<Harness />)
  return { onQuantity, onRemove, input: screen.getByLabelText('Mouse quantity'), user: userEvent.setup() }
}

test('typing a quantity updates it', async () => {
  const { user, input } = setup()
  await user.clear(input)
  await user.type(input, '25')
  await user.tab()
  expect(input).toHaveValue(25)
})

test('the spinner arrows and arrow keys save straight away, without leaving the field', () => {
  const { input, onQuantity } = setup()
  fireEvent.change(input, { target: { value: '4' } }) // what the browser sends for a spinner click or ArrowUp
  expect(onQuantity).toHaveBeenLastCalledWith(4)
})

test('a number above 99 is capped at 99', async () => {
  const { user, input } = setup()
  await user.clear(input)
  await user.type(input, '250')
  await user.tab()
  expect(input).toHaveValue(99)
})

test('typing 0 asks to remove the item when you leave the field', async () => {
  const { user, input, onQuantity, onRemove } = setup()
  await user.clear(input)
  await user.type(input, '0')
  expect(onRemove).not.toHaveBeenCalled()
  await user.tab()
  expect(onRemove).toHaveBeenCalledOnce()
  expect(onQuantity).not.toHaveBeenCalled()
})

test.each([['empty', ''], ['negative', '-3']])('%s text goes back to the old quantity and removes nothing', async (_name, text) => {
  const { user, input, onQuantity, onRemove } = setup()
  await user.clear(input)
  if (text) await user.type(input, text)
  await user.tab()
  expect(onQuantity).not.toHaveBeenCalled()
  expect(onRemove).not.toHaveBeenCalled()
  expect(input).toHaveValue(3)
})

test('a decimal never removes the item and always ends as a whole number', async () => {
  const { user, input, onRemove } = setup()
  await user.clear(input)
  await user.type(input, '2.5') // the 2 is saved as soon as it is typed
  await user.tab()
  expect(onRemove).not.toHaveBeenCalled()
  expect(Number.isInteger(Number((input as HTMLInputElement).value))).toBe(true)
})

test('+1, +5 and +10 add to the current quantity', async () => {
  const { user, onQuantity } = setup()
  await user.click(screen.getByLabelText('Increase quantity'))
  await user.click(screen.getByLabelText('Add 5 more'))
  await user.click(screen.getByLabelText('Add 10 more'))
  expect(onQuantity.mock.calls).toEqual([[4], [9], [19]])
})

test('the minus button removes the item when there is only one left', async () => {
  const { user, onRemove } = setup({ start: 1 })
  await user.click(screen.getByLabelText('Decrease quantity'))
  expect(onRemove).toHaveBeenCalledOnce()
})

test('at 99 the buttons that add more are turned off', () => {
  setup({ start: 99 })
  for (const name of ['Increase quantity', 'Add 5 more', 'Add 10 more']) expect(screen.getByLabelText(name)).toBeDisabled()
  expect(screen.getByLabelText('Decrease quantity')).toBeEnabled()
})

test('disabled turns every control off', () => {
  setup({ disabled: true })
  for (const el of screen.getAllByRole('button')) expect(el).toBeDisabled()
  expect(screen.getByLabelText('Mouse quantity')).toBeDisabled()
})

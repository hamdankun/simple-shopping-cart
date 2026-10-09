import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, expect, test } from 'vitest'
import { useConfirmStore } from '@/stores/confirmStore'
import { ConfirmDialog } from '../ConfirmDialog'

beforeEach(() => useConfirmStore.setState({ request: null }))

function ask(opts = { title: 'Remove item', message: 'Remove Mouse?', confirmLabel: 'Remove' }) {
  let answer!: Promise<boolean>
  act(() => {
    answer = useConfirmStore.getState().ask(opts)
  })
  return answer
}

test('stays closed until something asks a question', () => {
  render(<ConfirmDialog />)
  expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
})

test('shows the title, message and custom confirm label', async () => {
  render(<ConfirmDialog />)
  ask()
  expect(await screen.findByText('Remove item')).toBeInTheDocument()
  expect(screen.getByText('Remove Mouse?')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Remove' })).toBeInTheDocument()
})

test('confirming resolves the question with true', async () => {
  render(<ConfirmDialog />)
  const answer = ask()
  await userEvent.click(await screen.findByRole('button', { name: 'Remove' }))
  expect(await answer).toBe(true)
})

test('cancelling resolves the question with false', async () => {
  render(<ConfirmDialog />)
  const answer = ask()
  await userEvent.click(await screen.findByRole('button', { name: 'Cancel' }))
  expect(await answer).toBe(false)
})

test('pressing Escape counts as cancel', async () => {
  render(<ConfirmDialog />)
  const answer = ask()
  await screen.findByText('Remove item')
  await userEvent.keyboard('{Escape}')
  expect(await answer).toBe(false)
})

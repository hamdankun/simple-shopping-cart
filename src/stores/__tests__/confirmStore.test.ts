import { beforeEach, expect, test } from 'vitest'
import { useConfirmStore } from '../confirmStore'

const s = () => useConfirmStore.getState()
const question = (title: string) => ({ title, message: 'Sure?' })

beforeEach(() => useConfirmStore.setState({ request: null }))

test('answer resolves the question and closes it', async () => {
  const answer = s().ask(question('A'))
  expect(s().request?.title).toBe('A')
  s().answer(true)
  expect(await answer).toBe(true)
  expect(s().request).toBeNull()
})

test('a new question cancels the unanswered one instead of leaving it hanging', async () => {
  const first = s().ask(question('First'))
  const second = s().ask(question('Second'))
  expect(await first).toBe(false)
  expect(s().request?.title).toBe('Second')
  s().answer(true)
  expect(await second).toBe(true)
})

test('answering with nothing open does nothing', () => {
  expect(() => s().answer(true)).not.toThrow()
})

import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { useDebouncedValue } from '../useDebouncedValue'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

test('only updates after the value has been still for the delay', () => {
  const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 200), { initialProps: { value: 'a' } })
  rerender({ value: 'ab' })
  act(() => { vi.advanceTimersByTime(199) })
  expect(result.current).toBe('a')
  act(() => { vi.advanceTimersByTime(1) })
  expect(result.current).toBe('ab')
})

test('a new value restarts the wait', () => {
  const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 200), { initialProps: { value: 'a' } })
  rerender({ value: 'ab' })
  act(() => { vi.advanceTimersByTime(150) })
  rerender({ value: 'abc' })
  act(() => { vi.advanceTimersByTime(150) })
  expect(result.current).toBe('a')
  act(() => { vi.advanceTimersByTime(50) })
  expect(result.current).toBe('abc')
})

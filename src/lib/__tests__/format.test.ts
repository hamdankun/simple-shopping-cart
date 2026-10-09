import { expect, test } from 'vitest'
import { formatItems, formatPrice } from '../format'

test('whole prices have no cents, other prices show two decimals', () => {
  expect(formatPrice(29)).toBe('$29')
  expect(formatPrice(1299)).toBe('$1,299')
  expect(formatPrice(29.9)).toBe('$29.90')
  expect(formatPrice(59.98)).toBe('$59.98')
})

test('formatItems uses the singular only for one', () => {
  expect(formatItems(0)).toBe('0 items')
  expect(formatItems(1)).toBe('1 item')
  expect(formatItems(2)).toBe('2 items')
})

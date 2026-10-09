import { fireEvent, render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { ProductImage } from '../ProductImage'

const product = { id: 1, name: 'Mouse', price: 29, imageSeed: 'mouse' }

// alt="" marks the picture as decorative, so it has no "img" role to query by.
const getImage = (container: HTMLElement) => container.querySelector('img')!

test('asks Picsum for a WebP of the right size, plus a 2x version', () => {
  const { container } = render(<ProductImage product={product} width={300} height={225} />)
  const img = getImage(container)
  expect(img).toHaveAttribute('src', 'https://picsum.photos/seed/mouse/300/225.webp')
  expect(img.getAttribute('srcset')).toBe(
    'https://picsum.photos/seed/mouse/300/225.webp 300w, https://picsum.photos/seed/mouse/600/450.webp 600w',
  )
})

test('sets width and height so the page does not jump when the image arrives', () => {
  const { container } = render(<ProductImage product={product} width={300} height={225} />)
  expect(getImage(container)).toHaveAttribute('width', '300')
  expect(getImage(container)).toHaveAttribute('height', '225')
})

test('loads lazily by default, and right away when it is a priority image', () => {
  const { container, rerender } = render(<ProductImage product={product} width={56} height={56} />)
  expect(getImage(container)).toHaveAttribute('loading', 'lazy')
  rerender(<ProductImage product={product} width={56} height={56} priority />)
  expect(getImage(container)).toHaveAttribute('loading', 'eager')
  expect(getImage(container)).toHaveAttribute('fetchpriority', 'high')
})

test('is decorative, because the product name is shown next to it', () => {
  const { container } = render(<ProductImage product={product} width={56} height={56} />)
  expect(getImage(container)).toHaveAttribute('alt', '')
})

test('swaps to a plain placeholder when the image fails to load', () => {
  const { container } = render(<ProductImage product={product} width={56} height={56} className="size-14" />)
  fireEvent.error(getImage(container))
  expect(container.querySelector('img')).toBeNull()
  expect(container.firstElementChild).toHaveClass('size-14')
  expect(screen.queryByRole('img')).not.toBeInTheDocument()
})

test('a new picture gets a fresh try after an earlier one failed', () => {
  const { container, rerender } = render(<ProductImage product={product} width={56} height={56} />)
  fireEvent.error(getImage(container))
  expect(container.querySelector('img')).toBeNull()
  rerender(<ProductImage product={{ ...product, imageSeed: 'keyboard' }} width={56} height={56} />)
  expect(getImage(container)).toHaveAttribute('src', 'https://picsum.photos/seed/keyboard/56/56.webp')
})

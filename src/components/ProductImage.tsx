import { useState } from 'react'
import { imageUrl } from '@/lib/image'
import { cn } from '@/lib/utils'
import type { Product } from '@/types'

interface Props {
  product: Product
  width: number
  height: number
  /** The width the image is shown at, for the browser to pick the right file. Defaults to `width`. */
  sizes?: string
  /** Images above the fold load right away; the rest wait until they are close to the screen. */
  priority?: boolean
  className?: string
}

export function ProductImage({ product, width, height, sizes, priority = false, className }: Props) {
  const [failed, setFailed] = useState(false)

  // The product name is always next to the picture, so the picture itself is decorative.
  if (failed) return <div aria-hidden className={cn('bg-muted', className)} />

  return (
    <img
      src={imageUrl(product.imageSeed, width, height)}
      srcSet={`${imageUrl(product.imageSeed, width, height)} ${width}w, ${imageUrl(product.imageSeed, width * 2, height * 2)} ${width * 2}w`}
      sizes={sizes ?? `${width}px`}
      width={width}
      height={height}
      alt=""
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      onError={() => setFailed(true)}
      className={cn('bg-muted object-cover', className)}
    />
  )
}

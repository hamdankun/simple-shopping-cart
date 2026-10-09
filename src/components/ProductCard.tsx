import { Button } from '@/components/ui/button'
import { ProductImage } from '@/components/ProductImage'
import { formatPrice } from '@/lib/format'
import type { Product } from '@/types'

interface Props {
  product: Product
  onAdd: (product: Product) => void
  priority?: boolean
}

export function ProductCard({ product, onAdd, priority }: Props) {
  return (
    <article className="flex flex-col gap-2 rounded-xl border bg-card p-4 shadow-sm transition-transform hover:-translate-y-0.5 motion-reduce:transition-none">
      <ProductImage
        product={product}
        width={300}
        height={225}
        sizes="(max-width: 640px) 100vw, 300px"
        priority={priority}
        className="aspect-[4/3] w-full rounded-lg"
      />
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-xl font-bold">{formatPrice(product.price)}</p>
      <Button className="mt-auto w-full" onClick={() => onAdd(product)}>
        Add to cart
      </Button>
    </article>
  )
}

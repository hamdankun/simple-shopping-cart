import { useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { Button } from '@/components/ui/button'
import { useAddToCart } from '@/hooks/useAddToCart'
import { selectFilteredProducts, useProductsStore } from '@/stores/productsStore'
import { ProductCard } from './ProductCard'

// The first row is on screen straight away, so its images skip lazy loading.
const FIRST_ROW = 4

function Message({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center justify-center gap-2 py-10 text-muted-foreground">{children}</div>
}

export function ProductGrid() {
  const status = useProductsStore((s) => s.status)
  const load = useProductsStore((s) => s.load)
  const products = useProductsStore(useShallow(selectFilteredProducts))
  const addToCart = useAddToCart()

  useEffect(() => {
    load()
  }, [load])

  if (status === 'idle' || status === 'loading') return <Message>Loading products...</Message>
  if (status === 'error')
    return (
      <Message>
        Failed to load products.
        <Button variant="outline" size="sm" onClick={() => load()}>Retry</Button>
      </Message>
    )
  if (products.length === 0) return <Message>No products found</Message>

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5">
      {products.map((p, index) => (
        <ProductCard key={p.id} product={p} onAdd={addToCart} priority={index < FIRST_ROW} />
      ))}
    </div>
  )
}

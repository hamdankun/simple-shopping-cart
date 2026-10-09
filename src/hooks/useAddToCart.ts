import { toast } from 'sonner'
import { useCartStore } from '@/stores/cartStore'
import type { Product } from '@/types'

export function useAddToCart() {
  const add = useCartStore((s) => s.add)
  return (product: Product) => {
    add(product)
    toast.success(`Added to cart: ${product.name}`)
  }
}

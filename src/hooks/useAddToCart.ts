import { toast } from 'sonner'
import { MAX_QTY } from '@/lib/limits'
import { useCartStore } from '@/stores/cartStore'
import type { Product } from '@/types'

export function useAddToCart() {
  const add = useCartStore((s) => s.add)

  return (product: Product) => {
    const inCart = useCartStore.getState().items.find((i) => i.product.id === product.id)
    if (inCart && inCart.quantity >= MAX_QTY) {
      toast.error(`You can only add up to ${MAX_QTY} of ${product.name}`)
      return
    }
    add(product)
    toast.success(`Added to cart: ${product.name}`)
  }
}

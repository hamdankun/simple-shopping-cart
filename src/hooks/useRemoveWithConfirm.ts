import { useCartStore } from '@/stores/cartStore'
import { useConfirmStore } from '@/stores/confirmStore'
import type { Product } from '@/types'

export function useRemoveWithConfirm() {
  const ask = useConfirmStore((s) => s.ask)
  const remove = useCartStore((s) => s.remove)
  return async (product: Product) => {
    const ok = await ask({ title: 'Remove item', message: `Remove "${product.name}" from your cart?`, confirmLabel: 'Remove' })
    if (ok) remove(product.id)
  }
}

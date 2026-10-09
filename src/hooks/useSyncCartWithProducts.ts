import { useEffect } from 'react'
import { toast } from 'sonner'
import { useCartStore } from '@/stores/cartStore'
import { useProductsStore } from '@/stores/productsStore'

// Once the catalog has loaded, refresh the (possibly old) saved cart against it.
export function useSyncCartWithProducts() {
  const status = useProductsStore((s) => s.status)
  const products = useProductsStore((s) => s.items)
  const syncProducts = useCartStore((s) => s.syncProducts)

  useEffect(() => {
    if (status !== 'ready') return
    const before = useCartStore.getState().items.length
    syncProducts(products)
    const removed = before - useCartStore.getState().items.length
    if (removed > 0) toast.info(`${removed === 1 ? 'An item' : `${removed} items`} in your cart ${removed === 1 ? 'is' : 'are'} no longer available and ${removed === 1 ? 'was' : 'were'} removed.`)
  }, [status, products, syncProducts])
}

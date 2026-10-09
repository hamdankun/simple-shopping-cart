import { useEffect } from 'react'
import { useCartStore } from '@/stores/cartStore'
import { useProductsStore } from '@/stores/productsStore'

// Once the catalog has loaded, refresh the (possibly old) saved cart against it.
export function useSyncCartWithProducts() {
  const status = useProductsStore((s) => s.status)
  const products = useProductsStore((s) => s.items)
  const syncProducts = useCartStore((s) => s.syncProducts)

  useEffect(() => {
    if (status === 'ready') syncProducts(products)
  }, [status, products, syncProducts])
}

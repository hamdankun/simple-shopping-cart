import { useState } from 'react'
import { toast } from 'sonner'
import { formatItems, formatPrice } from '@/lib/format'
import { selectTotalPrice, selectTotalQuantity, useCartStore } from '@/stores/cartStore'
import { useConfirmStore } from '@/stores/confirmStore'
import { useProductsStore } from '@/stores/productsStore'
import { useUiStore } from '@/stores/uiStore'

export function useCheckout() {
  const ask = useConfirmStore((s) => s.ask)
  const quantity = useCartStore(selectTotalQuantity)
  const total = useCartStore(selectTotalPrice)
  const clear = useCartStore((s) => s.clear)
  const closeCart = useUiStore((s) => s.closeCart)
  // A saved cart may hold old prices, so wait until it has been checked against the loaded products.
  const pricesChecked = useProductsStore((s) => s.status === 'ready')
  const [isProcessing, setProcessing] = useState(false)

  const checkout = async () => {
    if (isProcessing || quantity === 0 || !pricesChecked) return

    const confirmed = await ask({
      title: 'Confirm checkout',
      message: `${formatItems(quantity)}, total ${formatPrice(total)}.`,
      confirmLabel: 'Place order',
    })
    if (!confirmed) return

    setProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 1500)) // pretend to talk to a payment API
    clear()
    closeCart()
    setProcessing(false)
    toast.success('Order placed. Thank you for your purchase!')
  }

  return { checkout, isProcessing, pricesChecked, disabled: quantity === 0 || isProcessing || !pricesChecked }
}

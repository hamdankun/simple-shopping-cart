import { useState } from 'react'
import { toast } from 'sonner'
import { formatItems, formatPrice } from '@/lib/format'
import { selectTotalPrice, selectTotalQuantity, useCartStore } from '@/stores/cartStore'
import { useConfirmStore } from '@/stores/confirmStore'
import { useUiStore } from '@/stores/uiStore'

export function useCheckout() {
  const ask = useConfirmStore((s) => s.ask)
  const quantity = useCartStore(selectTotalQuantity)
  const total = useCartStore(selectTotalPrice)
  const clear = useCartStore((s) => s.clear)
  const closeCart = useUiStore((s) => s.closeCart)
  const [isProcessing, setProcessing] = useState(false)

  const checkout = async () => {
    if (isProcessing || quantity === 0) return

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

  return { checkout, isProcessing, disabled: quantity === 0 || isProcessing }
}

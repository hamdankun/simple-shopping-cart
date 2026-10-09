import { ShoppingCartIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatItems } from '@/lib/format'
import { selectTotalQuantity, useCartStore } from '@/stores/cartStore'
import { useUiStore } from '@/stores/uiStore'

export function CartButton() {
  const count = useCartStore(selectTotalQuantity)
  const openCart = useUiStore((s) => s.openCart)

  return (
    <Button variant="secondary" className="relative" onClick={openCart} aria-label={`Cart, ${formatItems(count)}`}>
      <ShoppingCartIcon /> Cart
      {count > 0 && <Badge className="absolute -right-2 -top-2 min-w-6 justify-center">{count}</Badge>}
    </Button>
  )
}

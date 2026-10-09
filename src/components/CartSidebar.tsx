import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useCheckout } from '@/hooks/useCheckout'
import { useRemoveWithConfirm } from '@/hooks/useRemoveWithConfirm'
import { formatItems, formatPrice } from '@/lib/format'
import { selectTotalPrice, selectTotalQuantity, useCartStore } from '@/stores/cartStore'
import { useUiStore } from '@/stores/uiStore'
import { CartItemRow } from './CartItemRow'

export function CartSidebar() {
  const open = useUiStore((s) => s.cartOpen)
  const openCart = useUiStore((s) => s.openCart)
  const closeCart = useUiStore((s) => s.closeCart)
  const items = useCartStore((s) => s.items)
  const setQuantity = useCartStore((s) => s.setQuantity)
  const quantity = useCartStore(selectTotalQuantity)
  const total = useCartStore(selectTotalPrice)
  const removeWithConfirm = useRemoveWithConfirm()
  const { checkout, isProcessing, pricesChecked, disabled } = useCheckout()

  return (
    <Sheet open={open} onOpenChange={(next) => (next ? openCart() : !isProcessing && closeCart())}>
      <SheetContent className="data-[side=right]:w-full data-[side=right]:sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Your cart <span className="text-sm font-normal text-muted-foreground">{formatItems(quantity)}</span></SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <p className="mt-12 text-center text-muted-foreground">Your cart is empty</p>
        ) : (
          <ul className="flex-1 overflow-y-auto px-4">
            {items.map((item) => (
              <CartItemRow
                key={item.product.id}
                item={item}
                onQuantity={(q) => setQuantity(item.product.id, q)}
                onRemove={() => removeWithConfirm(item.product)}
                disabled={isProcessing}
              />
            ))}
          </ul>
        )}

        <SheetFooter>
          <p className="text-center text-2xl font-bold">Total: {formatPrice(total)}</p>
          {!pricesChecked && items.length > 0 && (
            <p className="text-center text-xs text-muted-foreground">Checking the latest prices...</p>
          )}
          <Button size="lg" disabled={disabled} onClick={checkout}>
            {isProcessing ? 'Processing...' : 'Checkout'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

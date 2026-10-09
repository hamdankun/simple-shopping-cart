import { useState } from 'react'
import { MinusIcon, PlusIcon, Trash2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ProductImage } from '@/components/ProductImage'
import { formatPrice } from '@/lib/format'
import type { CartItem } from '@/types'

const BULK_STEPS = [5, 10]

interface Props {
  item: CartItem
  onQuantity: (quantity: number) => void
  onRemove: () => void
}

export function CartItemRow({ item: { product, quantity }, onQuantity, onRemove }: Props) {
  // While typing, keep the raw text; commit (or revert) on blur.
  const [draft, setDraft] = useState<string | null>(null)

  const commitDraft = () => {
    if (draft === null) return
    setDraft(null)
    const value = Number(draft)
    if (draft.trim() === '' || !Number.isFinite(value)) return
    if (value < 1) onRemove()
    else onQuantity(value)
  }

  const decrease = () => (quantity <= 1 ? onRemove() : onQuantity(quantity - 1))

  return (
    <li className="flex items-center gap-4 border-b py-4">
      <ProductImage product={product} width={56} height={56} className="size-14 shrink-0 rounded-lg" />
      <div className="flex flex-1 flex-col gap-1 text-sm">
        <div className="flex items-center justify-between gap-2">
          <span>{product.name}</span>
          <Button variant="ghost" size="icon-sm" onClick={onRemove} aria-label={`Remove ${product.name}`}><Trash2Icon /></Button>
        </div>
        <span className="font-semibold">{formatPrice(product.price)}</span>
        <div className="flex items-center gap-1.5">
          <Button variant="outline" size="icon-sm" onClick={decrease} aria-label="Decrease quantity"><MinusIcon /></Button>
          <Input
            type="number"
            min={1}
            max={99}
            inputMode="numeric"
            aria-label={`${product.name} quantity`}
            className="h-7 w-14 px-1 text-center"
            value={draft ?? quantity}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commitDraft}
            onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
          />
          <Button variant="outline" size="icon-sm" onClick={() => onQuantity(quantity + 1)} aria-label="Increase quantity"><PlusIcon /></Button>
          {BULK_STEPS.map((step) => (
            <Button key={step} variant="outline" size="sm" onClick={() => onQuantity(quantity + step)} aria-label={`Add ${step} more`}>
              +{step}
            </Button>
          ))}
        </div>
      </div>
    </li>
  )
}

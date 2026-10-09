import { useState } from 'react'
import { MinusIcon, PlusIcon, Trash2Icon } from 'lucide-react'
import { ProductImage } from '@/components/ProductImage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatPrice } from '@/lib/format'
import { MAX_QTY } from '@/lib/limits'
import type { CartItem } from '@/types'

const BULK_STEPS = [5, 10]

interface Props {
  item: CartItem
  onQuantity: (quantity: number) => void
  onRemove: () => void
  /** Locks every control, e.g. while an order is being placed. */
  disabled?: boolean
}

export function CartItemRow({ item: { product, quantity }, onQuantity, onRemove, disabled }: Props) {
  // Only used while the text isn't a usable quantity yet (empty, 0, 2.5...).
  const [draft, setDraft] = useState<string | null>(null)
  const atMax = quantity >= MAX_QTY

  const handleChange = (text: string) => {
    const value = Number(text)
    if (text.trim() !== '' && Number.isInteger(value) && value >= 1) {
      setDraft(null)
      onQuantity(value) // saved straight away, so the spinner arrows and arrow keys work too
    } else {
      setDraft(text)
    }
  }

  const commitDraft = () => {
    if (draft === null) return
    setDraft(null)
    if (draft.trim() !== '' && Number(draft) === 0) onRemove() // anything else unusable goes back to the old number
  }

  const decrease = () => (quantity <= 1 ? onRemove() : onQuantity(quantity - 1))

  return (
    <li className="flex items-center gap-4 border-b py-4">
      <ProductImage product={product} width={56} height={56} className="size-14 shrink-0 rounded-lg" />
      <div className="flex flex-1 flex-col gap-1 text-sm">
        <div className="flex items-center justify-between gap-2">
          <span>{product.name}</span>
          <Button variant="ghost" size="icon-sm" onClick={onRemove} disabled={disabled} aria-label={`Remove ${product.name}`}><Trash2Icon /></Button>
        </div>
        <span className="font-semibold">{formatPrice(product.price)}</span>
        <div className="flex items-center gap-1.5">
          <Button variant="outline" size="icon-sm" onClick={decrease} disabled={disabled} aria-label="Decrease quantity"><MinusIcon /></Button>
          <Input
            type="number"
            min={1}
            max={MAX_QTY}
            inputMode="numeric"
            aria-label={`${product.name} quantity`}
            className="h-7 w-14 px-1 text-center"
            value={draft ?? quantity}
            disabled={disabled}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={commitDraft}
            onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
          />
          <Button variant="outline" size="icon-sm" onClick={() => onQuantity(quantity + 1)} disabled={disabled || atMax} aria-label="Increase quantity"><PlusIcon /></Button>
          {BULK_STEPS.map((step) => (
            <Button key={step} variant="outline" size="sm" onClick={() => onQuantity(quantity + step)} disabled={disabled || atMax} aria-label={`Add ${step} more`}>
              +{step}
            </Button>
          ))}
        </div>
      </div>
    </li>
  )
}

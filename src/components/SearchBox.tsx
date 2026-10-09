import { useEffect, useRef, useState } from 'react'
import { XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useProductsStore } from '@/stores/productsStore'

export function SearchBox() {
  const setQuery = useProductsStore((s) => s.setQuery)
  const [value, setValue] = useState('')
  const debounced = useDebouncedValue(value, 200)
  const inputRef = useRef<HTMLInputElement>(null)

  const clear = () => {
    setValue('')
    setQuery('') // no need to wait for the debounce when clearing
    inputRef.current?.focus()
  }

  useEffect(() => {
    setQuery(debounced)
  }, [debounced, setQuery])

  return (
    <div className="relative max-w-sm flex-1">
      <Input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search products..."
        aria-label="Search products"
        className="bg-background pr-9 text-foreground [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <Button variant="ghost" size="icon-xs" className="absolute right-1.5 top-1/2 -translate-y-1/2" onClick={clear} aria-label="Clear search">
          <XIcon />
        </Button>
      )}
    </div>
  )
}

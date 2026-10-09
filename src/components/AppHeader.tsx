import { CartButton } from './CartButton'
import { SearchBox } from './SearchBox'

export function AppHeader() {
  return (
    <header className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-neutral-900 p-5 text-white">
      <h1 className="text-2xl font-bold">Boutique Store</h1>
      <SearchBox />
      <CartButton />
    </header>
  )
}

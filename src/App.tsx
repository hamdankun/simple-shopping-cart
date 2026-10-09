import { AppHeader } from '@/components/AppHeader'
import { CartSidebar } from '@/components/CartSidebar'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { ProductGrid } from '@/components/ProductGrid'
import { Toaster } from '@/components/ui/sonner'
import { useSyncCartWithProducts } from '@/hooks/useSyncCartWithProducts'

export function App() {
  useSyncCartWithProducts()

  return (
    <>
      <main className="mx-auto min-h-screen max-w-6xl bg-background p-3 sm:p-5">
        <AppHeader />
        <ProductGrid />
      </main>
      <CartSidebar />
      <ConfirmDialog />
      <Toaster position="top-center" />
    </>
  )
}

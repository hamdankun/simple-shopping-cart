export interface Product { id: number; name: string; price: number; imageSeed: string }
export interface CartItem { product: Product; quantity: number }
export type ProductFetcher = () => Promise<Product[]>

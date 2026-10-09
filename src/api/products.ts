import type { Product, ProductFetcher } from '@/types'

// Dummy data; swap this fetcher for a real API call.
const PRODUCTS: Product[] = [
  { id: 1, name: 'Wireless Headphones', price: 99, imageSeed: 'headphones' },
  { id: 2, name: 'Smart Watch', price: 299, imageSeed: 'watch' },
  { id: 3, name: 'Portable Charger', price: 45, imageSeed: 'charger' },
  { id: 4, name: 'Wireless Mouse', price: 29, imageSeed: 'mouse' },
  { id: 5, name: 'Mechanical Keyboard', price: 129, imageSeed: 'keyboard' },
  { id: 6, name: 'Webcam', price: 79, imageSeed: 'webcam' },
  { id: 7, name: 'USB Flash Drive', price: 19, imageSeed: 'flash-drive' },
  { id: 8, name: 'Desktop Speaker', price: 59, imageSeed: 'speaker' },
  { id: 9, name: 'Wireless Charging Pad', price: 35, imageSeed: 'charging-pad' },
  { id: 10, name: 'Gaming Monitor', price: 399, imageSeed: 'monitor' },
  { id: 11, name: 'Bluetooth Speaker', price: 69, imageSeed: 'bluetooth-speaker' },
  { id: 12, name: 'Laptop Stand', price: 25, imageSeed: 'laptop-stand' },
]

export const fetchProducts: ProductFetcher = () =>
  new Promise((resolve) => setTimeout(() => resolve(PRODUCTS), 800))

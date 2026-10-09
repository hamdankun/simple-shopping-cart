export const formatPrice = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

export const formatItems = (n: number) => `${n} ${n === 1 ? 'item' : 'items'}`

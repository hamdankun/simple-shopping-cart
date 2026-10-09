export const formatPrice = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: Number.isInteger(n) ? 0 : 2 })

export const formatItems = (n: number) => `${n} ${n === 1 ? 'item' : 'items'}`

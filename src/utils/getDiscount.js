// utils/getDiscount.ts
export function getDiscount(price, discount = 0) {
  if (discount === 0) return price;
  return price - (price * discount) / 100;
}

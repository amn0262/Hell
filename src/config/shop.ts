export const SHOP_CONFIG = {
  shopName: 'NØX',
  productName: 'HELL',
  productPrice: 35.0,
  productWeightGrams: 500,
  nachnahmeFee: 9.0,
  claim: 'HELL. Direkt. Vertraulich.',
  claimAlt: 'HELL. Einfach anders.',
  currency: '€',
  minQuantity: 1,
} as const;

/**
 * Berechnet die Versandkosten nach der Produktmenge:
 * 1–4 Stück → 5,00 €
 * Danach erhöht sich der Versandpreis um 2,00 € je weitere 2 Produkte (5-6: 7€, 7-8: 9€, etc.)
 */
export function calculateShipping(quantity: number): number {
  if (quantity <= 0) return 0;
  if (quantity <= 4) return 5.0;
  const additionalPairs = Math.ceil((quantity - 4) / 2);
  return 5.0 + additionalPairs * 2.0;
}

export function formatPrice(amount: number): string {
  return amount.toLocaleString('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatWeight(grams: number): string {
  if (grams >= 1000) {
    const kg = grams / 1000;
    return `${kg.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kg`;
  }
  return `${grams} g`;
}

export function generateOrderNumber(indexToday: number = 1): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;
  const seq = String(indexToday).padStart(3, '0');
  return `NOX-${dateStr}-${seq}`;
}

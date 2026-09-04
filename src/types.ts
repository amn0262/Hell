export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
  createdAt: number;
}

export type OrderStatus = 'Gesendet' | 'Offen' | 'Bezahlt';

export interface Order {
  orderNumber: string;
  createdAt: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  unitWeightGrams: number;
  totalWeightGrams: number;
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
  shippingAddress: Address;
  status: OrderStatus;
  transmissionMode?: 'live' | 'simulated';
}

export type ActiveTab = 'start' | 'cart' | 'addresses' | 'orders' | 'checkout' | 'confirmation';

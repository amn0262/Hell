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

export type PaymentMethod = 'Vorkasse' | 'Nachnahme';

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
  codFee?: number;
  totalAmount: number;
  paymentMethod?: PaymentMethod;
  isCashOnDelivery?: boolean;
  shippingAddress: Address;
  status: OrderStatus;
  transmissionMode?: 'live' | 'simulated';
}

export type ActiveTab = 'start' | 'order' | 'cart' | 'addresses' | 'orders' | 'checkout' | 'confirmation';

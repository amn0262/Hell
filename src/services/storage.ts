import { Address, Order, OrderStatus } from '../types';

const DB_NAME = 'nox_store_db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

function getDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('addresses')) {
        db.createObjectStore('addresses', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('orders')) {
        db.createObjectStore('orders', { keyPath: 'orderNumber' });
      }
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  return dbPromise;
}

// LocalStorage fallbacks
const LS_KEYS = {
  ONBOARDING: 'nox_onboarding_completed',
  ADDRESSES: 'nox_addresses',
  ORDERS: 'nox_orders',
  SELECTED_ADDR: 'nox_selected_address_id',
  CART_QTY: 'nox_cart_qty',
  SEQ: 'nox_order_sequence',
};

export async function isOnboardingCompleted(): Promise<boolean> {
  try {
    const db = await getDB();
    return new Promise((resolve) => {
      const tx = db.transaction('settings', 'readonly');
      const store = tx.objectStore('settings');
      const req = store.get('onboarding_completed');
      req.onsuccess = () => resolve(Boolean(req.result?.value));
      req.onerror = () => resolve(localStorage.getItem(LS_KEYS.ONBOARDING) === 'true');
    });
  } catch {
    return localStorage.getItem(LS_KEYS.ONBOARDING) === 'true';
  }
}

export async function setOnboardingCompleted(completed: boolean): Promise<void> {
  try {
    localStorage.setItem(LS_KEYS.ONBOARDING, String(completed));
    const db = await getDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('settings', 'readwrite');
      const store = tx.objectStore('settings');
      const req = store.put({ key: 'onboarding_completed', value: completed });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    localStorage.setItem(LS_KEYS.ONBOARDING, String(completed));
  }
}

export async function getAddresses(): Promise<Address[]> {
  try {
    const db = await getDB();
    return new Promise((resolve) => {
      const tx = db.transaction('addresses', 'readonly');
      const store = tx.objectStore('addresses');
      const req = store.getAll();
      req.onsuccess = () => {
        const results = (req.result as Address[]) || [];
        if (results.length === 0) {
          const lsData = localStorage.getItem(LS_KEYS.ADDRESSES);
          resolve(lsData ? JSON.parse(lsData) : []);
        } else {
          resolve(results.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)));
        }
      };
      req.onerror = () => {
        const lsData = localStorage.getItem(LS_KEYS.ADDRESSES);
        resolve(lsData ? JSON.parse(lsData) : []);
      };
    });
  } catch {
    const lsData = localStorage.getItem(LS_KEYS.ADDRESSES);
    return lsData ? JSON.parse(lsData) : [];
  }
}

export async function saveAddress(address: Address): Promise<void> {
  // Sync to localStorage
  const current = await getAddresses();
  const index = current.findIndex((a) => a.id === address.id);
  let updated: Address[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = address;
  } else {
    updated = [address, ...current];
  }
  localStorage.setItem(LS_KEYS.ADDRESSES, JSON.stringify(updated));

  try {
    const db = await getDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('addresses', 'readwrite');
      const store = tx.objectStore('addresses');
      const req = store.put(address);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IDB saveAddress fallback used', err);
  }
}

export async function deleteAddress(id: string): Promise<void> {
  const current = await getAddresses();
  const filtered = current.filter((a) => a.id !== id);
  localStorage.setItem(LS_KEYS.ADDRESSES, JSON.stringify(filtered));

  try {
    const db = await getDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('addresses', 'readwrite');
      const store = tx.objectStore('addresses');
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IDB deleteAddress fallback used', err);
  }
}

export async function getSelectedAddressId(): Promise<string | null> {
  try {
    const db = await getDB();
    return new Promise((resolve) => {
      const tx = db.transaction('settings', 'readonly');
      const store = tx.objectStore('settings');
      const req = store.get('selected_address_id');
      req.onsuccess = () => {
        resolve(req.result?.value || localStorage.getItem(LS_KEYS.SELECTED_ADDR));
      };
      req.onerror = () => resolve(localStorage.getItem(LS_KEYS.SELECTED_ADDR));
    });
  } catch {
    return localStorage.getItem(LS_KEYS.SELECTED_ADDR);
  }
}

export async function setSelectedAddressId(id: string | null): Promise<void> {
  if (id) {
    localStorage.setItem(LS_KEYS.SELECTED_ADDR, id);
  } else {
    localStorage.removeItem(LS_KEYS.SELECTED_ADDR);
  }

  try {
    const db = await getDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('settings', 'readwrite');
      const store = tx.objectStore('settings');
      const req = store.put({ key: 'selected_address_id', value: id });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IDB setSelectedAddressId fallback used', err);
  }
}

export async function getCartQuantity(): Promise<number> {
  const stored = localStorage.getItem(LS_KEYS.CART_QTY);
  return stored ? Math.max(0, parseInt(stored, 10) || 0) : 0;
}

export async function setCartQuantity(qty: number): Promise<void> {
  const safeQty = Math.max(0, qty);
  localStorage.setItem(LS_KEYS.CART_QTY, String(safeQty));
}

export async function getOrders(): Promise<Order[]> {
  try {
    const db = await getDB();
    return new Promise((resolve) => {
      const tx = db.transaction('orders', 'readonly');
      const store = tx.objectStore('orders');
      const req = store.getAll();
      req.onsuccess = () => {
        const results = (req.result as Order[]) || [];
        if (results.length === 0) {
          const lsData = localStorage.getItem(LS_KEYS.ORDERS);
          resolve(lsData ? JSON.parse(lsData) : []);
        } else {
          resolve(results.sort((a, b) => b.createdAt - a.createdAt));
        }
      };
      req.onerror = () => {
        const lsData = localStorage.getItem(LS_KEYS.ORDERS);
        resolve(lsData ? JSON.parse(lsData) : []);
      };
    });
  } catch {
    const lsData = localStorage.getItem(LS_KEYS.ORDERS);
    return lsData ? JSON.parse(lsData) : [];
  }
}

export async function saveOrder(order: Order): Promise<void> {
  const current = await getOrders();
  const updated = [order, ...current.filter((o) => o.orderNumber !== order.orderNumber)];
  localStorage.setItem(LS_KEYS.ORDERS, JSON.stringify(updated));

  try {
    const db = await getDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('orders', 'readwrite');
      const store = tx.objectStore('orders');
      const req = store.put(order);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IDB saveOrder fallback used', err);
  }
}

export async function updateOrderStatus(orderNumber: string, status: OrderStatus): Promise<void> {
  const current = await getOrders();
  const target = current.find((o) => o.orderNumber === orderNumber);
  if (target) {
    target.status = status;
    await saveOrder(target);
  }
}

export async function getNextOrderSequence(): Promise<number> {
  const orders = await getOrders();
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const todayOrders = orders.filter((o) => o.orderNumber.includes(`NOX-${today}`));
  return todayOrders.length + 1;
}

import React, { useEffect, useState, useMemo } from 'react';
import { ActiveTab, Address, Order, OrderStatus } from './types';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { StartView } from './components/StartView';
import { ProductOrderView } from './components/ProductOrderView';
import { CartView } from './components/CartView';
import { AddressesView } from './components/AddressesView';
import { CheckoutView } from './components/CheckoutView';
import { ConfirmationView } from './components/ConfirmationView';
import { OrdersView } from './components/OrdersView';
import { OnboardingModal } from './components/OnboardingModal';
import { IdleScreen } from './components/IdleScreen';
import { PrivacyModal } from './components/PrivacyModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import {
  isOnboardingCompleted,
  getAddresses,
  saveAddress,
  deleteAddress,
  getSelectedAddressId,
  setSelectedAddressId,
  getCartQuantity,
  setCartQuantity,
  getOrders,
  updateOrderStatus,
} from './services/storage';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('start');
  const [cartQuantity, setCartQtyState] = useState<number>(0);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddrIdState] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [lastSubmittedOrder, setLastSubmittedOrder] = useState<Order | null>(null);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState<boolean>(false);
  const [telegramConfigured, setTelegramConfigured] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Initialize data from local IndexedDB
  useEffect(() => {
    async function initApp() {
      try {
        const [onboarded, storedAddresses, activeAddrId, storedCartQty, storedOrders] = await Promise.all([
          isOnboardingCompleted(),
          getAddresses(),
          getSelectedAddressId(),
          getCartQuantity(),
          getOrders(),
        ]);

        setShowOnboarding(!onboarded);
        setAddresses(storedAddresses);
        setCartQtyState(storedCartQty);
        setOrders(storedOrders);

        // Ensure a selected address exists if there are addresses
        if (activeAddrId && storedAddresses.some((a) => a.id === activeAddrId)) {
          setSelectedAddrIdState(activeAddrId);
        } else if (storedAddresses.length > 0) {
          setSelectedAddrIdState(storedAddresses[0].id);
          await setSelectedAddressId(storedAddresses[0].id);
        }

        // Check telegram backend status
        try {
          const res = await fetch('/api/telegram/status');
          if (res.ok) {
            const data = await res.json();
            setTelegramConfigured(Boolean(data.configured));
          }
        } catch {
          // Backend offline or running purely static
        }
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        setIsInitialized(true);
      }
    }

    initApp();
  }, []);

  const selectedAddress = useMemo(() => {
    return addresses.find((a) => a.id === selectedAddressId) || null;
  }, [addresses, selectedAddressId]);

  // Cart operations
  const handleAddToCart = async (quantity: number) => {
    const newQty = cartQuantity + quantity;
    setCartQtyState(newQty);
    await setCartQuantity(newQty);
  };

  const handleUpdateCartQuantity = async (quantity: number) => {
    const safeQty = Math.max(0, quantity);
    setCartQtyState(safeQty);
    await setCartQuantity(safeQty);
  };

  // Address operations
  const handleSelectAddress = async (id: string) => {
    setSelectedAddrIdState(id);
    await setSelectedAddressId(id);
  };

  const handleSaveAddress = async (address: Address) => {
    await saveAddress(address);
    const updated = await getAddresses();
    setAddresses(updated);
    if (!selectedAddressId || updated.length === 1) {
      setSelectedAddrIdState(address.id);
      await setSelectedAddressId(address.id);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    await deleteAddress(id);
    const updated = await getAddresses();
    setAddresses(updated);
    if (selectedAddressId === id) {
      const nextId = updated.length > 0 ? updated[0].id : null;
      setSelectedAddrIdState(nextId);
      await setSelectedAddressId(nextId);
    }
  };

  // Order submission
  const handleOrderSuccess = (order: Order) => {
    setLastSubmittedOrder(order);
    setOrders((prev) => [order, ...prev]);
    setCartQtyState(0);
    setActiveTab('confirmation');
  };

  const handleUpdateOrderStatus = async (orderNumber: string, status: OrderStatus) => {
    await updateOrderStatus(orderNumber, status);
    const refreshed = await getOrders();
    setOrders(refreshed);
  };

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#050505] text-white/40 font-mono text-xs">
        <span className="tracking-[0.3em] uppercase animate-pulse">NØX // INITIALISIERE …</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] flex items-center justify-center p-0 m-0 overflow-x-hidden relative selection:bg-[#FF3B30]/30 selection:text-white">
      {/* Geometric Balance Ambient Red Radial Gradient */}
      <div
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, #FF3B30 0%, transparent 70%)',
        }}
      />

      {/* Main Layout: Mobile Centered Frame + Desktop Companion Sidebar */}
      <div className="w-full flex items-center justify-center relative z-10 py-0 lg:py-6">
        {/* Mobile-first App Frame */}
        <div className="w-full max-w-[390px] min-h-screen bg-black flex flex-col relative border-x border-white/5 shadow-2xl">
          <OfflineIndicator />

          {/* Global Header */}
          <Header
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            cartCount={cartQuantity}
            onOpenPrivacy={() => setShowPrivacyModal(true)}
            telegramConfigured={telegramConfigured}
          />

          {/* Main Content Views */}
          <main className="flex-1 overflow-x-hidden">
            {activeTab === 'start' && (
              <StartView
                onGoToOrder={() => setActiveTab('order')}
                onGoToCart={() => setActiveTab('cart')}
                cartCount={cartQuantity}
              />
            )}

            {activeTab === 'order' && (
              <ProductOrderView
                onAddToCart={handleAddToCart}
                onProceedToCheckout={() => setActiveTab('checkout')}
                onGoToCart={() => setActiveTab('cart')}
                onGoToStart={() => setActiveTab('start')}
                cartCount={cartQuantity}
              />
            )}

            {activeTab === 'cart' && (
              <CartView
                quantity={cartQuantity}
                onUpdateQuantity={handleUpdateCartQuantity}
                onProceedToCheckout={() => setActiveTab('checkout')}
                onGoToStart={() => setActiveTab('order')}
              />
            )}

            {activeTab === 'addresses' && (
              <AddressesView
                addresses={addresses}
                selectedAddressId={selectedAddressId}
                onSelectAddress={handleSelectAddress}
                onSaveAddress={handleSaveAddress}
                onDeleteAddress={handleDeleteAddress}
              />
            )}

            {activeTab === 'checkout' && (
              <CheckoutView
                quantity={cartQuantity}
                selectedAddress={selectedAddress}
                onGoToAddresses={() => setActiveTab('addresses')}
                onGoBackToCart={() => setActiveTab('cart')}
                onOrderSuccess={handleOrderSuccess}
              />
            )}

            {activeTab === 'confirmation' && lastSubmittedOrder && (
              <ConfirmationView
                order={lastSubmittedOrder}
                onGoToOrders={() => setActiveTab('orders')}
                onGoToStart={() => setActiveTab('start')}
              />
            )}

            {activeTab === 'orders' && (
              <OrdersView
                orders={orders}
                onUpdateStatus={handleUpdateOrderStatus}
                onGoToStart={() => setActiveTab('start')}
              />
            )}
          </main>

          {/* Bottom Navigation */}
          <BottomNav
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            cartCount={cartQuantity}
          />

          {/* First-start Onboarding Modal */}
          {showOnboarding && (
            <OnboardingModal onComplete={() => setShowOnboarding(false)} />
          )}

          {/* Privacy & Info Modal */}
          <PrivacyModal
            isOpen={showPrivacyModal}
            onClose={() => setShowPrivacyModal(false)}
            onRestartOnboarding={() => setShowOnboarding(true)}
            telegramConfigured={telegramConfigured}
          />

          {/* 2-Minute Inactivity Idle Screen */}
          <IdleScreen idleTimeoutMs={120000} />
        </div>

        {/* Desktop Companion Panel (Geometric Balance Design) */}
        <aside className="hidden lg:flex flex-col gap-6 ml-14 xl:ml-20 w-64 text-[#F5F5F5] select-none sticky top-12 self-start py-4">
          <div className="space-y-2">
            <div className="h-[1px] w-full bg-gradient-to-r from-white/20 to-transparent" />
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#FF3B30] font-bold">
              System Status
            </p>
            <p className="text-[12px] opacity-40 leading-relaxed">
              Alle Daten werden lokal in IndexedDB geschützt gespeichert.
            </p>
          </div>

          <div className="space-y-2 opacity-40">
            <p className="text-[10px] uppercase tracking-widest font-bold text-white">
              Privatsphäre
            </p>
            <p className="text-[11px] leading-relaxed">
              NØX verwendet keine externen Tracker oder Werbe-Cookies zur Nutzeranalyse.
            </p>
          </div>

          <div className="space-y-2 opacity-40">
            <p className="text-[10px] uppercase tracking-widest font-bold text-white">
              Astronomischer Zeitmesser
            </p>
            <p className="text-[11px] leading-relaxed">
              Lebendige mechanische Visualisierung in Echtzeit-Präzision.
            </p>
          </div>

          <div className="mt-6 p-4 border border-white/5 rounded-2xl bg-white/[0.02]">
            <p className="text-[10px] uppercase tracking-widest opacity-40 mb-3 font-semibold">
              Versandkosten Rechner
            </p>
            <div className="flex justify-between text-[11px] mb-1.5 text-zinc-300">
              <span>1–4 Stück</span>
              <span className="font-mono">5,00 €</span>
            </div>
            <div className="flex justify-between text-[11px] opacity-40 text-zinc-400">
              <span>+2 Stück</span>
              <span className="font-mono">+2,00 €</span>
            </div>
            <div className="pt-2 mt-2 border-t border-white/5 flex justify-between text-[11px] text-white/60">
              <span>Option Nachnahme</span>
              <span className="font-mono text-[#FF3B30]">+9,00 €</span>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-white/30 uppercase tracking-widest">
            <span>NØX // HELL</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              ONLINE
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
}

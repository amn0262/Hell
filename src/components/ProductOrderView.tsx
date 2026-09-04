import React, { useState } from 'react';
import { Minus, Plus, ShoppingBag, ArrowRight, ShieldCheck, Check, ArrowLeft, Truck, PackageCheck } from 'lucide-react';
import { HellSymbol } from './HellSymbol';
import { SHOP_CONFIG, calculateShipping, formatPrice, formatWeight } from '../config/shop';

interface ProductOrderViewProps {
  onAddToCart: (quantity: number) => void;
  onProceedToCheckout: (quantity: number) => void;
  onGoToCart: () => void;
  onGoToStart: () => void;
  cartCount: number;
}

export const ProductOrderView: React.FC<ProductOrderViewProps> = ({
  onAddToCart,
  onProceedToCheckout,
  onGoToCart,
  onGoToStart,
  cartCount,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [justAdded, setJustAdded] = useState(false);

  const unitPrice = SHOP_CONFIG.productPrice;
  const subtotal = quantity * unitPrice;
  const shippingCost = calculateShipping(quantity);
  const totalAmount = subtotal + shippingCost;
  const totalWeightGrams = quantity * SHOP_CONFIG.productWeightGrams;

  const handleDecrease = () => {
    setQuantity((prev) => Math.max(SHOP_CONFIG.minQuantity, prev - 1));
  };

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleAdd = () => {
    onAddToCart(quantity);
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
    }, 2000);
  };

  const handleDirectCheckout = () => {
    onAddToCart(quantity);
    onProceedToCheckout(quantity);
  };

  return (
    <div
      id="product-order-view"
      className="max-w-[390px] mx-auto px-6 py-4 pb-28 space-y-6 select-none"
    >
      {/* Navigation Header with Back button */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <button
          onClick={onGoToStart}
          className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span className="uppercase tracking-widest text-[10px]">Zeitmesser</span>
        </button>

        <div className="text-right">
          <span className="text-[10px] font-mono tracking-widest uppercase text-[#FF3B30]">
            BESTELLUNG
          </span>
        </div>
      </div>

      {/* Main Product Showcase Card */}
      <div className="rounded-3xl bg-[#111113] border border-white/10 p-6 relative overflow-hidden shadow-2xl">
        <div
          className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full pointer-events-none opacity-20"
          style={{
            background: 'radial-gradient(circle, #FF3B30 0%, transparent 70%)',
          }}
        />

        <div className="flex items-center justify-between">
          <div>
            <span className="text-[9px] uppercase tracking-[0.3em] text-white/40 block">
              {SHOP_CONFIG.shopName} // SELECTION
            </span>
            <h1 className="text-3xl font-light tracking-[0.12em] text-white uppercase mt-1">
              {SHOP_CONFIG.productName}
            </h1>
          </div>

          <div className="p-2 rounded-2xl bg-black border border-white/10 shrink-0">
            <HellSymbol size="sm" animate={false} isClock={false} />
          </div>
        </div>

        <p className="text-xs text-white/50 leading-relaxed mt-3">
          {SHOP_CONFIG.claim}. Handverlesen, purifiziert und unter Lichtausschluss vakuumversiegelt.
        </p>

        {/* Specifications Matrix */}
        <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-white/10">
          <div className="bg-black/50 p-3 rounded-xl border border-white/5">
            <p className="text-[9px] uppercase tracking-widest text-white/40">Gewicht</p>
            <p className="text-sm font-medium text-white mt-0.5">{SHOP_CONFIG.productWeightGrams} g</p>
          </div>
          <div className="bg-black/50 p-3 rounded-xl border border-white/5">
            <p className="text-[9px] uppercase tracking-widest text-white/40">Einzelpreis</p>
            <p className="text-sm font-medium text-white mt-0.5">{formatPrice(unitPrice)}</p>
          </div>
        </div>
      </div>

      {/* Quantity & Order Configuration Box */}
      <div className="rounded-3xl bg-[#0c0c0e] border border-white/10 p-5 space-y-4 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-widest font-medium text-white">
            Menge wählen
          </span>
          <span className="text-[10px] text-white/40 font-mono">
            {formatWeight(totalWeightGrams)} Gesamt
          </span>
        </div>

        {/* Quantity Stepper */}
        <div className="flex items-center justify-between bg-black rounded-2xl p-2 border border-white/10">
          <button
            id="order-qty-minus"
            onClick={handleDecrease}
            disabled={quantity <= 1}
            className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all ${
              quantity <= 1
                ? 'opacity-20 cursor-not-allowed text-white'
                : 'bg-white/5 hover:bg-white/10 text-white active:scale-90'
            }`}
            aria-label="Menge verringern"
          >
            <Minus className="w-4 h-4" />
          </button>

          <div className="flex flex-col items-center select-none">
            <span className="text-2xl font-light text-white tracking-wider font-mono">
              {quantity}
            </span>
            <span className="text-[9px] uppercase tracking-widest text-white/40">
              {quantity === 1 ? 'Packung' : 'Packungen'}
            </span>
          </div>

          <button
            id="order-qty-plus"
            onClick={handleIncrease}
            className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white active:scale-90 transition-all"
            aria-label="Menge erhöhen"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Live Calculation Summary */}
        <div className="space-y-2 pt-2 text-xs">
          <div className="flex justify-between text-white/60">
            <span>Zwischensumme ({quantity} × {formatPrice(unitPrice)})</span>
            <span className="font-mono text-white">{formatPrice(subtotal)}</span>
          </div>

          <div className="flex justify-between text-white/60">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3 h-3 text-[#FF3B30]" />
              <span>Versand (Staffel)</span>
            </span>
            <span className="font-mono text-white">{formatPrice(shippingCost)}</span>
          </div>

          <div className="flex justify-between text-sm font-semibold text-white pt-2 border-t border-white/10">
            <span className="uppercase tracking-widest text-[11px]">Gesamtsumme</span>
            <span className="font-mono text-base text-[#FF3B30]">{formatPrice(totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5">
        {/* Primary White Button: Add to Cart */}
        <button
          id="order-add-to-cart-btn"
          onClick={handleAdd}
          className={`w-full h-14 font-bold text-[12px] uppercase tracking-widest rounded-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl ${
            justAdded
              ? 'bg-emerald-500 text-black'
              : 'bg-white text-black hover:bg-neutral-200'
          }`}
        >
          {justAdded ? (
            <>
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Dem Warenkorb hinzugefügt</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>In den Warenkorb ({formatPrice(subtotal)})</span>
            </>
          )}
        </button>

        {/* Secondary Action: Direct Checkout */}
        <button
          id="order-direct-checkout-btn"
          onClick={handleDirectCheckout}
          className="w-full h-13 py-3.5 rounded-2xl bg-white/5 border border-white/15 text-white hover:bg-white/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-[11px] uppercase tracking-widest font-semibold"
        >
          <span>Direkt zur Kasse</span>
          <ArrowRight className="w-4 h-4 text-[#FF3B30]" />
        </button>

        {/* Quick Link to Cart if cart has items */}
        {cartCount > 0 && (
          <button
            onClick={onGoToCart}
            className="w-full text-center py-1 text-[11px] text-white/50 hover:text-white transition flex items-center justify-center gap-1.5"
          >
            <span>Warenkorb enthält {cartCount} Artikel</span>
            <span className="text-[#FF3B30] underline font-medium">Ansehen</span>
          </button>
        )}
      </div>

      {/* Trust & Privacy Badges */}
      <div className="pt-2 border-t border-white/5 grid grid-cols-2 gap-3 text-[10px] text-white/40">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#FF3B30] shrink-0" />
          <span>Kein Benutzerkonto nötig</span>
        </div>
        <div className="flex items-center gap-2">
          <PackageCheck className="w-3.5 h-3.5 text-white/60 shrink-0" />
          <span>Diskreter Neutralversand</span>
        </div>
      </div>
    </div>
  );
};

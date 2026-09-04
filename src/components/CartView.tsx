import React from 'react';
import { Minus, Plus, Trash2, ArrowRight, Shield, ShoppingBag } from 'lucide-react';
import { HellSymbol } from './HellSymbol';
import { SHOP_CONFIG, calculateShipping, formatPrice, formatWeight } from '../config/shop';

interface CartViewProps {
  quantity: number;
  onUpdateQuantity: (quantity: number) => void;
  onProceedToCheckout: () => void;
  onGoToStart: () => void;
}

export const CartView: React.FC<CartViewProps> = ({
  quantity,
  onUpdateQuantity,
  onProceedToCheckout,
  onGoToStart,
}) => {
  const unitPrice = SHOP_CONFIG.productPrice;
  const subtotal = quantity * unitPrice;
  const shippingCost = calculateShipping(quantity);
  const totalAmount = subtotal + shippingCost;
  const totalWeightGrams = quantity * SHOP_CONFIG.productWeightGrams;

  if (quantity <= 0) {
    return (
      <div
        id="empty-cart-view"
        className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] px-6 max-w-[390px] mx-auto text-center"
      >
        <div className="w-16 h-16 rounded-full border border-white/10 bg-white/[0.02] flex items-center justify-center text-white/40 mb-4">
          <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
        </div>
        <h2 className="text-xl font-light tracking-wide text-white uppercase mb-2">Dein Warenkorb ist leer</h2>
        <p className="text-xs text-white/40 max-w-xs mb-8 leading-relaxed">
          Wähle die gewünschte Menge von HELL auf der Bestellseite aus.
        </p>
        <button
          id="cart-to-order-btn"
          onClick={onGoToStart}
          className="h-12 px-8 rounded-2xl bg-white text-black font-bold text-[12px] uppercase tracking-widest hover:bg-neutral-200 transition-all active:scale-95 shadow-lg"
        >
          Zur Bestellung
        </button>
      </div>
    );
  }

  return (
    <div id="cart-view" className="max-w-[390px] mx-auto px-6 py-5 pb-24 space-y-5">
      {/* View Title */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div>
          <h1 className="text-xl font-light tracking-[0.2em] text-white uppercase">Warenkorb</h1>
          <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">
            {quantity} {quantity === 1 ? 'ARTIKEL' : 'ARTIKEL'}
          </p>
        </div>
        <button
          onClick={() => onUpdateQuantity(0)}
          className="p-2 text-white/40 hover:text-[#FF3B30] transition"
          title="Warenkorb leeren"
          aria-label="Warenkorb leeren"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Product Item Card */}
      <div
        id="cart-item-card"
        className="rounded-2xl bg-[#111] border border-white/5 p-5 shadow-lg space-y-4"
      >
        <div className="flex items-center gap-4">
          <div className="p-1.5 rounded-full border border-white/10 bg-black shrink-0">
            <HellSymbol size="sm" animate={false} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-light tracking-[0.1em] text-white uppercase">
                {SHOP_CONFIG.productName}
              </h2>
              <span className="text-sm font-medium text-white">
                {formatPrice(subtotal)}
              </span>
            </div>

            <div className="text-[11px] text-white/40 space-y-0.5 mt-1">
              <p>Gewicht: {SHOP_CONFIG.productWeightGrams} g pro Stück</p>
              <p>Einzelpreis: {formatPrice(unitPrice)}</p>
            </div>
          </div>
        </div>

        {/* Quantity Controls inside Cart */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <div className="text-[11px] text-white/50">
            Gesamtgewicht: <span className="text-white font-medium">{formatWeight(totalWeightGrams)}</span>
          </div>

          <div className="flex items-center gap-2 bg-black border border-white/10 rounded-xl p-1">
            <button
              onClick={() => onUpdateQuantity(quantity - 1)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 transition active:scale-90"
              aria-label="Menge verringern"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-6 text-center text-sm font-medium text-white">
              {quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(quantity + 1)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 transition active:scale-90"
              aria-label="Menge erhöhen"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="rounded-2xl bg-[#111] border border-white/5 p-5 space-y-3 text-xs shadow-md">
        <div className="flex items-center justify-between text-white/60">
          <span>{SHOP_CONFIG.productName} × {quantity}</span>
          <span className="text-white font-medium">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex items-center justify-between text-white/60">
          <div className="flex flex-col">
            <span>Versandkosten</span>
            <span className="text-[9px] uppercase tracking-wider text-white/30">
              Staffelung nach Stückzahl
            </span>
          </div>
          <span className="text-white font-medium">{formatPrice(shippingCost)}</span>
        </div>

        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-sm font-semibold text-white">
          <span className="uppercase tracking-widest text-[11px]">Gesamtbetrag</span>
          <span className="text-white text-base">{formatPrice(totalAmount)}</span>
        </div>
      </div>

      {/* Discreet Privacy Note */}
      <div className="flex items-center gap-2 text-[11px] text-white/40 px-1">
        <Shield className="w-3.5 h-3.5 shrink-0 text-[#FF3B30]" />
        <span>Keine Registrierung. Ausschließlich lokale Speicherung.</span>
      </div>

      {/* Action Button */}
      <button
        id="proceed-to-checkout-btn"
        onClick={onProceedToCheckout}
        className="w-full h-14 rounded-2xl bg-white text-black font-bold text-[13px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:bg-neutral-200 active:scale-[0.98] shadow-xl"
      >
        <span>Zur Bestellung</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

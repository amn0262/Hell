import React, { useState } from 'react';
import { Minus, Plus, ShoppingBag, Check } from 'lucide-react';
import { HellSymbol } from './HellSymbol';
import { SHOP_CONFIG, formatPrice } from '../config/shop';

interface StartViewProps {
  onAddToCart: (quantity: number) => void;
  onGoToCart: () => void;
  cartCount: number;
}

export const StartView: React.FC<StartViewProps> = ({ onAddToCart, onGoToCart, cartCount }) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [justAdded, setJustAdded] = useState(false);

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
    }, 1800);
  };

  return (
    <div
      id="start-view"
      className="flex flex-col items-center justify-between min-h-[calc(100vh-140px)] px-6 py-4 max-w-[390px] mx-auto text-center"
    >
      {/* Brand Subtitle / Overhead */}
      <div className="pt-2 select-none">
        <h1 className="text-[18px] tracking-[0.4em] font-light text-white ml-[0.4em]">
          {SHOP_CONFIG.shopName}
        </h1>
        <p className="text-[9px] uppercase tracking-[0.2em] opacity-40 mt-1">
          {SHOP_CONFIG.claim}
        </p>
      </div>

      {/* Center Geometric Balance Graphic & Product Title */}
      <div className="my-auto flex flex-col items-center justify-center py-4 w-full select-none">
        <div
          className="relative group cursor-pointer active:scale-95 transition-transform"
          onClick={handleIncrease}
          title="Menge erhöhen"
        >
          <HellSymbol size="hero" animate={false} />
        </div>

        {/* Product Details Header */}
        <div className="mt-8 text-center w-full">
          <h2 className="text-[42px] font-light tracking-[0.1em] text-white leading-none mb-1">
            {SHOP_CONFIG.productName}
          </h2>

          {/* Geometric Specification Balance Bar */}
          <div className="flex justify-between items-center w-full px-4 border-t border-b border-white/10 py-4 mt-6">
            <div className="text-left">
              <p className="text-[10px] uppercase tracking-widest opacity-40">Gewicht</p>
              <p className="text-[14px] font-medium text-white">{SHOP_CONFIG.productWeightGrams} g</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest opacity-40">Preis</p>
              <p className="text-[14px] font-medium text-white">{formatPrice(SHOP_CONFIG.productPrice)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="w-full space-y-3 pb-2">
        {/* Quantity Controls Container */}
        <div className="flex items-center justify-between w-full bg-[#111] rounded-2xl p-2 border border-white/5">
          <button
            id="qty-minus-btn"
            onClick={handleDecrease}
            disabled={quantity <= 1}
            className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all ${
              quantity <= 1
                ? 'opacity-20 cursor-not-allowed bg-transparent'
                : 'bg-white/5 hover:bg-white/10 active:scale-95 text-white opacity-80'
            }`}
            aria-label="Menge verringern"
          >
            <Minus className="w-4 h-4" />
          </button>

          <span
            id="qty-display"
            className="text-lg font-medium w-8 text-center text-white select-none"
          >
            {quantity}
          </span>

          <button
            id="qty-plus-btn"
            onClick={handleIncrease}
            className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 transition-all text-white opacity-80"
            aria-label="Menge erhöhen"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Primary Action Button (White High-Contrast) */}
        <button
          id="add-to-cart-btn"
          onClick={handleAdd}
          className={`w-full h-14 font-bold text-[13px] uppercase tracking-widest rounded-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl ${
            justAdded
              ? 'bg-emerald-500 text-black hover:bg-emerald-400'
              : 'bg-white text-black hover:bg-neutral-200'
          }`}
        >
          {justAdded ? (
            <>
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Hinzugefügt</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4 stroke-[2]" />
              <span>In den Warenkorb</span>
            </>
          )}
        </button>

        {/* Quick Cart Shortcut if items in cart */}
        {cartCount > 0 && (
          <button
            id="quick-cart-link"
            onClick={onGoToCart}
            className="text-[10px] uppercase tracking-widest text-white/50 hover:text-white flex items-center justify-center gap-2 py-1 transition mx-auto"
          >
            <span>Warenkorb: {cartCount} Stück ({formatPrice(cartCount * SHOP_CONFIG.productPrice)})</span>
            <span className="text-[#FF3B30] font-semibold underline">Öffnen</span>
          </button>
        )}
      </div>
    </div>
  );
};

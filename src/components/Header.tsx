import React from 'react';
import { ShoppingBag, ShieldCheck, Send } from 'lucide-react';
import { ActiveTab } from '../types';
import { PWAInstallPrompt } from './OfflineIndicator';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  cartCount: number;
  onOpenPrivacy: () => void;
  telegramConfigured: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  onOpenPrivacy,
  telegramConfigured,
}) => {
  return (
    <header
      id="app-header"
      className="sticky top-0 z-30 w-full bg-black/60 backdrop-blur-md border-b border-white/5 px-5 py-3 select-none"
    >
      <div className="max-w-[390px] mx-auto flex items-center justify-between">
        {/* Brand Name & Tagline */}
        <button
          onClick={() => setActiveTab('start')}
          className="flex items-center gap-2 group text-left"
        >
          <div className="w-2 h-2 rounded-full border border-white/40 flex items-center justify-center">
            <div className="w-1 h-1 bg-[#FF3B30] rounded-full shadow-[0_0_5px_#FF3B30]" />
          </div>
          <div>
            <span className="text-[15px] font-light tracking-[0.35em] text-white ml-[0.35em] block group-hover:text-white/80 transition-colors">
              NØX
            </span>
            <span className="text-[8px] tracking-[0.25em] uppercase text-white/40 font-mono block -mt-0.5 ml-[0.25em]">
              HELL
            </span>
          </div>
        </button>

        {/* Right Actions with Circular Minimalist Aesthetic */}
        <div className="flex items-center gap-1.5">
          <PWAInstallPrompt />

          {/* Privacy info button */}
          <button
            onClick={onOpenPrivacy}
            className="w-8 h-8 rounded-full border border-white/10 hover:border-white/30 flex items-center justify-center text-white/50 hover:text-white transition active:scale-95"
            title="Datenschutz & Einführung anzeigen"
            aria-label="Datenschutz"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
          </button>

          {/* Telegram Status indicator */}
          <div
            className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/50 relative"
            title={
              telegramConfigured
                ? 'Telegram-Verbindung aktiv'
                : 'Telegram-Modus: Simulation (Lokale Abwicklung)'
            }
          >
            <Send className="w-3 h-3" />
            <span
              className={`absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full ${
                telegramConfigured ? 'bg-emerald-400 shadow-[0_0_5px_#34d399]' : 'bg-[#FF3B30]/80 shadow-[0_0_4px_#FF3B30]'
              }`}
            />
          </div>

          {/* Cart quick button */}
          <button
            id="header-cart-btn"
            onClick={() => setActiveTab('cart')}
            className={`relative w-8 h-8 rounded-full border flex items-center justify-center transition active:scale-95 ${
              activeTab === 'cart'
                ? 'border-white/40 bg-white/10 text-white'
                : 'border-white/10 text-white/50 hover:text-white hover:border-white/30'
            }`}
            aria-label="Warenkorb"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[14px] h-3.5 px-0.5 rounded-full bg-[#FF3B30] text-[8px] font-bold text-white flex items-center justify-center shadow-[0_0_6px_#FF3B30]">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

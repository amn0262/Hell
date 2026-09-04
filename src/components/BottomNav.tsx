import React from 'react';
import { Compass, ShoppingBag, MapPin, Clock, Package } from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  cartCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, cartCount }) => {
  const items = [
    { id: 'start' as ActiveTab, label: 'Start', icon: Compass },
    { id: 'order' as ActiveTab, label: 'Bestellen', icon: Package },
    { id: 'cart' as ActiveTab, label: 'Korb', icon: ShoppingBag, badge: cartCount },
    { id: 'addresses' as ActiveTab, label: 'Adressen', icon: MapPin },
    { id: 'orders' as ActiveTab, label: 'Historie', icon: Clock },
  ];

  return (
    <nav
      id="bottom-navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-black/60 backdrop-blur-md border-t border-white/5 pb-[env(safe-area-inset-bottom)] select-none"
    >
      <div className="max-w-[390px] mx-auto px-4">
        <div className="h-16 flex items-center justify-around">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive =
              activeTab === item.id ||
              (item.id === 'cart' && activeTab === 'checkout') ||
              (item.id === 'orders' && activeTab === 'confirmation');

            return (
              <button
                key={item.id}
                id={`nav-btn-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center gap-1 transition-all relative ${
                  isActive ? 'opacity-100 text-white' : 'opacity-35 hover:opacity-75 text-white'
                } active:scale-95`}
              >
                {/* Active Balance Indicator Dot or Icon */}
                <div className="relative flex flex-col items-center">
                  {isActive && (
                    <div className="w-1.5 h-1.5 bg-[#FF3B30] rounded-full mb-1 shadow-[0_0_8px_#FF3B30]" />
                  )}
                  {!isActive && (
                    <div className="w-1.5 h-1.5 mb-1" />
                  )}
                  
                  <div className="relative">
                    <Icon className="w-4 h-4 stroke-[1.75]" />
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="absolute -top-1.5 -right-2 w-3.5 h-3.5 bg-[#FF3B30] rounded-full text-[8px] font-bold text-white flex items-center justify-center shadow-[0_0_6px_#FF3B30]">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </div>

                <span className={`text-[10px] uppercase tracking-widest ${isActive ? 'font-semibold text-white' : 'font-normal'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Minimalist Phone Home Indicator Pill */}
        <div className="w-28 h-0.5 bg-white/20 mx-auto rounded-full mb-1.5" />
      </div>
    </nav>
  );
};

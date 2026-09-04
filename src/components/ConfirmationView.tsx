import React, { useState } from 'react';
import { CheckCircle2, Copy, Check, Clock, ShieldCheck } from 'lucide-react';
import { Order } from '../types';
import { formatPrice } from '../config/shop';

interface ConfirmationViewProps {
  order: Order;
  onGoToOrders: () => void;
  onGoToStart: () => void;
}

export const ConfirmationView: React.FC<ConfirmationViewProps> = ({
  order,
  onGoToOrders,
  onGoToStart,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyOrderNumber = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(order.orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      id="confirmation-view"
      className="max-w-[390px] mx-auto px-6 py-6 pb-24 space-y-5 text-center animate-in fade-in duration-300"
    >
      {/* Success Icon in Geometric Balance Style */}
      <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-white/20" />
        <div className="absolute inset-2 rounded-full border border-white/10" />
        <div className="w-10 h-10 rounded-full bg-emerald-950/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      </div>

      {/* Main Headlines */}
      <div className="space-y-1">
        <span className="text-[10px] uppercase tracking-[0.3em] text-emerald-400 font-semibold">
          ERFOLGREICH
        </span>
        <h1 className="text-2xl font-light tracking-[0.1em] text-white uppercase">
          Bestellung übermittelt
        </h1>
        <p className="text-xs text-white/50">
          Deine Bestellung wurde erfolgreich übermittelt.
        </p>
      </div>

      {/* Order Summary Box */}
      <div className="rounded-2xl bg-[#111] border border-white/5 p-5 space-y-3.5 text-left shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <span className="text-[9px] text-white/40 uppercase tracking-widest block">
              Bestellnummer
            </span>
            <span className="text-sm font-medium font-mono text-white tracking-wider">
              {order.orderNumber}
            </span>
          </div>
          <button
            onClick={handleCopyOrderNumber}
            className="w-8 h-8 rounded-full border border-white/10 bg-white/5 text-white/50 hover:text-white transition flex items-center justify-center active:scale-95"
            title="Bestellnummer kopieren"
            aria-label="Bestellnummer kopieren"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-white/50">Gesamtbetrag:</span>
          <span className="text-lg font-medium text-white">
            {formatPrice(order.totalAmount)}
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-white/40">
          <span>Artikel: {order.productName} × {order.quantity}</span>
          <span>Status: Gesendet</span>
        </div>
      </div>

      {/* Payment Instruction */}
      <div className="rounded-2xl bg-black border border-white/5 p-5 text-left space-y-2">
        <div className="flex items-center gap-2 text-[#FF3B30] font-semibold text-[10px] tracking-widest uppercase">
          <Clock className="w-3.5 h-3.5" />
          <span>Zahlungshinweis</span>
        </div>
        <p className="text-xs text-white/90 leading-relaxed font-medium">
          Bitte überweise den Gesamtbetrag auf das bereits bekannte Konto des Verkäufers.
        </p>
        <p className="text-[11px] text-white/40 leading-relaxed">
          Deine Bestellung wird nach Zahlungseingang bearbeitet.
        </p>
      </div>

      {/* Privacy Guarantee Note */}
      <div className="flex items-center justify-center gap-2 text-[11px] text-white/35">
        <ShieldCheck className="w-3.5 h-3.5 text-white/40" />
        <span>Ausschließlich lokal auf deinem Gerät gespeichert</span>
      </div>

      {/* Primary Action Buttons */}
      <div className="space-y-2.5 pt-1">
        <button
          id="confirmation-to-orders-btn"
          onClick={onGoToOrders}
          className="w-full h-14 rounded-2xl bg-white text-black font-bold text-[13px] uppercase tracking-widest hover:bg-neutral-200 transition shadow-xl active:scale-[0.98]"
        >
          Meine Bestellungen
        </button>

        <button
          id="confirmation-to-start-btn"
          onClick={onGoToStart}
          className="w-full h-11 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white font-medium text-xs uppercase tracking-wider transition"
        >
          Zurück zur Startseite
        </button>
      </div>
    </div>
  );
};

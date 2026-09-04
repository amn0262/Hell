import React, { useState } from 'react';
import { ShieldCheck, MapPin, ArrowLeft, Loader2, AlertCircle, Banknote, Check } from 'lucide-react';
import { Address, Order } from '../types';
import { SHOP_CONFIG, calculateShipping, formatPrice, formatWeight, generateOrderNumber } from '../config/shop';
import { saveOrder, setCartQuantity, getNextOrderSequence } from '../services/storage';

interface CheckoutViewProps {
  quantity: number;
  selectedAddress: Address | null;
  onGoToAddresses: () => void;
  onGoBackToCart: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  quantity,
  selectedAddress,
  onGoToAddresses,
  onGoBackToCart,
  onOrderSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isNachnahme, setIsNachnahme] = useState(false);

  const unitPrice = SHOP_CONFIG.productPrice;
  const subtotal = quantity * unitPrice;
  const shippingCost = calculateShipping(quantity);
  const codFee = isNachnahme ? SHOP_CONFIG.nachnahmeFee : 0;
  const totalAmount = subtotal + shippingCost + codFee;
  const totalWeightGrams = quantity * SHOP_CONFIG.productWeightGrams;

  const handleSendOrder = async () => {
    setErrorMessage(null);

    if (!selectedAddress) {
      setErrorMessage('Bitte wähle eine Lieferadresse aus.');
      return;
    }

    if (quantity <= 0) {
      setErrorMessage('Dein Warenkorb ist leer.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Generate unique sequential order number
      const nextSeq = await getNextOrderSequence();
      const orderNumber = generateOrderNumber(nextSeq);

      const orderPayload: Order = {
        orderNumber,
        createdAt: Date.now(),
        productName: SHOP_CONFIG.productName,
        quantity,
        unitPrice,
        unitWeightGrams: SHOP_CONFIG.productWeightGrams,
        totalWeightGrams,
        subtotal,
        shippingCost,
        codFee,
        totalAmount,
        paymentMethod: isNachnahme ? 'Nachnahme' : 'Vorkasse',
        isCashOnDelivery: isNachnahme,
        shippingAddress: selectedAddress,
        status: 'Gesendet',
      };

      // 2. Transmit order via secure server backend
      const res = await fetch('/api/telegram/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const responseData = await res.json();

      if (!res.ok || !responseData.success) {
        throw new Error(responseData.error || 'Server error');
      }

      orderPayload.transmissionMode = responseData.mode || 'simulated';

      // 3. Save locally in IndexedDB
      await saveOrder(orderPayload);

      // 4. Reset cart
      await setCartQuantity(0);

      // 5. Notify parent to display confirmation
      onOrderSuccess(orderPayload);
    } catch (err: unknown) {
      console.error('Order submission failed:', err);
      setErrorMessage('Die Bestellung konnte momentan nicht übermittelt werden. Bitte versuche es erneut.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="checkout-view" className="max-w-[390px] mx-auto px-6 py-5 pb-24 space-y-5">
      {/* Back button and title */}
      <div className="flex items-center gap-3 pb-3 border-b border-white/10">
        <button
          onClick={onGoBackToCart}
          className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition active:scale-95"
          aria-label="Zurück zum Warenkorb"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-light tracking-[0.2em] text-white uppercase">Bestellübersicht</h1>
          <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">KONTROLLE VOR DEM ABSENDEN</p>
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-950/40 border border-red-900/60 flex items-start gap-3 text-red-200 text-xs animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 text-[#FF3B30] shrink-0 mt-0.5" />
          <div className="flex-1">
            <p>{errorMessage}</p>
            {!selectedAddress && (
              <button
                onClick={onGoToAddresses}
                className="mt-2 text-[11px] font-semibold underline text-white hover:text-red-200"
              >
                Zu den Adressen wechseln
              </button>
            )}
          </div>
        </div>
      )}

      {/* Product Summary Card */}
      <div className="rounded-2xl bg-[#111] border border-white/5 p-5 space-y-3.5 shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-widest text-white/40">
            BESTELLUNG
          </span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30] shadow-[0_0_6px_#FF3B30]" />
            <span className="text-[10px] text-white/60 tracking-widest uppercase">NØX</span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-light tracking-[0.1em] text-white uppercase">
              {SHOP_CONFIG.productName}
            </h2>
            <span className="text-xs text-white/60">
              Menge: <strong className="text-white font-medium">{quantity}</strong>
            </span>
          </div>
          <div className="text-[11px] text-white/40 space-y-0.5">
            <p>Einzelpreis: {formatPrice(unitPrice)}</p>
            <p>Gesamtgewicht: {formatWeight(totalWeightGrams)}</p>
          </div>
        </div>

        {/* Cost details */}
        <div className="pt-3 border-t border-white/10 text-xs space-y-2">
          <div className="flex justify-between text-white/50">
            <span>Zwischensumme:</span>
            <span className="text-white font-medium">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-white/50">
            <span>Versandkosten:</span>
            <span className="text-white font-medium">{formatPrice(shippingCost)}</span>
          </div>
          {isNachnahme && (
            <div className="flex justify-between text-[#FF3B30] animate-in fade-in duration-200">
              <span className="flex items-center gap-1.5">
                <Banknote className="w-3.5 h-3.5" />
                <span>Nachnahmegebühr:</span>
              </span>
              <span className="font-medium font-mono">+{formatPrice(SHOP_CONFIG.nachnahmeFee)}</span>
            </div>
          )}
          <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-semibold text-white">
            <span className="uppercase tracking-widest text-[11px]">Gesamt:</span>
            <span className="text-white text-base font-mono">{formatPrice(totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* Delivery Address Card */}
      <div className="rounded-2xl bg-[#111] border border-white/5 p-5 space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-widest text-white/40">
            LIEFERADRESSE
          </span>
          <button
            onClick={onGoToAddresses}
            className="text-[10px] uppercase tracking-widest text-[#FF3B30] hover:text-white font-medium underline transition"
          >
            {selectedAddress ? 'Ändern' : 'Auswählen'}
          </button>
        </div>

        {selectedAddress ? (
          <div className="text-xs text-white/60 space-y-0.5 text-left">
            <p className="font-medium text-white text-sm">
              {selectedAddress.firstName} {selectedAddress.lastName}
            </p>
            <p>{selectedAddress.street} {selectedAddress.houseNumber}</p>
            <p>{selectedAddress.postalCode} {selectedAddress.city}</p>
            <p className="text-white/40">{selectedAddress.country}</p>
            <p className="text-[11px] text-white/30 pt-1">
              Telefon: {selectedAddress.phone ? selectedAddress.phone : 'Nicht angegeben'}
            </p>
          </div>
        ) : (
          <div
            onClick={onGoToAddresses}
            className="p-4 rounded-xl border border-dashed border-white/15 bg-black/40 text-center cursor-pointer hover:border-white/30 transition"
          >
            <MapPin className="w-4 h-4 text-[#FF3B30] mx-auto mb-1.5" />
            <p className="text-xs font-medium text-white">Keine Lieferadresse ausgewählt</p>
            <p className="text-[10px] text-white/40 mt-0.5">Tippe hier, um eine Adresse zu wählen</p>
          </div>
        )}
      </div>

      {/* Cash on Delivery / Nachnahme Toggle Button */}
      <div className="rounded-2xl bg-[#111] border border-white/5 p-4 space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-widest text-white/40">
            ZAHLUNGSOPTION
          </span>
          <span className="text-[10px] uppercase tracking-wider text-[#FF3B30] font-mono">
            {isNachnahme ? 'NACHNAHME AKTIV' : 'VORKASSE'}
          </span>
        </div>

        <button
          type="button"
          id="toggle-nachnahme-option-btn"
          onClick={() => setIsNachnahme((prev) => !prev)}
          className={`w-full p-3.5 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-3.5 text-left ${
            isNachnahme
              ? 'bg-white/[0.07] border-[#FF3B30] shadow-[0_0_20px_rgba(255,59,48,0.2)] ring-1 ring-[#FF3B30]'
              : 'bg-black/60 border-white/10 hover:border-white/25 hover:bg-black/80'
          }`}
          aria-pressed={isNachnahme}
        >
          {/* Custom Check / Indicator Box */}
          <div
            className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-all ${
              isNachnahme
                ? 'bg-[#FF3B30] text-white shadow-[0_0_10px_#FF3B30]'
                : 'border border-white/30 bg-white/5'
            }`}
          >
            {isNachnahme && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </div>

          <div className="flex-1">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-xs font-medium text-white tracking-wide">
                Per Nachnahme versenden
              </span>
              <span className="text-xs font-mono font-bold text-[#FF3B30] whitespace-nowrap">
                + 9,00 €
              </span>
            </div>
            <p className="text-[11px] text-white/50 mt-1 leading-relaxed">
              {isNachnahme
                ? 'Zahlung erfolgt bei Erhalt der Ware direkt in bar an den Zusteller (+9,00 € Nachnahmegebühr).'
                : 'Hier tippen, um per Nachnahme zu zahlen (Barzahlung bei Lieferung / +9,00 €).'}
            </p>
          </div>
        </button>
      </div>

      {/* Privacy Notice */}
      <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-black border border-white/5 text-[11px] text-white/40 text-left">
        <ShieldCheck className="w-4 h-4 text-[#FF3B30] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Deine Daten bleiben lokal auf deinem Gerät und werden ausschließlich für die Abwicklung deiner Bestellung verwendet.
        </p>
      </div>

      {/* Submit Order Buttons */}
      <div className="space-y-2 pt-1">
        <button
          id="submit-order-binding-btn"
          disabled={isSubmitting || !selectedAddress}
          onClick={handleSendOrder}
          className={`w-full h-14 rounded-2xl font-bold text-[13px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl ${
            isSubmitting || !selectedAddress
              ? 'bg-white/10 text-white/30 cursor-not-allowed'
              : 'bg-white text-black hover:bg-neutral-200 active:scale-[0.98]'
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Übermittlung läuft …</span>
            </>
          ) : (
            <span>
              {isNachnahme
                ? 'Bestellung per Nachnahme senden'
                : 'Bestellung verbindlich senden'}
            </span>
          )}
        </button>

        <p className="text-[10px] uppercase tracking-wider text-center text-white/30">
          Verschlüsselte Übermittlung an den Verkäufer
        </p>
      </div>
    </div>
  );
};

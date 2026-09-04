import React, { useState } from 'react';
import { ShieldCheck, Package, ChevronRight, X } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { formatPrice, formatWeight } from '../config/shop';

interface OrdersViewProps {
  orders: Order[];
  onUpdateStatus: (orderNumber: string, status: OrderStatus) => void;
  onGoToStart: () => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  onUpdateStatus,
  onGoToStart,
}) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Bezahlt':
        return (
          <span className="text-[9px] uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 font-medium">
            Bezahlt
          </span>
        );
      case 'Offen':
        return (
          <span className="text-[9px] uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-950/40 text-amber-400 border border-amber-500/30 font-medium">
            Offen
          </span>
        );
      case 'Gesendet':
      default:
        return (
          <span className="text-[9px] uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/5 text-white/70 border border-white/20 font-medium">
            Gesendet
          </span>
        );
    }
  };

  return (
    <div id="orders-view" className="max-w-[390px] mx-auto px-6 py-5 pb-24 space-y-5">
      {/* Header */}
      <div className="pb-3 border-b border-white/10">
        <h1 className="text-xl font-light tracking-[0.2em] text-white uppercase">Bestellungen</h1>
        <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">
          {orders.length} {orders.length === 1 ? 'BESTELLUNG VORHANDEN' : 'BESTELLUNGEN VORHANDEN'}
        </p>
      </div>

      {/* Mandatory Privacy Note */}
      <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-black border border-white/5 text-[11px] text-white/40">
        <ShieldCheck className="w-4 h-4 text-[#FF3B30] shrink-0" />
        <span>Deine Bestellungen werden ausschließlich auf diesem Gerät gespeichert.</span>
      </div>

      {/* Order List */}
      {orders.length === 0 ? (
        <div className="rounded-2xl bg-[#111] border border-dashed border-white/10 p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full border border-white/10 bg-white/[0.02] mx-auto flex items-center justify-center text-white/40">
            <Package className="w-5 h-5 stroke-[1.5]" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-white">Bisher keine Bestellungen</p>
            <p className="text-xs text-white/40 leading-relaxed">
              Sobald du eine Bestellung aufgibst, erscheint sie in dieser Übersicht.
            </p>
          </div>
          <button
            onClick={onGoToStart}
            className="h-11 px-6 rounded-xl bg-white text-black font-bold text-[11px] uppercase tracking-widest transition hover:bg-neutral-200 active:scale-95"
          >
            Jetzt bestellen
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const formattedDate = new Date(order.createdAt).toLocaleDateString('de-DE', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            });

            return (
              <div
                key={order.orderNumber}
                id={`order-card-${order.orderNumber}`}
                onClick={() => setSelectedOrder(order)}
                className="rounded-2xl bg-[#111] border border-white/5 hover:border-white/20 p-4 transition-all cursor-pointer shadow-md space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-medium text-white tracking-wider">
                    {order.orderNumber}
                  </span>
                  {getStatusBadge(order.status)}
                </div>

                <div className="flex items-center justify-between text-xs text-white/50">
                  <span>{formattedDate}</span>
                  <div className="flex items-center gap-1.5">
                    {(order.isCashOnDelivery || order.paymentMethod === 'Nachnahme') && (
                      <span className="text-[9px] uppercase tracking-wider text-[#FF3B30] bg-[#FF3B30]/10 px-1.5 py-0.5 rounded font-mono">
                        Nachnahme
                      </span>
                    )}
                    <span className="text-white/80">
                      {order.productName} × {order.quantity} Stück
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <div className="text-[11px] text-white/40 truncate max-w-[180px]">
                    {order.shippingAddress.city}, {order.shippingAddress.street}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-white text-sm">
                      {formatPrice(order.totalAmount)}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-white/30" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
          <div
            id="order-details-modal"
            className="w-full max-w-[390px] rounded-3xl bg-[#0e0e12] border border-white/10 p-6 shadow-2xl relative my-8 space-y-4"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-[9px] uppercase tracking-widest text-white/40 block">
                  BESTELLDETAILS
                </span>
                <h2 className="text-sm font-medium font-mono text-white tracking-wider">
                  {selectedOrder.orderNumber}
                </h2>
                <span className="text-[11px] text-white/40">
                  {new Date(selectedOrder.createdAt).toLocaleDateString('de-DE', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })} Uhr
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-white/40 hover:text-white rounded-lg transition"
                aria-label="Schließen"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Status Control */}
            <div className="flex items-center justify-between bg-black p-3 rounded-2xl border border-white/5">
              <span className="text-xs text-white/50">Status:</span>
              <div className="flex items-center gap-1">
                {(['Gesendet', 'Offen', 'Bezahlt'] as OrderStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      onUpdateStatus(selectedOrder.orderNumber, st);
                      setSelectedOrder({ ...selectedOrder, status: st });
                    }}
                    className={`text-[9px] uppercase tracking-wider px-2 py-1 rounded-lg transition ${
                      selectedOrder.status === st
                        ? 'bg-white text-black font-bold'
                        : 'bg-white/5 text-white/40 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Product & Pricing Breakdown */}
            <div className="space-y-1.5 text-xs bg-black p-4 rounded-2xl border border-white/5">
              <div className="flex justify-between text-white/80">
                <span>Produkt:</span>
                <span className="font-medium text-white">{selectedOrder.productName}</span>
              </div>
              <div className="flex justify-between text-white/50">
                <span>Menge:</span>
                <span>{selectedOrder.quantity} Stück ({formatWeight(selectedOrder.totalWeightGrams)})</span>
              </div>
              <div className="flex justify-between text-white/50">
                <span>Einzelpreis:</span>
                <span>{formatPrice(selectedOrder.unitPrice)}</span>
              </div>
              <div className="flex justify-between text-white/50">
                <span>Zwischensumme:</span>
                <span>{formatPrice(selectedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-white/50">
                <span>Versandkosten:</span>
                <span>{formatPrice(selectedOrder.shippingCost)}</span>
              </div>
              {(selectedOrder.isCashOnDelivery || selectedOrder.paymentMethod === 'Nachnahme' || selectedOrder.codFee) && (
                <div className="flex justify-between text-[#FF3B30]">
                  <span>Nachnahmegebühr:</span>
                  <span className="font-mono">+{formatPrice(selectedOrder.codFee || 9.0)}</span>
                </div>
              )}
              <div className="flex justify-between text-white/50">
                <span>Zahlungsart:</span>
                <span className="text-white">
                  {selectedOrder.isCashOnDelivery || selectedOrder.paymentMethod === 'Nachnahme'
                    ? 'Nachnahme (Barzahlung bei Zustellung)'
                    : 'Vorkasse / Überweisung'}
                </span>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-semibold text-white">
                <span className="uppercase tracking-widest text-[11px]">Gesamtbetrag:</span>
                <span className="font-mono text-base">{formatPrice(selectedOrder.totalAmount)}</span>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="space-y-1 text-xs text-white/60 bg-black p-4 rounded-2xl border border-white/5 text-left">
              <span className="text-[9px] uppercase tracking-widest text-white/40 block mb-1">
                Lieferadresse
              </span>
              <p className="font-medium text-white">
                {selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}
              </p>
              <p>{selectedOrder.shippingAddress.street} {selectedOrder.shippingAddress.houseNumber}</p>
              <p>{selectedOrder.shippingAddress.postalCode} {selectedOrder.shippingAddress.city}</p>
              <p className="text-white/40">{selectedOrder.shippingAddress.country}</p>
              {selectedOrder.shippingAddress.phone && (
                <p className="text-white/40 mt-1">
                  Tel: {selectedOrder.shippingAddress.phone}
                </p>
              )}
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full h-11 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold uppercase tracking-wider transition"
            >
              Schließen
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

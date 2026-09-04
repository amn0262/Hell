import React from 'react';
import { ShieldCheck, X, HardDrive, Lock, RefreshCw, Send } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestartOnboarding: () => void;
  telegramConfigured: boolean;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({
  isOpen,
  onClose,
  onRestartOnboarding,
  telegramConfigured,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="privacy-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto"
    >
      <div
        id="privacy-modal-card"
        className="w-full max-w-[390px] rounded-3xl bg-[#0e0e12] border border-white/10 p-6 shadow-2xl relative my-8 space-y-5 text-left"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#FF3B30] shadow-[0_0_6px_#FF3B30]" />
            <h2 className="text-sm font-light tracking-[0.2em] text-white uppercase">
              Datenschutz & Diskretion
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/40 hover:text-white rounded-lg transition"
            aria-label="Schließen"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Primary Privacy Statement */}
        <div className="p-4 rounded-2xl bg-black border border-white/5 space-y-2">
          <span className="text-[9px] uppercase tracking-widest text-[#FF3B30] font-semibold block">
            GRUNDSATZ
          </span>
          <p className="text-xs font-medium text-white leading-relaxed">
            Deine Daten bleiben lokal auf deinem Gerät und werden ausschließlich für die Abwicklung deiner Bestellung verwendet.
          </p>
          <p className="text-[11px] text-white/40 leading-relaxed">
            Diese App arbeitet lokal auf deinem Gerät. Deine persönlichen Daten werden geschützt und vertraulich behandelt und ausschließlich für den Versand deiner Bestellung verwendet.
          </p>
        </div>

        {/* Technical Highlights */}
        <div className="space-y-2.5 text-xs text-white/70">
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-black border border-white/5">
            <HardDrive className="w-4 h-4 text-white/40 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-white mb-0.5 text-xs">Lokale Datenspeicherung (IndexedDB)</p>
              <p className="text-[11px] text-white/40 leading-relaxed">
                Gespeicherte Adressen, Warenkorb und Bestellhistorie liegen ausschließlich in der geschützten Datenbank deines Browsers.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-black border border-white/5">
            <Lock className="w-4 h-4 text-white/40 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-white mb-0.5 text-xs">Keine Tracking- oder Werbedienste</p>
              <p className="text-[11px] text-white/40 leading-relaxed">
                Keine Werbe-Pixel, keine Cookies von Drittanbietern und keine Nutzeranalyse.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-black border border-white/5">
            <Send className="w-4 h-4 text-white/40 shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-medium text-white text-xs">Diskrete Telegram-Übermittlung</span>
                <span
                  className={`text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-full ${
                    telegramConfigured
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-white/5 text-white/40 border border-white/10'
                  }`}
                >
                  {telegramConfigured ? 'Aktiv' : 'Simulation'}
                </span>
              </div>
              <p className="text-[11px] text-white/40 leading-relaxed">
                Bei der Bestellung werden lediglich die Auftragsdaten verschlüsselt an den Verkäufer übertragen.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex items-center justify-between gap-3 border-t border-white/10">
          <button
            onClick={() => {
              onClose();
              onRestartOnboarding();
            }}
            className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-white/40 hover:text-white transition py-2"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Einführung</span>
          </button>

          <button
            onClick={onClose}
            className="h-10 px-6 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-widest transition hover:bg-neutral-200 active:scale-95 shadow-md"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};

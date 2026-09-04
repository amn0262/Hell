import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, ChevronRight, ChevronLeft, Package, MapPin, CheckCircle2 } from 'lucide-react';
import { HellSymbol } from './HellSymbol';
import { setOnboardingCompleted } from '../services/storage';

interface OnboardingModalProps {
  onComplete: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete }) => {
  const [step, setStep] = useState<number>(1);

  const handleFinish = async () => {
    await setOnboardingCompleted(true);
    onComplete();
  };

  return (
    <div
      id="onboarding-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-6 select-none"
    >
      <div
        id="onboarding-card"
        className="w-full max-w-[390px] rounded-3xl bg-[#0e0e12] border border-white/10 p-6 sm:p-7 flex flex-col justify-between min-h-[480px] shadow-2xl relative overflow-hidden text-center"
      >
        {/* Subtle crimson accent glow in background */}
        <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 30%, #FF3B30 0%, transparent 60%)' }} />

        {/* Header with Step Dots */}
        <div className="flex items-center justify-between z-10">
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-light">
            NØX // INTRO
          </span>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`h-1 rounded-full transition-all duration-300 ${
                  s === step
                    ? 'w-5 bg-[#FF3B30] shadow-[0_0_6px_#FF3B30]'
                    : s < step
                    ? 'w-1.5 bg-white/40'
                    : 'w-1.5 bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content Slides */}
        <div className="my-auto py-5 z-10">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="text-center flex flex-col items-center"
              >
                <div className="my-4">
                  <HellSymbol size="lg" animate={true} />
                </div>
                <h1 className="text-2xl font-light tracking-[0.2em] text-white mt-2 mb-2 uppercase">
                  HELL
                </h1>
                <p className="text-xs text-white/50 max-w-xs leading-relaxed">
                  Willkommen bei NØX. Ein Produkt. Kompromisslose Reduktion. Reine Diskretion.
                </p>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="text-center flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-full border border-white/10 bg-white/[0.02] flex items-center justify-center text-white/80 my-4">
                  <Package className="w-7 h-7 stroke-[1.5]" />
                </div>
                <h2 className="text-xl font-light tracking-[0.15em] text-white mt-1 mb-2 uppercase">
                  Ein einziges Produkt
                </h2>
                <p className="text-xs text-white/50 max-w-xs leading-relaxed">
                  Keine unübersichtlichen Kataloge. 500 Gramm HELL für 35,00 € zzgl. gestaffelter Versandkosten.
                </p>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="text-center flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-full border border-white/10 bg-white/[0.02] flex items-center justify-center text-white/80 my-4">
                  <MapPin className="w-7 h-7 stroke-[1.5]" />
                </div>
                <h2 className="text-xl font-light tracking-[0.15em] text-white mt-1 mb-2 uppercase">
                  Flexible Adressen
                </h2>
                <p className="text-xs text-white/50 max-w-xs leading-relaxed">
                  Hinterlege mehrere Lieferadressen und wähle im Bestellvorgang mit einem Fingertipp die passende aus.
                </p>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="text-center flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-full border border-emerald-500/30 bg-emerald-950/20 flex items-center justify-center text-emerald-400 my-4">
                  <ShieldCheck className="w-7 h-7 stroke-[1.5]" />
                </div>
                <h2 className="text-xl font-light tracking-[0.15em] text-white mt-1 mb-2 uppercase">
                  Höchste Privatsphäre
                </h2>
                <p className="text-xs text-white/50 max-w-xs leading-relaxed">
                  Deine Daten bleiben lokal auf deinem Gerät und werden ausschließlich für die Abwicklung deiner Bestellung verwendet.
                </p>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="text-center flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-white my-4">
                  <CheckCircle2 className="w-7 h-7 stroke-[1.5]" />
                </div>
                <h2 className="text-xl font-light tracking-[0.15em] text-white mt-1 mb-2 uppercase">
                  Bereit für HELL
                </h2>
                <p className="text-xs text-white/50 max-w-xs leading-relaxed">
                  Tauche ein in das minimalistische Erlebnis. Wähle die Menge und bestelle diskret.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Navigation Controls */}
        <div className="flex items-center justify-between z-10 pt-4 border-t border-white/10">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              className="h-11 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition flex items-center gap-1 text-xs"
              aria-label="Zurück"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Zurück</span>
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition px-2 py-1"
            >
              Überspringen
            </button>
          )}

          {step < 5 ? (
            <button
              onClick={() => setStep((s) => Math.min(5, s + 1))}
              className="h-11 px-5 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-neutral-200 transition active:scale-95 flex items-center gap-1 shadow-md"
            >
              <span>Weiter</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="h-11 px-6 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-neutral-200 transition active:scale-95 shadow-md"
            >
              Starten
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

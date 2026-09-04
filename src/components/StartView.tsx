import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Volume2, VolumeX, Sparkles, ShoppingBag } from 'lucide-react';
import { HellSymbol } from './HellSymbol';
import { SHOP_CONFIG } from '../config/shop';

interface StartViewProps {
  onGoToOrder: () => void;
  onGoToCart: () => void;
  cartCount: number;
}

export const StartView: React.FC<StartViewProps> = ({
  onGoToOrder,
  onGoToCart,
  cartCount,
}) => {
  // Live high-precision digital chronometer
  const [time, setTime] = useState<Date>(() => new Date());
  const [isAudioActive, setIsAudioActive] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);

  // 3D Parallax Tilt state for the clock
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [resonanceWave, setResonanceWave] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 50); // 20 FPS digital milliseconds fidelity
    return () => clearInterval(timer);
  }, []);

  // Ambient sound generator (432Hz deep meditative cosmic chord)
  const toggleAmbientAudio = () => {
    if (isAudioActive) {
      // Stop audio
      if (gainNodeRef.current && audioCtxRef.current) {
        gainNodeRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.5);
        setTimeout(() => {
          oscillatorsRef.current.forEach((osc) => {
            try {
              osc.stop();
              osc.disconnect();
            } catch {
              // ignore if already stopped
            }
          });
          oscillatorsRef.current = [];
          setIsAudioActive(false);
        }, 500);
      } else {
        setIsAudioActive(false);
      }
    } else {
      // Start soothing harmonic ambient drone
      try {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
        masterGain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 1.5);
        masterGain.connect(ctx.destination);
        gainNodeRef.current = masterGain;

        // Sacred harmony frequencies (108Hz, 216Hz, 432Hz with gentle detune)
        const freqs = [108, 216, 324, 432];
        const newOscs: OscillatorNode[] = [];

        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);

          // Subtle slow LFO vibrato
          const lfo = ctx.createOscillator();
          const lfoGain = ctx.createGain();
          lfo.frequency.setValueAtTime(0.2 + idx * 0.05, ctx.currentTime);
          lfoGain.gain.setValueAtTime(1.2, ctx.currentTime);
          lfo.connect(lfoGain);
          lfoGain.connect(osc.frequency);
          lfo.start();

          const toneGain = ctx.createGain();
          toneGain.gain.setValueAtTime(0.25 / freqs.length, ctx.currentTime);
          osc.connect(toneGain);
          toneGain.connect(masterGain);

          osc.start();
          newOscs.push(osc);
        });

        oscillatorsRef.current = newOscs;
        setIsAudioActive(true);
      } catch (err) {
        console.warn('AudioContext failed:', err);
      }
    }
  };

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      oscillatorsRef.current.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // ignore
        }
      });
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // Format Digital Readout
  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  const ms = Math.floor(time.getMilliseconds() / 100).toString();

  // Mouse / Touch tracking for 3D parallax on the dial
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 18, y: -y * 18 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const triggerResonance = () => {
    setResonanceWave(true);
    setTimeout(() => setResonanceWave(false), 800);
  };

  return (
    <div
      id="start-view"
      className="flex flex-col items-center justify-between min-h-[calc(100vh-130px)] px-6 py-5 max-w-[390px] mx-auto text-center relative selection:bg-[#FF3B30]/30 select-none overflow-hidden"
    >
      {/* Subtle Ambient Cosmic Background Rings */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-25">
        <div className="w-[380px] h-[380px] rounded-full border border-white/[0.03] animate-[spin_120s_linear_infinite]" />
        <div className="absolute w-[300px] h-[300px] rounded-full border border-dashed border-white/[0.04] animate-[spin_80s_linear_infinite_reverse]" />
      </div>

      {/* Brand Header & Atmospheric Subtitle */}
      <div className="pt-2 z-10 w-full flex flex-col items-center">
        <div className="flex items-center justify-between w-full px-2">
          <div className="text-left">
            <h1 className="text-[20px] tracking-[0.45em] font-light text-white ml-[0.45em]">
              {SHOP_CONFIG.shopName}
            </h1>
            <p className="text-[8px] uppercase tracking-[0.3em] text-white/40 mt-0.5">
              OBSERVATORIUM // HELL
            </p>
          </div>

          {/* Ambient Soundscape Toggle */}
          <button
            id="ambient-sound-toggle"
            onClick={toggleAmbientAudio}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[9px] uppercase tracking-wider transition-all active:scale-95 ${
              isAudioActive
                ? 'bg-[#FF3B30]/20 border-[#FF3B30] text-white shadow-[0_0_12px_rgba(255,59,48,0.4)]'
                : 'bg-white/5 border-white/10 text-white/40 hover:text-white hover:border-white/30'
            }`}
            title="Kosmische Ambient-Harmonie an/aus"
          >
            {isAudioActive ? (
              <>
                <Volume2 className="w-3 h-3 text-[#FF3B30] animate-pulse" />
                <span className="text-[#FF3B30]">Klang Aktiv</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3 h-3" />
                <span>Atmosphäre</span>
              </>
            )}
          </button>
        </div>

        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent mt-4" />
      </div>

      {/* Central Interactive Astronomical Timepiece */}
      <div
        className="my-auto flex flex-col items-center justify-center py-6 w-full z-10 cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={triggerResonance}
        title="Tippen für Resonanzwelle"
      >
        {/* Parallax Container */}
        <div
          className="relative transition-transform duration-200 ease-out flex items-center justify-center"
          style={{
            transform: `perspective(800px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
          }}
        >
          {/* Pulsing Resonance Shockwave when clicked */}
          {resonanceWave && (
            <div className="absolute inset-0 rounded-full border-2 border-[#FF3B30] animate-ping pointer-events-none" />
          )}

          {/* The Astronomical Timepiece Master Dial */}
          <HellSymbol size="idle" animate={false} isClock={true} />
        </div>

        {/* Live Precision Digital Chronometer */}
        <div className="mt-7 flex flex-col items-center">
          <div className="inline-flex items-baseline gap-1 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md shadow-inner">
            <span className="text-xl font-light tracking-[0.25em] text-white font-mono">
              {hours}:{minutes}:{seconds}
            </span>
            <span className="text-xs font-mono text-[#FF3B30] font-light tracking-widest">
              .{ms}
            </span>
          </div>

          <p className="text-[9px] uppercase tracking-[0.35em] text-white/30 mt-2 font-mono">
            PRÄZISIONS-ZEITMESSER
          </p>
        </div>
      </div>

      {/* Bottom Gateway & Start Button */}
      <div className="w-full space-y-4 pb-4 z-10 flex flex-col items-center">
        {/* Poetic Philosophy Statement */}
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">
            GEOMETRISCHE HARMONIE • ABSOLUTE STILLE
          </p>
          <p className="text-[9px] text-white/30 tracking-widest font-mono">
            AUTHENTISCH • PURIFIZIERT • LIMITIERT
          </p>
        </div>

        {/* The Requested Start Button Under The Clock */}
        <button
          id="start-order-btn"
          onClick={onGoToOrder}
          className="group relative w-full h-15 py-4 rounded-2xl bg-white text-black font-bold text-[12px] uppercase tracking-[0.25em] flex items-center justify-center gap-3 hover:bg-[#FF3B30] hover:text-white transition-all duration-300 active:scale-[0.98] shadow-[0_0_30px_rgba(255,255,255,0.2)] overflow-hidden"
        >
          {/* Subtle button sheen line */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

          <Sparkles className="w-4 h-4 transition-transform group-hover:rotate-45" />
          <span className="font-semibold tracking-[0.25em]">BESTELLUNG STARTEN</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
        </button>

        {/* Quick Cart Shortcut if items in cart */}
        {cartCount > 0 && (
          <button
            onClick={onGoToCart}
            className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition py-1"
          >
            <ShoppingBag className="w-3 h-3 text-[#FF3B30]" />
            <span>Warenkorb ({cartCount} Artikel im Speicher)</span>
          </button>
        )}
      </div>
    </div>
  );
};

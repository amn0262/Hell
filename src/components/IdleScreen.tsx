import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HellSymbol } from './HellSymbol';

interface IdleScreenProps {
  idleTimeoutMs?: number; // default 120,000 ms (2 minutes)
}

export const IdleScreen: React.FC<IdleScreenProps> = ({ idleTimeoutMs = 120000 }) => {
  const [isIdle, setIsIdle] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    // If currently idle, any interaction dismisses it immediately
    setIsIdle(false);

    timerRef.current = setTimeout(() => {
      setIsIdle(true);
    }, idleTimeoutMs);
  }, [idleTimeoutMs]);

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keydown', 'touchstart', 'touchend', 'scroll', 'wheel'];

    const handleUserActivity = () => {
      resetTimer();
    };

    events.forEach((evt) => {
      window.addEventListener(evt, handleUserActivity, { passive: true });
    });

    // Start initial timer
    resetTimer();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((evt) => {
        window.removeEventListener(evt, handleUserActivity);
      });
    };
  }, [resetTimer]);

  const handleDismiss = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    setIsIdle(false);
    resetTimer();
  };

  return (
    <AnimatePresence>
      {isIdle && (
        <motion.div
          id="idle-screen-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          onClick={handleDismiss}
          onTouchStart={handleDismiss}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-2xl cursor-pointer select-none px-6 text-center"
        >
          {/* Ambient red radial gradient */}
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #FF3B30 0%, transparent 70%)' }} />

          <motion.div
            animate={{
              y: [-6, 6, -6],
              scale: [0.99, 1.01, 0.99],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="mb-10"
          >
            <HellSymbol size="idle" animate={true} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="space-y-3 z-10"
          >
            <p className="text-xl sm:text-2xl font-light tracking-[0.25em] text-white uppercase">
              HELL wartet auf dich …
            </p>
            <p className="text-[10px] text-white/40 tracking-[0.3em] uppercase">
              Tippe auf das Display, um fortzufahren
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

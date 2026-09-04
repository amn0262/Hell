import React, { useState, useEffect } from 'react';
import { WifiOff, Download } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div
      id="offline-banner"
      className="fixed top-3 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 rounded-full bg-black/90 border border-white/10 px-4 py-1.5 text-xs text-white/70 shadow-xl backdrop-blur-md"
    >
      <WifiOff className="w-3.5 h-3.5 text-[#FF3B30]" />
      <span>Offline-Modus — Lokaler Speicher aktiv</span>
    </div>
  );
};

export const PWAInstallPrompt: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window.navigator as any).standalone === true;
    setIsInstalled(isStandalone);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handlePrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handlePrompt);
    return () => window.removeEventListener('beforeinstallprompt', handlePrompt);
  }, []);

  if (isInstalled || !deferredPrompt) return null;

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setIsInstalled(true);
      setDeferredPrompt(null);
    }
  };

  return (
    <button
      onClick={handleInstall}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-wider text-white/60 hover:text-white hover:border-white/30 transition"
      title="Als App installieren"
    >
      <Download className="w-3 h-3 text-[#FF3B30]" />
      <span>Installieren</span>
    </button>
  );
};

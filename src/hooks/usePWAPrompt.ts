import { useState, useEffect } from 'react';
import { isIOS, isStandalone } from '@/utils/notification';
import { useLocalStorage } from './useLocalStorage';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function usePWAPrompt() {
  const { data, updateData } = useLocalStorage();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Don't show if already installed or standalone
    if (data?.pwaInstalled || isStandalone()) {
      return;
    }

    // Listen for beforeinstallprompt event (Chrome/Android)
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Show prompt after a delay (not immediately on page load)
      const timer = setTimeout(() => {
        if (!data?.pwaInstalled) {
          setShowPrompt(true);
        }
      }, 5000);

      return () => clearTimeout(timer);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if app was installed
    window.addEventListener('appinstalled', () => {
      updateData({ pwaInstalled: true });
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, [data, updateData]);

  const promptInstall = async () => {
    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      updateData({ pwaInstalled: true });
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const dismissPrompt = () => {
    setShowPrompt(false);
  };

  const shouldShowiOSPrompt = isIOS() && !isStandalone() && !data?.pwaInstalled;
  const shouldShowNativePrompt = showPrompt && deferredPrompt && !data?.pwaInstalled;

  return {
    shouldShowiOSPrompt,
    shouldShowNativePrompt,
    promptInstall,
    dismissPrompt,
  };
}

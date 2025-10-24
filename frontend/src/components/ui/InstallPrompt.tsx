import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import { useState } from 'react';
import { usePWA } from '../../hooks/usePWA';

export const InstallPrompt = () => {
  const { isInstallable, installApp } = usePWA();
  const [dismissed, setDismissed] = useState(false);

  if (!isInstallable || dismissed) return null;

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      setDismissed(true);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50"
      >
        <div className="bg-secondary border-2 border-warning rounded-lg p-4 shadow-2xl">
          <button
            onClick={() => setDismissed(true)}
            className="absolute top-2 right-2 text-secondary hover:text-white transition"
            aria-label="Dismiss install prompt"
          >
            <X size={20} />
          </button>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center flex-shrink-0">
              <Download size={24} className="text-warning" />
            </div>

            <div className="flex-1">
              <h3 className="font-bold text-white mb-1">Install Somnia Screams</h3>
              <p className="text-sm text-secondary mb-3">
                Install the app for a better experience
              </p>

              <button
                onClick={handleInstall}
                className="w-full py-2 bg-warning hover:bg-warning/80 text-black font-bold rounded-lg transition"
              >
                Install Now
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

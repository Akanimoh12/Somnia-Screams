import { motion } from 'framer-motion';
import { WifiOff, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';

export const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

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
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      exit={{ y: -100 }}
      className="fixed top-0 left-0 right-0 bg-error text-white py-3 px-4 text-center z-50 flex items-center justify-center gap-2"
      role="alert"
      aria-live="assertive"
    >
      <WifiOff size={20} />
      <span className="font-bold">You're offline</span>
      <button
        onClick={() => window.location.reload()}
        className="ml-2 px-3 py-1 bg-white/20 hover:bg-white/30 rounded transition flex items-center gap-1"
        aria-label="Retry connection"
      >
        <RefreshCw size={16} />
        Retry
      </button>
    </motion.div>
  );
};

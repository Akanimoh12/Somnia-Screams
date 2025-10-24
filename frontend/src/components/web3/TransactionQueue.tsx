import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react';
import type { Transaction } from '../../types/game';

interface TransactionQueueProps {
  transactions: Transaction[];
  onClear?: () => void;
}

export default function TransactionQueue({ transactions, onClear }: Readonly<TransactionQueueProps>) {
  if (transactions.length === 0) return null;

  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'PENDING':
        return <Loader2 className="w-4 h-4 animate-spin text-warning" />;
      case 'CONFIRMED':
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      case 'FAILED':
        return <XCircle className="w-4 h-4 text-accent-red" />;
    }
  };

  const getPriorityColor = (priority: Transaction['priority']) => {
    switch (priority) {
      case 'CRITICAL':
        return 'border-accent-red/50';
      case 'HIGH':
        return 'border-accent-orange/50';
      case 'MEDIUM':
        return 'border-accent-purple/50';
      case 'LOW':
        return 'border-border-color';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 max-h-96 overflow-y-auto bg-bg-card border-2 border-accent-orange/30 rounded-lg shadow-lg z-50">
      <div className="sticky top-0 bg-bg-card border-b border-border-color px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-accent-orange" />
          <span className="font-bold ui-font text-sm">Transaction Queue</span>
        </div>
        {transactions.length > 0 && (
          <button
            onClick={onClear}
            className="text-xs ui-font text-text-secondary hover:text-accent-orange transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      <div className="p-2 space-y-2">
        <AnimatePresence>
          {transactions.map(tx => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={`bg-bg-secondary border-2 ${getPriorityColor(tx.priority)} rounded-lg p-3`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(tx.status)}
                  <span className="text-sm ui-font font-semibold">
                    {tx.type.replaceAll('_', ' ')}
                  </span>
                </div>
                <span className="text-xs ui-font text-text-secondary">
                  {tx.priority}
                </span>
              </div>
              {tx.hash && (
                <div className="text-xs ui-font text-text-secondary truncate">
                  {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                </div>
              )}
              {tx.error && (
                <div className="text-xs ui-font text-accent-red mt-1">
                  {tx.error}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

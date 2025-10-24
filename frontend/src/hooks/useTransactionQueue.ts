import { useState, useCallback } from 'react';
import type { Transaction } from '../types/game';

export function useTransactionQueue() {
  const [queue, setQueue] = useState<Transaction[]>([]);
  const [processing, setProcessing] = useState(false);

  const addTransaction = useCallback((
    type: Transaction['type'],
    data: any,
    priority: Transaction['priority'] = 'MEDIUM'
  ) => {
    const transaction: Transaction = {
      id: `tx-${Date.now()}-${Math.random()}`,
      type,
      status: 'PENDING',
      priority,
      data,
      timestamp: Date.now()
    };

    setQueue(prev => {
      const updated = [...prev, transaction];
      return updated.sort((a, b) => {
        const priorityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
    });

    return transaction.id;
  }, []);

  const updateTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
    setQueue(prev => prev.map(tx => 
      tx.id === id ? { ...tx, ...updates } : tx
    ));
  }, []);

  const removeTransaction = useCallback((id: string) => {
    setQueue(prev => prev.filter(tx => tx.id !== id));
  }, []);

  const processBatch = useCallback(async () => {
    if (processing || queue.length === 0) return;

    setProcessing(true);
    try {
      const batch = queue.slice(0, 5);
      
      for (const tx of batch) {
        updateTransaction(tx.id, { status: 'CONFIRMED' });
        await new Promise(resolve => setTimeout(resolve, 1000));
        removeTransaction(tx.id);
      }
    } finally {
      setProcessing(false);
    }
  }, [queue, processing, updateTransaction, removeTransaction]);

  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  const pendingCount = queue.filter(tx => tx.status === 'PENDING').length;

  return {
    queue,
    processing,
    pendingCount,
    addTransaction,
    updateTransaction,
    removeTransaction,
    processBatch,
    clearQueue
  };
}

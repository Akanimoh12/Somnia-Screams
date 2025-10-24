import { useState, useCallback } from 'react';
import { useAccount } from 'wagmi';
import type { PlayerInventory } from '../types/player';

export function useInventory() {
  const { address } = useAccount();
  const [inventory, setInventory] = useState<PlayerInventory | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchInventory = useCallback(async () => {
    if (!address) return;

    setLoading(true);
    try {
      const mockInventory: PlayerInventory = {
        souls: 1250,
        powerUps: [],
        items: []
      };
      
      setInventory(mockInventory);
    } finally {
      setLoading(false);
    }
  }, [address]);

  const updateSouls = useCallback((souls: number) => {
    setInventory(prev => prev ? { ...prev, souls } : null);
  }, []);

  return {
    inventory,
    loading,
    fetchInventory,
    updateSouls
  };
}

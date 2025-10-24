import { useState, useCallback } from 'react';
import { useAccount } from 'wagmi';
import type { PlayerStats } from '../types/player';

export function usePlayerStats() {
  const { address } = useAccount();
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStats = useCallback(async () => {
    if (!address) return;

    setLoading(true);
    try {
      const mockStats: PlayerStats = {
        address,
        level: 1,
        experience: 0,
        totalPoints: 0,
        totalSouls: 0,
        battlesWon: 0,
        roomsExplored: 0,
        nftsOwned: []
      };
      
      setStats(mockStats);
    } finally {
      setLoading(false);
    }
  }, [address]);

  const updateStats = useCallback((updates: Partial<PlayerStats>) => {
    setStats(prev => prev ? { ...prev, ...updates } : null);
  }, []);

  const addExperience = useCallback((exp: number) => {
    setStats(prev => {
      if (!prev) return null;
      const newExp = prev.experience + exp;
      const newLevel = Math.floor(newExp / 100) + 1;
      return {
        ...prev,
        experience: newExp,
        level: newLevel
      };
    });
  }, []);

  return {
    stats,
    loading,
    fetchStats,
    updateStats,
    addExperience
  };
}

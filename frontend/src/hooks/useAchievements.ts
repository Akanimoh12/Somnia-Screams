import { useState, useCallback } from 'react';
import { useAccount } from 'wagmi';
import type { Achievement } from '../types/player';

export function useAchievements() {
  const { address } = useAccount();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAchievements = useCallback(async () => {
    if (!address) return;

    setLoading(true);
    try {
      const mockAchievements: Achievement[] = [
        {
          id: 1,
          name: 'First Blood',
          description: 'Win your first battle',
          unlocked: true,
          timestamp: Date.now() - 86400000
        },
        {
          id: 2,
          name: 'Soul Hunter',
          description: 'Collect 100 souls',
          unlocked: false
        }
      ];
      
      setAchievements(mockAchievements);
    } finally {
      setLoading(false);
    }
  }, [address]);

  const unlockAchievement = useCallback((id: number) => {
    setAchievements(prev => 
      prev.map(achievement => 
        achievement.id === id 
          ? { ...achievement, unlocked: true, timestamp: Date.now() }
          : achievement
      )
    );
  }, []);

  return {
    achievements,
    loading,
    fetchAchievements,
    unlockAchievement
  };
}

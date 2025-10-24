import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import type { PlayerStats } from '../types/player';
import type { Achievement } from '../types/player';

export interface GameHistory {
  id: string;
  timestamp: number;
  type: 'SESSION' | 'BATTLE' | 'ACHIEVEMENT' | 'NFT_MINT';
  description: string;
  pointsEarned?: number;
  soulsCollected?: number;
  outcome?: 'WIN' | 'LOSE' | 'DRAW';
}

export interface ProfileData {
  stats: PlayerStats;
  achievements: Achievement[];
  history: GameHistory[];
  joinedAt: number;
  lastActive: number;
}

export const useProfile = (targetAddress?: string) => {
  const { address: connectedAddress } = useAccount();
  const address = targetAddress || connectedAddress;
  
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!address) return;
    
    setLoading(true);
    
    setTimeout(() => {
      const mockProfile: ProfileData = {
        stats: {
          address: address,
          level: 28,
          experience: 7850,
          totalPoints: 15420,
          totalSouls: 2340,
          battlesWon: 67,
          roomsExplored: 142,
          nftsOwned: [1],
        },
        achievements: [
          {
            id: 1,
            name: 'First Blood',
            description: 'Win your first battle',
            unlocked: true,
            timestamp: Date.now() - 15 * 24 * 60 * 60 * 1000,
          },
          {
            id: 2,
            name: 'Soul Hunter',
            description: 'Collect 100 souls',
            unlocked: true,
            timestamp: Date.now() - 10 * 24 * 60 * 60 * 1000,
          },
          {
            id: 3,
            name: 'Room Explorer',
            description: 'Visit 10 rooms',
            unlocked: true,
            timestamp: Date.now() - 12 * 24 * 60 * 60 * 1000,
          },
          {
            id: 4,
            name: 'Warrior',
            description: 'Win 10 battles',
            unlocked: true,
            timestamp: Date.now() - 8 * 24 * 60 * 60 * 1000,
          },
          {
            id: 5,
            name: 'Soul Master',
            description: 'Collect 1,000 souls',
            unlocked: true,
            timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000,
          },
        ],
        history: [
          {
            id: '1',
            timestamp: Date.now() - 2 * 60 * 60 * 1000,
            type: 'SESSION',
            description: 'Completed haunted session',
            pointsEarned: 250,
            soulsCollected: 35,
            outcome: 'WIN',
          },
          {
            id: '2',
            timestamp: Date.now() - 5 * 60 * 60 * 1000,
            type: 'BATTLE',
            description: 'Battle against Spectral Warrior',
            pointsEarned: 150,
            outcome: 'WIN',
          },
          {
            id: '3',
            timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000,
            type: 'ACHIEVEMENT',
            description: 'Unlocked "Soul Master"',
            pointsEarned: 500,
          },
          {
            id: '4',
            timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
            type: 'SESSION',
            description: 'Explored cursed ballroom',
            pointsEarned: 180,
            soulsCollected: 28,
            outcome: 'WIN',
          },
          {
            id: '5',
            timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
            type: 'BATTLE',
            description: 'Battle against Dark Phantom',
            pointsEarned: 0,
            outcome: 'LOSE',
          },
        ],
        joinedAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
        lastActive: Date.now() - 2 * 60 * 60 * 1000,
      };
      
      setProfile(mockProfile);
      setLoading(false);
    }, 700);
  }, [address]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    const interval = setInterval(fetchProfile, 30000);
    return () => clearInterval(interval);
  }, [fetchProfile]);

  return {
    profile,
    loading,
    refetch: fetchProfile,
  };
};

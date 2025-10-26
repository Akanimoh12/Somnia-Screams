import { useState, useEffect, useMemo } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { CONTRACTS } from '../contracts/addresses';
import { PlayerProfileABI, PlayerRegistryABI } from '../contracts/abis';
import { usePlayerStats } from './usePlayerStats';
import { useAchievements } from './useAchievements';
import { useActivityFeed, type Activity } from './useActivityFeed';
import type { PlayerStats, Achievement } from '../types/player';

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

  // Fetch real player stats
  const { stats, loading: statsLoading } = usePlayerStats();
  
  // Fetch real achievements
  const { achievements, loading: achievementsLoading } = useAchievements();
  
  // Fetch activity feed for history
  const { activities } = useActivityFeed();

  // Fetch registration timestamp
  const { data: registrationTime, isLoading: registrationLoading } = useReadContract({
    address: CONTRACTS.PlayerRegistry as `0x${string}`,
    abi: PlayerRegistryABI,
    functionName: 'registrationTime',
    args: address ? [address as `0x${string}`] : undefined,
    query: {
      enabled: !!address && !!CONTRACTS.PlayerRegistry,
    },
  });

  // Fetch last activity time from PlayerProfile
  const { data: playerData, isLoading: profileLoading } = useReadContract({
    address: CONTRACTS.PlayerProfile as `0x${string}`,
    abi: PlayerProfileABI,
    functionName: 'profiles',
    args: address ? [address as `0x${string}`] : undefined,
    query: {
      enabled: !!address && !!CONTRACTS.PlayerProfile,
    },
  });

  // Transform activities to GameHistory format
  // Use JSON.stringify for stable comparison to prevent unnecessary recalculations
  const activitiesKey = useMemo(() => 
    JSON.stringify(activities.map(a => ({ id: a.id, timestamp: a.timestamp }))),
    [activities]
  );

  const gameHistory: GameHistory[] = useMemo(() => {
    return activities.map((activity: Activity) => {
      // Map activity types to game history types
      let type: GameHistory['type'] = 'SESSION';
      let outcome: GameHistory['outcome'] | undefined;
      let pointsEarned: number | undefined;
      let soulsCollected: number | undefined;

      switch (activity.type) {
        case 'SESSION':
          pointsEarned = activity.value;
          break;
        case 'BATTLE':
          type = 'BATTLE';
          pointsEarned = activity.value;
          // Determine outcome from description
          if (activity.description.toLowerCase().includes('won')) {
            outcome = 'WIN';
          } else if (activity.description.toLowerCase().includes('lost')) {
            outcome = 'LOSE';
          }
          break;
        case 'SOUL':
          soulsCollected = activity.value;
          break;
        case 'ACHIEVEMENT':
        case 'LEVEL_UP':
          type = 'ACHIEVEMENT';
          pointsEarned = activity.value;
          break;
        case 'NFT':
          type = 'NFT_MINT';
          break;
      }

      return {
        id: activity.id,
        timestamp: activity.timestamp,
        type,
        description: activity.description,
        pointsEarned,
        soulsCollected,
        outcome,
      };
    });
  }, [activitiesKey]);

  // Combine all data sources
  useEffect(() => {
    // Wait for address
    if (!address) {
      return;
    }

    // Don't block on stats loading if we have an address - show default values
    if (statsLoading && !stats) {
      return;
    }

    // Extract lastActivityTime from playerData
    let lastActivityTime = Date.now();
    if (playerData && Array.isArray(playerData) && playerData.length >= 8) {
      const lastActivityTimestamp = playerData[7];
      if (lastActivityTimestamp && typeof lastActivityTimestamp === 'bigint') {
        lastActivityTime = Number(lastActivityTimestamp) * 1000; // Convert to milliseconds
      }
    }

    // Extract joinedAt from registrationTime
    let joinedAt = Date.now();
    if (registrationTime && typeof registrationTime === 'bigint' && registrationTime > 0n) {
      joinedAt = Number(registrationTime) * 1000; // Convert to milliseconds
    }

    // Use real stats from usePlayerStats hook or provide defaults
    const defaultStats: PlayerStats = {
      address,
      level: 1,
      experience: 0,
      totalPoints: 0,
      totalSouls: 0,
      battlesWon: 0,
      roomsExplored: 0,
      nftsOwned: [],
    };

    const profileData: ProfileData = {
      stats: stats || defaultStats,
      achievements: achievements || [],
      history: gameHistory,
      joinedAt,
      lastActive: lastActivityTime || Date.now(),
    };

    setProfile(profileData);
  }, [stats, statsLoading, achievements, address, registrationTime, playerData, activitiesKey]);

  // Check if profile exists
  const { data: isRegistered } = useReadContract({
    address: CONTRACTS.PlayerRegistry as `0x${string}`,
    abi: PlayerRegistryABI,
    functionName: 'isRegistered',
    args: address ? [address as `0x${string}`] : undefined,
    query: {
      enabled: !!address && !!CONTRACTS.PlayerRegistry,
    },
  });

  const profileExists = !!isRegistered;
  
  // Only show loading if we're actually fetching and don't have any data yet
  const loading = (statsLoading || achievementsLoading || registrationLoading || profileLoading) && !profile;

  return {
    profile,
    loading,
    profileExists,
    refetch: () => {
      // Refetch will be handled automatically by the hooks
    },
  };
};

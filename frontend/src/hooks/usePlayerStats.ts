import { useEffect, useState, useCallback } from 'react';
import { useAccount, useReadContract, useWatchContractEvent } from 'wagmi';
import { CONTRACTS } from '../contracts/addresses';
import { PlayerProfileABI } from '../contracts/abis';
import type { PlayerStats } from '../types/player';

export function usePlayerStats() {
  const { address } = useAccount();
  const [stats, setStats] = useState<PlayerStats | null>(null);

  // Read player profile from contract
  const { data: profileData, isLoading, refetch } = useReadContract({
    address: CONTRACTS.PlayerProfile as `0x${string}`,
    abi: PlayerProfileABI,
    functionName: 'profiles',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!CONTRACTS.PlayerProfile,
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  });

  // Listen for LevelUp events
  useWatchContractEvent({
    address: CONTRACTS.PlayerProfile as `0x${string}`,
    abi: PlayerProfileABI,
    eventName: 'LevelUp',
    onLogs: (logs) => {
      logs.forEach((log: any) => {
        if (log.args.player?.toLowerCase() === address?.toLowerCase()) {
          // Show celebration and refetch
          refetch();
        }
      });
    },
  });

  // Listen for ExperienceGained events
  useWatchContractEvent({
    address: CONTRACTS.PlayerProfile as `0x${string}`,
    abi: PlayerProfileABI,
    eventName: 'ExperienceGained',
    onLogs: (logs) => {
      logs.forEach((log: any) => {
        if (log.args.player?.toLowerCase() === address?.toLowerCase()) {
          refetch();
        }
      });
    },
  });

  // Convert contract data to PlayerStats
  useEffect(() => {
    if (!profileData || !address) {
      setStats(null);
      return;
    }

    const profile = profileData as readonly [number, number, number, number, bigint, bigint, bigint, bigint, bigint];
    const [
      level,
      totalSoulsCollected,
      battlesWon,
      roomsExplored,
      _currentSessionPoints,
      lifetimePoints,
      experience,
      _lastActivityTime,
      _achievementFlags
    ] = profile;

    setStats({
      address,
      level: Number(level),
      experience: Number(experience),
      totalPoints: Number(lifetimePoints),
      totalSouls: Number(totalSoulsCollected),
      battlesWon: Number(battlesWon),
      roomsExplored: Number(roomsExplored),
      nftsOwned: [] // Will be fetched separately from NFT contract
    });
  }, [profileData, address]);

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
    loading: isLoading,
    fetchStats: refetch,
    updateStats,
    addExperience
  };
}

import { useAccount, useReadContract, useWatchContractEvent } from 'wagmi';
import { CONTRACTS } from '../contracts/addresses';
import { PlayerProfileABI } from '../contracts/abis';
import { decodeAchievements, getAchievementsByCategory, getAchievementProgress, getRecentAchievements } from '../utils/achievementDecoder';
import { useAchievementTimestamps } from './useAchievementTimestamps';
import type { Achievement } from '../types/player';

/**
 * Hook for fetching and decoding player achievements from blockchain
 * Reads achievementFlags from PlayerProfile contract and decodes into Achievement objects
 * Enriches achievements with exact unlock timestamps from blockchain events
 */
export function useAchievements() {
  const { address } = useAccount();
  
  // Get achievement timestamps from blockchain events
  const { 
    loading: timestampsLoading, 
    getTimestamp, 
    createEstimatedTimestamp 
  } = useAchievementTimestamps();

  // Read achievement flags from PlayerProfile contract
  const { 
    data: playerData, 
    isLoading,
    refetch 
  } = useReadContract({
    address: CONTRACTS.PlayerProfile as `0x${string}`,
    abi: PlayerProfileABI,
    functionName: 'profiles',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!CONTRACTS.PlayerProfile,
      refetchInterval: 30000, // Refetch every 30 seconds
    },
  });

  // Listen for ExperienceGained events (which might trigger achievement unlocks)
  useWatchContractEvent({
    address: CONTRACTS.PlayerProfile as `0x${string}`,
    abi: PlayerProfileABI,
    eventName: 'ExperienceGained',
    onLogs: (logs) => {
      for (const log of logs) {
        if ((log.args as any).player?.toLowerCase() === address?.toLowerCase()) {
          // Refetch to check for new achievements
          refetch();
        }
      }
    },
  });

  // Listen for LevelUp events
  useWatchContractEvent({
    address: CONTRACTS.PlayerProfile as `0x${string}`,
    abi: PlayerProfileABI,
    eventName: 'LevelUp',
    onLogs: (logs) => {
      for (const log of logs) {
        if ((log.args as any).player?.toLowerCase() === address?.toLowerCase()) {
          // Refetch to check for new achievements
          refetch();
        }
      }
    },
  });

  // Extract achievement flags from player data
  // PlayerProfile.profiles returns: {level, totalSoulsCollected, battlesWon, roomsExplored, currentSessionPoints, lifetimePoints, experience, lastActivityTime, achievementFlags}
  const achievementFlags = playerData && typeof playerData === 'object' && 'achievementFlags' in playerData
    ? BigInt((playerData as any).achievementFlags || 0)
    : 0n;

  // Decode achievements
  const decodedAchievements: Achievement[] = achievementFlags > 0n
    ? decodeAchievements(achievementFlags)
    : [];

  // Enrich achievements with timestamps
  const achievements: Achievement[] = decodedAchievements.map(achievement => {
    const timestamp = getTimestamp(achievement.id);
    
    // If we have a timestamp, use it
    if (timestamp) {
      return {
        ...achievement,
        unlockedAt: timestamp.timestamp,
        timestampSource: timestamp.isExact ? 'blockchain' : 'estimated',
      };
    }
    
    // If achievement is unlocked but no timestamp, create estimated one
    if (achievement.unlocked) {
      const estimated = createEstimatedTimestamp(achievement.id);
      return {
        ...achievement,
        unlockedAt: estimated.timestamp,
        timestampSource: 'estimated',
      };
    }
    
    // Locked achievement - no timestamp
    return achievement;
  });

  // Get unlocked and locked counts
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  // Calculate progress
  const progress = achievements.length > 0
    ? getAchievementProgress(achievementFlags)
    : 0;

  // Get achievements by category
  const getByCategory = (category: 'battle' | 'souls' | 'exploration' | 'level' | 'nft' | 'session' | 'special') => {
    return achievementFlags > 0n
      ? getAchievementsByCategory(achievementFlags, category)
      : [];
  };

  // Get recent achievements
  const recentAchievements = achievementFlags > 0n
    ? getRecentAchievements(achievementFlags, 5)
    : [];

  return {
    // All achievements
    achievements,
    
    // Filtered lists
    unlockedAchievements,
    lockedAchievements,
    recentAchievements,
    
    // Counts
    unlockedCount: unlockedAchievements.length,
    lockedCount: lockedAchievements.length,
    totalCount: achievements.length,
    
    // Progress
    progress,
    
    // Category filter
    getByCategory,
    
    // Loading state
    loading: isLoading || timestampsLoading,
    
    // Refetch function
    refetch,
  };
}

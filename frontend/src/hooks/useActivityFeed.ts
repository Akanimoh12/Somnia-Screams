import { useState, useEffect, useCallback } from 'react';
import { useAccount, useWatchContractEvent } from 'wagmi';
import { CONTRACTS } from '../contracts/addresses';
import { SomniaScreamsABI } from '../contracts/abis/SomniaScreamsABI';
import { SpectralBattlesABI } from '../contracts/abis/SpectralBattlesABI';
import { SoulCollectorABI } from '../contracts/abis/SoulCollectorABI';
import { PlayerProfileABI } from '../contracts/abis/PlayerProfileABI';
import { HalloweenNFTABI } from '../contracts/abis/HalloweenNFTABI';

export type ActivityType = 'SESSION' | 'BATTLE' | 'SOUL' | 'ACHIEVEMENT' | 'NFT' | 'LEVEL_UP';

export interface Activity {
  id: string;
  type: ActivityType;
  description: string;
  timestamp: number;
  value?: number;
  player?: string;
}

const STORAGE_KEY = 'somnia-activities';
const MAX_ACTIVITIES = 50; // Store max 50 activities

export function useActivityFeed() {
  const { address } = useAccount();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<ActivityType | 'ALL'>('ALL');

  // Load activities from localStorage on mount
  useEffect(() => {
    if (!address) {
      setActivities([]);
      setIsLoading(false);
      return;
    }

    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}-${address}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        setActivities(parsed);
      }
    } catch (error) {
      console.error('Failed to load activities from storage:', error);
    }
    setIsLoading(false);
  }, [address]);

  // Save activities to localStorage
  const saveActivities = useCallback((newActivities: Activity[]) => {
    if (!address) return;
    
    try {
      // Keep only the most recent activities
      const trimmed = newActivities.slice(0, MAX_ACTIVITIES);
      localStorage.setItem(`${STORAGE_KEY}-${address}`, JSON.stringify(trimmed));
    } catch (error) {
      console.error('Failed to save activities to storage:', error);
    }
  }, [address]);

  // Add new activity
  const addActivity = useCallback((activity: Omit<Activity, 'id'>) => {
    setActivities((prev) => {
      const newActivity: Activity = {
        ...activity,
        id: `${activity.type}-${activity.timestamp}-${Math.random()}`,
      };
      const updated = [newActivity, ...prev].slice(0, MAX_ACTIVITIES);
      saveActivities(updated);
      return updated;
    });
  }, [saveActivities]);

  // Format timestamp to relative time
  const getTimeAgo = useCallback((timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }, []);

  // Listen for SessionStarted events
  useWatchContractEvent({
    address: CONTRACTS.SomniaScreams as `0x${string}`,
    abi: SomniaScreamsABI,
    eventName: 'SessionStarted',
    onLogs(logs) {
      for (const log of logs) {
        if (log.args.player?.toLowerCase() === address?.toLowerCase()) {
          addActivity({
            type: 'SESSION',
            description: 'Started new game session',
            timestamp: Date.now(),
            player: log.args.player,
          });
        }
      }
    },
  });

  // Listen for SessionEnded events
  useWatchContractEvent({
    address: CONTRACTS.SomniaScreams as `0x${string}`,
    abi: SomniaScreamsABI,
    eventName: 'SessionEnded',
    onLogs(logs) {
      for (const log of logs) {
        if (log.args.player?.toLowerCase() === address?.toLowerCase()) {
          const points = log.args.points ? Number(log.args.points) : undefined;
          addActivity({
            type: 'SESSION',
            description: 'Completed game session',
            timestamp: Date.now(),
            value: points,
            player: log.args.player,
          });
        }
      }
    },
  });

  // Listen for BattleStarted events
  useWatchContractEvent({
    address: CONTRACTS.SpectralBattles as `0x${string}`,
    abi: SpectralBattlesABI,
    eventName: 'BattleStarted',
    onLogs(logs) {
      for (const log of logs) {
        if (log.args.player?.toLowerCase() === address?.toLowerCase()) {
          addActivity({
            type: 'BATTLE',
            description: 'Started battle',
            timestamp: Date.now(),
            player: log.args.player,
          });
        }
      }
    },
  });

  // Listen for BattleEnded events
  useWatchContractEvent({
    address: CONTRACTS.SpectralBattles as `0x${string}`,
    abi: SpectralBattlesABI,
    eventName: 'BattleEnded',
    onLogs(logs) {
      for (const log of logs) {
        if (log.args.player?.toLowerCase() === address?.toLowerCase()) {
          const victory = log.args.victory;
          const rewards = log.args.rewards ? Number(log.args.rewards) : undefined;
          addActivity({
            type: 'BATTLE',
            description: victory ? 'Won battle!' : 'Lost battle',
            timestamp: Date.now(),
            value: rewards,
            player: log.args.player,
          });
        }
      }
    },
  });

  // Listen for SoulCollected events
  useWatchContractEvent({
    address: CONTRACTS.SoulCollector as `0x${string}`,
    abi: SoulCollectorABI,
    eventName: 'SoulCollected',
    onLogs(logs) {
      for (const log of logs) {
        if (log.args.player?.toLowerCase() === address?.toLowerCase()) {
          const count = log.args.count ? Number(log.args.count) : undefined;
          addActivity({
            type: 'SOUL',
            description: 'Collected soul',
            timestamp: Date.now(),
            value: count,
            player: log.args.player,
          });
        }
      }
    },
  });

  // Listen for SoulsBatchCollected events
  useWatchContractEvent({
    address: CONTRACTS.SoulCollector as `0x${string}`,
    abi: SoulCollectorABI,
    eventName: 'SoulsBatchCollected',
    onLogs(logs) {
      for (const log of logs) {
        if (log.args.player?.toLowerCase() === address?.toLowerCase()) {
          const totalPoints = log.args.totalPoints ? Number(log.args.totalPoints) : undefined;
          addActivity({
            type: 'SOUL',
            description: `Collected souls batch`,
            timestamp: Date.now(),
            value: totalPoints,
            player: log.args.player,
          });
        }
      }
    },
  });

  // Listen for ExperienceGained events
  useWatchContractEvent({
    address: CONTRACTS.PlayerProfile as `0x${string}`,
    abi: PlayerProfileABI,
    eventName: 'ExperienceGained',
    onLogs(logs) {
      for (const log of logs) {
        if (log.args.player?.toLowerCase() === address?.toLowerCase()) {
          const xp = log.args.xp ? Number(log.args.xp) : undefined;
          addActivity({
            type: 'ACHIEVEMENT',
            description: 'Gained experience',
            timestamp: Date.now(),
            value: xp,
            player: log.args.player,
          });
        }
      }
    },
  });

  // Listen for LevelUp events
  useWatchContractEvent({
    address: CONTRACTS.PlayerProfile as `0x${string}`,
    abi: PlayerProfileABI,
    eventName: 'LevelUp',
    onLogs(logs) {
      for (const log of logs) {
        if (log.args.player?.toLowerCase() === address?.toLowerCase()) {
          const newLevel = log.args.newLevel ? Number(log.args.newLevel) : undefined;
          addActivity({
            type: 'LEVEL_UP',
            description: `Level up! Reached level ${newLevel}`,
            timestamp: Date.now(),
            value: newLevel,
            player: log.args.player,
          });
        }
      }
    },
  });

  // Listen for NFTMinted events
  useWatchContractEvent({
    address: CONTRACTS.HalloweenNFT as `0x${string}`,
    abi: HalloweenNFTABI,
    eventName: 'NFTMinted',
    onLogs(logs) {
      for (const log of logs) {
        if (log.args.player?.toLowerCase() === address?.toLowerCase()) {
          const tokenId = log.args.tokenId ? Number(log.args.tokenId) : undefined;
          addActivity({
            type: 'NFT',
            description: `Minted NFT #${tokenId}`,
            timestamp: Date.now(),
            value: tokenId,
            player: log.args.player,
          });
        }
      }
    },
  });

  // Filter activities
  const filteredActivities = filter === 'ALL' 
    ? activities 
    : activities.filter(a => a.type === filter);

  // Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const paginatedActivities = filteredActivities.slice(0, page * itemsPerPage);

  const loadMore = useCallback(() => {
    if (page < totalPages) {
      setPage(prev => prev + 1);
    }
  }, [page, totalPages]);

  const hasMore = page < totalPages;

  // Clear all activities
  const clearActivities = useCallback(() => {
    setActivities([]);
    if (address) {
      localStorage.removeItem(`${STORAGE_KEY}-${address}`);
    }
  }, [address]);

  return {
    activities: paginatedActivities,
    isLoading,
    filter,
    setFilter,
    loadMore,
    hasMore,
    clearActivities,
    getTimeAgo,
  };
}

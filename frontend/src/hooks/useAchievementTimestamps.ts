/**
 * Achievement Timestamps Hook
 * 
 * Tracks achievement unlock times by monitoring blockchain events.
 * Uses getLogs to query historical ExperienceGained and LevelUp events,
 * then correlates them with achievement unlocks.
 * 
 * Features:
 * - Query historical events on first load (data migration)
 * - Real-time event listening for new achievements
 * - localStorage persistence with player-specific keys
 * - Exact timestamps from blockchain events
 * - Fallback to estimation for very old events (>30 days)
 * - Cache invalidation when player changes
 */

import { useState, useEffect, useCallback } from 'react';
import { useAccount, usePublicClient, useWatchContractEvent } from 'wagmi';
import { parseAbiItem } from 'viem';
import { CONTRACTS } from '../contracts/addresses';
import { PlayerProfileABI } from '../contracts/abis';

export interface AchievementTimestamp {
  achievementId: number; // Numeric ID matching ACHIEVEMENT_METADATA
  timestamp: number;
  isExact: boolean; // true = from blockchain, false = estimated
  eventType: 'ExperienceGained' | 'LevelUp' | 'BattleWon' | 'Estimated';
}

interface StoredTimestamps {
  [achievementId: number]: AchievementTimestamp;
}

const STORAGE_KEY_PREFIX = 'achievement-timestamps-';
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export const useAchievementTimestamps = () => {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const [timestamps, setTimestamps] = useState<StoredTimestamps>({});
  const [loading, setLoading] = useState(false);

  // Get storage key for current player
  const getStorageKey = useCallback(() => {
    if (!address) return null;
    return `${STORAGE_KEY_PREFIX}${address.toLowerCase()}`;
  }, [address]);

  // Load timestamps from localStorage
  const loadFromStorage = useCallback(() => {
    const key = getStorageKey();
    if (!key) return { timestamps: {}, lastFetchTime: 0 };

    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const data = JSON.parse(stored);
        return {
          timestamps: data.timestamps || {},
          lastFetchTime: data.lastFetchTime || 0,
        };
      }
    } catch (error) {
      console.error('Error loading achievement timestamps:', error);
    }
    return { timestamps: {}, lastFetchTime: 0 };
  }, [getStorageKey]);

  // Save timestamps to localStorage
  const saveToStorage = useCallback((newTimestamps: StoredTimestamps, fetchTime: number) => {
    const key = getStorageKey();
    if (!key) return;

    try {
      localStorage.setItem(key, JSON.stringify({
        timestamps: newTimestamps,
        lastFetchTime: fetchTime,
      }));
    } catch (error) {
      console.error('Error saving achievement timestamps:', error);
    }
  }, [getStorageKey]);

  // Query historical events from blockchain
  const queryHistoricalEvents = useCallback(async () => {
    if (!address || !publicClient || !CONTRACTS.PlayerProfile) {
      return;
    }

    // Load cache info from localStorage
    const { lastFetchTime: cachedFetchTime } = loadFromStorage();
    
    // Check if we recently fetched (cache for 7 days)
    const now = Date.now();
    if (cachedFetchTime && now - cachedFetchTime < CACHE_DURATION) {
      console.log('Using cached achievement timestamps (age: ' + Math.round((now - cachedFetchTime) / 1000 / 60 / 60) + ' hours)');
      return;
    }

    console.log('Fetching achievement timestamps from blockchain...');
    setLoading(true);

    try {
      // Calculate block range (last 30 days)
      const currentBlock = await publicClient.getBlockNumber();
      const blocksPerDay = 7200n; // ~12 second blocks = 7200 blocks/day
      const blocksToQuery = blocksPerDay * 30n; // 30 days
      const fromBlock = currentBlock > blocksToQuery ? currentBlock - blocksToQuery : 0n;

      // Query ExperienceGained events
      const experienceLogs = await publicClient.getLogs({
        address: CONTRACTS.PlayerProfile as `0x${string}`,
        event: parseAbiItem('event ExperienceGained(address indexed player, uint256 xp, uint256 totalXp)'),
        args: {
          player: address,
        },
        fromBlock,
        toBlock: currentBlock,
      });

      // Query LevelUp events
      const levelUpLogs = await publicClient.getLogs({
        address: CONTRACTS.PlayerProfile as `0x${string}`,
        event: parseAbiItem('event LevelUp(address indexed player, uint256 newLevel)'),
        args: {
          player: address,
        },
        fromBlock,
        toBlock: currentBlock,
      });

      // Process events and create timestamps
      const { timestamps: cachedTimestamps } = loadFromStorage();
      const newTimestamps: StoredTimestamps = { ...cachedTimestamps };

      // Process experience events (for soul collection achievements)
      for (const log of experienceLogs) {
        const block = await publicClient.getBlock({ blockNumber: log.blockNumber });
        const timestamp = Number(block.timestamp) * 1000;
        const totalXp = log.args.totalXp as bigint;

        // Check which achievements this might unlock
        // SOUL_HUNTER: 16 - Collect 100 souls
        if (totalXp >= 100n && !newTimestamps[16]) {
          newTimestamps[16] = {
            achievementId: 16,
            timestamp,
            isExact: true,
            eventType: 'ExperienceGained',
          };
        }

        // SOUL_MASTER: 17 - Collect 1,000 souls
        if (totalXp >= 1000n && !newTimestamps[17]) {
          newTimestamps[17] = {
            achievementId: 17,
            timestamp,
            isExact: true,
            eventType: 'ExperienceGained',
          };
        }

        // SOUL_LEGEND: 18 - Collect 10,000 souls
        if (totalXp >= 10000n && !newTimestamps[18]) {
          newTimestamps[18] = {
            achievementId: 18,
            timestamp,
            isExact: true,
            eventType: 'ExperienceGained',
          };
        }
      }

      // Process level up events
      for (const log of levelUpLogs) {
        const block = await publicClient.getBlock({ blockNumber: log.blockNumber });
        const timestamp = Number(block.timestamp) * 1000;
        const level = log.args.newLevel as bigint;

        // Level achievements
        // NOVICE: 48 - Reach level 5
        if (level >= 5n && !newTimestamps[48]) {
          newTimestamps[48] = {
            achievementId: 48,
            timestamp,
            isExact: true,
            eventType: 'LevelUp',
          };
        }

        // ADEPT: 49 - Reach level 10
        if (level >= 10n && !newTimestamps[49]) {
          newTimestamps[49] = {
            achievementId: 49,
            timestamp,
            isExact: true,
            eventType: 'LevelUp',
          };
        }

        // EXPERT: 50 - Reach level 25
        if (level >= 25n && !newTimestamps[50]) {
          newTimestamps[50] = {
            achievementId: 50,
            timestamp,
            isExact: true,
            eventType: 'LevelUp',
          };
        }

        // MASTER: 51 - Reach level 50
        if (level >= 50n && !newTimestamps[51]) {
          newTimestamps[51] = {
            achievementId: 51,
            timestamp,
            isExact: true,
            eventType: 'LevelUp',
          };
        }

        // GRANDMASTER: 52 - Reach level 100
        if (level >= 100n && !newTimestamps[52]) {
          newTimestamps[52] = {
            achievementId: 52,
            timestamp,
            isExact: true,
            eventType: 'LevelUp',
          };
        }
      }

      setTimestamps(newTimestamps);
      saveToStorage(newTimestamps, now);
    } catch (error) {
      console.error('Error querying historical events:', error);
    } finally {
      setLoading(false);
    }
  }, [address, publicClient, loadFromStorage, saveToStorage]);

  // Listen for real-time ExperienceGained events
  useWatchContractEvent({
    address: CONTRACTS.PlayerProfile as `0x${string}`,
    abi: PlayerProfileABI,
    eventName: 'ExperienceGained',
    args: address ? { player: address } : undefined,
    onLogs: (logs) => {
      const newTimestamps = { ...timestamps };
      let hasChanges = false;

      for (const log of logs) {
        const totalXp = log.args.totalXp as bigint;
        const timestamp = Date.now(); // Use current time for real-time events

        // Check for achievement unlocks
        if (totalXp >= 100n && !newTimestamps[16]) {
          newTimestamps[16] = {
            achievementId: 16,
            timestamp,
            isExact: true,
            eventType: 'ExperienceGained',
          };
          hasChanges = true;
        }

        if (totalXp >= 1000n && !newTimestamps[17]) {
          newTimestamps[17] = {
            achievementId: 17,
            timestamp,
            isExact: true,
            eventType: 'ExperienceGained',
          };
          hasChanges = true;
        }

        if (totalXp >= 10000n && !newTimestamps[18]) {
          newTimestamps[18] = {
            achievementId: 18,
            timestamp,
            isExact: true,
            eventType: 'ExperienceGained',
          };
          hasChanges = true;
        }
      }

      if (hasChanges) {
        setTimestamps(newTimestamps);
        const now = Date.now();
        saveToStorage(newTimestamps, now);
      }
    },
  });

  // Listen for real-time LevelUp events
  useWatchContractEvent({
    address: CONTRACTS.PlayerProfile as `0x${string}`,
    abi: PlayerProfileABI,
    eventName: 'LevelUp',
    args: address ? { player: address } : undefined,
    onLogs: (logs) => {
      const newTimestamps = { ...timestamps };
      let hasChanges = false;

      for (const log of logs) {
        const level = log.args.newLevel as bigint;
        const timestamp = Date.now();

        if (level >= 5n && !newTimestamps[48]) {
          newTimestamps[48] = {
            achievementId: 48,
            timestamp,
            isExact: true,
            eventType: 'LevelUp',
          };
          hasChanges = true;
        }

        if (level >= 10n && !newTimestamps[49]) {
          newTimestamps[49] = {
            achievementId: 49,
            timestamp,
            isExact: true,
            eventType: 'LevelUp',
          };
          hasChanges = true;
        }

        if (level >= 25n && !newTimestamps[50]) {
          newTimestamps[50] = {
            achievementId: 50,
            timestamp,
            isExact: true,
            eventType: 'LevelUp',
          };
          hasChanges = true;
        }

        if (level >= 50n && !newTimestamps[51]) {
          newTimestamps[51] = {
            achievementId: 51,
            timestamp,
            isExact: true,
            eventType: 'LevelUp',
          };
          hasChanges = true;
        }

        if (level >= 100n && !newTimestamps[52]) {
          newTimestamps[52] = {
            achievementId: 52,
            timestamp,
            isExact: true,
            eventType: 'LevelUp',
          };
          hasChanges = true;
        }
      }

      if (hasChanges) {
        setTimestamps(newTimestamps);
        const now = Date.now();
        saveToStorage(newTimestamps, now);
      }
    },
  });

  // Load from storage and query historical events on mount
  useEffect(() => {
    if (!address) {
      setTimestamps({});
      return;
    }

    // Load from storage first
    const { timestamps: storedTimestamps } = loadFromStorage();
    setTimestamps(storedTimestamps);

    // Then query blockchain for updates (will respect cache)
    queryHistoricalEvents();
  }, [address, loadFromStorage, queryHistoricalEvents]);

  // Get timestamp for a specific achievement
  const getTimestamp = useCallback((achievementId: number): AchievementTimestamp | null => {
    return timestamps[achievementId] || null;
  }, [timestamps]);

  // Create estimated timestamp for old achievements
  const createEstimatedTimestamp = useCallback((achievementId: number): AchievementTimestamp => {
    // Fallback to 30+ days ago for very old achievements
    const estimatedDate = Date.now() - (35 * 24 * 60 * 60 * 1000);
    return {
      achievementId,
      timestamp: estimatedDate,
      isExact: false,
      eventType: 'Estimated',
    };
  }, []);

  return {
    timestamps,
    loading,
    getTimestamp,
    createEstimatedTimestamp,
    refetch: queryHistoricalEvents,
  };
};

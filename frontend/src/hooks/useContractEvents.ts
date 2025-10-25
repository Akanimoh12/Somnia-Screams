import { useCallback } from 'react';
import { useAccount, useWatchContractEvent } from 'wagmi';
import { CONTRACTS } from '../contracts/addresses';
import { 
  PlayerProfileABI, 
  LeaderboardABI, 
  HalloweenNFTABI, 
  SomniaScreamsABI,
  SoulCollectorABI 
} from '../contracts/abis';
import confetti from 'canvas-confetti';

interface ContractEventsOptions {
  onLevelUp?: (level: number) => void;
  onExperienceGained?: (xp: number, totalXp: number) => void;
  onAchievementUnlocked?: (achievementId: number) => void;
  onNFTMinted?: (tokenId: bigint, tier: number) => void;
  onLeaderboardUpdated?: (rank: number, score: number) => void;
  onSessionStarted?: (sessionId: bigint) => void;
  onSessionEnded?: (points: number, souls: number) => void;
  onSoulCollected?: (count: number) => void;
  onBatchCollected?: (totalPoints: number) => void;
}

export function useContractEvents(options: ContractEventsOptions = {}) {
  const { address } = useAccount();

  // Celebration effects
  const triggerConfetti = useCallback(() => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999,
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  }, []);

  const triggerLevelUpEffect = useCallback((level: number) => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FFA500', '#FF8C00'],
      zIndex: 9999,
    });
    options.onLevelUp?.(level);
  }, [options]);

  const triggerAchievementEffect = useCallback((achievementId: number) => {
    confetti({
      particleCount: 100,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#9333EA', '#C084FC', '#E9D5FF'],
      zIndex: 9999,
    });
    options.onAchievementUnlocked?.(achievementId);
  }, [options]);

  const triggerSoulEffect = useCallback(() => {
    confetti({
      particleCount: 20,
      spread: 30,
      origin: { y: 0.8 },
      colors: ['#FFFFFF', '#E0E0E0', '#C0C0C0'],
      gravity: 0.5,
      zIndex: 9999,
      shapes: ['circle'],
      scalar: 0.6,
    });
  }, []);

  // Listen for PlayerProfile events
  useWatchContractEvent({
    address: CONTRACTS.PlayerProfile as `0x${string}`,
    abi: PlayerProfileABI,
    eventName: 'LevelUp',
    onLogs: (logs) => {
      logs.forEach((log: any) => {
        if (log.args.player?.toLowerCase() === address?.toLowerCase()) {
          triggerLevelUpEffect(Number(log.args.newLevel));
        }
      });
    },
  });

  useWatchContractEvent({
    address: CONTRACTS.PlayerProfile as `0x${string}`,
    abi: PlayerProfileABI,
    eventName: 'ExperienceGained',
    onLogs: (logs) => {
      logs.forEach((log: any) => {
        if (log.args.player?.toLowerCase() === address?.toLowerCase()) {
          options.onExperienceGained?.(Number(log.args.xp), Number(log.args.totalXp));
        }
      });
    },
  });

  useWatchContractEvent({
    address: CONTRACTS.PlayerProfile as `0x${string}`,
    abi: PlayerProfileABI,
    eventName: 'AchievementUnlocked',
    onLogs: (logs) => {
      logs.forEach((log: any) => {
        if (log.args.player?.toLowerCase() === address?.toLowerCase()) {
          triggerAchievementEffect(Number(log.args.achievementId));
        }
      });
    },
  });

  // Listen for NFT events
  useWatchContractEvent({
    address: CONTRACTS.HalloweenNFT as `0x${string}`,
    abi: HalloweenNFTABI,
    eventName: 'NFTMinted',
    onLogs: (logs) => {
      logs.forEach((log: any) => {
        if (log.args.player?.toLowerCase() === address?.toLowerCase()) {
          triggerConfetti();
          options.onNFTMinted?.(log.args.tokenId, log.args.tier);
        }
      });
    },
  });

  // Listen for Leaderboard events
  useWatchContractEvent({
    address: CONTRACTS.Leaderboard as `0x${string}`,
    abi: LeaderboardABI,
    eventName: 'LeaderboardUpdated',
    onLogs: (logs) => {
      logs.forEach((log: any) => {
        if (log.args.player?.toLowerCase() === address?.toLowerCase()) {
          const rank = Number(log.args.rank);
          if (rank <= 10) {
            confetti({
              particleCount: 50,
              spread: 50,
              origin: { y: 0.6 },
              colors: ['#10B981', '#34D399', '#6EE7B7'],
              zIndex: 9999,
            });
          }
          options.onLeaderboardUpdated?.(rank, Number(log.args.score));
        }
      });
    },
  });

  // Listen for Game Session events
  useWatchContractEvent({
    address: CONTRACTS.SomniaScreams as `0x${string}`,
    abi: SomniaScreamsABI,
    eventName: 'SessionStarted',
    onLogs: (logs) => {
      logs.forEach((log: any) => {
        if (log.args.player?.toLowerCase() === address?.toLowerCase()) {
          options.onSessionStarted?.(log.args.sessionId);
        }
      });
    },
  });

  useWatchContractEvent({
    address: CONTRACTS.SomniaScreams as `0x${string}`,
    abi: SomniaScreamsABI,
    eventName: 'SessionEnded',
    onLogs: (logs) => {
      logs.forEach((log: any) => {
        if (log.args.player?.toLowerCase() === address?.toLowerCase()) {
          options.onSessionEnded?.(Number(log.args.points), Number(log.args.souls));
        }
      });
    },
  });

  // Listen for Soul Collection events
  useWatchContractEvent({
    address: CONTRACTS.SoulCollector as `0x${string}`,
    abi: SoulCollectorABI,
    eventName: 'SoulCollected',
    onLogs: (logs) => {
      logs.forEach((log: any) => {
        if (log.args.player?.toLowerCase() === address?.toLowerCase()) {
          triggerSoulEffect();
          options.onSoulCollected?.(Number(log.args.count));
        }
      });
    },
  });

  useWatchContractEvent({
    address: CONTRACTS.SoulCollector as `0x${string}`,
    abi: SoulCollectorABI,
    eventName: 'SoulsBatchCollected',
    onLogs: (logs) => {
      logs.forEach((log: any) => {
        if (log.args.player?.toLowerCase() === address?.toLowerCase()) {
          options.onBatchCollected?.(Number(log.args.totalPoints));
        }
      });
    },
  });

  return {
    triggerConfetti,
    triggerLevelUpEffect,
    triggerAchievementEffect,
    triggerSoulEffect,
  };
}

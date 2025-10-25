/**
 * Contract Service Layer
 * Centralized functions for contract interactions with error handling
 */

import { readContract, writeContract, waitForTransactionReceipt } from '@wagmi/core';
import { wagmiConfig } from '../config/wagmi';
import { CONTRACTS } from '../contracts/addresses';
import {
  PlayerProfileABI,
  LeaderboardABI,
  HalloweenNFTABI,
  SomniaScreamsABI,
  SoulCollectorABI,
} from '../contracts/abis';

// ============================================================================
// Player Profile Service
// ============================================================================

export const playerProfileService = {
  /**
   * Read player profile data from contract
   */
  async getProfile(address: `0x${string}`) {
    try {
      const data = await readContract(wagmiConfig, {
        address: CONTRACTS.PlayerProfile as `0x${string}`,
        abi: PlayerProfileABI,
        functionName: 'profiles',
        args: [address],
      });

      return {
        level: Number(data[0]),
        totalSoulsCollected: Number(data[1]),
        battlesWon: Number(data[2]),
        roomsExplored: Number(data[3]),
        currentSessionPoints: Number(data[4]),
        lifetimePoints: Number(data[5]),
        experience: Number(data[6]),
        lastActivityTime: Number(data[7]),
        achievementFlags: data[8],
      };
    } catch (error) {
      console.error('Failed to read player profile:', error);
      throw error;
    }
  },

  /**
   * Create a new player profile
   */
  async createProfile(address: `0x${string}`) {
    try {
      const hash = await writeContract(wagmiConfig, {
        address: CONTRACTS.PlayerProfile as `0x${string}`,
        abi: PlayerProfileABI,
        functionName: 'createProfile',
        args: [address],
      });

      const receipt = await waitForTransactionReceipt(wagmiConfig, { hash });
      return receipt;
    } catch (error) {
      console.error('Failed to create profile:', error);
      throw error;
    }
  },
};

// ============================================================================
// Leaderboard Service
// ============================================================================

export const leaderboardService = {
  /**
   * Get leaderboard page with pagination
   */
  async getLeaderboardPage(offset: number, limit: number) {
    try {
      const data = await readContract(wagmiConfig, {
        address: CONTRACTS.Leaderboard as `0x${string}`,
        abi: LeaderboardABI,
        functionName: 'getLeaderboardPage',
        args: [BigInt(offset), BigInt(limit)],
      });

      const [addresses, scores] = data as [string[], bigint[]];
      return addresses.map((addr, idx) => ({
        address: addr as `0x${string}`,
        score: Number(scores[idx]),
        rank: offset + idx + 1,
      }));
    } catch (error) {
      console.error('Failed to get leaderboard:', error);
      throw error;
    }
  },

  /**
   * Get player's rank
   */
  async getPlayerRank(address: `0x${string}`) {
    try {
      const rank = await readContract(wagmiConfig, {
        address: CONTRACTS.Leaderboard as `0x${string}`,
        abi: LeaderboardABI,
        functionName: 'getPlayerRank',
        args: [address],
      });

      return Number(rank);
    } catch (error) {
      console.error('Failed to get player rank:', error);
      throw error;
    }
  },

  /**
   * Get total players count
   */
  async getTotalPlayers() {
    try {
      const total = await readContract(wagmiConfig, {
        address: CONTRACTS.Leaderboard as `0x${string}`,
        abi: LeaderboardABI,
        functionName: 'getTotalPlayers',
      });

      return Number(total);
    } catch (error) {
      console.error('Failed to get total players:', error);
      throw error;
    }
  },
};

// ============================================================================
// Game Session Service
// ============================================================================

export const gameSessionService = {
  /**
   * Start a new game session
   */
  async startSession() {
    try {
      const hash = await writeContract(wagmiConfig, {
        address: CONTRACTS.SomniaScreams as `0x${string}`,
        abi: SomniaScreamsABI,
        functionName: 'startGameSession',
      });

      const receipt = await waitForTransactionReceipt(wagmiConfig, { hash });
      return receipt;
    } catch (error) {
      console.error('Failed to start session:', error);
      throw error;
    }
  },

  /**
   * Exit a game session
   */
  async exitSession(sessionId: bigint) {
    try {
      const hash = await writeContract(wagmiConfig, {
        address: CONTRACTS.SomniaScreams as `0x${string}`,
        abi: SomniaScreamsABI,
        functionName: 'exitSession',
        args: [sessionId],
      });

      const receipt = await waitForTransactionReceipt(wagmiConfig, { hash });
      return receipt;
    } catch (error) {
      console.error('Failed to exit session:', error);
      throw error;
    }
  },

  /**
   * Claim session rewards
   */
  async claimRewards(sessionId: bigint, souls: bigint) {
    try {
      const hash = await writeContract(wagmiConfig, {
        address: CONTRACTS.SomniaScreams as `0x${string}`,
        abi: SomniaScreamsABI,
        functionName: 'claimSessionRewards',
        args: [sessionId, souls],
      });

      const receipt = await waitForTransactionReceipt(wagmiConfig, { hash });
      return receipt;
    } catch (error) {
      console.error('Failed to claim rewards:', error);
      throw error;
    }
  },
};

// ============================================================================
// Soul Collection Service
// ============================================================================

export const soulCollectionService = {
  /**
   * Collect a single soul
   */
  async collectSoul(player: `0x${string}`, sessionId: bigint, points: bigint) {
    try {
      const hash = await writeContract(wagmiConfig, {
        address: CONTRACTS.SoulCollector as `0x${string}`,
        abi: SoulCollectorABI,
        functionName: 'collectSoul',
        args: [player, sessionId, points],
      });

      const receipt = await waitForTransactionReceipt(wagmiConfig, { hash });
      return receipt;
    } catch (error) {
      console.error('Failed to collect soul:', error);
      throw error;
    }
  },

  /**
   * Batch collect souls
   */
  async batchCollectSouls(player: `0x${string}`, sessionId: bigint, count: bigint) {
    try {
      const hash = await writeContract(wagmiConfig, {
        address: CONTRACTS.SoulCollector as `0x${string}`,
        abi: SoulCollectorABI,
        functionName: 'batchCollectSouls',
        args: [player, sessionId, count],
      });

      const receipt = await waitForTransactionReceipt(wagmiConfig, { hash });
      return receipt;
    } catch (error) {
      console.error('Failed to batch collect souls:', error);
      throw error;
    }
  },

  /**
   * Get collection data
   */
  async getCollectionData(player: `0x${string}`, sessionId: bigint) {
    try {
      const data = await readContract(wagmiConfig, {
        address: CONTRACTS.SoulCollector as `0x${string}`,
        abi: SoulCollectorABI,
        functionName: 'getCollectionData',
        args: [player, sessionId],
      });

      return {
        soulsCollected: Number(data[0]),
        pendingBatchSize: Number(data[1]),
        lastCollectionTime: Number(data[2]),
      };
    } catch (error) {
      console.error('Failed to get collection data:', error);
      throw error;
    }
  },
};

// ============================================================================
// NFT Service
// ============================================================================

export const nftService = {
  /**
   * Get player's NFTs
   */
  async getPlayerNFTs(address: `0x${string}`) {
    try {
      const tokenIds = await readContract(wagmiConfig, {
        address: CONTRACTS.HalloweenNFT as `0x${string}`,
        abi: HalloweenNFTABI,
        functionName: 'getPlayerNFTs',
        args: [address],
      });

      return (tokenIds as bigint[]).map(id => Number(id));
    } catch (error) {
      console.error('Failed to get player NFTs:', error);
      throw error;
    }
  },

  /**
   * Check NFT eligibility
   */
  async checkEligibility(address: `0x${string}`, tier: number) {
    try {
      const eligible = await readContract(wagmiConfig, {
        address: CONTRACTS.HalloweenNFT as `0x${string}`,
        abi: HalloweenNFTABI,
        functionName: 'checkEligibility',
        args: [address, tier],
      });

      return Boolean(eligible);
    } catch (error) {
      console.error('Failed to check eligibility:', error);
      throw error;
    }
  },

  /**
   * Mint an NFT
   */
  async mintNFT(player: `0x${string}`, tier: number) {
    try {
      const hash = await writeContract(wagmiConfig, {
        address: CONTRACTS.HalloweenNFT as `0x${string}`,
        abi: HalloweenNFTABI,
        functionName: 'mintNFT',
        args: [player, tier],
      });

      const receipt = await waitForTransactionReceipt(wagmiConfig, { hash });
      return receipt;
    } catch (error) {
      console.error('Failed to mint NFT:', error);
      throw error;
    }
  },

  /**
   * Get NFT tier
   */
  async getNFTTier(tokenId: bigint) {
    try {
      const tier = await readContract(wagmiConfig, {
        address: CONTRACTS.HalloweenNFT as `0x${string}`,
        abi: HalloweenNFTABI,
        functionName: 'getNFTTier',
        args: [tokenId],
      });

      return Number(tier);
    } catch (error) {
      console.error('Failed to get NFT tier:', error);
      throw error;
    }
  },
};

// ============================================================================
// Export all services
// ============================================================================

export const contractService = {
  playerProfile: playerProfileService,
  leaderboard: leaderboardService,
  gameSession: gameSessionService,
  soulCollection: soulCollectionService,
  nft: nftService,
};

export default contractService;

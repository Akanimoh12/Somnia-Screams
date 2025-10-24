import { CONTRACTS } from '../contracts/addresses';

export { CONTRACTS } from '../contracts/addresses';

export const contractConfig = {
  somniaScreams: {
    address: CONTRACTS.SomniaScreams as `0x${string}`,
    abi: [] as const,
  },
  halloweenNFT: {
    address: CONTRACTS.HalloweenNFT as `0x${string}`,
    abi: [] as const,
  },
  leaderboard: {
    address: CONTRACTS.Leaderboard as `0x${string}`,
    abi: [] as const,
  },
  leaderboardReader: {
    address: CONTRACTS.LeaderboardReader as `0x${string}`,
    abi: [] as const,
  },
  nftRewards: {
    address: CONTRACTS.NFTRewards as `0x${string}`,
    abi: [] as const,
  },
  playerProfile: {
    address: CONTRACTS.PlayerProfile as `0x${string}`,
    abi: [] as const,
  },
  gameSession: {
    address: CONTRACTS.GameSession as `0x${string}`,
    abi: [] as const,
  },
  batchProcessor: {
    address: CONTRACTS.BatchProcessor as `0x${string}`,
    abi: [] as const,
  },
} as const;

export type ContractName = keyof typeof contractConfig;

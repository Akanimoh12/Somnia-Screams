import { CONTRACTS } from '../contracts/addresses';

// Re-export contract addresses
export { CONTRACTS } from '../contracts/addresses';

// Import ABIs
import SomniaScreamsABI from '../contracts/SomniaScreams.json';
import HalloweenNFTABI from '../contracts/HalloweenNFT.json';
import LeaderboardABI from '../contracts/Leaderboard.json';
import LeaderboardReaderABI from '../contracts/LeaderboardReader.json';
import NFTRewardsABI from '../contracts/NFTRewards.json';
import PlayerProfileABI from '../contracts/PlayerProfile.json';
import GameSessionABI from '../contracts/GameSession.json';
import BatchProcessorABI from '../contracts/BatchProcessor.json';

// Contract configurations with addresses and ABIs
export const contractConfig = {
  somniaScreams: {
    address: CONTRACTS.SomniaScreams as `0x${string}`,
    abi: SomniaScreamsABI,
  },
  halloweenNFT: {
    address: CONTRACTS.HalloweenNFT as `0x${string}`,
    abi: HalloweenNFTABI,
  },
  leaderboard: {
    address: CONTRACTS.Leaderboard as `0x${string}`,
    abi: LeaderboardABI,
  },
  leaderboardReader: {
    address: CONTRACTS.LeaderboardReader as `0x${string}`,
    abi: LeaderboardReaderABI,
  },
  nftRewards: {
    address: CONTRACTS.NFTRewards as `0x${string}`,
    abi: NFTRewardsABI,
  },
  playerProfile: {
    address: CONTRACTS.PlayerProfile as `0x${string}`,
    abi: PlayerProfileABI,
  },
  gameSession: {
    address: CONTRACTS.GameSession as `0x${string}`,
    abi: GameSessionABI,
  },
  batchProcessor: {
    address: CONTRACTS.BatchProcessor as `0x${string}`,
    abi: BatchProcessorABI,
  },
} as const;

export type ContractName = keyof typeof contractConfig;

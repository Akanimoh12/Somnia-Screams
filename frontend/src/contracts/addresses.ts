// Contract addresses on Somnia Devnet
// Update these after deployment

export const CONTRACTS = {
  // Core System
  SomniaScreams: "",
  GameSession: "",
  GameState: "",
  BatchProcessor: "",
  
  // Player System
  PlayerRegistry: "",
  PlayerProfile: "",
  PlayerActions: "",
  PlayerInventory: "",
  
  // Challenge System
  HauntedRooms: "",
  SpectralBattles: "",
  SoulCollector: "",
  DailyQuests: "",
  
  // Rewards System
  Leaderboard: "",
  LeaderboardReader: "",
  NFTRewards: "",
  PointsSystem: "",
  SeasonalRewards: "",
  
  // NFT System
  HalloweenNFT: "",
  NFTTiers: "",
} as const;

export const NETWORK_CONFIG = {
  chainId: 50312,
  chainName: "Somnia Devnet",
  rpcUrl: "https://dream-rpc.somnia.network",
  explorerUrl: "https://explorer.somnia.network",
  nativeCurrency: {
    name: "STT",
    symbol: "STT",
    decimals: 18,
  },
};

export type ContractName = keyof typeof CONTRACTS;

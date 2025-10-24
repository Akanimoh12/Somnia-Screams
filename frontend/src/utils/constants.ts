// App-wide constants
export const APP_NAME = 'Somnia Screams';
export const APP_DESCRIPTION = 'Halloween Mini-Game on Somnia Blockchain';

// Game constants
export const SESSION_DURATION = 120; // 2 minutes in seconds
export const EXPLORATION_PHASE = 90; // 90 seconds
export const BATTLE_PHASE = 30; // 30 seconds

// NFT Tiers
export const NFT_TIERS = {
  BRONZE: 0,
  SILVER: 1,
  GOLD: 2,
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  GAME: '/game',
  LEADERBOARD: '/leaderboard',
  PROFILE: '/profile',
  INVENTORY: '/inventory',
  ACHIEVEMENTS: '/achievements',
  HOW_TO_PLAY: '/how-to-play',
  SETTINGS: '/settings',
} as const;

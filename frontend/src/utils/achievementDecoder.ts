import type { Achievement } from '../types/player';

/**
 * Achievement bit flag constants
 * Each achievement is represented by a specific bit position in a uint256
 * This allows efficient storage of up to 256 achievements in a single variable
 */
export const ACHIEVEMENT_FLAGS = {
  // Battle Achievements (bits 0-15)
  FIRST_BLOOD: 1n << 0n,           // Win first battle
  WARRIOR: 1n << 1n,               // Win 10 battles
  GLADIATOR: 1n << 2n,             // Win 50 battles
  CHAMPION: 1n << 3n,              // Win 100 battles
  PERFECT_BATTLE: 1n << 4n,        // Win battle without taking damage
  SPEED_DEMON: 1n << 5n,           // Win battle in under 15 seconds
  
  // Soul Collection Achievements (bits 16-31)
  SOUL_HUNTER: 1n << 16n,          // Collect 100 souls
  SOUL_MASTER: 1n << 17n,          // Collect 1,000 souls
  SOUL_LEGEND: 1n << 18n,          // Collect 10,000 souls
  SOUL_GOD: 1n << 19n,             // Collect 100,000 souls
  BATCH_MASTER: 1n << 20n,         // Submit 10 soul batches
  
  // Exploration Achievements (bits 32-47)
  ROOM_EXPLORER: 1n << 32n,        // Visit 10 rooms
  MANOR_TOURIST: 1n << 33n,        // Visit 25 rooms
  MANOR_EXPERT: 1n << 34n,         // Visit all 50 rooms
  FIRST_CLEAR_MASTER: 1n << 35n,   // Get first clear on 10 rooms
  TREASURE_HUNTER: 1n << 36n,      // Find 5 treasure chests
  PUZZLE_SOLVER: 1n << 37n,        // Complete 10 puzzle rooms
  
  // Level & XP Achievements (bits 48-63)
  NOVICE: 1n << 48n,               // Reach level 5
  ADEPT: 1n << 49n,                // Reach level 10
  EXPERT: 1n << 50n,               // Reach level 25
  MASTER: 1n << 51n,               // Reach level 50
  GRANDMASTER: 1n << 52n,          // Reach level 100
  XP_GRINDER: 1n << 53n,           // Earn 10,000 XP in single session
  
  // NFT Achievements (bits 64-79)
  NFT_COLLECTOR: 1n << 64n,        // Mint first NFT
  BRONZE_BADGE: 1n << 65n,         // Own Bronze tier NFT
  SILVER_BADGE: 1n << 66n,         // Own Silver tier NFT
  GOLD_BADGE: 1n << 67n,           // Own Gold tier NFT
  NFT_WHALE: 1n << 68n,            // Own 10+ NFTs
  NFT_UPGRADER: 1n << 69n,         // Upgrade an NFT tier
  
  // Session Achievements (bits 80-95)
  SESSION_STARTER: 1n << 80n,      // Complete first session
  SESSION_WARRIOR: 1n << 81n,      // Complete 10 sessions
  SESSION_VETERAN: 1n << 82n,      // Complete 50 sessions
  SESSION_LEGEND: 1n << 83n,       // Complete 100 sessions
  MARATHON_RUNNER: 1n << 84n,      // Complete 5 sessions in one day
  PERFECT_SESSION: 1n << 85n,      // Complete session with max souls
  
  // Special Achievements (bits 96-111)
  EARLY_ADOPTER: 1n << 96n,        // Join in first week
  SOCIAL_BUTTERFLY: 1n << 97n,     // Refer 5 friends
  TOP_TEN: 1n << 98n,              // Reach top 10 leaderboard
  NUMBER_ONE: 1n << 99n,           // Reach #1 leaderboard
  COMEBACK_KID: 1n << 100n,        // Win battle from 10% health
  LUCKY_SEVEN: 1n << 101n,         // Collect exactly 777 souls
} as const;

/**
 * Achievement metadata - descriptions, names, and requirements
 */
export const ACHIEVEMENT_METADATA: Record<string, {
  id: number;
  name: string;
  description: string;
  category: 'battle' | 'souls' | 'exploration' | 'level' | 'nft' | 'session' | 'special';
  flag: bigint;
  requirement?: string;
}> = {
  FIRST_BLOOD: {
    id: 0,
    name: 'First Blood',
    description: 'Win your first battle against a spectral enemy',
    category: 'battle',
    flag: ACHIEVEMENT_FLAGS.FIRST_BLOOD,
    requirement: 'Win 1 battle',
  },
  WARRIOR: {
    id: 1,
    name: 'Warrior',
    description: 'Prove your combat prowess',
    category: 'battle',
    flag: ACHIEVEMENT_FLAGS.WARRIOR,
    requirement: 'Win 10 battles',
  },
  GLADIATOR: {
    id: 2,
    name: 'Gladiator',
    description: 'A seasoned fighter of the haunted manor',
    category: 'battle',
    flag: ACHIEVEMENT_FLAGS.GLADIATOR,
    requirement: 'Win 50 battles',
  },
  CHAMPION: {
    id: 3,
    name: 'Champion',
    description: 'Legendary battle master',
    category: 'battle',
    flag: ACHIEVEMENT_FLAGS.CHAMPION,
    requirement: 'Win 100 battles',
  },
  PERFECT_BATTLE: {
    id: 4,
    name: 'Flawless Victory',
    description: 'Win a battle without taking any damage',
    category: 'battle',
    flag: ACHIEVEMENT_FLAGS.PERFECT_BATTLE,
    requirement: 'Win battle at full health',
  },
  SPEED_DEMON: {
    id: 5,
    name: 'Speed Demon',
    description: 'Lightning-fast reflexes',
    category: 'battle',
    flag: ACHIEVEMENT_FLAGS.SPEED_DEMON,
    requirement: 'Win battle in under 15 seconds',
  },
  SOUL_HUNTER: {
    id: 16,
    name: 'Soul Hunter',
    description: 'Begin your collection of lost souls',
    category: 'souls',
    flag: ACHIEVEMENT_FLAGS.SOUL_HUNTER,
    requirement: 'Collect 100 souls',
  },
  SOUL_MASTER: {
    id: 17,
    name: 'Soul Master',
    description: 'A master of soul collection',
    category: 'souls',
    flag: ACHIEVEMENT_FLAGS.SOUL_MASTER,
    requirement: 'Collect 1,000 souls',
  },
  SOUL_LEGEND: {
    id: 18,
    name: 'Soul Legend',
    description: 'Legendary soul collector',
    category: 'souls',
    flag: ACHIEVEMENT_FLAGS.SOUL_LEGEND,
    requirement: 'Collect 10,000 souls',
  },
  SOUL_GOD: {
    id: 19,
    name: 'Soul God',
    description: 'The ultimate soul collector',
    category: 'souls',
    flag: ACHIEVEMENT_FLAGS.SOUL_GOD,
    requirement: 'Collect 100,000 souls',
  },
  BATCH_MASTER: {
    id: 20,
    name: 'Batch Master',
    description: 'Efficient soul batch collector',
    category: 'souls',
    flag: ACHIEVEMENT_FLAGS.BATCH_MASTER,
    requirement: 'Submit 10 soul batches',
  },
  ROOM_EXPLORER: {
    id: 32,
    name: 'Room Explorer',
    description: 'Begin exploring the haunted manor',
    category: 'exploration',
    flag: ACHIEVEMENT_FLAGS.ROOM_EXPLORER,
    requirement: 'Visit 10 different rooms',
  },
  MANOR_TOURIST: {
    id: 33,
    name: 'Manor Tourist',
    description: 'Familiar with the manor layout',
    category: 'exploration',
    flag: ACHIEVEMENT_FLAGS.MANOR_TOURIST,
    requirement: 'Visit 25 rooms',
  },
  MANOR_EXPERT: {
    id: 34,
    name: 'Manor Expert',
    description: 'Master of the haunted manor',
    category: 'exploration',
    flag: ACHIEVEMENT_FLAGS.MANOR_EXPERT,
    requirement: 'Visit all 50 rooms',
  },
  FIRST_CLEAR_MASTER: {
    id: 35,
    name: 'Pioneer',
    description: 'First to clear multiple rooms',
    category: 'exploration',
    flag: ACHIEVEMENT_FLAGS.FIRST_CLEAR_MASTER,
    requirement: 'Get first clear on 10 rooms',
  },
  TREASURE_HUNTER: {
    id: 36,
    name: 'Treasure Hunter',
    description: 'Find hidden treasures',
    category: 'exploration',
    flag: ACHIEVEMENT_FLAGS.TREASURE_HUNTER,
    requirement: 'Find 5 treasure chests',
  },
  PUZZLE_SOLVER: {
    id: 37,
    name: 'Puzzle Master',
    description: 'Solve complex manor puzzles',
    category: 'exploration',
    flag: ACHIEVEMENT_FLAGS.PUZZLE_SOLVER,
    requirement: 'Complete 10 puzzle rooms',
  },
  NOVICE: {
    id: 48,
    name: 'Novice',
    description: 'Beginning your journey',
    category: 'level',
    flag: ACHIEVEMENT_FLAGS.NOVICE,
    requirement: 'Reach level 5',
  },
  ADEPT: {
    id: 49,
    name: 'Adept',
    description: 'Growing stronger',
    category: 'level',
    flag: ACHIEVEMENT_FLAGS.ADEPT,
    requirement: 'Reach level 10',
  },
  EXPERT: {
    id: 50,
    name: 'Expert',
    description: 'A powerful soul hunter',
    category: 'level',
    flag: ACHIEVEMENT_FLAGS.EXPERT,
    requirement: 'Reach level 25',
  },
  MASTER: {
    id: 51,
    name: 'Master',
    description: 'Among the elite',
    category: 'level',
    flag: ACHIEVEMENT_FLAGS.MASTER,
    requirement: 'Reach level 50',
  },
  GRANDMASTER: {
    id: 52,
    name: 'Grandmaster',
    description: 'The pinnacle of power',
    category: 'level',
    flag: ACHIEVEMENT_FLAGS.GRANDMASTER,
    requirement: 'Reach level 100',
  },
  XP_GRINDER: {
    id: 53,
    name: 'XP Grinder',
    description: 'Massive XP gain in one session',
    category: 'level',
    flag: ACHIEVEMENT_FLAGS.XP_GRINDER,
    requirement: 'Earn 10,000 XP in single session',
  },
  NFT_COLLECTOR: {
    id: 64,
    name: 'NFT Collector',
    description: 'Mint your first Halloween NFT',
    category: 'nft',
    flag: ACHIEVEMENT_FLAGS.NFT_COLLECTOR,
    requirement: 'Mint 1 NFT',
  },
  BRONZE_BADGE: {
    id: 65,
    name: 'Bronze Badge',
    description: 'Own a Bronze tier NFT',
    category: 'nft',
    flag: ACHIEVEMENT_FLAGS.BRONZE_BADGE,
    requirement: 'Own Bronze NFT',
  },
  SILVER_BADGE: {
    id: 66,
    name: 'Silver Badge',
    description: 'Own a Silver tier NFT',
    category: 'nft',
    flag: ACHIEVEMENT_FLAGS.SILVER_BADGE,
    requirement: 'Own Silver NFT',
  },
  GOLD_BADGE: {
    id: 67,
    name: 'Gold Badge',
    description: 'Own a Gold tier NFT',
    category: 'nft',
    flag: ACHIEVEMENT_FLAGS.GOLD_BADGE,
    requirement: 'Own Gold NFT',
  },
  NFT_WHALE: {
    id: 68,
    name: 'NFT Whale',
    description: 'Collect many NFTs',
    category: 'nft',
    flag: ACHIEVEMENT_FLAGS.NFT_WHALE,
    requirement: 'Own 10+ NFTs',
  },
  NFT_UPGRADER: {
    id: 69,
    name: 'Tier Climber',
    description: 'Upgrade an NFT to higher tier',
    category: 'nft',
    flag: ACHIEVEMENT_FLAGS.NFT_UPGRADER,
    requirement: 'Upgrade 1 NFT',
  },
  SESSION_STARTER: {
    id: 80,
    name: 'Session Starter',
    description: 'Complete your first gaming session',
    category: 'session',
    flag: ACHIEVEMENT_FLAGS.SESSION_STARTER,
    requirement: 'Complete 1 session',
  },
  SESSION_WARRIOR: {
    id: 81,
    name: 'Session Warrior',
    description: 'Regular player',
    category: 'session',
    flag: ACHIEVEMENT_FLAGS.SESSION_WARRIOR,
    requirement: 'Complete 10 sessions',
  },
  SESSION_VETERAN: {
    id: 82,
    name: 'Session Veteran',
    description: 'Dedicated player',
    category: 'session',
    flag: ACHIEVEMENT_FLAGS.SESSION_VETERAN,
    requirement: 'Complete 50 sessions',
  },
  SESSION_LEGEND: {
    id: 83,
    name: 'Session Legend',
    description: 'Legendary dedication',
    category: 'session',
    flag: ACHIEVEMENT_FLAGS.SESSION_LEGEND,
    requirement: 'Complete 100 sessions',
  },
  MARATHON_RUNNER: {
    id: 84,
    name: 'Marathon Runner',
    description: 'Play multiple sessions in one day',
    category: 'session',
    flag: ACHIEVEMENT_FLAGS.MARATHON_RUNNER,
    requirement: 'Complete 5 sessions in one day',
  },
  PERFECT_SESSION: {
    id: 85,
    name: 'Perfect Session',
    description: 'Collect maximum souls in a session',
    category: 'session',
    flag: ACHIEVEMENT_FLAGS.PERFECT_SESSION,
    requirement: 'Complete perfect session',
  },
  EARLY_ADOPTER: {
    id: 96,
    name: 'Early Adopter',
    description: 'Join in the first week',
    category: 'special',
    flag: ACHIEVEMENT_FLAGS.EARLY_ADOPTER,
    requirement: 'Join in first week',
  },
  SOCIAL_BUTTERFLY: {
    id: 97,
    name: 'Social Butterfly',
    description: 'Bring friends to the manor',
    category: 'special',
    flag: ACHIEVEMENT_FLAGS.SOCIAL_BUTTERFLY,
    requirement: 'Refer 5 friends',
  },
  TOP_TEN: {
    id: 98,
    name: 'Top Ten',
    description: 'Reach top 10 on leaderboard',
    category: 'special',
    flag: ACHIEVEMENT_FLAGS.TOP_TEN,
    requirement: 'Reach top 10',
  },
  NUMBER_ONE: {
    id: 99,
    name: 'Number One',
    description: 'Become the ultimate champion',
    category: 'special',
    flag: ACHIEVEMENT_FLAGS.NUMBER_ONE,
    requirement: 'Reach #1',
  },
  COMEBACK_KID: {
    id: 100,
    name: 'Comeback Kid',
    description: 'Win from the brink of defeat',
    category: 'special',
    flag: ACHIEVEMENT_FLAGS.COMEBACK_KID,
    requirement: 'Win battle from 10% health',
  },
  LUCKY_SEVEN: {
    id: 101,
    name: 'Lucky Seven',
    description: 'Hit the lucky number',
    category: 'special',
    flag: ACHIEVEMENT_FLAGS.LUCKY_SEVEN,
    requirement: 'Collect exactly 777 souls',
  },
};

/**
 * Check if a specific achievement is unlocked
 * Uses bitwise AND to check if the achievement bit is set
 * 
 * @param achievementFlags - The uint256 achievement flags from contract
 * @param achievementFlag - The specific achievement flag to check
 * @returns true if achievement is unlocked
 */
export function hasAchievement(achievementFlags: bigint, achievementFlag: bigint): boolean {
  return (achievementFlags & achievementFlag) !== 0n;
}

/**
 * Decode achievement flags into array of Achievement objects
 * Converts the bit flags from blockchain into readable achievement data
 * 
 * @param achievementFlags - The uint256 achievement flags from contract
 * @returns Array of Achievement objects with unlock status
 */
export function decodeAchievements(achievementFlags: bigint): Achievement[] {
  const achievements: Achievement[] = [];

  for (const [, metadata] of Object.entries(ACHIEVEMENT_METADATA)) {
    const unlocked = hasAchievement(achievementFlags, metadata.flag);
    
    achievements.push({
      id: metadata.id,
      name: metadata.name,
      description: metadata.description,
      unlocked,
      requirement: metadata.requirement,
      category: metadata.category,
      // Timestamps are added by useAchievements hook via useAchievementTimestamps
    });
  }

  // Sort by ID
  return achievements.sort((a, b) => a.id - b.id);
}

/**
 * Get achievements by category
 * 
 * @param achievementFlags - The uint256 achievement flags from contract
 * @param category - Category to filter by
 * @returns Filtered achievements
 */
export function getAchievementsByCategory(
  achievementFlags: bigint,
  category: 'battle' | 'souls' | 'exploration' | 'level' | 'nft' | 'session' | 'special'
): Achievement[] {
  const allAchievements = decodeAchievements(achievementFlags);
  return allAchievements.filter(a => a.category === category);
}

/**
 * Calculate achievement completion percentage
 * 
 * @param achievementFlags - The uint256 achievement flags from contract
 * @returns Percentage of achievements unlocked (0-100)
 */
export function getAchievementProgress(achievementFlags: bigint): number {
  const allAchievements = decodeAchievements(achievementFlags);
  const unlockedCount = allAchievements.filter(a => a.unlocked).length;
  return (unlockedCount / allAchievements.length) * 100;
}

/**
 * Get recently unlocked achievements
 * Note: Requires achievements to have unlockedAt timestamps populated
 * 
 * @param achievementFlags - The uint256 achievement flags from contract
 * @param limit - Number of recent achievements to return
 * @returns Array of recently unlocked achievements
 */
export function getRecentAchievements(achievementFlags: bigint, limit: number = 5): Achievement[] {
  const allAchievements = decodeAchievements(achievementFlags);
  const unlocked = allAchievements.filter(a => a.unlocked && a.unlockedAt);
  
  // Create sorted copy (most recent first)
  const sorted = [...unlocked].sort((a, b) => (b.unlockedAt || 0) - (a.unlockedAt || 0));
  return sorted.slice(0, limit);
}

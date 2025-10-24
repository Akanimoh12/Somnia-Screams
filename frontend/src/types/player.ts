// Player types
export interface PlayerStats {
  address: string;
  level: number;
  experience: number;
  totalPoints: number;
  totalSouls: number;
  battlesWon: number;
  roomsExplored: number;
  nftsOwned: number[];
}

export interface PlayerProfile {
  stats: PlayerStats;
  achievements: Achievement[];
  inventory: PlayerInventory;
}

export interface PlayerInventory {
  souls: number;
  powerUps: PowerUp[];
  items: GameItem[];
}

export interface PowerUp {
  id: number;
  name: string;
  description: string;
  expiry: number;
  active: boolean;
}

export interface GameItem {
  id: number;
  name: string;
  quantity: number;
  type: 'CONSUMABLE' | 'POWER_UP' | 'COLLECTIBLE';
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  unlocked: boolean;
  timestamp?: number;
}

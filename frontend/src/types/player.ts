// Player types
export interface Player {
  address: string;
  level: number;
  experience: number;
  points: number;
  souls: number;
  battlesWon: number;
  roomsExplored: number;
  nftsOwned: number[];
}

export interface PlayerProfile {
  player: Player;
  achievements: number[];
  inventory: PlayerInventory;
}

export interface PlayerInventory {
  souls: number;
  powerUps: PowerUp[];
  items: Item[];
}

export interface PowerUp {
  id: number;
  name: string;
  expiry: number;
  active: boolean;
}

export interface Item {
  id: number;
  name: string;
  quantity: number;
}

// Add more player types here

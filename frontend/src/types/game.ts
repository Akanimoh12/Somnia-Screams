// Game-related types
export interface GameSession {
  id: number;
  player: string;
  startTime: number;
  endTime: number;
  points: number;
  souls: number;
  active: boolean;
}

export interface GamePhase {
  name: 'PRE_GAME' | 'EXPLORATION' | 'BATTLE' | 'REWARDS';
  duration: number;
  description: string;
}

// Add more game types here

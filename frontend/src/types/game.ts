// Game-related types
export type GamePhase = 'PRE_GAME' | 'EXPLORATION' | 'BATTLE' | 'REWARDS';

export interface GameSession {
  id: string;
  player: string;
  startTime: number;
  endTime: number;
  points: number;
  souls: number;
  active: boolean;
  phase: GamePhase;
  roomId: number;
  health: number;
  maxHealth: number;
  battlePoints: number;
}

export interface Room {
  id: number;
  name: string;
  difficulty: number;
  souls: number;
  explored: boolean;
  description: string;
}

export interface Battle {
  id: string;
  opponentHealth: number;
  playerHealth: number;
  playerDamage: number;
  opponentDamage: number;
  active: boolean;
  winner?: string;
}

export interface SoulAnimation {
  id: string;
  x: number;
  y: number;
  value: number;
}

export interface Transaction {
  id: string;
  type: 'COLLECT_SOULS' | 'START_BATTLE' | 'CLAIM_REWARDS' | 'START_SESSION' | 'END_SESSION';
  status: 'PENDING' | 'CONFIRMED' | 'FAILED';
  hash?: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  data: any;
  timestamp: number;
  error?: string;
}

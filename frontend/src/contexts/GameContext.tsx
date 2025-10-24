import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';

type GamePhase = 'PRE_GAME' | 'EXPLORATION' | 'BATTLE' | 'REWARDS';

interface GameSession {
  id: string;
  player: string;
  startTime: number;
  endTime: number;
  points: number;
  souls: number;
  active: boolean;
  phase: GamePhase;
}

interface PlayerStats {
  address: string;
  level: number;
  experience: number;
  totalPoints: number;
  totalSouls: number;
  battlesWon: number;
  roomsExplored: number;
  nftsOwned: number;
}

interface GameContextType {
  session: GameSession | null;
  playerStats: PlayerStats | null;
  isLoading: boolean;
  startSession: () => Promise<void>;
  endSession: () => Promise<void>;
  updatePhase: (phase: GamePhase) => void;
  collectSoul: () => void;
  addPoints: (points: number) => void;
  setPlayerStats: (stats: PlayerStats) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [session, setSession] = useState<GameSession | null>(null);
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const startSession = useCallback(async () => {
    setIsLoading(true);
    try {
      const newSession: GameSession = {
        id: `session-${Date.now()}`,
        player: playerStats?.address || '',
        startTime: Date.now(),
        endTime: Date.now() + 120000,
        points: 0,
        souls: 0,
        active: true,
        phase: 'EXPLORATION',
      };
      setSession(newSession);
    } catch (error) {
      console.error('Failed to start session:', error);
    } finally {
      setIsLoading(false);
    }
  }, [playerStats]);

  const endSession = useCallback(async () => {
    if (!session) return;
    
    setIsLoading(true);
    try {
      setSession({
        ...session,
        active: false,
        endTime: Date.now(),
        phase: 'REWARDS',
      });
    } catch (error) {
      console.error('Failed to end session:', error);
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  const updatePhase = useCallback((phase: GamePhase) => {
    if (!session) return;
    setSession({ ...session, phase });
  }, [session]);

  const collectSoul = useCallback(() => {
    if (!session) return;
    setSession({
      ...session,
      souls: session.souls + 1,
      points: session.points + 10,
    });
  }, [session]);

  const addPoints = useCallback((points: number) => {
    if (!session) return;
    setSession({
      ...session,
      points: session.points + points,
    });
  }, [session]);

  const value = useMemo<GameContextType>(() => ({
    session,
    playerStats,
    isLoading,
    startSession,
    endSession,
    updatePhase,
    collectSoul,
    addPoints,
    setPlayerStats,
  }), [session, playerStats, isLoading, startSession, endSession, updatePhase, collectSoul, addPoints]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

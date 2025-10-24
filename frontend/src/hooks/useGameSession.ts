import { useState, useCallback, useEffect } from 'react';
import { useAccount } from 'wagmi';
import type { GameSession, GamePhase } from '../types/game';

export function useGameSession() {
  const { address } = useAccount();
  const [session, setSession] = useState<GameSession | null>(null);
  const [loading, setLoading] = useState(false);

  const startSession = useCallback(async (roomId: number) => {
    if (!address) return;
    
    setLoading(true);
    try {
      const newSession: GameSession = {
        id: `session-${Date.now()}`,
        player: address,
        startTime: Date.now(),
        endTime: Date.now() + 120000,
        points: 0,
        souls: 0,
        active: true,
        phase: 'PRE_GAME',
        roomId,
        health: 100,
        maxHealth: 100,
        battlePoints: 0
      };
      
      setSession(newSession);
    } finally {
      setLoading(false);
    }
  }, [address]);

  const updatePhase = useCallback((phase: GamePhase) => {
    setSession(prev => prev ? { ...prev, phase } : null);
  }, []);

  const collectSoul = useCallback(() => {
    setSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        souls: prev.souls + 1,
        points: prev.points + 10
      };
    });
  }, []);

  const takeDamage = useCallback((damage: number) => {
    setSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        health: Math.max(0, prev.health - damage)
      };
    });
  }, []);

  const endSession = useCallback(() => {
    setSession(prev => prev ? { ...prev, active: false } : null);
  }, []);

  useEffect(() => {
    if (!session?.active) return;

    const timer = setInterval(() => {
      const now = Date.now();
      const elapsed = now - session.startTime;
      
      if (elapsed >= 120000) {
        endSession();
      } else if (elapsed < 30000) {
        updatePhase('PRE_GAME');
      } else if (elapsed < 120000 - 30000) {
        updatePhase('EXPLORATION');
      } else {
        updatePhase('BATTLE');
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [session, endSession, updatePhase]);

  const timeRemaining = session?.active 
    ? Math.max(0, Math.floor((session.endTime - Date.now()) / 1000))
    : 0;

  return {
    session,
    loading,
    timeRemaining,
    startSession,
    updatePhase,
    collectSoul,
    takeDamage,
    endSession
  };
}

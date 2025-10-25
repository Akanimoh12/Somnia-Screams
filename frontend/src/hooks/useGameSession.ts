import { useState, useCallback, useEffect } from 'react';
import { useAccount, useWriteContract, useWatchContractEvent, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACTS } from '../contracts/addresses';
import { SomniaScreamsABI } from '../contracts/abis';
import type { GameSession, GamePhase } from '../types/game';

export function useGameSession() {
  const { address } = useAccount();
  const [session, setSession] = useState<GameSession | null>(null);
  const [sessionId, setSessionId] = useState<bigint | null>(null);

  const { 
    data: hash,
    isPending: isStarting,
    writeContract
  } = useWriteContract();

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash,
  });

  useWatchContractEvent({
    address: CONTRACTS.SomniaScreams as `0x${string}`,
    abi: SomniaScreamsABI,
    eventName: 'SessionStarted',
    onLogs: (logs) => {
      logs.forEach((log: any) => {
        if (log.args.player?.toLowerCase() === address?.toLowerCase()) {
          const newSessionId = log.args.sessionId;
          setSessionId(newSessionId);
          
          const newSession: GameSession = {
            id: newSessionId.toString(),
            player: address!,
            startTime: Date.now(),
            endTime: Date.now() + 120000,
            points: 0,
            souls: 0,
            active: true,
            phase: 'PRE_GAME',
            roomId: 1,
            health: 100,
            maxHealth: 100,
            battlePoints: 0
          };
          
          setSession(newSession);
        }
      });
    },
  });

  useWatchContractEvent({
    address: CONTRACTS.SomniaScreams as `0x${string}`,
    abi: SomniaScreamsABI,
    eventName: 'SessionEnded',
    onLogs: (logs) => {
      logs.forEach((log: any) => {
        if (log.args.player?.toLowerCase() === address?.toLowerCase()) {
          setSession(prev => prev ? { ...prev, active: false } : null);
        }
      });
    },
  });

  const startSession = useCallback(async () => {
    if (!address || !CONTRACTS.SomniaScreams) return;
    
    try {
      writeContract({
        address: CONTRACTS.SomniaScreams as `0x${string}`,
        abi: SomniaScreamsABI,
        functionName: 'startGameSession',
      });
    } catch (error) {
      console.error('Failed to start session:', error);
    }
  }, [address, writeContract]);

  const exitSession = useCallback(async () => {
    if (!sessionId || !CONTRACTS.SomniaScreams) return;
    
    try {
      writeContract({
        address: CONTRACTS.SomniaScreams as `0x${string}`,
        abi: SomniaScreamsABI,
        functionName: 'exitSession',
        args: [sessionId],
      });
    } catch (error) {
      console.error('Failed to exit session:', error);
    }
  }, [sessionId, writeContract]);

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
    exitSession();
  }, [exitSession]);

  useEffect(() => {
    if (!session?.active) return;

    const timer = setInterval(() => {
      const now = Date.now();
      const elapsed = now - session.startTime;
      
      if (elapsed >= 120000) {
        endSession();
      } else if (elapsed < 30000) {
        updatePhase('PRE_GAME');
      } else if (elapsed < 90000) {
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
    loading: isStarting || isConfirming,
    timeRemaining,
    startSession,
    updatePhase,
    collectSoul,
    takeDamage,
    endSession
  };
}

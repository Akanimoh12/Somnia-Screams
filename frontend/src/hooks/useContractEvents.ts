import { useCallback, useState } from 'react';
import { useWatchContractEvent } from 'wagmi';
import type { Log } from 'viem';

export function useContractEvents() {
  const [events, setEvents] = useState<Log[]>([]);

  const addEvent = useCallback((log: Log) => {
    setEvents(prev => [...prev, log]);
  }, []);

  return {
    events,
    addEvent
  };
}

export function useSoulCollectedEvent(
  address?: `0x${string}`,
  abi?: any[],
  onSoulCollected?: (player: string, souls: number) => void
) {
  useWatchContractEvent({
    address,
    abi,
    eventName: 'SoulCollected',
    onLogs(logs) {
      if (logs.length > 0 && onSoulCollected) {
        onSoulCollected('', 0);
      }
    },
  });
}

export function useBattleEvent(
  address?: `0x${string}`,
  abi?: any[],
  onBattleStart?: () => void,
  onBattleEnd?: (winner: string) => void
) {
  useWatchContractEvent({
    address,
    abi,
    eventName: 'BattleStarted',
    onLogs() {
      onBattleStart?.();
    },
  });

  useWatchContractEvent({
    address,
    abi,
    eventName: 'BattleEnded',
    onLogs(logs) {
      if (logs.length > 0) {
        onBattleEnd?.('');
      }
    },
  });
}

export function useSessionEvents(
  address?: `0x${string}`,
  abi?: any[],
  onSessionStart?: (sessionId: string) => void,
  onSessionEnd?: (sessionId: string, points: number) => void
) {
  useWatchContractEvent({
    address,
    abi,
    eventName: 'SessionStarted',
    onLogs(logs) {
      if (logs.length > 0) {
        onSessionStart?.('');
      }
    },
  });

  useWatchContractEvent({
    address,
    abi,
    eventName: 'SessionEnded',
    onLogs(logs) {
      if (logs.length > 0) {
        onSessionEnd?.('', 0);
      }
    },
  });
}

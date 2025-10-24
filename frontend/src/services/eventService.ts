import type { Log } from 'viem';

export interface ParsedEvent {
  eventName: string;
  args: Record<string, any>;
  blockNumber: bigint;
  transactionHash: string;
  timestamp: number;
}

class EventService {
  private readonly listeners: Map<string, ((event: ParsedEvent) => void)[]> = new Map();

  subscribe(eventName: string, callback: (event: ParsedEvent) => void) {
    const callbacks = this.listeners.get(eventName) || [];
    callbacks.push(callback);
    this.listeners.set(eventName, callbacks);

    return () => {
      const current = this.listeners.get(eventName) || [];
      this.listeners.set(
        eventName,
        current.filter(cb => cb !== callback)
      );
    };
  }

  emit(eventName: string, event: ParsedEvent) {
    const callbacks = this.listeners.get(eventName) || [];
    for (const cb of callbacks) {
      cb(event);
    }
  }

  parseLog(log: Log): ParsedEvent {
    return {
      eventName: 'Unknown',
      args: {},
      blockNumber: log.blockNumber || 0n,
      transactionHash: log.transactionHash || '',
      timestamp: Date.now()
    };
  }

  clear() {
    this.listeners.clear();
  }
}

export const eventService = new EventService();

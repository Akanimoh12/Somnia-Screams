import { createContext, useContext, ReactNode } from 'react';

// Global game state context
interface GameContextType {
  // Game state will be defined here
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  return (
    <GameContext.Provider value={{}}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

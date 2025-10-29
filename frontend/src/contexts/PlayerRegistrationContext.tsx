/**
 * Player Registration Context
 * 
 * Provides shared registration state across the entire application.
 * This ensures modal state is synchronized everywhere.
 */

import { createContext, useContext, ReactNode } from 'react';
import { usePlayerRegistration } from '../hooks/usePlayerRegistration';

type PlayerRegistrationContextType = ReturnType<typeof usePlayerRegistration>;

const PlayerRegistrationContext = createContext<PlayerRegistrationContextType | undefined>(undefined);

export function PlayerRegistrationProvider({ children }: { children: ReactNode }) {
  const registration = usePlayerRegistration();

  console.log('🌐 [PlayerRegistrationContext] Provider render - shouldShowModal:', registration.shouldShowModal);

  return (
    <PlayerRegistrationContext.Provider value={registration}>
      {children}
    </PlayerRegistrationContext.Provider>
  );
}

export function usePlayerRegistrationContext() {
  const context = useContext(PlayerRegistrationContext);
  if (context === undefined) {
    throw new Error('usePlayerRegistrationContext must be used within PlayerRegistrationProvider');
  }
  return context;
}

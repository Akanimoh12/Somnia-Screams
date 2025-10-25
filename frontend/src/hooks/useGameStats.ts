import { useReadContract } from 'wagmi';
import { GameStateABI } from '../contracts/abis';
import { CONTRACTS } from '../config/contracts';

interface GlobalState {
  totalSessions: bigint;
  activeSessions: bigint;
  totalPlayers: bigint;
  totalSoulsCollected: bigint;
  totalBattles: bigint;
  maintenanceMode: boolean;
}

export const useGameStats = () => {
  // Get global state from contract
  const { data: globalState, isLoading, error, refetch } = useReadContract({
    address: CONTRACTS.GameState,
    abi: GameStateABI,
    functionName: 'getGlobalState',
    query: {
      refetchInterval: 30000, // Refetch every 30 seconds
      staleTime: 20000,
    },
  });

  // Check if in maintenance mode
  const { data: isInMaintenance } = useReadContract({
    address: CONTRACTS.GameState,
    abi: GameStateABI,
    functionName: 'isInMaintenance',
    query: {
      refetchInterval: 60000, // Check every minute
    },
  });

  const state = globalState as GlobalState | undefined;

  return {
    // Raw data
    globalState: state,
    
    // Formatted stats (convert BigInt to Number for display)
    totalPlayers: state ? Number(state.totalPlayers) : 0,
    totalSessions: state ? Number(state.totalSessions) : 0,
    activeSessions: state ? Number(state.activeSessions) : 0,
    totalSoulsCollected: state ? Number(state.totalSoulsCollected) : 0,
    totalBattles: state ? Number(state.totalBattles) : 0,
    
    // Maintenance status
    isInMaintenance: isInMaintenance ?? false,
    
    // Loading states
    isLoading,
    error,
    
    // Manual refetch
    refetch,
  };
};

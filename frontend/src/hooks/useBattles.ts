import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { SpectralBattlesABI } from '../contracts/abis';
import { CONTRACTS } from '../config/contracts';

interface BattleData {
  player: string;
  startTime: bigint;
  enemyType: number;
  enemyPower: number;
  playerPower: number;
  active: boolean;
  victory: boolean;
}

export const useBattles = () => {
  const { address } = useAccount();
  const [activeBattleId, setActiveBattleId] = useState<bigint | null>(null);

  // Read active battle
  const { data: activeBattle } = useReadContract({
    address: CONTRACTS.SpectralBattles,
    abi: SpectralBattlesABI,
    functionName: 'activeBattles',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 5000,
    },
  });

  // Check if player is in battle
  const { data: isInBattle } = useReadContract({
    address: CONTRACTS.SpectralBattles,
    abi: SpectralBattlesABI,
    functionName: 'isInBattle',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 3000,
    },
  });

  // Get player battle stats
  const { data: battleStats } = useReadContract({
    address: CONTRACTS.SpectralBattles,
    abi: SpectralBattlesABI,
    functionName: 'getPlayerBattleStats',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  }) as { data: [bigint, bigint] | undefined };

  // Get battle data
  const { data: battleData } = useReadContract({
    address: CONTRACTS.SpectralBattles,
    abi: SpectralBattlesABI,
    functionName: 'getBattleData',
    args: activeBattle ? [activeBattle] : undefined,
    query: {
      enabled: !!activeBattle && activeBattle > 0n,
      refetchInterval: 5000,
    },
  });

  // Start battle
  const { writeContractAsync: startBattle, isPending: isStarting } = useWriteContract();

  // Resolve battle
  const { writeContractAsync: resolveBattle, isPending: isResolving } = useWriteContract();

  const handleStartBattle = async (roomId: bigint) => {
    if (!address) return;

    try {
      await startBattle({
        address: CONTRACTS.SpectralBattles,
        abi: SpectralBattlesABI,
        functionName: 'startBattle',
        args: [address, roomId],
      });
    } catch (error) {
      console.error('Failed to start battle:', error);
      throw error;
    }
  };

  const handleResolveBattle = async (battleId: bigint) => {
    try {
      const result = await resolveBattle({
        address: CONTRACTS.SpectralBattles,
        abi: SpectralBattlesABI,
        functionName: 'resolveBattle',
        args: [battleId],
      });
      return result;
    } catch (error) {
      console.error('Failed to resolve battle:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (activeBattle && activeBattle > 0n) {
      setActiveBattleId(activeBattle);
    }
  }, [activeBattle]);

  return {
    // Data
    isInBattle: isInBattle ?? false,
    activeBattleId,
    battleData: battleData as BattleData | undefined,
    battleStats: battleStats
      ? { total: battleStats[0], won: battleStats[1] }
      : { total: 0n, won: 0n },

    // Actions
    startBattle: handleStartBattle,
    resolveBattle: handleResolveBattle,

    // Loading states
    isStarting,
    isResolving,
  };
};

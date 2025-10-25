import { useState, useCallback, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWatchContractEvent, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACTS } from '../contracts/addresses';
import { SoulCollectorABI } from '../contracts/abis';

interface SoulQueue {
  count: number;
  points: number;
  pending: boolean;
}

const BATCH_LIMIT = 10; // Souls to collect before auto-submit
const SOUL_POINTS = 10; // Points per soul

export function useSoulCollection(sessionId: bigint | null) {
  const { address } = useAccount();
  const [soulQueue, setSoulQueue] = useState<SoulQueue>({ count: 0, points: 0, pending: false });
  const [optimisticCount, setOptimisticCount] = useState(0);

  // Read collection data from contract
  const { data: collectionData, refetch } = useReadContract({
    address: CONTRACTS.SoulCollector as `0x${string}`,
    abi: SoulCollectorABI,
    functionName: 'getCollectionData',
    args: address && sessionId ? [address, sessionId] : undefined,
    query: {
      enabled: !!address && !!sessionId && !!CONTRACTS.SoulCollector,
      refetchInterval: 30000,
    }
  });

  // Read pending batch points
  const { data: pendingPoints } = useReadContract({
    address: CONTRACTS.SoulCollector as `0x${string}`,
    abi: SoulCollectorABI,
    functionName: 'getPendingBatchPoints',
    args: address && sessionId ? [address, sessionId] : undefined,
    query: {
      enabled: !!address && !!sessionId && !!CONTRACTS.SoulCollector,
    }
  });

  // Write contract for batch collection
  const {
    data: batchHash,
    isPending: isBatching,
    writeContract
  } = useWriteContract();

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: batchHash,
  });

  // Listen for soul collected events
  useWatchContractEvent({
    address: CONTRACTS.SoulCollector as `0x${string}`,
    abi: SoulCollectorABI,
    eventName: 'SoulCollected',
    onLogs: (logs) => {
      logs.forEach((log: any) => {
        if (
          log.args.player?.toLowerCase() === address?.toLowerCase() &&
          log.args.sessionId === sessionId
        ) {
          refetch();
        }
      });
    },
  });

  // Listen for batch collected events
  useWatchContractEvent({
    address: CONTRACTS.SoulCollector as `0x${string}`,
    abi: SoulCollectorABI,
    eventName: 'SoulsBatchCollected',
    onLogs: (logs) => {
      logs.forEach((log: any) => {
        if (
          log.args.player?.toLowerCase() === address?.toLowerCase() &&
          log.args.sessionId === sessionId
        ) {
          // Reset queue after successful batch
          setSoulQueue({ count: 0, points: 0, pending: false });
          setOptimisticCount(0);
          refetch();
        }
      });
    },
  });

  // Collect a single soul (optimistic update)
  const collectSoul = useCallback(() => {
    if (!address || !sessionId) return;

    // Optimistic update
    setOptimisticCount(prev => prev + 1);
    setSoulQueue(prev => ({
      count: prev.count + 1,
      points: prev.points + SOUL_POINTS,
      pending: prev.pending
    }));

    // Auto-submit if we reach batch limit
    if (soulQueue.count + 1 >= BATCH_LIMIT) {
      submitBatch();
    }
  }, [address, sessionId, soulQueue.count]);

  // Submit batch to blockchain
  const submitBatch = useCallback(async () => {
    if (!address || !sessionId || !CONTRACTS.SoulCollector || soulQueue.count === 0) {
      return;
    }

    try {
      setSoulQueue(prev => ({ ...prev, pending: true }));
      
      writeContract({
        address: CONTRACTS.SoulCollector as `0x${string}`,
        abi: SoulCollectorABI,
        functionName: 'batchCollectSouls',
        args: [address, sessionId, BigInt(soulQueue.count)],
      });
    } catch (error) {
      console.error('Failed to submit soul batch:', error);
      setSoulQueue(prev => ({ ...prev, pending: false }));
    }
  }, [address, sessionId, soulQueue.count, writeContract]);

  // Force process pending batch on session end
  const forceProcessBatch = useCallback(async () => {
    if (!address || !sessionId || !CONTRACTS.SoulCollector) {
      return;
    }

    try {
      writeContract({
        address: CONTRACTS.SoulCollector as `0x${string}`,
        abi: SoulCollectorABI,
        functionName: 'forceBatchProcess',
        args: [address, sessionId],
      });
    } catch (error) {
      console.error('Failed to force process batch:', error);
    }
  }, [address, sessionId, writeContract]);

  // Auto-submit on session end
  useEffect(() => {
    if (!sessionId && soulQueue.count > 0) {
      submitBatch();
    }
  }, [sessionId, soulQueue.count, submitBatch]);

  const totalSoulsCollected = collectionData ? Number(collectionData[0]) : 0;
  const pendingBatchSize = collectionData ? Number(collectionData[1]) : 0;
  const lastCollectionTime = collectionData ? Number(collectionData[2]) : 0;

  return {
    // Real data from contract
    totalSoulsCollected,
    pendingBatchSize,
    lastCollectionTime,
    pendingPoints: pendingPoints ? Number(pendingPoints) : 0,
    
    // Optimistic local state
    queuedSouls: soulQueue.count,
    queuedPoints: soulQueue.points,
    optimisticCount,
    
    // Display count (real + optimistic)
    displayCount: totalSoulsCollected + optimisticCount,
    
    // Status
    loading: isBatching || isConfirming,
    isPending: soulQueue.pending,
    shouldAutoSubmit: soulQueue.count >= BATCH_LIMIT,
    
    // Actions
    collectSoul,
    submitBatch,
    forceProcessBatch,
    refetch,
  };
}

import { useState, useCallback, useEffect } from 'react';
import { useAccount, useWriteContract, useWatchContractEvent, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { CONTRACTS } from '../contracts/addresses';
import { SomniaScreamsABI } from '../contracts/abis';
import type { GameSession, GamePhase } from '../types/game';

export function useGameSession() {
  const { address } = useAccount();
  const [session, setSession] = useState<GameSession | null>(null);
  const [sessionId, setSessionId] = useState<bigint | null>(null);

  // Start session transaction
  const { 
    data: hash,
    isPending: isStarting,
    writeContract,
    error: writeError,
  } = useWriteContract();

  const { 
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  // Poll for active session - check on mount AND after transaction confirms
  const { data: activeSessionId, refetch: refetchActiveSession } = useReadContract({
    address: CONTRACTS.GameSession as `0x${string}`,
    abi: [{
      "type": "function",
      "name": "getPlayerActiveSession",
      "inputs": [
        { "name": "player", "type": "address", "internalType": "address" }
      ],
      "outputs": [
        { "name": "", "type": "uint256", "internalType": "uint256" }
      ],
      "stateMutability": "view"
    }],
    functionName: 'getPlayerActiveSession',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address, // Always poll when address is available
      refetchInterval: 2000, // Poll every 2 seconds to detect existing or new sessions
    },
  });

  // When we get an active session ID, create the session object
  useEffect(() => {
    console.log('🔍 [useGameSession] Polling check - activeSessionId:', activeSessionId?.toString(), 'session exists:', !!session, 'isConfirmed:', isConfirmed);
    
    if (activeSessionId && activeSessionId > 0n && !session) {
      console.log('✅ [useGameSession] Active session found via polling:', activeSessionId.toString());
      setSessionId(activeSessionId);
      
      const newSession: GameSession = {
        id: activeSessionId.toString(),
        player: address!,
        startTime: Date.now(),
        endTime: Date.now() + 120000, // 2 minutes
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
  }, [activeSessionId, session, address, isConfirmed]);

  // Claim rewards transaction
  const {
    data: claimHash,
    isPending: isClaimPending,
    writeContract: claimWrite,
    error: claimError,
  } = useWriteContract();

  const { 
    isLoading: isClaimConfirming,
    isSuccess: isClaimSuccess,
  } = useWaitForTransactionReceipt({
    hash: claimHash,
  });

  // Listen to GameSession contract events, not SomniaScreams!
  useWatchContractEvent({
    address: CONTRACTS.GameSession as `0x${string}`,
    abi: [{
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "sessionId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "player",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "SessionStarted",
      "type": "event"
    }],
    eventName: 'SessionStarted',
    onLogs: (logs) => {
      console.log('📢 [useGameSession] SessionStarted event received:', logs);
      logs.forEach((log: any) => {
        console.log('📢 [useGameSession] Event args:', log.args);
        console.log('📢 [useGameSession] Player from event:', log.args.player);
        console.log('📢 [useGameSession] Current address:', address);
        
        if (log.args.player?.toLowerCase() === address?.toLowerCase()) {
          const newSessionId = log.args.sessionId;
          console.log('✅ [useGameSession] Session started for current player! ID:', newSessionId.toString());
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
    address: CONTRACTS.GameSession as `0x${string}`,
    abi: [{
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "sessionId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "player",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "points",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "souls",
          "type": "uint256"
        }
      ],
      "name": "SessionEnded",
      "type": "event"
    }],
    eventName: 'SessionEnded',
    onLogs: (logs) => {
      console.log('📢 [useGameSession] SessionEnded event received:', logs);
      logs.forEach((log: any) => {
        if (log.args.player?.toLowerCase() === address?.toLowerCase()) {
          console.log('✅ [useGameSession] Session ended for current player');
          setSession(prev => prev ? { ...prev, active: false } : null);
        }
      });
    },
  });

  const startSession = useCallback(async () => {
    console.log('🎲 [useGameSession] startSession called');
    console.log('🎲 [useGameSession] address:', address);
    console.log('🎲 [useGameSession] CONTRACTS.SomniaScreams:', CONTRACTS.SomniaScreams);
    
    if (!address || !CONTRACTS.SomniaScreams) {
      console.error('❌ [useGameSession] Missing address or contract');
      return;
    }
    
    try {
      console.log('📝 [useGameSession] Calling startGameSession...');
      writeContract({
        address: CONTRACTS.SomniaScreams as `0x${string}`,
        abi: SomniaScreamsABI,
        functionName: 'startGameSession',
      });
      console.log('✅ [useGameSession] startGameSession transaction submitted, waiting for confirmation...');
    } catch (error) {
      console.error('❌ [useGameSession] Failed to start session:', error);
      throw error;
    }
  }, [address, writeContract]);

  // Watch for transaction hash to appear
  useEffect(() => {
    if (hash) {
      console.log('📝 [useGameSession] Transaction hash received:', hash);
      console.log('⏳ [useGameSession] Waiting for confirmation...');
    }
    if (writeError) {
      console.error('❌ [useGameSession] Transaction submission error:', writeError);
    }
  }, [hash, writeError]);

  // Watch for confirmation
  useEffect(() => {
    if (hash) {
      console.log('⏳ [useGameSession] Transaction status - isConfirming:', isConfirming, 'isStarting:', isStarting, 'isConfirmed:', isConfirmed);
      
      if (receiptError) {
        console.error('❌ [useGameSession] Transaction receipt error:', receiptError);
      }
      
      if (isConfirmed) {
        console.log('✅ [useGameSession] Transaction confirmed!');
        console.log('👂 [useGameSession] Now listening for SessionStarted event...');
        console.log('🔍 [useGameSession] Polling for active session...');
      }
    }
  }, [hash, isConfirming, isStarting, isConfirmed, receiptError]);

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

  const claimSessionRewards = useCallback(async (sessId: bigint) => {
    console.log('💎 [useGameSession] claimSessionRewards called');
    console.log('💎 [useGameSession] sessionId:', sessId.toString());
    
    if (!address || !CONTRACTS.SomniaScreams) {
      console.error('❌ [useGameSession] Missing address or contract');
      throw new Error('Wallet not connected or contract not found');
    }

    // Check if session is already rewarded
    if (session && session.id === sessId.toString() && (session as any).rewarded) {
      console.error('❌ [useGameSession] Rewards already claimed');
      throw new Error('Rewards already claimed for this session');
    }

    try {
      console.log('📝 [useGameSession] Calling claimSessionRewards contract...');
      claimWrite({
        address: CONTRACTS.SomniaScreams as `0x${string}`,
        abi: SomniaScreamsABI,
        functionName: 'claimSessionRewards',
        args: [sessId],
      });
      console.log('✅ [useGameSession] claimSessionRewards transaction submitted');
    } catch (error) {
      console.error('❌ [useGameSession] Failed to claim rewards:', error);
      throw error;
    }
  }, [address, claimWrite, session]);

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
    endSession,
    claimSessionRewards,
    isClaiming: isClaimPending || isClaimConfirming,
    isClaimSuccess,
    claimError,
    claimHash,
  };
}

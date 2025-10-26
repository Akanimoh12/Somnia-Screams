import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Wallet } from 'lucide-react';
import GameCanvas from '../components/game/GameCanvas';
import PlayerHUD from '../components/game/PlayerHUD';
import ActionPanel from '../components/game/ActionPanel';
import HauntedRoom from '../components/game/HauntedRoom';
import SoulCollector from '../components/game/SoulCollector';
import BattleArena from '../components/game/BattleArena';
import TransactionQueue from '../components/web3/TransactionQueue';
import RewardsSummaryModal from '../components/common/modals/RewardsSummaryModal';
import { useGameSession } from '../hooks/useGameSession';
import { usePlayerStats } from '../hooks/usePlayerStats';
import { useTransactionQueue } from '../hooks/useTransactionQueue';
import { useBattles } from '../hooks/useBattles';
import { useRooms } from '../hooks/useRooms';
import { useSoulCollection } from '../hooks/useSoulCollection';
import { usePlayerRegistration } from '../hooks/usePlayerRegistration';

// Available room IDs (1-50 based on MAX_ROOMS constant in contract)
const AVAILABLE_ROOM_IDS = [1, 2, 3, 4, 5];

export default function GameArena() {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { 
    session, 
    timeRemaining, 
    startSession,
    claimSessionRewards,
    isClaiming,
    isClaimSuccess,
    claimError
  } = useGameSession();
  const { stats, fetchStats } = usePlayerStats();
  const { queue, addTransaction, clearQueue } = useTransactionQueue();
  const { checkAndShowRegistration } = usePlayerRegistration();
  
  // Soul collection system - batch souls to blockchain
  const { 
    queuedSouls, 
    queuedPoints,
    displayCount,
    loading: isSoulProcessing,
    isPending,
    collectSoul: collectSoulToBlockchain,
    submitBatch,
    forceProcessBatch
  } = useSoulCollection(session?.id ? BigInt(session.id) : null);
  
  // Real battle system from blockchain
  const { 
    isInBattle, 
    activeBattleId, 
    battleData, 
    battleStats,
    startBattle, 
    resolveBattle,
    isStarting,
    isResolving 
  } = useBattles();

  // Real rooms system from blockchain
  const { 
    roomData, 
    selectedRoomId, 
    setSelectedRoomId, 
    enterRoom, 
    roomHistory 
  } = useRooms();
  
  const [currentRoomId, setCurrentRoomId] = useState<number | null>(null);
  const [showConnectPrompt, setShowConnectPrompt] = useState(false);
  const [battleResolved, setBattleResolved] = useState(false);
  const [showRewardsModal, setShowRewardsModal] = useState(false);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Handle successful reward claims
  useEffect(() => {
    if (isClaimSuccess && session) {
      // Refetch player stats to show updated values
      fetchStats();
      
      // Show rewards summary modal
      setShowRewardsModal(true);
    }
  }, [isClaimSuccess, session, fetchStats]);

  // Auto-start battle when entering BATTLE phase and not already in battle
  useEffect(() => {
    const shouldStartBattle = session?.phase === 'BATTLE' && 
                              !isInBattle && 
                              !isStarting && 
                              currentRoomId !== null &&
                              !battleResolved;
    
    if (shouldStartBattle) {
      handleStartBattle(BigInt(currentRoomId!));
    }
  }, [session?.phase, isInBattle, isStarting, currentRoomId, battleResolved]);

  const handleStartSession = async (roomId: number) => {
    if (!isConnected) {
      setShowConnectPrompt(true);
      return;
    }

    // Check if user needs to register/create profile
    const needsRegistration = checkAndShowRegistration();
    if (needsRegistration) {
      return; // Stop here, modal will show
    }

    setCurrentRoomId(roomId);
    setSelectedRoomId(BigInt(roomId));
    setBattleResolved(false);
    
    // Enter room on blockchain
    try {
      await enterRoom(BigInt(roomId));
      addTransaction('START_SESSION', { roomId }, 'HIGH');
    } catch (error) {
      console.error('Failed to enter room:', error);
    }
    
    // Start game session
    await startSession();
  };

  const handleStartBattle = async (roomId: bigint) => {
    if (!address || isStarting) return;
    
    try {
      await startBattle(roomId);
      addTransaction('START_BATTLE', { roomId: Number(roomId) }, 'HIGH');
    } catch (error) {
      console.error('Failed to start battle:', error);
    }
  };

  const handleAttack = async () => {
    if (!activeBattleId || !battleData || isResolving) return;

    // Battle resolution happens on blockchain after BATTLE_PHASE duration
    const battleDuration = Date.now() / 1000 - Number(battleData.startTime);
    const BATTLE_PHASE_SECONDS = 30; // 30 seconds battle phase

    if (battleDuration >= BATTLE_PHASE_SECONDS && !battleResolved) {
      try {
        await resolveBattle(activeBattleId);
        setBattleResolved(true);
        addTransaction('CLAIM_REWARDS', { battleId: Number(activeBattleId) }, 'HIGH');
      } catch (error) {
        console.error('Failed to resolve battle:', error);
      }
    }
  };

  const handleCollectSoul = () => {
    // Collect soul via blockchain hook (optimistic update + auto-batching)
    collectSoulToBlockchain();
    addTransaction('COLLECT_SOULS', { count: 1 }, 'MEDIUM');
  };

  const handleRewardsModalClose = () => {
    setShowRewardsModal(false);
    // Navigate to dashboard after modal closes
    navigate('/dashboard');
  };

  const handleClaimRewards = async () => {
    if (!session?.id) {
      console.error('No active session to claim rewards for');
      return;
    }

    // Force process any remaining queued souls before claiming rewards
    if (queuedSouls > 0) {
      try {
        await forceProcessBatch();
      } catch (error) {
        console.error('Failed to process remaining souls:', error);
      }
    }
    
    try {
      // Call contract to claim session rewards
      const sessId = BigInt(session.id);
      await claimSessionRewards(sessId);
      
      // Transaction submitted, UI will show loading state via isClaiming
      addTransaction('CLAIM_REWARDS', { points: session?.points, souls: session?.souls }, 'CRITICAL');
    } catch (error) {
      console.error('Failed to claim rewards:', error);
      // User will see error via claimError state
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold title-font text-accent-orange text-center mb-12 glow-text">
            SELECT YOUR ROOM
          </h1>

          {showConnectPrompt && (
            <div className="bg-linear-to-br from-accent-orange/10 to-accent-purple/10 border-2 border-accent-orange/30 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-accent-orange/20 rounded-lg">
                    <Wallet className="w-6 h-6 text-accent-orange" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1 ui-font">
                      Connect Wallet to Play
                    </h3>
                    <p className="text-sm text-text-secondary ui-font">
                      You need to connect your wallet to start a game session
                    </p>
                  </div>
                </div>
                <ConnectButton />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {AVAILABLE_ROOM_IDS.map(roomId => {
              // Check if room is completed (in history)
              const isCompleted = roomHistory?.includes(BigInt(roomId)) ?? false;
              const isFirstClear = !isCompleted;
              
              const roomDescription = roomId === 1 ? 'Ancient tomes whisper secrets' :
                                     roomId === 2 ? 'Ghostly dancers waltz eternally' :
                                     roomId === 3 ? 'Shadows move with intent' :
                                     roomId === 4 ? 'Cursed artifacts await' :
                                     'Dark forces gather';
              
              // For now, we'll show generic data. In production, you'd fetch each room's data
              // when the component mounts using multiple useReadContract hooks
              const estimatedDifficulty = roomId;
              const estimatedSouls = roomId * 15;
              const estimatedPoints = roomId * 100;
              
              return (
                <HauntedRoom
                  key={roomId}
                  room={{
                    id: roomId,
                    name: `Haunted Room ${roomId}`,
                    difficulty: estimatedDifficulty,
                    souls: estimatedSouls,
                    explored: isCompleted,
                    description: roomDescription,
                    // Blockchain data (will be fetched when room is selected)
                    basePoints: estimatedPoints,
                    soulCount: estimatedSouls,
                    enemyType: (roomId % 5) as number, // 0-4 enemy types
                    hasChest: roomId % 2 === 0, // Even rooms have chests
                    requiresPuzzle: roomId >= 3, // Rooms 3+ require puzzles
                    isCompleted,
                    isFirstClear,
                  }}
                  onExplore={() => handleStartSession(roomId)}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <GameCanvas phase={session.phase} timeRemaining={timeRemaining}>
        <PlayerHUD session={session} stats={stats || undefined} />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {session.phase === 'EXPLORATION' && (
            <>
              <div>
                {roomData ? (
                  <div className="bg-bg-card border-2 border-border-color rounded-lg p-6">
                    <h3 className="text-2xl header-font text-accent-orange mb-4">Room {Number(selectedRoomId)}</h3>
                    <div className="space-y-2 ui-font">
                      <p className="text-text-secondary">Difficulty: <span className="text-accent-orange">{roomData.difficulty}/5</span></p>
                      <p className="text-text-secondary">Souls Available: <span className="text-accent-purple">{Number(roomData.soulCount)}</span></p>
                      <p className="text-text-secondary">Enemy Type: <span className="text-accent-red">{roomData.enemyType}</span></p>
                      {roomData.hasChest && <p className="text-success">💎 Contains Treasure Chest!</p>}
                      {roomData.requiresPuzzle && <p className="text-warning">🧩 Puzzle Required</p>}
                    </div>
                  </div>
                ) : (
                  <div className="text-text-secondary ui-font">Loading room data...</div>
                )}
              </div>
              <div>
                <SoulCollector souls={displayCount} onCollect={handleCollectSoul} />
                
                {/* Queued Souls Indicator & Batch Submit */}
                <div className="mt-4 bg-bg-card border-2 border-border-color rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${isPending ? 'bg-warning animate-pulse' : 'bg-success'}`} />
                      <span className="text-sm ui-font text-text-secondary">Queued for Batch:</span>
                      <span className="text-lg font-bold stat-font text-accent-purple">
                        {queuedSouls}/10
                      </span>
                    </div>
                    {queuedPoints > 0 && (
                      <span className="text-sm ui-font text-text-muted">
                        +{queuedPoints} pts pending
                      </span>
                    )}
                  </div>
                  
                  {queuedSouls > 0 && (
                    <button
                      onClick={submitBatch}
                      disabled={isPending || isSoulProcessing}
                      className={`w-full py-2 px-4 rounded-lg font-bold ui-font transition-all ${
                        isPending || isSoulProcessing
                          ? 'bg-bg-secondary text-text-muted cursor-not-allowed'
                          : 'bg-accent-purple hover:bg-accent-purple/80 text-white hover:scale-105'
                      }`}
                    >
                      {isPending || isSoulProcessing ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing Batch...
                        </span>
                      ) : (
                        `Submit Batch (${queuedSouls} souls)`
                      )}
                    </button>
                  )}
                  
                  <p className="text-xs text-text-muted ui-font mt-2 text-center">
                    {queuedSouls >= 10 
                      ? '⚡ Auto-submit ready!' 
                      : 'Collect 10 souls to auto-submit or submit manually'}
                  </p>
                </div>
              </div>
            </>
          )}

          {session.phase === 'BATTLE' && (
            <div className="lg:col-span-2">
              {isStarting ? (
                <div className="bg-bg-card border-2 border-accent-orange rounded-lg p-12 text-center">
                  <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-accent-orange mb-6"></div>
                  <p className="text-xl text-text-secondary ui-font">Summoning enemy...</p>
                  <p className="text-sm text-text-secondary/70 ui-font mt-2">Preparing battle arena</p>
                </div>
              ) : battleData && battleData.active ? (
                <BattleArena 
                  battle={{
                    id: `battle-${activeBattleId}`,
                    opponentHealth: Number(battleData.enemyPower),
                    playerHealth: Number(battleData.playerPower),
                    playerDamage: 10,
                    opponentDamage: 15,
                    active: true
                  }} 
                  onAttack={handleAttack} 
                />
              ) : battleData && !battleData.active ? (
                <div className="bg-bg-card border-2 border-success rounded-lg p-12 text-center">
                  <h3 className="text-3xl header-font text-success mb-4">
                    {battleData.victory ? '🎉 Victory!' : '💀 Defeat'}
                  </h3>
                  <p className="text-xl text-text-secondary ui-font">
                    {battleData.victory ? 'You defeated the enemy!' : 'You were defeated...'}
                  </p>
                </div>
              ) : (
                <div className="bg-bg-card border-2 border-border-color rounded-lg p-12 text-center">
                  <p className="text-text-secondary ui-font">Loading battle data from blockchain...</p>
                </div>
              )}
            </div>
          )}

          {session.phase === 'REWARDS' && (
            <div className="lg:col-span-2 text-center">
              <div className="bg-bg-card border-2 border-success/30 rounded-lg p-8">
                <h2 className="text-3xl font-bold header-font text-success mb-6">
                  Session Complete!
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <div>
                    <div className="text-4xl font-bold stat-font text-accent-orange mb-2">
                      {session.souls}
                    </div>
                    <div className="text-sm ui-font text-text-secondary">Souls Collected</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold stat-font text-accent-purple mb-2">
                      {session.points}
                    </div>
                    <div className="text-sm ui-font text-text-secondary">Points Earned</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold stat-font text-success mb-2">
                      {Number(battleStats.won)}
                    </div>
                    <div className="text-sm ui-font text-text-secondary">Battles Won</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold stat-font text-text-secondary mb-2">
                      {Number(battleStats.total)}
                    </div>
                    <div className="text-sm ui-font text-text-secondary">Total Battles</div>
                  </div>
                </div>
                <button
                  onClick={handleClaimRewards}
                  disabled={isClaiming}
                  className={`px-8 py-4 font-bold ui-font rounded-lg transition-all ${
                    isClaiming 
                      ? 'bg-text-secondary cursor-not-allowed' 
                      : 'bg-success text-white hover:shadow-lg hover:shadow-success/50'
                  }`}
                >
                  {isClaiming ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Claiming Rewards...
                    </span>
                  ) : (
                    'Claim Rewards & Return'
                  )}
                </button>
                {claimError && (
                  <div className="mt-4 p-4 bg-danger/20 border border-danger rounded-lg">
                    <p className="text-danger text-sm">{claimError.message || 'Failed to claim rewards. Please try again.'}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {session.phase !== 'REWARDS' && session.active && (
          <div className="mt-8">
            <ActionPanel
              phase={session.phase}
              onMove={() => console.log('Move')}
              onCollect={handleCollectSoul}
              onAttack={handleAttack}
              onClaim={handleClaimRewards}
            />
          </div>
        )}
      </GameCanvas>

      <TransactionQueue transactions={queue} onClear={clearQueue} />

      {/* Rewards Summary Modal */}
      <RewardsSummaryModal
        isOpen={showRewardsModal}
        onClose={handleRewardsModalClose}
        sessionData={{
          souls: session?.souls || 0,
          points: session?.points || 0,
          battlesWon: Number(battleStats?.won || 0),
          totalBattles: Number(battleStats?.total || 0),
        }}
      />
    </>
  );
}

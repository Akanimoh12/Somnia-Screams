import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import GameCanvas from '../components/game/GameCanvas';
import PlayerHUD from '../components/game/PlayerHUD';
import ActionPanel from '../components/game/ActionPanel';
import HauntedRoom from '../components/game/HauntedRoom';
import SoulCollector from '../components/game/SoulCollector';
import BattleArena from '../components/game/BattleArena';
import TransactionQueue from '../components/web3/TransactionQueue';
import { useGameSession } from '../hooks/useGameSession';
import { usePlayerStats } from '../hooks/usePlayerStats';
import { useTransactionQueue } from '../hooks/useTransactionQueue';
import type { Room, Battle } from '../types/game';

const MOCK_ROOMS: Room[] = [
  { id: 1, name: 'Haunted Library', difficulty: 1, souls: 10, explored: false, description: 'Ancient tomes whisper forgotten secrets' },
  { id: 2, name: 'Cursed Ballroom', difficulty: 2, souls: 15, explored: false, description: 'Ghostly dancers waltz eternally' },
  { id: 3, name: 'Dark Cellar', difficulty: 3, souls: 20, explored: false, description: 'Shadows move with malicious intent' }
];

export default function GameArena() {
  const navigate = useNavigate();
  const { address } = useAccount();
  const { session, timeRemaining, startSession, collectSoul, takeDamage, endSession } = useGameSession();
  const { stats, fetchStats } = usePlayerStats();
  const { queue, addTransaction, clearQueue } = useTransactionQueue();
  
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [battle, setBattle] = useState<Battle | null>(null);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    if (session?.phase === 'BATTLE' && !battle) {
      setBattle({
        id: `battle-${Date.now()}`,
        opponentHealth: 100,
        playerHealth: session.health,
        playerDamage: 10,
        opponentDamage: 15,
        active: true
      });
    }
  }, [session?.phase, battle, session?.health]);

  const handleStartSession = async (roomId: number) => {
    const room = MOCK_ROOMS.find(r => r.id === roomId);
    if (!room) return;

    setCurrentRoom(room);
    await startSession(roomId);
    addTransaction('START_SESSION', { roomId }, 'HIGH');
  };

  const handleCollectSoul = () => {
    collectSoul();
    addTransaction('COLLECT_SOULS', { count: 1 }, 'MEDIUM');
  };

  const handleAttack = () => {
    if (!battle) return;

    const newOpponentHealth = Math.max(0, battle.opponentHealth - battle.playerDamage);
    const newPlayerHealth = Math.max(0, battle.playerHealth - battle.opponentDamage);

    setBattle({
      ...battle,
      opponentHealth: newOpponentHealth,
      playerHealth: newPlayerHealth
    });

    takeDamage(battle.opponentDamage);

    if (newOpponentHealth <= 0) {
      setBattle({ ...battle, active: false, winner: address });
      addTransaction('CLAIM_REWARDS', { winner: true }, 'HIGH');
    } else if (newPlayerHealth <= 0) {
      setBattle({ ...battle, active: false, winner: 'opponent' });
      endSession();
    }
  };

  const handleClaimRewards = () => {
    addTransaction('CLAIM_REWARDS', { points: session?.points, souls: session?.souls }, 'CRITICAL');
    setTimeout(() => navigate('/dashboard'), 2000);
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold title-font text-accent-orange text-center mb-12 glow-text">
            SELECT YOUR ROOM
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {MOCK_ROOMS.map(room => (
              <HauntedRoom
                key={room.id}
                room={room}
                onExplore={() => handleStartSession(room.id)}
              />
            ))}
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
                {currentRoom && <HauntedRoom room={currentRoom} />}
              </div>
              <div>
                <SoulCollector souls={session.souls} onCollect={handleCollectSoul} />
              </div>
            </>
          )}

          {session.phase === 'BATTLE' && (
            <div className="lg:col-span-2">
              <BattleArena battle={battle || undefined} onAttack={handleAttack} />
            </div>
          )}

          {session.phase === 'REWARDS' && (
            <div className="lg:col-span-2 text-center">
              <div className="bg-bg-card border-2 border-success/30 rounded-lg p-8">
                <h2 className="text-3xl font-bold header-font text-success mb-6">
                  Session Complete!
                </h2>
                <div className="grid grid-cols-2 gap-6 mb-8">
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
                </div>
                <button
                  onClick={handleClaimRewards}
                  className="px-8 py-4 bg-success text-white font-bold ui-font rounded-lg hover:shadow-lg hover:shadow-success/50 transition-all"
                >
                  Claim Rewards
                </button>
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
    </>
  );
}

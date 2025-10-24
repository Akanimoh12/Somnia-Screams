import { motion } from 'framer-motion';
import { Trophy, Crown, Target, Skull } from 'lucide-react';
import type { LeaderboardEntry } from '../../../hooks/useLeaderboard';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  loading: boolean;
}

export const LeaderboardTable = ({ entries, loading }: LeaderboardTableProps) => {
  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 bg-primary/20 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown size={20} className="text-yellow-400" />;
    if (rank === 2) return <Crown size={18} className="text-gray-400" />;
    if (rank === 3) return <Crown size={16} className="text-amber-700" />;
    return null;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-400';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-amber-700';
    return 'text-white';
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs text-secondary font-bold uppercase">
        <div className="col-span-1">Rank</div>
        <div className="col-span-3">Player</div>
        <div className="col-span-2 text-center">Points</div>
        <div className="col-span-2 text-center">Level</div>
        <div className="col-span-2 text-center">Battles</div>
        <div className="col-span-2 text-center">NFTs</div>
      </div>

      {entries.map((entry, index) => (
        <motion.div
          key={entry.address}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`grid grid-cols-12 gap-4 px-4 py-4 rounded-lg border-2 transition ${
            entry.isCurrentUser
              ? 'bg-warning/10 border-warning'
              : 'bg-secondary border-primary/30 hover:border-primary'
          }`}
        >
          <div className="col-span-1 flex items-center gap-2">
            {getRankIcon(entry.rank)}
            <span className={`font-bold stat-font ${getRankColor(entry.rank)}`}>
              #{entry.rank}
            </span>
          </div>

          <div className="col-span-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-warning to-error flex items-center justify-center">
              <Skull size={16} className="text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">
                {entry.username || formatAddress(entry.address)}
              </div>
              {entry.isCurrentUser && (
                <div className="text-xs text-warning font-bold">You</div>
              )}
            </div>
          </div>

          <div className="col-span-2 flex items-center justify-center">
            <div className="text-center">
              <div className="text-white font-bold stat-font">{entry.points.toLocaleString()}</div>
              <div className="text-xs text-secondary">points</div>
            </div>
          </div>

          <div className="col-span-2 flex items-center justify-center">
            <div className="px-3 py-1 bg-success/20 rounded-full">
              <span className="text-success font-bold">{entry.level}</span>
            </div>
          </div>

          <div className="col-span-2 flex items-center justify-center">
            <div className="flex items-center gap-1">
              <Target size={14} className="text-error" />
              <span className="text-white font-bold">{entry.battlesWon}</span>
            </div>
          </div>

          <div className="col-span-2 flex items-center justify-center">
            <div className="flex items-center gap-1">
              <Trophy size={14} className="text-warning" />
              <span className="text-white font-bold">{entry.nftsOwned}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

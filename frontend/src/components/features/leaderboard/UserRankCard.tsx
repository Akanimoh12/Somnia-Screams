import { Trophy } from 'lucide-react';
import type { LeaderboardEntry } from '../../../hooks/useLeaderboard';

interface UserRankCardProps {
  userRank: LeaderboardEntry;
}

export const UserRankCard = ({ userRank }: UserRankCardProps) => {
  const getRankSuffix = (rank: number) => {
    const j = rank % 10;
    const k = rank % 100;
    if (j === 1 && k !== 11) return 'st';
    if (j === 2 && k !== 12) return 'nd';
    if (j === 3 && k !== 13) return 'rd';
    return 'th';
  };

  return (
    <div className="bg-gradient-to-r from-warning/20 to-error/20 border-2 border-warning rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-warning to-error flex items-center justify-center">
            <Trophy size={32} className="text-white" />
          </div>
          <div>
            <div className="text-sm text-secondary mb-1">Your Rank</div>
            <div className="text-3xl font-bold text-white title-font">
              #{userRank.rank}
              <span className="text-xl">{getRankSuffix(userRank.rank)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-white stat-font">{userRank.points.toLocaleString()}</div>
            <div className="text-xs text-secondary">Points</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-success stat-font">{userRank.level}</div>
            <div className="text-xs text-secondary">Level</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-error stat-font">{userRank.battlesWon}</div>
            <div className="text-xs text-secondary">Battles</div>
          </div>
        </div>
      </div>
    </div>
  );
};

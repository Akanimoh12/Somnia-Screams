import { motion } from 'framer-motion';
import { Trophy, Users, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { useLeaderboard } from '../hooks/useLeaderboard';
import type { LeaderboardFilter } from '../hooks/useLeaderboard';
import { LeaderboardTable } from '../components/features/leaderboard/LeaderboardTable';
import { Pagination } from '../components/features/leaderboard/Pagination';
import { UserRankCard } from '../components/features/leaderboard/UserRankCard';

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const { isConnected } = useAccount();
  const {
    entries,
    loading,
    currentPage,
    totalPages,
    totalPlayers,
    filter,
    userRank,
    changePage,
    changeFilter,
    refetch,
  } = useLeaderboard(1, 10);

  if (!isConnected) {
    navigate('/');
    return null;
  }

  const filters: { value: LeaderboardFilter; label: string }[] = [
    { value: 'ALL_TIME', label: 'All Time' },
    { value: 'WEEKLY', label: 'This Week' },
    { value: 'DAILY', label: 'Today' },
  ];

  return (
    <div className="min-h-screen bg-primary text-white p-6 relative overflow-hidden">
      <div className="absolute top-20 left-20 w-96 h-96 bg-warning/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-warning to-error flex items-center justify-center">
              <Trophy size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white title-font glow-text">
                LEADERBOARD
              </h1>
              <div className="flex items-center gap-2 text-secondary">
                <Users size={16} />
                <span>{totalPlayers.toLocaleString()} Players</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => refetch()}
            disabled={loading}
            className="p-3 rounded-lg bg-secondary border-2 border-primary hover:border-warning transition disabled:opacity-50"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-3"
        >
          {filters.map((filterOption) => (
            <button
              key={filterOption.value}
              onClick={() => changeFilter(filterOption.value)}
              className={`px-6 py-2 rounded-lg font-bold transition ${
                filter === filterOption.value
                  ? 'bg-warning text-black'
                  : 'bg-secondary border-2 border-primary/30 text-white hover:border-primary'
              }`}
            >
              {filterOption.label}
            </button>
          ))}
        </motion.div>

        {userRank && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <UserRankCard userRank={userRank} />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-secondary/50 backdrop-blur-sm border-2 border-primary/30 rounded-lg p-6"
        >
          <LeaderboardTable entries={entries} loading={loading} />
        </motion.div>

        {!loading && totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={changePage}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}

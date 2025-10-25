import { motion } from 'framer-motion';
import { Trophy, Crown, Medal, TrendingUp } from 'lucide-react';
import { useLeaderboard } from '../../../hooks/useLeaderboard';
import { useGameStats } from '../../../hooks/useGameStats';

interface LeaderboardPlayer {
  rank: number;
  address: string;
  souls: number;
  tier: 'legendary' | 'epic' | 'rare' | 'common';
}

const tierColors = {
  legendary: 'text-accent-orange border-accent-orange',
  epic: 'text-accent-purple border-accent-purple',
  rare: 'text-accent-red border-accent-red',
  common: 'text-text-secondary border-border-color',
};

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="w-8 h-8 text-accent-orange drop-shadow-[0_0_10px_rgba(255,123,0,0.5)]" strokeWidth={2.5} />;
    case 2:
      return <Medal className="w-8 h-8 text-text-secondary drop-shadow-[0_0_10px_rgba(156,163,175,0.5)]" strokeWidth={2.5} />;
    case 3:
      return <Medal className="w-8 h-8 text-accent-red drop-shadow-[0_0_10px_rgba(255,68,68,0.5)]" strokeWidth={2.5} />;
    default:
      return <span className="metal-font text-xl text-text-secondary">#{rank}</span>;
  }
};

export default function LeaderboardPreview() {
  // Get top 10 players from leaderboard
  const { entries: leaderboardEntries, loading: leaderboardLoading } = useLeaderboard(1, 10);
  
  // Get global stats
  const { totalSoulsCollected, activeSessions, totalBattles } = useGameStats();

  // Helper to determine tier based on score
  const getTier = (score: number): 'legendary' | 'epic' | 'rare' | 'common' => {
    if (score >= 10000) return 'legendary';
    if (score >= 5000) return 'epic';
    if (score >= 1000) return 'rare';
    return 'common';
  };

  // Helper to format large numbers
  const formatNumber = (num: number | undefined): string => {
    if (!num) return '0';
    if (num > 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // Map leaderboard data to display format
  const topPlayers: LeaderboardPlayer[] = leaderboardEntries.map((entry) => ({
    rank: entry.rank,
    address: entry.address,
    souls: entry.points,
    tier: getTier(entry.points),
  }));
  return (
    <section className="py-24 px-4 bg-bg-primary">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <Trophy className="w-16 h-16 text-accent-orange" strokeWidth={2} />
            <h2 className="header-font text-5xl md:text-6xl text-accent-orange">
              Top Soul Hunters
            </h2>
          </div>
          <p className="ui-font text-lg text-text-secondary max-w-2xl mx-auto">
            See who's dominating the arena and collecting the most souls
          </p>
        </motion.div>

        {/* Leaderboard Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-bg-card border-2 border-border-color rounded-lg overflow-hidden"
        >
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-bg-primary border-b-2 border-border-color">
            <div className="col-span-2 text-center">
              <span className="metal-font text-sm text-text-secondary">RANK</span>
            </div>
            <div className="col-span-5">
              <span className="metal-font text-sm text-text-secondary">PLAYER</span>
            </div>
            <div className="col-span-2 text-center hidden sm:block">
              <span className="metal-font text-sm text-text-secondary">SOULS</span>
            </div>
            <div className="col-span-2 text-center hidden md:block">
              <span className="metal-font text-sm text-text-secondary">POSITION</span>
            </div>
            <div className="col-span-1 text-center">
              <span className="metal-font text-sm text-text-secondary">TIER</span>
            </div>
          </div>

          {/* Player Rows */}
          <div className="divide-y-2 divide-border-color">
            {leaderboardLoading && (
              // Loading skeleton
              Array.from({ length: 10 }).map((_, index) => (
                <div key={`leaderboard-skeleton-row-${index}`} className="grid grid-cols-12 gap-4 px-6 py-5 items-center animate-pulse">
                  <div className="col-span-2 flex justify-center">
                    <div className="w-8 h-8 bg-bg-primary rounded" />
                  </div>
                  <div className="col-span-5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-bg-primary" />
                    <div className="h-4 bg-bg-primary rounded w-32" />
                  </div>
                  <div className="col-span-2 text-center hidden sm:block">
                    <div className="h-4 bg-bg-primary rounded w-16 mx-auto" />
                  </div>
                  <div className="col-span-2 text-center hidden md:block">
                    <div className="h-4 bg-bg-primary rounded w-12 mx-auto" />
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <div className="w-6 h-6 bg-bg-primary rounded" />
                  </div>
                </div>
              ))
            )}
            
            {!leaderboardLoading && topPlayers.length === 0 && (
              // Empty state
              <div className="px-6 py-12 text-center">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-text-secondary opacity-50" />
                <p className="ui-font text-text-secondary">No players yet. Be the first!</p>
              </div>
            )}
            
            {!leaderboardLoading && topPlayers.length > 0 && (
              topPlayers.map((player, playerIndex) => (
              <motion.div
                key={player.address}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: playerIndex * 0.05 }}
                whileHover={{ backgroundColor: 'rgba(255, 123, 0, 0.05)' }}
                className="grid grid-cols-12 gap-4 px-6 py-5 items-center transition-all duration-300 group hover:border-l-4 hover:border-accent-orange"
              >
                {/* Rank */}
                <div className="col-span-2 flex justify-center">
                  {getRankIcon(player.rank)}
                </div>

                {/* Player Address */}
                <div className="col-span-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-accent-orange to-accent-purple flex items-center justify-center border-2 border-border-color group-hover:border-accent-orange transition-colors">
                      <span className="metal-font text-white text-xs">
                        {player.address.slice(2, 4).toUpperCase()}
                      </span>
                    </div>
                    <span className="ui-font text-text-primary text-sm md:text-base font-mono">
                      {player.address.slice(0, 6)}...{player.address.slice(-4)}
                    </span>
                  </div>
                </div>

                {/* Souls Collected */}
                <div className="col-span-2 text-center hidden sm:flex flex-col items-center">
                  <span className="metal-font text-accent-orange text-lg">
                    {player.souls.toLocaleString()}
                  </span>
                  <span className="ui-font text-xs text-text-secondary">souls</span>
                </div>

                {/* Rank Display for mobile */}
                <div className="col-span-2 text-center hidden md:flex flex-col items-center">
                  <span className="metal-font text-success text-lg">#{player.rank}</span>
                  <span className="ui-font text-xs text-text-secondary">rank</span>
                </div>

                {/* NFT Tier Badge */}
                <div className="col-span-1 flex justify-center">
                  <div className={`px-2 py-1 rounded border-2 ${tierColors[player.tier]} metal-font text-xs uppercase`}>
                    {player.tier.charAt(0)}
                  </div>
                </div>
              </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* View Full Leaderboard CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 text-center"
        >
          <motion.a
            href="/leaderboard"
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-10 py-5 bg-accent-orange hover:bg-accent-orange/80 text-white metal-font text-lg rounded-lg transition-all duration-300 border-2 border-accent-orange hover:border-white shadow-lg"
          >
            <TrendingUp className="w-6 h-6" strokeWidth={2.5} />
            View Full Leaderboard
          </motion.a>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4"
        >
          {[
            { 
              label: 'Active Hunters', 
              value: activeSessions?.toString() || '0', 
              icon: TrendingUp, 
              color: 'text-success' 
            },
            { 
              label: 'Souls Collected', 
              value: formatNumber(totalSoulsCollected), 
              icon: Crown, 
              color: 'text-accent-purple' 
            },
            { 
              label: 'Battles Today', 
              value: formatNumber(totalBattles), 
              icon: Medal, 
              color: 'text-accent-red' 
            },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.6 }}
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
              className="bg-bg-card border-2 border-border-color hover:border-accent-orange transition-all duration-300 rounded-lg p-4 text-center group"
            >
              <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color} transform group-hover:scale-110 transition-transform duration-300`} strokeWidth={2} />
              <div className={`metal-font text-3xl ${stat.color} mb-1`}>{stat.value}</div>
              <div className="ui-font text-xs text-text-secondary">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

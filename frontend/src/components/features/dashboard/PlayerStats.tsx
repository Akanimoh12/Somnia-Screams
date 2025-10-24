import { motion } from 'framer-motion';
import { Trophy, Zap, Skull, Target, TrendingUp } from 'lucide-react';
import { usePlayerStats } from '../../../hooks/usePlayerStats';
import { useEffect } from 'react';

export default function PlayerStats() {
  const { stats, loading, fetchStats } = usePlayerStats();

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  if (loading && !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-bg-card border-2 border-border-color rounded-lg p-6 animate-pulse">
            <div className="h-20 bg-bg-secondary rounded" />
          </div>
        ))}
      </div>
    );
  }

  const xpProgress = stats ? (stats.experience % 100) : 0;
  const xpNeeded = 100;

  const statCards = [
    {
      label: 'Level',
      value: stats?.level || 1,
      icon: Zap,
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/30'
    },
    {
      label: 'Total Points',
      value: stats?.totalPoints || 0,
      icon: Trophy,
      color: 'text-accent-purple',
      bgColor: 'bg-accent-purple/10',
      borderColor: 'border-accent-purple/30'
    },
    {
      label: 'Souls Collected',
      value: stats?.totalSouls || 0,
      icon: Skull,
      color: 'text-accent-orange',
      bgColor: 'bg-accent-orange/10',
      borderColor: 'border-accent-orange/30'
    },
    {
      label: 'Battles Won',
      value: stats?.battlesWon || 0,
      icon: Target,
      color: 'text-accent-red',
      bgColor: 'bg-accent-red/10',
      borderColor: 'border-accent-red/30'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-bg-card border-2 ${card.borderColor} rounded-lg p-6 ${card.bgColor}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${card.bgColor}`}>
                  <Icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <TrendingUp className="w-4 h-4 text-text-muted" />
              </div>
              <div className={`text-3xl font-bold stat-font ${card.color} mb-1`}>
                {card.value.toLocaleString()}
              </div>
              <div className="text-sm ui-font text-text-secondary">
                {card.label}
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-bg-card border-2 border-accent-orange/30 rounded-lg p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold ui-font text-white mb-1">
              Level Progress
            </h3>
            <p className="text-sm ui-font text-text-secondary">
              {xpProgress} / {xpNeeded} XP
            </p>
          </div>
          <div className="text-2xl font-bold stat-font text-accent-orange">
            {Math.floor((xpProgress / xpNeeded) * 100)}%
          </div>
        </div>
        <div className="w-full bg-bg-secondary rounded-full h-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(xpProgress / xpNeeded) * 100}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="bg-linear-to-r from-accent-orange to-accent-red h-4 rounded-full relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

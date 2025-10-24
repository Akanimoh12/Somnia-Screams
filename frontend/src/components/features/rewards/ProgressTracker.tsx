import { motion } from 'framer-motion';
import { Trophy, Lock } from 'lucide-react';
import { usePlayerStats } from '../../../hooks/usePlayerStats';
import { useEffect } from 'react';

interface NFTTier {
  name: string;
  emoji: string;
  pointsRequired: number;
  levelRequired: number;
  benefits: string[];
  color: string;
}

export default function ProgressTracker() {
  const { stats, fetchStats } = usePlayerStats();

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  const tiers: NFTTier[] = [
    {
      name: 'Bronze',
      emoji: '🥉',
      pointsRequired: 1000,
      levelRequired: 10,
      benefits: ['+5% XP boost', 'Special badge'],
      color: 'from-amber-700 to-amber-500'
    },
    {
      name: 'Silver',
      emoji: '🥈',
      pointsRequired: 5000,
      levelRequired: 25,
      benefits: ['+10% XP boost', 'Exclusive power-ups'],
      color: 'from-gray-400 to-gray-200'
    },
    {
      name: 'Gold',
      emoji: '🥇',
      pointsRequired: 10000,
      levelRequired: 50,
      benefits: ['+20% XP boost', 'Governance rights'],
      color: 'from-yellow-600 to-yellow-400'
    }
  ];

  const currentPoints = stats?.totalPoints || 0;
  const currentLevel = stats?.level || 1;

  const getProgress = (tier: NFTTier) => {
    const pointsProgress = Math.min((currentPoints / tier.pointsRequired) * 100, 100);
    const levelProgress = Math.min((currentLevel / tier.levelRequired) * 100, 100);
    return Math.min(pointsProgress, levelProgress);
  };

  const isUnlocked = (tier: NFTTier) => {
    return currentPoints >= tier.pointsRequired && currentLevel >= tier.levelRequired;
  };

  return (
    <div className="bg-bg-card border-2 border-border-color rounded-lg p-6">
      <h3 className="text-xl font-bold header-font text-accent-orange mb-6">
        NFT Progress Tracker
      </h3>

      <div className="space-y-6">
        {tiers.map((tier, index) => {
          const progress = getProgress(tier);
          const unlocked = isUnlocked(tier);

          return (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-6 rounded-lg border-2 ${
                unlocked
                  ? 'bg-success/10 border-success/30'
                  : 'bg-bg-secondary border-border-color'
              }`}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`text-4xl ${unlocked ? '' : 'grayscale opacity-50'}`}>
                  {tier.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg font-bold ui-font text-white">
                      {tier.name} NFT
                    </span>
                    {unlocked ? (
                      <span className="text-xs ui-font px-2 py-1 bg-success rounded text-white">
                        UNLOCKED
                      </span>
                    ) : (
                      <Lock className="w-4 h-4 text-text-muted" />
                    )}
                  </div>
                  <div className="text-sm ui-font text-text-secondary mb-3">
                    Requirements: {tier.pointsRequired.toLocaleString()} points • Level {tier.levelRequired}+
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tier.benefits.map(benefit => (
                      <span
                        key={benefit}
                        className="text-xs ui-font px-2 py-1 bg-bg-card rounded text-text-secondary"
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                  <div className="w-full bg-bg-card rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className={`bg-linear-to-r ${tier.color} h-3 relative`}
                    >
                      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                    </motion.div>
                  </div>
                  <div className="mt-2 text-xs ui-font text-text-muted">
                    {unlocked ? 'Ready to mint!' : `${progress.toFixed(0)}% complete`}
                  </div>
                </div>
              </div>

              {unlocked && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-success text-white font-bold ui-font py-3 rounded-lg hover:shadow-lg hover:shadow-success/50 transition-all"
                >
                  <Trophy className="w-5 h-5 inline mr-2" />
                  Mint {tier.name} NFT
                </motion.button>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

import { motion } from 'framer-motion';
import { Trophy, Lock, Check } from 'lucide-react';
import { useState } from 'react';
import { useAchievements } from '../../../hooks/useAchievements';

export default function AchievementsList() {
  const { 
    achievements, 
    unlockedCount, 
    totalCount, 
    progress, 
    loading 
  } = useAchievements();
  
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  const filteredAchievements = achievements.filter(achievement => {
    if (filter === 'unlocked') return achievement.unlocked;
    if (filter === 'locked') return !achievement.unlocked;
    return true;
  });

  if (loading) {
    return (
      <div className="bg-bg-card border-2 border-border-color rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-bg-secondary rounded w-1/3 mb-6" />
          <div className="h-3 bg-bg-secondary rounded w-full mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-24 bg-bg-secondary rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-card border-2 border-border-color rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold header-font text-accent-orange">
          Achievements
        </h3>
        <div className="text-sm ui-font text-text-secondary">
          {unlockedCount} / {totalCount} Unlocked
        </div>
      </div>

      <div className="mb-6">
        <div className="w-full bg-bg-secondary rounded-full h-3 mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="bg-linear-to-r from-accent-purple to-accent-orange h-3 rounded-full"
          />
        </div>
        <div className="text-xs ui-font text-text-muted text-right">
          {progress.toFixed(0)}% Complete
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {(['all', 'unlocked', 'locked'] as const).map(filterOption => (
          <button
            key={filterOption}
            onClick={() => setFilter(filterOption)}
            className={`px-4 py-2 rounded-lg font-bold ui-font text-sm transition-all ${
              filter === filterOption
                ? 'bg-accent-orange text-white'
                : 'bg-bg-secondary text-text-secondary hover:text-white'
            }`}
          >
            {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAchievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-4 rounded-lg border-2 ${
              achievement.unlocked
                ? 'bg-success/10 border-success/30'
                : 'bg-bg-secondary border-border-color'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${
                achievement.unlocked ? 'bg-success/20' : 'bg-bg-card'
              }`}>
                {achievement.unlocked ? (
                  <Check className="w-6 h-6 text-success" />
                ) : (
                  <Lock className="w-6 h-6 text-text-muted" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className={`w-4 h-4 ${
                    achievement.unlocked ? 'text-success' : 'text-text-muted'
                  }`} />
                  <span className="font-bold ui-font text-white">
                    {achievement.name}
                  </span>
                </div>
                <p className="text-sm ui-font text-text-secondary mb-2">
                  {achievement.description}
                </p>
                {achievement.unlocked && achievement.unlockedAt && (
                  <div className="flex items-center gap-2">
                    <p className="text-xs ui-font text-text-muted">
                      Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </p>
                    {achievement.timestampSource && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        achievement.timestampSource === 'blockchain'
                          ? 'bg-success/20 text-success'
                          : 'bg-warning/20 text-warning'
                      }`}>
                        {achievement.timestampSource === 'blockchain' ? 'Exact' : 'Estimated'}
                      </span>
                    )}
                  </div>
                )}
                {achievement.requirement && !achievement.unlocked && (
                  <p className="text-xs ui-font text-text-muted">
                    Requirement: {achievement.requirement}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredAchievements.length === 0 && (
        <div className="text-center py-8">
          <Trophy className="w-12 h-12 text-text-muted mx-auto mb-3" />
          <p className="text-sm ui-font text-text-secondary">
            No achievements in this category
          </p>
        </div>
      )}
    </div>
  );
}

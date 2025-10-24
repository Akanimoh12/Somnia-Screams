import { motion } from 'framer-motion';
import { Trophy, Lock, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Achievement } from '../../../types/player';

export default function AchievementsList() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  useEffect(() => {
    const fetchAchievements = () => {
      const mockAchievements: Achievement[] = [
        {
          id: 1,
          name: 'First Blood',
          description: 'Win your first battle',
          unlocked: true,
          timestamp: Date.now() - 86400000
        },
        {
          id: 2,
          name: 'Soul Hunter',
          description: 'Collect 100 souls',
          unlocked: true,
          timestamp: Date.now() - 172800000
        },
        {
          id: 3,
          name: 'Room Explorer',
          description: 'Visit 10 different rooms',
          unlocked: false
        },
        {
          id: 4,
          name: 'Warrior',
          description: 'Win 10 battles',
          unlocked: false
        },
        {
          id: 5,
          name: 'Soul Master',
          description: 'Collect 1,000 souls',
          unlocked: false
        },
        {
          id: 6,
          name: 'Manor Tourist',
          description: 'Visit 25 rooms',
          unlocked: false
        }
      ];
      setAchievements(mockAchievements);
    };

    fetchAchievements();
    const interval = setInterval(fetchAchievements, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredAchievements = achievements.filter(achievement => {
    if (filter === 'unlocked') return achievement.unlocked;
    if (filter === 'locked') return !achievement.unlocked;
    return true;
  });

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const progressPercent = (unlockedCount / totalCount) * 100;

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
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="bg-linear-to-r from-accent-purple to-accent-orange h-3 rounded-full"
          />
        </div>
        <div className="text-xs ui-font text-text-muted text-right">
          {progressPercent.toFixed(0)}% Complete
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
                {achievement.unlocked && achievement.timestamp && (
                  <p className="text-xs ui-font text-text-muted">
                    Unlocked {new Date(achievement.timestamp).toLocaleDateString()}
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

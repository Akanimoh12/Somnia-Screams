import { motion } from 'framer-motion';
import { Trophy, CheckCircle, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { useAchievements } from '../hooks/useAchievements';

export default function AchievementsPage() {
  const navigate = useNavigate();
  const { isConnected } = useAccount();
  const { achievements, loading } = useAchievements();

  if (!isConnected) {
    navigate('/');
    return null;
  }

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const progress = (unlockedCount / totalCount) * 100;

  return (
    <div className="min-h-screen bg-primary text-white p-6 relative overflow-hidden">
      <div className="absolute top-20 left-20 w-96 h-96 bg-success/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-warning/20 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-success to-warning flex items-center justify-center">
              <Trophy size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white title-font glow-text">
                ACHIEVEMENTS
              </h1>
              <p className="text-secondary">
                {unlockedCount} of {totalCount} unlocked
              </p>
            </div>
          </div>

          <div className="bg-secondary/50 backdrop-blur-sm border-2 border-primary/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-bold">Overall Progress</span>
              <span className="text-warning font-bold stat-font">{progress.toFixed(0)}%</span>
            </div>
            <div className="w-full h-3 bg-primary/50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-success to-warning rounded-full relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`border-2 rounded-lg p-6 transition ${
                achievement.unlocked
                  ? 'bg-success/10 border-success'
                  : 'bg-secondary border-primary/30'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    achievement.unlocked
                      ? 'bg-gradient-to-br from-success to-warning'
                      : 'bg-primary/50'
                  }`}
                >
                  {achievement.unlocked ? (
                    <CheckCircle size={32} className="text-white" />
                  ) : (
                    <Lock size={32} className="text-secondary" />
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white title-font mb-2">
                    {achievement.name}
                  </h3>
                  <p className="text-secondary text-sm mb-3">{achievement.description}</p>

                  {achievement.unlocked && achievement.unlockedAt && (
                    <div className="text-xs text-success">
                      Unlocked on{' '}
                      {new Date(achievement.unlockedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-primary/20 rounded-lg animate-pulse" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

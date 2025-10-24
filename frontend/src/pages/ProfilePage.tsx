import { motion } from 'framer-motion';
import { User, Trophy, Target, Skull, MapPin, Calendar, Clock, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { useProfile } from '../hooks/useProfile';
import { NFTGallery } from '../components/features/nft/NFTGallery';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { profile, loading } = useProfile();

  if (!isConnected) {
    navigate('/');
    return null;
  }

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-primary text-white p-6 flex items-center justify-center">
        <div className="space-y-4 w-full max-w-4xl">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-primary/20 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="min-h-screen bg-primary text-white p-6 relative overflow-hidden">
      <div className="absolute top-20 left-20 w-96 h-96 bg-warning/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-secondary/50 backdrop-blur-sm border-2 border-primary/30 rounded-lg p-8"
        >
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-warning to-error flex items-center justify-center">
              <User size={48} className="text-white" />
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-white title-font mb-2">
                  {formatAddress(address || '')}
                </h1>
                <div className="flex items-center gap-4 text-secondary text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>Joined {formatDate(profile.joinedAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>Active {getTimeAgo(profile.lastActive)}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-success/10 border-2 border-success/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Flame size={18} className="text-success" />
                    <span className="text-xs text-secondary">Level</span>
                  </div>
                  <div className="text-2xl font-bold text-white stat-font">{profile.stats.level}</div>
                  <div className="text-xs text-secondary mt-1">
                    {profile.stats.experience % 100}/100 XP
                  </div>
                </div>

                <div className="bg-purple-500/10 border-2 border-purple-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy size={18} className="text-purple-500" />
                    <span className="text-xs text-secondary">Points</span>
                  </div>
                  <div className="text-2xl font-bold text-white stat-font">
                    {profile.stats.totalPoints.toLocaleString()}
                  </div>
                </div>

                <div className="bg-warning/10 border-2 border-warning/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Skull size={18} className="text-warning" />
                    <span className="text-xs text-secondary">Souls</span>
                  </div>
                  <div className="text-2xl font-bold text-white stat-font">
                    {profile.stats.totalSouls.toLocaleString()}
                  </div>
                </div>

                <div className="bg-error/10 border-2 border-error/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target size={18} className="text-error" />
                    <span className="text-xs text-secondary">Battles</span>
                  </div>
                  <div className="text-2xl font-bold text-white stat-font">{profile.stats.battlesWon}</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <Trophy size={24} className="text-success" />
              <h2 className="text-2xl font-bold text-white title-font">Recent Achievements</h2>
            </div>

            <div className="space-y-3">
              {profile.achievements.slice(0, 5).map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="bg-secondary border-2 border-success/30 rounded-lg p-4 flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-success to-warning flex items-center justify-center">
                    <Trophy size={20} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white">{achievement.name}</h3>
                    <p className="text-sm text-secondary">{achievement.description}</p>
                  </div>
                  {achievement.timestamp && (
                    <div className="text-xs text-secondary">
                      {formatDate(achievement.timestamp)}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <Clock size={24} className="text-warning" />
              <h2 className="text-2xl font-bold text-white title-font">Activity History</h2>
            </div>

            <div className="space-y-2">
              {profile.history.map((item, index) => {
                const typeColors = {
                  SESSION: 'text-purple-500',
                  BATTLE: 'text-error',
                  ACHIEVEMENT: 'text-success',
                  NFT_MINT: 'text-warning',
                };

                const typeIcons = {
                  SESSION: MapPin,
                  BATTLE: Target,
                  ACHIEVEMENT: Trophy,
                  NFT_MINT: Skull,
                };

                const Icon = typeIcons[item.type];

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    className="bg-secondary border-2 border-primary/30 rounded-lg p-4 hover:border-primary transition"
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={16} className={typeColors[item.type]} />
                      <div className="flex-1">
                        <p className="text-white text-sm">{item.description}</p>
                        {item.pointsEarned && (
                          <span className="text-xs text-warning">+{item.pointsEarned} pts</span>
                        )}
                      </div>
                      <div className="text-xs text-secondary">{getTimeAgo(item.timestamp)}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-secondary/50 backdrop-blur-sm border-2 border-primary/30 rounded-lg p-6"
        >
          <NFTGallery />
        </motion.div>
      </div>
    </div>
  );
}

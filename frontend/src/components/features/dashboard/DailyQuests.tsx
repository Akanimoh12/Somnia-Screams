import { motion } from 'framer-motion';
import { Skull, Swords, DoorOpen, TrendingUp, Star, Clock, Award, CheckCircle } from 'lucide-react';
import { useDailyQuests } from '../../../hooks/useDailyQuests';
import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';

interface QuestItem {
  id: bigint;
  type: number;
  title: string;
  description: string;
  icon: React.ElementType;
  current: number;
  target: number;
  rewardPoints: number;
  timeLeft: number;
  completed: boolean;
  claimed: boolean;
}

export default function DailyQuests() {
  const { isConnected } = useAccount();
  const { 
    questCounter, 
    getQuestData, 
    getPlayerProgress, 
    claimReward, 
    isClaiming 
  } = useDailyQuests();

  const [quests, setQuests] = useState<QuestItem[]>([]);
  const [selectedQuestId, setSelectedQuestId] = useState<bigint | null>(null);

  // Quest type metadata
  const QUEST_TYPES = {
    0: { icon: Skull, label: 'Collect Souls', color: 'text-accent-purple' },
    1: { icon: Swords, label: 'Win Battles', color: 'text-accent-red' },
    2: { icon: DoorOpen, label: 'Explore Rooms', color: 'text-accent-orange' },
    3: { icon: TrendingUp, label: 'Reach Level', color: 'text-success' },
    4: { icon: Star, label: 'Earn Points', color: 'text-warning' },
  };

  // Fetch and format quest data
  useEffect(() => {
    if (!isConnected || !questCounter) return;

    const totalQuests = Number(questCounter);
    const formattedQuests: QuestItem[] = [];

    for (let i = 1; i <= totalQuests; i++) {
      const questId = BigInt(i);
      const data = getQuestData(questId);
      const progress = getPlayerProgress(questId);

      if (data?.active) {
        const questType = QUEST_TYPES[data.questType as keyof typeof QUEST_TYPES] || QUEST_TYPES[0];
        const timeLeft = Math.max(0, data.endTime - Math.floor(Date.now() / 1000));

        formattedQuests.push({
          id: questId,
          type: data.questType,
          title: questType.label,
          description: `${questType.label}: ${progress?.currentValue || 0}/${data.targetValue}`,
          icon: questType.icon,
          current: progress?.currentValue || 0,
          target: data.targetValue,
          rewardPoints: data.rewardPoints,
          timeLeft,
          completed: progress?.completed || false,
          claimed: progress?.claimed || false,
        });
      }
    }

    setQuests(formattedQuests);
  }, [questCounter, isConnected]);

  // Auto-refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setQuests(prev => prev.map(quest => ({
        ...quest,
        timeLeft: Math.max(0, quest.timeLeft - 10),
      })));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleClaimReward = async (questId: bigint) => {
    setSelectedQuestId(questId);
    try {
      await claimReward(questId);
      // Update quest status
      setQuests(prev => prev.map(q => 
        q.id === questId ? { ...q, claimed: true } : q
      ));
    } catch (error) {
      console.error('Failed to claim reward:', error);
    } finally {
      setSelectedQuestId(null);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m`;
    return 'Ending soon!';
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min(100, (current / target) * 100);
  };

  if (!isConnected) {
    return (
      <div className="bg-bg-card border-2 border-border-color rounded-lg p-6">
        <h3 className="text-xl header-font text-accent-orange mb-4">Daily Quests</h3>
        <p className="text-text-secondary ui-font text-center py-8">
          Connect your wallet to view daily quests
        </p>
      </div>
    );
  }

  if (quests.length === 0) {
    return (
      <div className="bg-bg-card border-2 border-border-color rounded-lg p-6">
        <h3 className="text-xl header-font text-accent-orange mb-4">Daily Quests</h3>
        <p className="text-text-secondary ui-font text-center py-8">
          No active quests available. Check back later!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-bg-card border-2 border-border-color rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl header-font text-accent-orange">Daily Quests</h3>
        <div className="flex items-center gap-2 text-sm ui-font text-text-secondary">
          <Award className="w-4 h-4" />
          <span>{quests.filter(q => q.completed && !q.claimed).length} ready to claim</span>
        </div>
      </div>

      <div className="space-y-4">
        {quests.map((quest, index) => {
          const QuestIcon = quest.icon;
          const progress = getProgressPercentage(quest.current, quest.target);
          const isLoading = isClaiming && selectedQuestId === quest.id;

          return (
            <motion.div
              key={quest.id.toString()}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-bg-secondary border-2 rounded-lg p-4 transition-all ${
                quest.completed && !quest.claimed
                  ? 'border-success/50 bg-success/5'
                  : 'border-border-color/30'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`p-2 rounded-lg ${
                    quest.completed ? 'bg-success/20' : 'bg-accent-orange/20'
                  }`}>
                    <QuestIcon className={`w-5 h-5 ${
                      quest.completed ? 'text-success' : QUEST_TYPES[quest.type as keyof typeof QUEST_TYPES]?.color || 'text-accent-orange'
                    }`} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-base font-bold ui-font text-white">
                        {quest.title}
                      </h4>
                      {quest.completed && (
                        <CheckCircle className="w-4 h-4 text-success" />
                      )}
                    </div>

                    <p className="text-sm ui-font text-text-secondary mb-3">
                      {quest.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs ui-font mb-1">
                        <span className="text-text-secondary">
                          {quest.current} / {quest.target}
                        </span>
                        <span className="text-accent-orange font-bold">
                          {Math.round(progress)}%
                        </span>
                      </div>
                      <div className="h-2 bg-bg-primary rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.5, ease: 'easeOut' }}
                          className={`h-full rounded-full ${
                            quest.completed 
                              ? 'bg-success' 
                              : 'bg-linear-to-r from-accent-orange to-accent-red'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Rewards & Time */}
                    <div className="flex items-center gap-4 text-xs ui-font">
                      <div className="flex items-center gap-1 text-warning">
                        <Star className="w-3 h-3" />
                        <span>{quest.rewardPoints} points</span>
                      </div>
                      <div className="flex items-center gap-1 text-text-secondary">
                        <Clock className="w-3 h-3" />
                        <span>{formatTime(quest.timeLeft)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Claim Button */}
                <div>
                  {quest.completed && !quest.claimed ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleClaimReward(quest.id)}
                      disabled={isLoading}
                      className="bg-linear-to-r from-success to-accent-purple text-white font-bold ui-font px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-success/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Claiming...
                        </span>
                      ) : (
                        'Claim Reward'
                      )}
                    </motion.button>
                  ) : quest.claimed ? (
                    <div className="bg-success/20 border border-success/40 rounded-lg px-4 py-2">
                      <span className="text-xs ui-font text-success">✓ Claimed</span>
                    </div>
                  ) : null}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

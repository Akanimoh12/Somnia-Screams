/**
 * Rewards Summary Modal
 * 
 * Displays session completion stats with celebration effects.
 * Shows XP gained, souls collected, points earned, and level progression.
 */

import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Skull, Zap, Star, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';

interface RewardsSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionData: {
    souls: number;
    points: number;
    xpGained?: number;
    levelsGained?: number;
    battlesWon?: number;
    totalBattles?: number;
  };
}

export default function RewardsSummaryModal({ 
  isOpen, 
  onClose, 
  sessionData 
}: RewardsSummaryModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  // Show confetti when modal opens
  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Confetti Celebration */}
          {showConfetti && (
            <Confetti
              width={window.innerWidth}
              height={window.innerHeight}
              recycle={false}
              numberOfPieces={500}
              gravity={0.3}
            />
          )}

          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="bg-gradient-to-br from-bg-card via-bg-card to-bg-primary border-2 border-accent-orange rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-accent-orange/20 to-accent-purple/20 p-6 border-b-2 border-accent-orange/30">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-accent-orange/30 rounded-xl">
                    <Trophy className="w-8 h-8 text-accent-orange" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold title-font text-white glow-text mb-1">
                      Session Complete!
                    </h2>
                    <p className="text-text-secondary ui-font">
                      Your rewards have been claimed
                    </p>
                  </div>
                </div>
              </div>

              {/* Rewards Grid */}
              <div className="p-8">
                <div className="grid grid-cols-2 gap-6 mb-8">
                  {/* Souls Collected */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-accent-purple/20 to-transparent border border-accent-purple/30 rounded-xl p-6 text-center"
                  >
                    <div className="flex justify-center mb-3">
                      <div className="p-3 bg-accent-purple/30 rounded-full">
                        <Skull className="w-8 h-8 text-accent-purple" />
                      </div>
                    </div>
                    <div className="text-5xl font-bold stat-font text-accent-purple mb-2 glow-text">
                      {sessionData.souls}
                    </div>
                    <div className="text-sm ui-font text-text-secondary uppercase tracking-wide">
                      Souls Collected
                    </div>
                  </motion.div>

                  {/* Points Earned */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-accent-orange/20 to-transparent border border-accent-orange/30 rounded-xl p-6 text-center"
                  >
                    <div className="flex justify-center mb-3">
                      <div className="p-3 bg-accent-orange/30 rounded-full">
                        <Star className="w-8 h-8 text-accent-orange" />
                      </div>
                    </div>
                    <div className="text-5xl font-bold stat-font text-accent-orange mb-2 glow-text">
                      {sessionData.points}
                    </div>
                    <div className="text-sm ui-font text-text-secondary uppercase tracking-wide">
                      Points Earned
                    </div>
                  </motion.div>

                  {/* XP Gained (if provided) */}
                  {sessionData.xpGained !== undefined && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-gradient-to-br from-success/20 to-transparent border border-success/30 rounded-xl p-6 text-center"
                    >
                      <div className="flex justify-center mb-3">
                        <div className="p-3 bg-success/30 rounded-full">
                          <Zap className="w-8 h-8 text-success" />
                        </div>
                      </div>
                      <div className="text-5xl font-bold stat-font text-success mb-2 glow-text">
                        +{sessionData.xpGained}
                      </div>
                      <div className="text-sm ui-font text-text-secondary uppercase tracking-wide">
                        Experience Gained
                      </div>
                    </motion.div>
                  )}

                  {/* Battles Won (if provided) */}
                  {sessionData.battlesWon !== undefined && sessionData.totalBattles !== undefined && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="bg-gradient-to-br from-danger/20 to-transparent border border-danger/30 rounded-xl p-6 text-center"
                    >
                      <div className="flex justify-center mb-3">
                        <div className="p-3 bg-danger/30 rounded-full">
                          <Trophy className="w-8 h-8 text-danger" />
                        </div>
                      </div>
                      <div className="text-5xl font-bold stat-font text-danger mb-2 glow-text">
                        {sessionData.battlesWon}/{sessionData.totalBattles}
                      </div>
                      <div className="text-sm ui-font text-text-secondary uppercase tracking-wide">
                        Battles Won
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Level Up Notification */}
                {sessionData.levelsGained && sessionData.levelsGained > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring' }}
                    className="bg-gradient-to-r from-accent-orange/30 via-accent-purple/30 to-accent-orange/30 border-2 border-accent-orange/50 rounded-xl p-6 mb-8 text-center"
                  >
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <TrendingUp className="w-6 h-6 text-accent-orange" />
                      <h3 className="text-2xl font-bold title-font text-accent-orange glow-text">
                        Level Up!
                      </h3>
                      <TrendingUp className="w-6 h-6 text-accent-orange" />
                    </div>
                    <p className="text-lg ui-font text-white">
                      You gained <span className="font-bold text-accent-orange">{sessionData.levelsGained}</span> level{sessionData.levelsGained > 1 ? 's' : ''}!
                    </p>
                  </motion.div>
                )}

                {/* Action Button */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  onClick={onClose}
                  className="w-full py-4 bg-gradient-to-r from-accent-orange to-accent-purple text-white font-bold text-lg ui-font rounded-lg hover:shadow-xl hover:shadow-accent-orange/50 transition-all"
                >
                  Continue to Dashboard
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

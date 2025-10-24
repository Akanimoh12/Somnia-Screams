import { motion } from 'framer-motion';
import { Heart, Zap, Sparkles, Trophy } from 'lucide-react';
import type { GameSession } from '../../types/game';
import type { PlayerStats } from '../../types/player';

interface PlayerHUDProps {
  session: GameSession;
  stats?: PlayerStats;
}

export default function PlayerHUD({ session, stats }: Readonly<PlayerHUDProps>) {
  const healthPercentage = (session.health / session.maxHealth) * 100;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-bg-card border-2 border-accent-red/30 rounded-lg p-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <Heart className="w-5 h-5 text-accent-red" />
          <span className="text-sm ui-font text-text-secondary">Health</span>
        </div>
        <div className="w-full bg-bg-secondary rounded-full h-3 mb-1">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${healthPercentage}%` }}
            className="bg-accent-red h-3 rounded-full"
          />
        </div>
        <div className="text-xs ui-font text-text-secondary">
          {session.health}/{session.maxHealth}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-bg-card border-2 border-accent-orange/30 rounded-lg p-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-accent-orange" />
          <span className="text-sm ui-font text-text-secondary">Souls</span>
        </div>
        <div className="text-2xl font-bold stat-font text-accent-orange">
          {session.souls}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-bg-card border-2 border-accent-purple/30 rounded-lg p-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="w-5 h-5 text-accent-purple" />
          <span className="text-sm ui-font text-text-secondary">Points</span>
        </div>
        <div className="text-2xl font-bold stat-font text-accent-purple">
          {session.points}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-bg-card border-2 border-success/30 rounded-lg p-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-5 h-5 text-success" />
          <span className="text-sm ui-font text-text-secondary">Level</span>
        </div>
        <div className="text-2xl font-bold stat-font text-success">
          {stats?.level || 1}
        </div>
      </motion.div>
    </div>
  );
}

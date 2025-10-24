import { motion } from 'framer-motion';
import { Clock, Sparkles, Swords, Gift } from 'lucide-react';
import type { GamePhase } from '../../types/game';

interface GamePhaseIndicatorProps {
  phase: GamePhase;
  timeRemaining: number;
}

export default function GamePhaseIndicator({ phase, timeRemaining }: Readonly<GamePhaseIndicatorProps>) {
  const getPhaseConfig = () => {
    switch (phase) {
      case 'PRE_GAME':
        return {
          label: 'Preparing',
          icon: Clock,
          color: 'text-accent-purple',
          bgColor: 'bg-accent-purple/10',
          borderColor: 'border-accent-purple/30'
        };
      case 'EXPLORATION':
        return {
          label: 'Exploration',
          icon: Sparkles,
          color: 'text-accent-orange',
          bgColor: 'bg-accent-orange/10',
          borderColor: 'border-accent-orange/30'
        };
      case 'BATTLE':
        return {
          label: 'Battle',
          icon: Swords,
          color: 'text-accent-red',
          bgColor: 'bg-accent-red/10',
          borderColor: 'border-accent-red/30'
        };
      case 'REWARDS':
        return {
          label: 'Rewards',
          icon: Gift,
          color: 'text-success',
          bgColor: 'bg-success/10',
          borderColor: 'border-success/30'
        };
    }
  };

  const config = getPhaseConfig();
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-3 px-6 py-3 rounded-lg border-2 ${config.bgColor} ${config.borderColor}`}
    >
      <Icon className={`w-6 h-6 ${config.color}`} />
      <div>
        <div className={`text-sm font-bold ui-font ${config.color}`}>
          {config.label.toUpperCase()}
        </div>
        <div className="text-xs text-text-secondary ui-font">
          {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
        </div>
      </div>
    </motion.div>
  );
}

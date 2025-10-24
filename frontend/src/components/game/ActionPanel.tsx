import { motion } from 'framer-motion';
import { Move, Sparkles, Sword, Gift } from 'lucide-react';
import type { GamePhase } from '../../types/game';

interface ActionPanelProps {
  phase: GamePhase;
  onMove?: () => void;
  onCollect?: () => void;
  onAttack?: () => void;
  onClaim?: () => void;
  disabled?: boolean;
}

export default function ActionPanel({
  phase,
  onMove,
  onCollect,
  onAttack,
  onClaim,
  disabled = false
}: Readonly<ActionPanelProps>) {
  const getActions = () => {
    switch (phase) {
      case 'EXPLORATION':
        return [
          { label: 'Move', icon: Move, onClick: onMove, color: 'bg-accent-purple' },
          { label: 'Collect Soul', icon: Sparkles, onClick: onCollect, color: 'bg-accent-orange' }
        ];
      case 'BATTLE':
        return [
          { label: 'Attack', icon: Sword, onClick: onAttack, color: 'bg-accent-red' }
        ];
      case 'REWARDS':
        return [
          { label: 'Claim Rewards', icon: Gift, onClick: onClaim, color: 'bg-success' }
        ];
      default:
        return [];
    }
  };

  const actions = getActions();

  return (
    <div className="flex gap-4 flex-wrap">
      {actions.map((action, index) => {
        const Icon = action.icon;
        return (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={action.onClick}
            disabled={disabled}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg ${action.color} text-white font-bold ui-font disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-${action.color}/50`}
          >
            <Icon className="w-5 h-5" />
            {action.label}
          </motion.button>
        );
      })}
    </div>
  );
}

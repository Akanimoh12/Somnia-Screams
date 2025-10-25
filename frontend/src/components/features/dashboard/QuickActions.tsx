import { motion } from 'framer-motion';
import { Gamepad2, Trophy, Users, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';

export default function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      label: 'Play Now',
      description: 'Start a new game session',
      icon: Gamepad2,
      color: 'from-accent-orange to-accent-red',
      onClick: () => navigate(ROUTES.GAME)
    },
    {
      label: 'Leaderboard',
      description: 'View top players',
      icon: Trophy,
      color: 'from-accent-purple to-accent-orange',
      onClick: () => navigate(ROUTES.LEADERBOARD)
    },
    {
      label: 'Achievements',
      description: 'Track your progress',
      icon: Users,
      color: 'from-success to-accent-purple',
      onClick: () => navigate(ROUTES.ACHIEVEMENTS)
    },
    {
      label: 'Settings',
      description: 'Configure preferences',
      icon: Settings,
      color: 'from-accent-red to-accent-purple',
      onClick: () => navigate(ROUTES.SETTINGS)
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action, index) => {
        const Icon = action.icon;
        return (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={action.onClick}
            className="bg-bg-card border-2 border-border-color rounded-lg p-6 text-left hover:border-accent-orange/50 transition-all group"
          >
            <div className={`inline-flex p-3 rounded-lg bg-linear-to-r ${action.color} mb-4`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="text-lg font-bold ui-font text-white mb-1 group-hover:text-accent-orange transition-colors">
              {action.label}
            </div>
            <div className="text-sm ui-font text-text-secondary">
              {action.description}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

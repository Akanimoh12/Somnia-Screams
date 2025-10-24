import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';
import PlayerStats from '../components/features/dashboard/PlayerStats';
import QuickActions from '../components/features/dashboard/QuickActions';
import RecentActivity from '../components/features/dashboard/RecentActivity';
import Inventory from '../components/features/dashboard/Inventory';
import ProgressTracker from '../components/features/rewards/ProgressTracker';
import AchievementsList from '../components/features/rewards/AchievementsList';

export default function Dashboard() {
  const { address } = useAccount();

  return (
    <div className="space-y-8">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-accent-orange/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-purple/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold title-font text-accent-orange glow-text mb-2">
          PLAYER DASHBOARD
        </h1>
        <p className="text-sm ui-font text-text-secondary">
          Welcome back, {address?.slice(0, 6)}...{address?.slice(-4)}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <PlayerStats />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <QuickActions />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Inventory />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <RecentActivity />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <ProgressTracker />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <AchievementsList />
        </motion.div>
      </div>
    </div>
  );
}

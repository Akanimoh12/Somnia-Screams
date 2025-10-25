import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Wallet } from 'lucide-react';
import PlayerStats from '../components/features/dashboard/PlayerStats';
import QuickActions from '../components/features/dashboard/QuickActions';
import RecentActivity from '../components/features/dashboard/RecentActivity';
import Inventory from '../components/features/dashboard/Inventory';
import DailyQuests from '../components/features/dashboard/DailyQuests';
import ProgressTracker from '../components/features/rewards/ProgressTracker';
import AchievementsList from '../components/features/rewards/AchievementsList';

export default function Dashboard() {
  const { address, isConnected } = useAccount();

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
        {isConnected ? (
          <p className="text-sm ui-font text-text-secondary">
            Welcome back, {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>
        ) : (
          <p className="text-sm ui-font text-text-secondary">
            Explore the dashboard or connect your wallet to play
          </p>
        )}
      </motion.div>

      {!isConnected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-linear-to-br from-accent-orange/10 to-accent-purple/10 border-2 border-accent-orange/30 rounded-lg p-6"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-accent-orange/20 rounded-lg">
                <Wallet className="w-6 h-6 text-accent-orange" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1 ui-font">
                  Connect Your Wallet to Play
                </h3>
                <p className="text-sm text-text-secondary ui-font">
                  Connect your wallet to access your profile, collect souls, battle enemies, and mint exclusive NFTs
                </p>
              </div>
            </div>
            <ConnectButton />
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <PlayerStats />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <QuickActions />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <DailyQuests />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Inventory />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <RecentActivity />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <ProgressTracker />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <AchievementsList />
        </motion.div>
      </div>
    </div>
  );
}

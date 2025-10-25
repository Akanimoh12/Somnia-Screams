import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Skull, Zap, Flame } from 'lucide-react';
import { useGameStats } from '../../../hooks/useGameStats';

interface StatItem {
  id: string;
  label: string;
  value: number;
  suffix: string;
  icon: React.ElementType;
  color: string;
  description: string;
}

// Animated counter hook
function useCounter(end: number, duration: number = 2000, inView: boolean = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    
    let startTime: number | null = null;
    const startValue = 0;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * (end - startValue) + startValue);
      
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, inView]);

  return count;
}

function StatCard({ stat, delay, inView }: { stat: StatItem; delay: number; inView: boolean }) {
  const count = useCounter(stat.value, 2000, inView);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -10, scale: 1.05, transition: { duration: 0.3 } }}
      className="bg-bg-card border-2 border-border-color hover:border-accent-orange transition-all duration-300 rounded-lg p-8 group relative overflow-hidden"
    >
      {/* Background Glow Effect */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at center, ${stat.color.includes('blue') ? '#60A5FA' : stat.color.includes('purple') ? '#A78BFA' : stat.color.includes('orange') ? '#FF7B00' : '#34D399'}, transparent)`,
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <div className="flex items-center justify-between mb-6">
          <div className={`${stat.color} transform group-hover:scale-110 transition-transform duration-300`}>
            <stat.icon className="w-12 h-12" strokeWidth={2} />
          </div>
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Flame className={`w-8 h-8 ${stat.color} opacity-50`} />
          </motion.div>
        </div>

        {/* Value */}
        <div className="mb-3">
          <span className={`metal-font text-5xl ${stat.color}`}>
            {count.toLocaleString()}
          </span>
          <span className={`metal-font text-3xl ${stat.color} opacity-70`}>
            {stat.suffix}
          </span>
        </div>

        {/* Label */}
        <h3 className="header-font text-2xl mb-2 text-text-primary">{stat.label}</h3>
        
        {/* Description */}
        <p className="ui-font text-sm text-text-secondary leading-relaxed">{stat.description}</p>
      </div>
    </motion.div>
  );
}

export default function GameStats() {
  const [inView, setInView] = useState(false);

  // Get real data from GameState contract
  const { 
    totalPlayers, 
    totalSoulsCollected, 
    activeSessions, 
    isLoading,
    isInMaintenance 
  } = useGameStats();

  // NFT count - will be available when NFT minting is integrated
  const nftsMinted = 0;

  // Format souls (display in thousands if > 1000)
  const formatSouls = (souls: number) => {
    if (souls >= 1000) {
      return { value: Math.floor(souls / 1000), suffix: 'K' };
    }
    return { value: souls, suffix: '' };
  };

  const soulsData = formatSouls(totalSoulsCollected);

  // Stats array with real data
  const stats: StatItem[] = [
    {
      id: 'players',
      label: 'Total Players',
      value: totalPlayers,
      suffix: '',
      icon: Users,
      color: 'text-accent-purple',
      description: 'Brave souls who entered the arena',
    },
    {
      id: 'souls',
      label: 'Souls Collected',
      value: soulsData.value,
      suffix: soulsData.suffix,
      icon: Skull,
      color: 'text-accent-red',
      description: 'Total souls hunted by all players',
    },
    {
      id: 'nfts',
      label: 'NFTs Minted',
      value: nftsMinted,
      suffix: '',
      icon: Zap,
      color: 'text-accent-orange',
      description: 'Unique ghost characters created',
    },
    {
      id: 'sessions',
      label: 'Active Sessions',
      value: activeSessions,
      suffix: '',
      icon: Flame,
      color: 'text-success',
      description: 'Live battles happening right now',
    },
  ];

  return (
    <section className="py-24 px-4 bg-bg-primary">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          onViewportEnter={() => setInView(true)}
          className="text-center mb-16"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="inline-block mb-4"
          >
            <Zap className="w-16 h-16 text-accent-orange" strokeWidth={2} />
          </motion.div>
          <h2 className="header-font text-5xl md:text-6xl mb-4 text-accent-orange">
            Live Game Statistics
          </h2>
          <p className="ui-font text-lg text-text-secondary max-w-2xl mx-auto mb-6">
            Real-time data from the Somnia Network blockchain
          </p>
          
          {/* Live Indicator */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 rounded-full border-2 border-success"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-3 h-3 bg-success rounded-full" />
            <span className="metal-font text-sm text-success">LIVE</span>
          </motion.div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="bg-bg-card border-2 border-border-color rounded-lg p-8 animate-pulse"
              >
                <div className="h-12 w-12 bg-border-color rounded mb-6" />
                <div className="h-12 bg-border-color rounded mb-3 w-3/4" />
                <div className="h-6 bg-border-color rounded mb-2 w-1/2" />
                <div className="h-4 bg-border-color rounded w-full" />
              </div>
            ))
          ) : (
            stats.map((stat, index) => (
              <StatCard
                key={stat.id}
                stat={stat}
                delay={index * 0.1}
                inView={inView}
              />
            ))
          )}
        </div>

        {/* Maintenance Mode Warning */}
        {isInMaintenance && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-accent-orange/10 border-2 border-accent-orange rounded-lg p-6 text-center"
          >
            <Flame className="w-8 h-8 text-accent-orange mx-auto mb-3" />
            <p className="metal-font text-lg text-accent-orange mb-2">
              ⚠️ MAINTENANCE MODE
            </p>
            <p className="ui-font text-sm text-text-secondary">
              The game is currently under maintenance. Please check back soon!
            </p>
          </motion.div>
        )}

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 bg-bg-card border-2 border-accent-orange rounded-lg p-6 text-center"
        >
          <p className="ui-font text-text-secondary mb-3">
            All statistics are updated in real-time from smart contracts on the Somnia Devnet
          </p>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-accent-orange rounded-full animate-pulse" />
            <span className="metal-font text-sm text-text-primary">
              Data refreshed every 30 seconds
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

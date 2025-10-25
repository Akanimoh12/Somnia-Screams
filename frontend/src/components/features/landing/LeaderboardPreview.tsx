import { motion } from 'framer-motion';
import { Trophy, Crown, Medal, TrendingUp } from 'lucide-react';

interface LeaderboardPlayer {
  rank: number;
  address: string;
  souls: number;
  wins: number;
  tier: 'legendary' | 'epic' | 'rare' | 'common';
}

// Mock data - In production, this would come from smart contract
const topPlayers: LeaderboardPlayer[] = [
  { rank: 1, address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', souls: 12450, wins: 89, tier: 'legendary' },
  { rank: 2, address: '0x8ba1f109551bD432803012645Ac136ddd64DBA72', souls: 10820, wins: 76, tier: 'legendary' },
  { rank: 3, address: '0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097', souls: 9340, wins: 68, tier: 'epic' },
  { rank: 4, address: '0x5A86858aA3b595FD6663c2296741eF4cd8BC4d01', souls: 8120, wins: 61, tier: 'epic' },
  { rank: 5, address: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE', souls: 7450, wins: 54, tier: 'epic' },
  { rank: 6, address: '0x976EA74026E726554dB657fA54763abd0C3a0aa9', souls: 6890, wins: 48, tier: 'rare' },
  { rank: 7, address: '0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f', souls: 6320, wins: 43, tier: 'rare' },
  { rank: 8, address: '0x9f2df0feD2c77648de5860a4cc508cd0818c85b8', souls: 5780, wins: 39, tier: 'rare' },
  { rank: 9, address: '0x14dC79964da2C08b23698B3D3cc7Ca32193d9955', souls: 5240, wins: 34, tier: 'rare' },
  { rank: 10, address: '0xa0Ee7A142d267C1f36714E4a8F75612F20a79720', souls: 4890, wins: 30, tier: 'common' },
];

const tierColors = {
  legendary: 'text-accent-orange border-accent-orange',
  epic: 'text-accent-purple border-accent-purple',
  rare: 'text-accent-red border-accent-red',
  common: 'text-text-secondary border-border-color',
};

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="w-8 h-8 text-accent-orange drop-shadow-[0_0_10px_rgba(255,123,0,0.5)]" strokeWidth={2.5} />;
    case 2:
      return <Medal className="w-8 h-8 text-text-secondary drop-shadow-[0_0_10px_rgba(156,163,175,0.5)]" strokeWidth={2.5} />;
    case 3:
      return <Medal className="w-8 h-8 text-accent-red drop-shadow-[0_0_10px_rgba(255,68,68,0.5)]" strokeWidth={2.5} />;
    default:
      return <span className="metal-font text-xl text-text-secondary">#{rank}</span>;
  }
};

export default function LeaderboardPreview() {
  return (
    <section className="py-24 px-4 bg-bg-primary">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <Trophy className="w-16 h-16 text-accent-orange" strokeWidth={2} />
            <h2 className="header-font text-5xl md:text-6xl text-accent-orange">
              Top Soul Hunters
            </h2>
          </div>
          <p className="ui-font text-lg text-text-secondary max-w-2xl mx-auto">
            See who's dominating the arena and collecting the most souls
          </p>
        </motion.div>

        {/* Leaderboard Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-bg-card border-2 border-border-color rounded-lg overflow-hidden"
        >
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-bg-primary border-b-2 border-border-color">
            <div className="col-span-2 text-center">
              <span className="metal-font text-sm text-text-secondary">RANK</span>
            </div>
            <div className="col-span-5">
              <span className="metal-font text-sm text-text-secondary">PLAYER</span>
            </div>
            <div className="col-span-2 text-center hidden sm:block">
              <span className="metal-font text-sm text-text-secondary">SOULS</span>
            </div>
            <div className="col-span-2 text-center hidden md:block">
              <span className="metal-font text-sm text-text-secondary">WINS</span>
            </div>
            <div className="col-span-1 text-center">
              <span className="metal-font text-sm text-text-secondary">TIER</span>
            </div>
          </div>

          {/* Player Rows */}
          <div className="divide-y-2 divide-border-color">
            {topPlayers.map((player, index) => (
              <motion.div
                key={player.address}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ backgroundColor: 'rgba(255, 123, 0, 0.05)' }}
                className="grid grid-cols-12 gap-4 px-6 py-5 items-center transition-all duration-300 group hover:border-l-4 hover:border-accent-orange"
              >
                {/* Rank */}
                <div className="col-span-2 flex justify-center">
                  {getRankIcon(player.rank)}
                </div>

                {/* Player Address */}
                <div className="col-span-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-orange to-accent-purple flex items-center justify-center border-2 border-border-color group-hover:border-accent-orange transition-colors">
                      <span className="metal-font text-white text-xs">
                        {player.address.slice(2, 4).toUpperCase()}
                      </span>
                    </div>
                    <span className="ui-font text-text-primary text-sm md:text-base font-mono">
                      {player.address.slice(0, 6)}...{player.address.slice(-4)}
                    </span>
                  </div>
                </div>

                {/* Souls Collected */}
                <div className="col-span-2 text-center hidden sm:flex flex-col items-center">
                  <span className="metal-font text-accent-orange text-lg">
                    {player.souls.toLocaleString()}
                  </span>
                  <span className="ui-font text-xs text-text-secondary">souls</span>
                </div>

                {/* Total Wins */}
                <div className="col-span-2 text-center hidden md:flex flex-col items-center">
                  <span className="metal-font text-success text-lg">{player.wins}</span>
                  <span className="ui-font text-xs text-text-secondary">wins</span>
                </div>

                {/* NFT Tier Badge */}
                <div className="col-span-1 flex justify-center">
                  <div className={`px-2 py-1 rounded border-2 ${tierColors[player.tier]} metal-font text-xs uppercase`}>
                    {player.tier.charAt(0)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* View Full Leaderboard CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 text-center"
        >
          <motion.a
            href="/leaderboard"
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-10 py-5 bg-accent-orange hover:bg-accent-orange/80 text-white metal-font text-lg rounded-lg transition-all duration-300 border-2 border-accent-orange hover:border-white shadow-lg"
          >
            <TrendingUp className="w-6 h-6" strokeWidth={2.5} />
            View Full Leaderboard
          </motion.a>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: 'Total Prize Pool', value: '50,000+', icon: Trophy, color: 'text-accent-orange' },
            { label: 'Active Hunters', value: '1,234', icon: TrendingUp, color: 'text-success' },
            { label: 'Souls Collected', value: '125K+', icon: Crown, color: 'text-accent-purple' },
            { label: 'Battles Today', value: '456', icon: Medal, color: 'text-accent-red' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
              className="bg-bg-card border-2 border-border-color hover:border-accent-orange transition-all duration-300 rounded-lg p-4 text-center group"
            >
              <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color} transform group-hover:scale-110 transition-transform duration-300`} strokeWidth={2} />
              <div className={`metal-font text-3xl ${stat.color} mb-1`}>{stat.value}</div>
              <div className="ui-font text-xs text-text-secondary">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

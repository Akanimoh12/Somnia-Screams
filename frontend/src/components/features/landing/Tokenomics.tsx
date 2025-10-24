import { motion } from 'framer-motion';
import { Medal, Crown, Gem, TrendingUp, Zap, Users } from 'lucide-react';

const tiers = [
  {
    name: 'Bronze',
    title: 'Ghostly Apprentice',
    icon: Medal,
    color: 'from-amber-700 to-amber-900',
    borderColor: 'border-amber-700',
    requirements: [
      '1,000 lifetime points',
      'Level 10+',
      '5 sessions completed',
    ],
    benefits: [
      '+5% XP boost',
      'Special avatar badge',
      'Bronze holder chat',
    ],
    cost: '0.001 STT',
  },
  {
    name: 'Silver',
    title: 'Soul Reaper',
    icon: Gem,
    color: 'from-slate-400 to-slate-600',
    borderColor: 'border-slate-400',
    requirements: [
      '5,000 lifetime points',
      'Level 25+',
      '10 Battle Wins',
    ],
    benefits: [
      '+10% XP boost',
      'Exclusive power-ups',
      'Priority matchmaking',
    ],
    cost: '0.005 STT',
  },
  {
    name: 'Gold',
    title: 'Manor Master',
    icon: Crown,
    color: 'from-yellow-500 to-yellow-700',
    borderColor: 'border-yellow-500',
    requirements: [
      '10,000 lifetime points',
      'Level 50+',
      'Top 100 Leaderboard',
    ],
    benefits: [
      '+20% XP boost',
      'Legendary power-ups',
      'Governance rights',
    ],
    cost: '0.01 STT',
  },
];

export default function Tokenomics() {
  return (
    <section className="py-24 px-4 bg-bg-primary">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="header-font text-5xl md:text-6xl mb-4 text-accent-orange">
            NFT Tiers
          </h2>
          <p className="ui-font text-lg text-text-secondary max-w-2xl mx-auto">
            Unlock exclusive Halloween NFTs with powerful benefits
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {tiers.map((tier, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
              className={`bg-bg-card border-2 ${tier.borderColor} rounded-lg p-6 relative overflow-hidden group`}
            >
              <div className={`absolute inset-0 bg-linear-to-br ${tier.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <tier.icon className={`w-12 h-12 ${tier.borderColor.replace('border', 'text')}`} />
                  <span className="stat-font text-sm text-text-muted">{tier.name}</span>
                </div>

                <h3 className="metal-font text-2xl mb-2">{tier.title}</h3>
                
                <div className="stat-font text-3xl text-accent-orange mb-6">
                  {tier.cost}
                </div>

                <div className="mb-6">
                  <p className="ui-font text-sm font-bold text-text-secondary mb-2">Requirements:</p>
                  <ul className="space-y-2">
                    {tier.requirements.map((req, idx) => (
                      <li key={idx} className="ui-font text-sm text-text-muted flex items-start gap-2">
                        <span className="text-accent-orange mt-1">•</span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="ui-font text-sm font-bold text-text-secondary mb-2">Benefits:</p>
                  <ul className="space-y-2">
                    {tier.benefits.map((benefit, idx) => (
                      <li key={idx} className="ui-font text-sm text-text-muted flex items-start gap-2">
                        <span className="text-success mt-1">✓</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { icon: TrendingUp, label: 'Progressive Rewards', value: 'Earn More As You Play' },
            { icon: Zap, label: 'Instant Benefits', value: 'Immediate XP Boost' },
            { icon: Users, label: 'Community Power', value: 'Governance Rights' },
          ].map((stat, index) => (
            <div key={index} className="bg-bg-card border border-border-color rounded-lg p-6 text-center">
              <stat.icon className="w-10 h-10 text-accent-orange mx-auto mb-3" />
              <p className="ui-font font-bold mb-1">{stat.label}</p>
              <p className="ui-font text-sm text-text-muted">{stat.value}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Swords, 
  Skull, 
  Flame, 
  Trophy, 
  HelpCircle,
  ChevronDown,
  Play,
  Target,
  Zap
} from 'lucide-react';

interface AccordionItemProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function AccordionItem({ title, icon, children, defaultOpen = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-bg-secondary rounded-lg border border-border overflow-hidden"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-bg-secondary/80 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="text-accent-orange">{icon}</div>
          <h3 className="text-xl font-bold text-text-primary">{title}</h3>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-5 h-5 text-text-secondary" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 py-4 border-t border-border">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface NFTTier {
  name: string;
  color: string;
  requirements: string;
  benefits: string[];
}

const nftTiers: NFTTier[] = [
  {
    name: 'Common Ghost',
    color: 'text-gray-400',
    requirements: 'Free mint available to all players',
    benefits: ['Basic game access', '1x soul collection rate', 'Standard rewards'],
  },
  {
    name: 'Rare Specter',
    color: 'text-blue-400',
    requirements: '500 souls collected',
    benefits: ['Enhanced abilities', '1.5x soul collection rate', 'Exclusive arenas'],
  },
  {
    name: 'Epic Phantom',
    color: 'text-purple-400',
    requirements: '2,000 souls + 10 PvP wins',
    benefits: ['Advanced powers', '2x soul collection rate', 'Rare item drops'],
  },
  {
    name: 'Legendary Wraith',
    color: 'text-orange-400',
    requirements: '5,000 souls + Top 100 leaderboard',
    benefits: ['Maximum power', '3x soul collection rate', 'Legendary rewards', 'Custom skins'],
  },
];

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'How do I start playing?',
    answer: 'Connect your wallet, claim your free Ghost NFT, and enter the game arena. Complete the tutorial mission to learn the basics.',
  },
  {
    question: 'What are Souls used for?',
    answer: 'Souls are the primary currency in Somnia Screams. Use them to upgrade your NFT, purchase items, enter premium arenas, and climb the leaderboard.',
  },
  {
    question: 'How does PvP work?',
    answer: 'Challenge other players in real-time battles. Winner takes 60% of the soul pool, loser keeps 40%. Your NFT tier affects your base stats.',
  },
  {
    question: 'Can I lose my NFT?',
    answer: 'No! Your NFT is always safe. In battles, you only risk souls, not your character. NFTs can only be traded or sold by you.',
  },
  {
    question: 'How do I upgrade my NFT tier?',
    answer: 'Meet the soul collection and achievement requirements for the next tier, then visit the Inventory page to upgrade.',
  },
  {
    question: 'Are there gas fees?',
    answer: 'Somnia Network offers extremely low gas fees. Most in-game actions cost less than $0.01 in STT.',
  },
];

export default function HowToPlayPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-3">
          <BookOpen className="w-12 h-12 text-accent-orange" />
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary">
            How to Play
          </h1>
        </div>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
          Master the art of soul hunting and become a legendary wraith in Somnia Screams
        </p>
      </motion.div>

      {/* Quick Start Guide */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-accent-orange/20 to-accent-purple/20 rounded-lg p-6 border border-accent-orange/30"
      >
        <div className="flex items-center gap-3 mb-4">
          <Play className="w-6 h-6 text-accent-orange" />
          <h2 className="text-2xl font-bold text-text-primary">Quick Start</h2>
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { step: '1', title: 'Connect Wallet', desc: 'Link your Web3 wallet' },
            { step: '2', title: 'Claim NFT', desc: 'Get your free Ghost' },
            { step: '3', title: 'Enter Arena', desc: 'Start your first battle' },
            { step: '4', title: 'Collect Souls', desc: 'Earn and upgrade' },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              className="bg-bg-secondary rounded-lg p-4 text-center"
            >
              <div className="w-12 h-12 bg-accent-orange/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl font-bold text-accent-orange">{item.step}</span>
              </div>
              <h3 className="font-bold text-text-primary mb-1">{item.title}</h3>
              <p className="text-sm text-text-secondary">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Main Content Accordion */}
      <div className="space-y-4">
        {/* Game Mechanics */}
        <AccordionItem
          title="Game Mechanics"
          icon={<Target className="w-6 h-6" />}
          defaultOpen
        >
          <div className="space-y-4 text-text-secondary">
            <p>
              Somnia Screams is a blockchain-based battle arena where you control ghost NFTs to collect souls 
              and compete against other players. Each action is recorded on the Somnia Network, ensuring 
              transparency and true ownership.
            </p>
            
            <div className="space-y-2">
              <h4 className="font-bold text-text-primary">Core Mechanics:</h4>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li><strong>Soul Hunting:</strong> Complete PvE missions to collect souls</li>
                <li><strong>Character Stats:</strong> Attack, Defense, Speed, and Special abilities</li>
                <li><strong>Energy System:</strong> Actions consume energy, regenerates over time</li>
                <li><strong>Combo System:</strong> Chain attacks for bonus damage and soul rewards</li>
                <li><strong>Territory Control:</strong> Capture haunted zones for passive soul income</li>
              </ul>
            </div>

            <div className="bg-bg-primary rounded-lg p-4 border border-accent-purple/30">
              <p className="text-sm">
                <strong className="text-accent-purple">💡 Pro Tip:</strong> Focus on completing daily 
                quests for guaranteed soul rewards and energy refills.
              </p>
            </div>
          </div>
        </AccordionItem>

        {/* Battle System */}
        <AccordionItem
          title="Battle System Guide"
          icon={<Swords className="w-6 h-6" />}
        >
          <div className="space-y-4 text-text-secondary">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-bg-primary rounded-lg p-4 border border-border">
                <h4 className="font-bold text-text-primary mb-2 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-400" />
                  PvE Battles
                </h4>
                <ul className="space-y-1 text-sm">
                  <li>• Fight AI-controlled enemies</li>
                  <li>• Earn souls based on difficulty</li>
                  <li>• No risk of losing souls</li>
                  <li>• Perfect for learning and grinding</li>
                  <li>• Unlock new arenas as you progress</li>
                </ul>
              </div>

              <div className="bg-bg-primary rounded-lg p-4 border border-border">
                <h4 className="font-bold text-text-primary mb-2 flex items-center gap-2">
                  <Swords className="w-5 h-5 text-accent-orange" />
                  PvP Battles
                </h4>
                <ul className="space-y-1 text-sm">
                  <li>• Challenge real players</li>
                  <li>• Bet souls on the match</li>
                  <li>• Winner takes 60% of the pool</li>
                  <li>• Climb the leaderboard</li>
                  <li>• Earn exclusive PvP achievements</li>
                </ul>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-text-primary">Battle Phases:</h4>
              <ol className="list-decimal list-inside space-y-2 pl-2">
                <li>
                  <strong>Preparation:</strong> Select your ghost, equip items, set strategy
                </li>
                <li>
                  <strong>Combat:</strong> Execute attacks, use abilities, manage energy
                </li>
                <li>
                  <strong>Resolution:</strong> Winner determined, souls distributed, stats updated
                </li>
              </ol>
            </div>

            <div className="bg-accent-orange/10 rounded-lg p-4 border border-accent-orange/30">
              <p className="text-sm">
                <strong className="text-accent-orange">⚔️ Battle Tip:</strong> Higher tier NFTs have 
                better base stats, but skill and strategy matter most. Time your special abilities 
                for maximum impact!
              </p>
            </div>
          </div>
        </AccordionItem>

        {/* Soul Collection */}
        <AccordionItem
          title="Soul Collection Tips"
          icon={<Skull className="w-6 h-6" />}
        >
          <div className="space-y-4 text-text-secondary">
            <p>
              Souls are the lifeblood of Somnia Screams. The more souls you collect, the stronger 
              you become and the higher you can climb.
            </p>

            <div className="grid md:grid-cols-3 gap-3">
              {[
                { icon: <Target className="w-5 h-5" />, title: 'Daily Quests', souls: '50-200', color: 'blue' },
                { icon: <Swords className="w-5 h-5" />, title: 'PvP Victories', souls: '100-500', color: 'orange' },
                { icon: <Flame className="w-5 h-5" />, title: 'Boss Raids', souls: '500-2000', color: 'purple' },
              ].map((source, idx) => (
                <div key={idx} className="bg-bg-primary rounded-lg p-4 border border-border text-center">
                  <div className={`text-${source.color}-400 flex justify-center mb-2`}>
                    {source.icon}
                  </div>
                  <h4 className="font-bold text-text-primary mb-1">{source.title}</h4>
                  <p className="text-sm text-accent-orange font-bold">{source.souls} souls</p>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-text-primary">Maximizing Soul Gain:</h4>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Upgrade to higher NFT tiers for collection rate multipliers</li>
                <li>Complete achievement sets for bonus soul rewards</li>
                <li>Participate in weekend tournaments for 2x soul events</li>
                <li>Hold territory zones for passive soul generation</li>
                <li>Form guilds to unlock team-based soul bonuses</li>
              </ul>
            </div>

            <div className="bg-bg-primary rounded-lg p-4 border border-accent-purple/30">
              <p className="text-sm">
                <strong className="text-accent-purple">💎 Collection Bonus:</strong> Consecutive daily 
                logins grant increasing soul multipliers, up to 2.5x at day 7!
              </p>
            </div>
          </div>
        </AccordionItem>

        {/* NFT Tiers */}
        <AccordionItem
          title="NFT Tier Requirements"
          icon={<Flame className="w-6 h-6" />}
        >
          <div className="space-y-4 text-text-secondary">
            <p>
              Progress through four distinct NFT tiers, each with unique abilities and benefits. 
              Upgrade your ghost to unlock new powers and increased soul collection rates.
            </p>

            <div className="space-y-3">
              {nftTiers.map((tier, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-bg-primary rounded-lg p-4 border border-border"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className={`text-xl font-bold ${tier.color}`}>{tier.name}</h4>
                    <Zap className={`w-6 h-6 ${tier.color}`} />
                  </div>
                  <p className="text-sm text-text-secondary mb-3">
                    <strong>Requirements:</strong> {tier.requirements}
                  </p>
                  <div className="space-y-1">
                    <strong className="text-text-primary text-sm">Benefits:</strong>
                    <ul className="list-disc list-inside space-y-1 text-sm pl-2">
                      {tier.benefits.map((benefit, bidx) => (
                        <li key={bidx}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-accent-orange/10 rounded-lg p-4 border border-accent-orange/30">
              <p className="text-sm">
                <strong className="text-accent-orange">🔥 Upgrade Tip:</strong> You can trade or sell 
                your NFT at any time on the marketplace. Higher tiers command premium prices!
              </p>
            </div>
          </div>
        </AccordionItem>

        {/* Achievements */}
        <AccordionItem
          title="Achievement Guide"
          icon={<Trophy className="w-6 h-6" />}
        >
          <div className="space-y-4 text-text-secondary">
            <p>
              Unlock achievements to earn exclusive rewards, titles, and soul bonuses. Achievements 
              are permanently recorded on-chain as part of your player profile.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-bold text-text-primary">Combat Achievements</h4>
                <ul className="space-y-1 text-sm">
                  <li>🗡️ First Blood - Win your first PvP battle</li>
                  <li>⚔️ Warrior - Win 10 PvP battles</li>
                  <li>👑 Champion - Reach Top 10 leaderboard</li>
                  <li>🔥 Unstoppable - Win 5 battles in a row</li>
                  <li>💀 Soul Hunter - Collect 10,000 souls</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-text-primary">Collection Achievements</h4>
                <ul className="space-y-1 text-sm">
                  <li>👻 Ghost Collector - Own 5 different NFTs</li>
                  <li>🎭 Rare Hunter - Own a Rare or higher NFT</li>
                  <li>💎 Legendary Owner - Own a Legendary NFT</li>
                  <li>🏆 Complete Set - Own all 4 tiers</li>
                  <li>🌟 Customizer - Unlock 10 custom skins</li>
                </ul>
              </div>
            </div>

            <div className="bg-bg-primary rounded-lg p-4 border border-accent-purple/30">
              <div className="flex items-start gap-3">
                <Trophy className="w-5 h-5 text-accent-purple flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm mb-2">
                    <strong className="text-accent-purple">Achievement Rewards:</strong>
                  </p>
                  <ul className="text-sm space-y-1 list-disc list-inside pl-2">
                    <li>Exclusive profile badges and titles</li>
                    <li>Bonus soul multipliers (up to +50%)</li>
                    <li>Early access to new features</li>
                    <li>Special event invitations</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </AccordionItem>

        {/* FAQ */}
        <AccordionItem
          title="Frequently Asked Questions"
          icon={<HelpCircle className="w-6 h-6" />}
        >
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="pb-4 border-b border-border last:border-0 last:pb-0">
                <h4 className="font-bold text-text-primary mb-2">{faq.question}</h4>
                <p className="text-text-secondary text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-bg-primary rounded-lg p-4 border border-accent-orange/30">
            <p className="text-sm text-text-secondary">
              <strong className="text-accent-orange">Still have questions?</strong> Join our Discord 
              community or check out the full documentation for detailed guides and tutorials.
            </p>
          </div>
        </AccordionItem>
      </div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-accent-orange to-accent-purple rounded-lg p-8 text-center"
      >
        <h2 className="text-2xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
        <p className="text-white/80 mb-6 max-w-2xl mx-auto">
          Join thousands of players in the ultimate blockchain battle arena. 
          Collect souls, upgrade your ghost, and become a legend!
        </p>
        <motion.a
          href="/dashboard"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-2 px-8 py-3 bg-white text-accent-orange font-bold rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Play className="w-5 h-5" />
          Enter the Arena
        </motion.a>
      </motion.div>
    </div>
  );
}

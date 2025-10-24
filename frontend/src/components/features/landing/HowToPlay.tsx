// Tutorial section
import { motion } from 'framer-motion';
import { Wallet, Gamepad2, Swords, Gift } from 'lucide-react';

const steps = [
  {
    icon: Wallet,
    title: 'Connect Wallet',
    description: 'Connect your Web3 wallet to Somnia Devnet and get ready to play',
    step: '01',
  },
  {
    icon: Gamepad2,
    title: 'Explore Rooms',
    description: 'Navigate haunted rooms and collect souls for 90 seconds',
    step: '02',
  },
  {
    icon: Swords,
    title: 'Battle Phase',
    description: 'Fight spectral enemies in intense 30-second combat',
    step: '03',
  },
  {
    icon: Gift,
    title: 'Claim Rewards',
    description: 'Earn points, climb leaderboards, and mint exclusive NFTs',
    step: '04',
  },
];

export default function HowToPlay() {
  return (
    <section className="py-24 px-4 bg-bg-secondary">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="header-font text-5xl md:text-6xl mb-4 text-accent-orange">
            How to Play
          </h2>
          <p className="ui-font text-lg text-text-secondary max-w-2xl mx-auto">
            Four simple steps to start your haunted adventure
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative"
            >
              <div className="bg-bg-card border-2 border-border-color hover:border-accent-orange transition-all duration-300 rounded-lg p-6 h-full">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-accent-orange rounded-full flex items-center justify-center stat-font text-2xl shadow-lg">
                  {step.step}
                </div>
                
                <div className="text-accent-orange mb-4 mt-4">
                  <step.icon className="w-14 h-14" />
                </div>
                
                <h3 className="metal-font text-2xl mb-3">{step.title}</h3>
                
                <p className="ui-font text-text-secondary leading-relaxed">
                  {step.description}
                </p>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-accent-orange/30" />
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="inline-block bg-bg-card border-2 border-accent-orange rounded-lg p-6">
            <p className="ui-font text-lg text-text-secondary mb-2">
              Each game session lasts
            </p>
            <p className="stat-font text-5xl text-accent-orange">
              2 Minutes
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

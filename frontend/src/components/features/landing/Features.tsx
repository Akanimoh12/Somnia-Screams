// Game features list
import { motion } from 'framer-motion';
import { Sword, Ghost, Trophy, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Ghost,
    title: 'Room Exploration',
    description: 'Navigate 50+ haunted rooms filled with mysteries and hidden souls',
    color: 'text-accent-purple',
  },
  {
    icon: Sword,
    title: 'Spectral Battles',
    description: '30-second intense combat with ghosts and demons every 2 minutes',
    color: 'text-accent-red',
  },
  {
    icon: Sparkles,
    title: 'Soul Collection',
    description: 'Gather floating souls and batch collect for optimized gas efficiency',
    color: 'text-accent-orange',
  },
  {
    icon: Trophy,
    title: 'NFT Rewards',
    description: 'Unlock Bronze, Silver, and Gold tier NFTs with exclusive benefits',
    color: 'text-success',
  },
];

export default function Features() {
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
            Game Features
          </h2>
          <p className="ui-font text-lg text-text-secondary max-w-2xl mx-auto">
            Experience the ultimate Halloween gaming adventure on Somnia blockchain
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="bg-bg-card border-2 border-border-color hover:border-accent-orange transition-all duration-300 rounded-lg p-6 group"
            >
              <div className={`${feature.color} mb-4 transform group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-12 h-12" />
              </div>
              <h3 className="metal-font text-2xl mb-3">{feature.title}</h3>
              <p className="ui-font text-text-secondary leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

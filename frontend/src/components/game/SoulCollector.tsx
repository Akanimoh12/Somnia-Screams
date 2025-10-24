import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useState } from 'react';
import type { SoulAnimation } from '../../types/game';

interface SoulCollectorProps {
  souls: number;
  onCollect?: () => void;
}

export default function SoulCollector({ souls, onCollect }: Readonly<SoulCollectorProps>) {
  const [animations, setAnimations] = useState<SoulAnimation[]>([]);

  const handleCollect = () => {
    const newAnimation: SoulAnimation = {
      id: `soul-${Date.now()}`,
      x: Math.random() * 300,
      y: Math.random() * 200,
      value: 1
    };

    setAnimations(prev => [...prev, newAnimation]);
    onCollect?.();

    setTimeout(() => {
      setAnimations(prev => prev.filter(a => a.id !== newAnimation.id));
    }, 1000);
  };

  return (
    <div className="relative">
      <div className="bg-bg-card border-2 border-accent-orange/30 rounded-lg p-6">
        <div className="text-center mb-6">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
            className="inline-block mb-4"
          >
            <Sparkles className="w-16 h-16 text-accent-orange" />
          </motion.div>
          <div className="text-4xl font-bold stat-font text-accent-orange mb-2">
            {souls}
          </div>
          <div className="text-sm ui-font text-text-secondary">
            Souls Collected
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCollect}
          className="w-full bg-accent-orange text-white font-bold ui-font py-3 rounded-lg hover:shadow-lg hover:shadow-accent-orange/50 transition-all"
        >
          Collect Soul
        </motion.button>
      </div>

      <AnimatePresence>
        {animations.map(anim => (
          <motion.div
            key={anim.id}
            initial={{ opacity: 1, x: anim.x, y: anim.y, scale: 0 }}
            animate={{ opacity: 0, x: anim.x, y: -100, scale: 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute pointer-events-none"
          >
            <Sparkles className="w-8 h-8 text-accent-orange" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

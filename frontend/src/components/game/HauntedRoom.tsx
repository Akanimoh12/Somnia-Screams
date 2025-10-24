import { motion } from 'framer-motion';
import { Ghost, Skull, Flame } from 'lucide-react';
import type { Room } from '../../types/game';

interface HauntedRoomProps {
  room: Room;
  onExplore?: () => void;
}

export default function HauntedRoom({ room, onExplore }: Readonly<HauntedRoomProps>) {
  const icons = [Ghost, Skull, Flame];
  const RandomIcon = icons[room.id % icons.length];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="relative bg-bg-card border-2 border-accent-orange/30 rounded-lg p-6 overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent-orange/5 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold header-font text-accent-orange mb-1">
              {room.name}
            </h3>
            <p className="text-sm ui-font text-text-secondary">
              {room.description}
            </p>
          </div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <RandomIcon className="w-12 h-12 text-accent-orange/50" />
          </motion.div>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent-purple" />
            <span className="text-sm ui-font text-text-secondary">
              Difficulty: {room.difficulty}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent-orange" />
            <span className="text-sm ui-font text-text-secondary">
              Souls: {room.souls}
            </span>
          </div>
        </div>

        {room.explored && (
          <div className="bg-success/10 border border-success/30 rounded px-3 py-1 mb-4 inline-block">
            <span className="text-xs ui-font text-success">✓ Explored</span>
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onExplore}
          className="w-full bg-linear-to-r from-accent-orange to-accent-red text-white font-bold ui-font py-3 rounded-lg hover:shadow-lg hover:shadow-accent-orange/50 transition-all"
        >
          {room.explored ? 'Re-explore' : 'Enter Room'}
        </motion.button>
      </div>
    </motion.div>
  );
}

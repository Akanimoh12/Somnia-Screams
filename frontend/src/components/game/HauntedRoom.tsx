import { motion } from 'framer-motion';
import { Ghost, Skull, Flame, Star, Gem, Puzzle, Zap } from 'lucide-react';
import type { Room } from '../../types/game';

interface HauntedRoomProps {
  room: Room;
  onExplore?: () => void;
}

export default function HauntedRoom({ room, onExplore }: Readonly<HauntedRoomProps>) {
  const icons = [Ghost, Skull, Flame];
  const RandomIcon = icons[room.id % icons.length];

  // Render difficulty stars
  const renderDifficultyStars = () => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3 h-3 ${
              star <= room.difficulty 
                ? 'fill-accent-orange text-accent-orange' 
                : 'text-text-secondary/30'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="relative bg-bg-card border-2 border-accent-orange/30 rounded-lg p-6 overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent-orange/5 rounded-full blur-3xl" />
      
      {/* Badges Overlay */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        {room.hasChest && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-success/20 border border-success/50 rounded-full p-2"
            title="Contains Treasure Chest"
          >
            <Gem className="w-4 h-4 text-success" />
          </motion.div>
        )}
        {room.requiresPuzzle && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-warning/20 border border-warning/50 rounded-full p-2"
            title="Puzzle Required"
          >
            <Puzzle className="w-4 h-4 text-warning" />
          </motion.div>
        )}
      </div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold header-font text-accent-orange">
                {room.name}
              </h3>
              {room.isCompleted && (
                <div className="bg-success/20 border border-success/40 rounded px-2 py-0.5">
                  <span className="text-xs ui-font text-success">✓</span>
                </div>
              )}
            </div>
            <p className="text-sm ui-font text-text-secondary mb-2">
              {room.description}
            </p>
            {renderDifficultyStars()}
          </div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <RandomIcon className="w-12 h-12 text-accent-orange/50" />
          </motion.div>
        </div>

        <div className="flex items-center gap-4 mb-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Skull className="w-4 h-4 text-accent-purple" />
            <span className="text-sm ui-font text-text-secondary">
              {room.soulCount ?? room.souls} souls
            </span>
          </div>
          {room.basePoints && (
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-accent-orange" />
              <span className="text-sm ui-font text-text-secondary">
                {room.basePoints} pts
              </span>
            </div>
          )}
          {room.enemyType !== undefined && (
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-accent-red" />
              <span className="text-sm ui-font text-text-secondary">
                Type {room.enemyType}
              </span>
            </div>
          )}
        </div>

        {/* First Clear Bonus Badge */}
        {room.isFirstClear && !room.isCompleted && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-linear-to-r from-accent-orange to-accent-red border border-accent-orange rounded px-3 py-2 mb-4 inline-flex items-center gap-2"
          >
            <Zap className="w-4 h-4 text-white" />
            <span className="text-xs font-bold ui-font text-white">
              FIRST CLEAR: 2X POINTS!
            </span>
          </motion.div>
        )}

        {room.isCompleted && (
          <div className="bg-success/10 border border-success/30 rounded px-3 py-1 mb-4 inline-block">
            <span className="text-xs ui-font text-success">✓ Completed</span>
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onExplore}
          className="w-full bg-linear-to-r from-accent-orange to-accent-red text-white font-bold ui-font py-3 rounded-lg hover:shadow-lg hover:shadow-accent-orange/50 transition-all"
        >
          {room.isCompleted ? 'Re-explore' : 'Enter Room'}
        </motion.button>
      </div>
    </motion.div>
  );
}

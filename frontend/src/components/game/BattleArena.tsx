import { motion } from 'framer-motion';
import { Sword, Shield, Heart, Skull } from 'lucide-react';
import { useState } from 'react';
import type { Battle } from '../../types/game';

interface BattleArenaProps {
  battle?: Battle;
  onAttack?: () => void;
  onDefend?: () => void;
}

export default function BattleArena({ battle, onAttack, onDefend }: Readonly<BattleArenaProps>) {
  const [playerAttacking, setPlayerAttacking] = useState(false);

  const handleAttack = () => {
    setPlayerAttacking(true);
    onAttack?.();
    setTimeout(() => setPlayerAttacking(false), 500);
  };

  if (!battle?.active) {
    return (
      <div className="bg-bg-card border-2 border-accent-red/30 rounded-lg p-8 text-center">
        <Skull className="w-16 h-16 text-accent-red/50 mx-auto mb-4" />
        <p className="ui-font text-text-secondary">No active battle</p>
      </div>
    );
  }

  const playerHealthPercent = (battle.playerHealth / 100) * 100;
  const opponentHealthPercent = (battle.opponentHealth / 100) * 100;

  return (
    <div className="bg-bg-card border-2 border-accent-red/30 rounded-lg p-6">
      <div className="grid grid-cols-2 gap-8 mb-8">
        <motion.div
          animate={playerAttacking ? { x: [0, 20, 0] } : {}}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-accent-orange/20 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Sword className="w-12 h-12 text-accent-orange" />
          </div>
          <div className="text-lg font-bold ui-font mb-2">You</div>
          <div className="w-full bg-bg-secondary rounded-full h-4 mb-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${playerHealthPercent}%` }}
              className="bg-accent-red h-4 rounded-full"
            />
          </div>
          <div className="text-sm ui-font text-text-secondary flex items-center justify-center gap-1">
            <Heart className="w-4 h-4" />
            {battle.playerHealth}/100
          </div>
        </motion.div>

        <div className="text-center">
          <div className="w-24 h-24 bg-accent-purple/20 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Skull className="w-12 h-12 text-accent-purple" />
          </div>
          <div className="text-lg font-bold ui-font mb-2">Opponent</div>
          <div className="w-full bg-bg-secondary rounded-full h-4 mb-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${opponentHealthPercent}%` }}
              className="bg-accent-purple h-4 rounded-full"
            />
          </div>
          <div className="text-sm ui-font text-text-secondary flex items-center justify-center gap-1">
            <Heart className="w-4 h-4" />
            {battle.opponentHealth}/100
          </div>
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAttack}
          className="flex items-center gap-2 px-8 py-3 bg-accent-red text-white font-bold ui-font rounded-lg hover:shadow-lg hover:shadow-accent-red/50 transition-all"
        >
          <Sword className="w-5 h-5" />
          Attack
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onDefend}
          className="flex items-center gap-2 px-8 py-3 bg-accent-purple text-white font-bold ui-font rounded-lg hover:shadow-lg hover:shadow-accent-purple/50 transition-all"
        >
          <Shield className="w-5 h-5" />
          Defend
        </motion.button>
      </div>
    </div>
  );
}

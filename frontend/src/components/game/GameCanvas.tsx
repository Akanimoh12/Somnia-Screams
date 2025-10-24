import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import type { GamePhase } from '../../types/game';
import GamePhaseIndicator from './GamePhaseIndicator';
import TimerDisplay from './TimerDisplay';

interface GameCanvasProps {
  children: ReactNode;
  phase: GamePhase;
  timeRemaining: number;
}

export default function GameCanvas({ children, phase, timeRemaining }: Readonly<GameCanvasProps>) {
  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-accent-orange/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-purple/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <GamePhaseIndicator phase={phase} timeRemaining={timeRemaining} />
          <TimerDisplay timeRemaining={timeRemaining} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}

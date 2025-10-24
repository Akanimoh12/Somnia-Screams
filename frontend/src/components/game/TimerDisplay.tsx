import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

interface TimerDisplayProps {
  timeRemaining: number;
}

export default function TimerDisplay({ timeRemaining }: Readonly<TimerDisplayProps>) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  
  const isWarning = timeRemaining <= 30 && timeRemaining > 10;
  const isCritical = timeRemaining <= 10;

  const getColorClass = () => {
    if (isCritical) return 'text-accent-red';
    if (isWarning) return 'text-warning';
    return 'text-accent-orange';
  };

  return (
    <motion.div
      animate={isCritical ? { scale: [1, 1.1, 1] } : {}}
      transition={{ repeat: Infinity, duration: 1 }}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-card border-2 border-border-color"
    >
      <Clock className={`w-5 h-5 ${getColorClass()}`} />
      <div className={`text-2xl font-bold eater-font ${getColorClass()}`}>
        {minutes}:{seconds.toString().padStart(2, '0')}
      </div>
    </motion.div>
  );
}

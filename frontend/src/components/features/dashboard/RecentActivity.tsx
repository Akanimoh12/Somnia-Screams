import { motion } from 'framer-motion';
import { Clock, Trophy, Skull, Swords } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Activity {
  id: string;
  type: 'SESSION' | 'BATTLE' | 'SOUL' | 'ACHIEVEMENT';
  description: string;
  timestamp: number;
  value?: number;
}

export default function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const mockActivities: Activity[] = [
      {
        id: '1',
        type: 'SESSION',
        description: 'Completed game session',
        timestamp: Date.now() - 300000,
        value: 150
      },
      {
        id: '2',
        type: 'BATTLE',
        description: 'Won battle against Spectral Knight',
        timestamp: Date.now() - 600000,
        value: 50
      },
      {
        id: '3',
        type: 'SOUL',
        description: 'Collected 25 souls',
        timestamp: Date.now() - 900000,
        value: 25
      }
    ];
    setActivities(mockActivities);
  }, []);

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'SESSION':
        return Clock;
      case 'BATTLE':
        return Swords;
      case 'SOUL':
        return Skull;
      case 'ACHIEVEMENT':
        return Trophy;
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'SESSION':
        return 'text-accent-purple';
      case 'BATTLE':
        return 'text-accent-red';
      case 'SOUL':
        return 'text-accent-orange';
      case 'ACHIEVEMENT':
        return 'text-success';
    }
  };

  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div className="bg-bg-card border-2 border-border-color rounded-lg p-6">
      <h3 className="text-xl font-bold header-font text-accent-orange mb-6">
        Recent Activity
      </h3>
      
      {activities.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-text-muted mx-auto mb-3" />
          <p className="text-sm ui-font text-text-secondary">
            No recent activity
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const Icon = getActivityIcon(activity.type);
            const color = getActivityColor(activity.type);
            
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4 p-4 bg-bg-secondary rounded-lg border border-border-color hover:border-accent-orange/30 transition-colors"
              >
                <div className={`p-2 rounded-lg bg-${color.split('-')[1]}/10`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div className="flex-1">
                  <div className="text-sm ui-font text-white mb-1">
                    {activity.description}
                  </div>
                  <div className="text-xs ui-font text-text-muted">
                    {getTimeAgo(activity.timestamp)}
                  </div>
                </div>
                {activity.value && (
                  <div className={`text-lg font-bold stat-font ${color}`}>
                    +{activity.value}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

import { motion } from 'framer-motion';
import { Clock, Trophy, Skull, Swords, Zap } from 'lucide-react';
import { useActivityFeed, type ActivityType } from '../../../hooks/useActivityFeed';

export default function RecentActivity() {
  const { 
    activities, 
    isLoading, 
    filter, 
    setFilter, 
    loadMore, 
    hasMore,
    getTimeAgo 
  } = useActivityFeed();

  const filters: Array<ActivityType | 'ALL'> = ['ALL', 'SESSION', 'BATTLE', 'SOUL', 'ACHIEVEMENT', 'NFT', 'LEVEL_UP'];

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'SESSION':
        return Clock;
      case 'BATTLE':
        return Swords;
      case 'SOUL':
        return Skull;
      case 'ACHIEVEMENT':
        return Trophy;
      case 'NFT':
        return Zap;
      case 'LEVEL_UP':
        return Trophy;
    }
  };

  const getActivityColor = (type: ActivityType) => {
    switch (type) {
      case 'SESSION':
        return 'text-accent-purple';
      case 'BATTLE':
        return 'text-accent-red';
      case 'SOUL':
        return 'text-accent-orange';
      case 'ACHIEVEMENT':
        return 'text-success';
      case 'NFT':
        return 'text-accent-purple';
      case 'LEVEL_UP':
        return 'text-accent-orange';
    }
  };


  return (
    <div className="bg-bg-card border-2 border-border-color rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold header-font text-accent-orange">
          Recent Activity
        </h3>
        
        {/* Filter dropdown */}
        <div className="relative">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as ActivityType | 'ALL')}
            className="bg-bg-secondary border border-border-color rounded-lg px-3 py-1.5 text-sm ui-font text-white focus:outline-none focus:border-accent-orange transition-colors"
          >
            {filters.map((f) => (
              <option key={f} value={f}>
                {f === 'ALL' ? 'All Activities' : f.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-4 p-4 bg-bg-secondary rounded-lg border border-border-color animate-pulse">
              <div className="w-10 h-10 bg-bg-primary rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-bg-primary rounded w-3/4" />
                <div className="h-3 bg-bg-primary rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {!isLoading && activities.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-text-muted mx-auto mb-3" />
          <p className="text-sm ui-font text-text-secondary">
            No recent activity
          </p>
          <p className="text-xs ui-font text-text-muted mt-2">
            Start playing to see your activities here
          </p>
        </div>
      ) : null}

      {!isLoading && activities.length > 0 ? (
        <>
          <div className="space-y-4">
            {activities.map((activity, index) => {
              const Icon = getActivityIcon(activity.type);
              const color = getActivityColor(activity.type);
              
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
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
          
          {/* Load More button */}
          {hasMore && (
            <button
              onClick={loadMore}
              className="w-full mt-4 px-4 py-2 bg-bg-secondary border border-border-color rounded-lg text-sm ui-font text-white hover:border-accent-orange/50 hover:bg-bg-primary transition-all"
            >
              Load More
            </button>
          )}
        </>
      ) : null}
    </div>
  );
}

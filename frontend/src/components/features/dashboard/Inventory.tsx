import { motion } from 'framer-motion';
import { Package, Sparkles, Zap, X } from 'lucide-react';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useInventory } from '../../../hooks/useInventory';

export default function Inventory() {
  const { address } = useAccount();
  const { inventory } = useInventory();
  const [selectedTab, setSelectedTab] = useState<'souls' | 'powerups' | 'items'>('souls');

  const tabs = [
    { id: 'souls', label: 'Souls', icon: Sparkles },
    { id: 'powerups', label: 'Power-ups', icon: Zap },
    { id: 'items', label: 'Items', icon: Package }
  ];

  const getTimeRemaining = (expiry: number) => {
    const remaining = expiry - Date.now();
    const hours = Math.floor(remaining / 3600000);
    const minutes = Math.floor((remaining % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  if (!address) {
    return (
      <div className="bg-bg-card border-2 border-border-color rounded-lg p-6">
        <div className="text-center py-8">
          <Package className="w-12 h-12 text-text-muted mx-auto mb-3" />
          <p className="text-sm ui-font text-text-secondary">
            Connect wallet to view inventory
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-card border-2 border-border-color rounded-lg overflow-hidden">
      <div className="border-b border-border-color">
        <div className="flex">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as typeof selectedTab)}
                className={`flex items-center gap-2 px-6 py-4 font-bold ui-font transition-all ${
                  selectedTab === tab.id
                    ? 'bg-accent-orange text-white border-b-2 border-accent-orange'
                    : 'text-text-secondary hover:text-white hover:bg-bg-secondary'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-6">
        {selectedTab === 'souls' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8"
          >
            <Sparkles className="w-16 h-16 text-accent-orange mx-auto mb-4" />
            <div className="text-5xl font-bold stat-font text-accent-orange mb-2">
              {inventory?.souls.toLocaleString()}
            </div>
            <div className="text-lg ui-font text-text-secondary mb-6">
              Total Souls Collected
            </div>
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-bg-secondary rounded-lg p-4">
                <div className="text-2xl font-bold stat-font text-accent-purple mb-1">
                  {Math.floor((inventory?.souls || 0) * 0.1)}
                </div>
                <div className="text-xs ui-font text-text-muted">This Session</div>
              </div>
              <div className="bg-bg-secondary rounded-lg p-4">
                <div className="text-2xl font-bold stat-font text-accent-red mb-1">
                  {Math.floor((inventory?.souls || 0) * 0.3)}
                </div>
                <div className="text-xs ui-font text-text-muted">This Week</div>
              </div>
              <div className="bg-bg-secondary rounded-lg p-4">
                <div className="text-2xl font-bold stat-font text-success mb-1">
                  {inventory?.souls}
                </div>
                <div className="text-xs ui-font text-text-muted">All Time</div>
              </div>
            </div>
          </motion.div>
        )}

        {selectedTab === 'powerups' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {inventory?.powerUps.length === 0 ? (
              <div className="text-center py-8">
                <Zap className="w-12 h-12 text-text-muted mx-auto mb-3" />
                <p className="text-sm ui-font text-text-secondary">
                  No power-ups available
                </p>
              </div>
            ) : (
              inventory?.powerUps.map(powerUp => (
                <div
                  key={powerUp.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border-2 ${
                    powerUp.active
                      ? 'bg-accent-orange/10 border-accent-orange/30'
                      : 'bg-bg-secondary border-border-color'
                  }`}
                >
                  <div className={`p-3 rounded-lg ${
                    powerUp.active ? 'bg-accent-orange/20' : 'bg-bg-card'
                  }`}>
                    <Zap className={`w-6 h-6 ${
                      powerUp.active ? 'text-accent-orange' : 'text-text-muted'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold ui-font text-white">
                        {powerUp.name}
                      </span>
                      {powerUp.active && (
                        <span className="text-xs ui-font px-2 py-1 bg-accent-orange rounded text-white">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <p className="text-sm ui-font text-text-secondary mb-1">
                      {powerUp.description}
                    </p>
                    <p className="text-xs ui-font text-text-muted">
                      Expires in: {getTimeRemaining(powerUp.expiry)}
                    </p>
                  </div>
                  {powerUp.active && (
                    <button className="p-2 hover:bg-accent-red/20 rounded transition-colors">
                      <X className="w-5 h-5 text-accent-red" />
                    </button>
                  )}
                </div>
              ))
            )}
          </motion.div>
        )}

        {selectedTab === 'items' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {inventory?.items.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <Package className="w-12 h-12 text-text-muted mx-auto mb-3" />
                <p className="text-sm ui-font text-text-secondary">
                  No items in inventory
                </p>
              </div>
            ) : (
              inventory?.items.map(item => (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.05 }}
                  className="bg-bg-secondary border-2 border-border-color rounded-lg p-4 hover:border-accent-orange/30 transition-all cursor-pointer"
                >
                  <div className="aspect-square bg-bg-card rounded-lg mb-3 flex items-center justify-center">
                    <Package className="w-8 h-8 text-accent-purple" />
                  </div>
                  <div className="text-sm font-bold ui-font text-white mb-1">
                    {item.name}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs ui-font text-text-muted">
                      {item.type}
                    </span>
                    <span className="text-sm font-bold stat-font text-accent-orange">
                      x{item.quantity}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

import { motion } from 'framer-motion';
import { Calendar, Zap, Crown } from 'lucide-react';
import type { NFT } from '../../../hooks/useNFTs';

interface NFTCardProps {
  nft: NFT;
  canUpgradeToSilver?: boolean;
  canUpgradeToGold?: boolean;
  onUpgrade?: (tokenId: string, newTier: 'SILVER' | 'GOLD') => void;
  upgrading?: boolean;
}

export const NFTCard = ({ nft, canUpgradeToSilver, canUpgradeToGold, onUpgrade, upgrading }: NFTCardProps) => {
  const tierColors = {
    BRONZE: 'from-amber-700 to-amber-900',
    SILVER: 'from-gray-400 to-gray-600',
    GOLD: 'from-yellow-400 to-yellow-600',
  };

  const tierGlow = {
    BRONZE: 'shadow-[0_0_20px_rgba(217,119,6,0.5)]',
    SILVER: 'shadow-[0_0_20px_rgba(156,163,175,0.5)]',
    GOLD: 'shadow-[0_0_30px_rgba(250,204,21,0.7)]',
  };

  const formattedDate = new Date(nft.mintedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Determine if upgrade is available
  const canUpgrade = nft.tokenId && (
    (nft.tierNum === 0 && canUpgradeToSilver) ||
    (nft.tierNum === 1 && canUpgradeToGold)
  );

  const nextTier = nft.tierNum === 0 ? 'SILVER' : 'GOLD';

  const handleUpgrade = () => {
    if (nft.tokenId && onUpgrade && canUpgrade) {
      onUpgrade(nft.tokenId, nextTier);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className={`relative bg-secondary border-2 border-primary/30 rounded-lg overflow-hidden ${tierGlow[nft.tier]}`}
    >
      <div className={`absolute top-3 right-3 px-3 py-1 rounded-full bg-gradient-to-r ${tierColors[nft.tier]} text-white text-xs font-bold`}>
        {nft.tier}
      </div>

      <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center p-8">
        {nft.tier === 'BRONZE' && <Crown size={80} className="text-amber-700" />}
        {nft.tier === 'SILVER' && <Crown size={80} className="text-gray-400" />}
        {nft.tier === 'GOLD' && <Crown size={80} className="text-yellow-400 animate-pulse" />}
      </div>

      <div className="p-4 space-y-3">
        <h3 className="font-bold text-white text-lg stat-font">{nft.name}</h3>

        <div className="flex items-center gap-2 text-sm text-secondary">
          <Calendar size={14} />
          <span>Minted {formattedDate}</span>
        </div>

        <div className="space-y-2 pt-2 border-t border-primary/20">
          <div className="flex items-center justify-between">
            <span className="text-sm text-secondary">XP Boost</span>
            <div className="flex items-center gap-1 text-success">
              <Zap size={14} />
              <span className="font-bold">+{nft.attributes.xpBoost}%</span>
            </div>
          </div>

          {nft.attributes.specialAbility && (
            <div className="text-xs text-secondary bg-primary/10 rounded px-2 py-1">
              {nft.attributes.specialAbility}
            </div>
          )}

          {canUpgrade && nft.tierNum !== 2 && (
            <motion.button
              onClick={handleUpgrade}
              disabled={upgrading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full mt-2 px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                upgrading 
                  ? 'bg-primary/20 text-secondary cursor-not-allowed'
                  : 'bg-gradient-to-r from-primary to-primary/80 text-white hover:from-primary/90 hover:to-primary/70'
              }`}
            >
              {upgrading ? (
                'Upgrading...'
              ) : (
                <span className="flex items-center justify-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  Upgrade to {nextTier}
                </span>
              )}
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

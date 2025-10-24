import { useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Sparkles, Lock } from 'lucide-react';
import { useNFTs } from '../../../hooks/useNFTs';
import { NFTCard } from './NFTCard';
import { MintNFTModal } from './MintNFTModal';
import type { NFTTierRequirements } from '../../../hooks/useNFTs';

export const NFTGallery = () => {
  const { nfts, tierRequirements, loading, minting, mintNFT } = useNFTs();
  const [selectedTier, setSelectedTier] = useState<NFTTierRequirements | null>(null);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-primary/20 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Crown size={28} className="text-warning" />
          <h2 className="text-2xl font-bold text-white title-font">NFT Collection</h2>
        </div>

        {nfts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-primary/20 rounded-lg"
          >
            <Sparkles size={48} className="text-secondary mx-auto mb-4" />
            <p className="text-secondary">You haven't minted any NFTs yet</p>
            <p className="text-sm text-secondary/70 mt-2">Complete challenges to unlock tiers below</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nfts.map((nft) => (
              <NFTCard key={nft.id} nft={nft} />
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Crown size={28} className="text-warning" />
          <h2 className="text-2xl font-bold text-white title-font">Available Tiers</h2>
        </div>

        <div className="grid gap-6">
          {tierRequirements.map((tier, index) => {
            const tierColors = {
              BRONZE: 'border-amber-700/50 bg-amber-900/10',
              SILVER: 'border-gray-400/50 bg-gray-600/10',
              GOLD: 'border-yellow-400/50 bg-yellow-600/10',
            };

            const tierGradients = {
              BRONZE: 'from-amber-700 to-amber-900',
              SILVER: 'from-gray-400 to-gray-600',
              GOLD: 'from-yellow-400 to-yellow-600',
            };

            return (
              <motion.div
                key={tier.tier}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`border-2 rounded-lg p-6 ${tierColors[tier.tier]} ${
                  tier.unlocked ? 'border-success bg-success/5' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${tierGradients[tier.tier]} flex items-center justify-center`}>
                        <Crown size={24} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white title-font">{tier.name}</h3>
                        <span className="text-sm text-secondary">{tier.tier} Tier</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="space-y-1">
                        <div className="text-xs text-secondary">Requirements</div>
                        <div className="text-sm text-white font-bold">
                          {tier.points.toLocaleString()} pts • Level {tier.level}+
                        </div>
                        {tier.additionalReqs && (
                          <div className="text-xs text-secondary">{tier.additionalReqs}</div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-secondary">Cost</div>
                        <div className="text-sm text-warning font-bold stat-font">{tier.mintCost}</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {tier.benefits.slice(0, 3).map((benefit, i) => (
                        <span
                          key={i}
                          className="text-xs bg-primary/30 text-secondary px-2 py-1 rounded"
                        >
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedTier(tier)}
                    disabled={!tier.unlocked}
                    className={`px-6 py-2 rounded-lg font-bold transition ${
                      tier.unlocked
                        ? `bg-gradient-to-r ${tierGradients[tier.tier]} text-white hover:scale-105`
                        : 'bg-primary/30 text-secondary cursor-not-allowed'
                    }`}
                  >
                    {tier.unlocked ? 'Mint' : <Lock size={18} />}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {selectedTier && (
        <MintNFTModal
          isOpen={!!selectedTier}
          onClose={() => setSelectedTier(null)}
          tier={selectedTier}
          onMint={() => mintNFT(selectedTier.tier)}
          minting={minting}
        />
      )}
    </div>
  );
};

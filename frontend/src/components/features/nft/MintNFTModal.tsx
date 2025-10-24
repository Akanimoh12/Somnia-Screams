import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Zap, Trophy, Target, Lock } from 'lucide-react';
import type { NFTTierRequirements } from '../../../hooks/useNFTs';

interface MintNFTModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier: NFTTierRequirements;
  onMint: () => void;
  minting: boolean;
}

export const MintNFTModal = ({ isOpen, onClose, tier, onMint, minting }: MintNFTModalProps) => {
  const [confirmed, setConfirmed] = useState(false);

  const tierColors = {
    BRONZE: 'from-amber-700 to-amber-900',
    SILVER: 'from-gray-400 to-gray-600',
    GOLD: 'from-yellow-400 to-yellow-600',
  };

  const tierIcons = {
    BRONZE: <Crown size={60} className="text-amber-700" />,
    SILVER: <Crown size={60} className="text-gray-400" />,
    GOLD: <Crown size={60} className="text-yellow-400 animate-pulse" />,
  };

  const handleMint = () => {
    setConfirmed(true);
    onMint();
    setTimeout(() => {
      setConfirmed(false);
      onClose();
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-secondary border-2 border-primary rounded-lg max-w-lg w-full p-6 relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-secondary hover:text-white transition"
              >
                <X size={24} />
              </button>

              <div className="text-center space-y-6">
                <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-r ${tierColors[tier.tier]} flex items-center justify-center`}>
                  {tierIcons[tier.tier]}
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white title-font mb-2">
                    Mint {tier.name}
                  </h2>
                  <p className="text-secondary">{tier.tier} Tier NFT</p>
                </div>

                <div className="space-y-3 text-left bg-primary/20 rounded-lg p-4">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <Trophy size={18} className="text-warning" />
                    Requirements
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-secondary">Lifetime Points</span>
                      <span className="text-white font-bold">{tier.points.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-secondary">Level Required</span>
                      <span className="text-white font-bold">{tier.level}+</span>
                    </div>
                    {tier.additionalReqs && (
                      <div className="flex items-center justify-between">
                        <span className="text-secondary">Additional</span>
                        <span className="text-white font-bold text-xs">{tier.additionalReqs}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3 text-left bg-primary/20 rounded-lg p-4">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <Zap size={18} className="text-success" />
                    Benefits
                  </h3>
                  <div className="space-y-2">
                    {tier.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-secondary">
                        <Target size={12} className="text-success" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-center py-2">
                  <div className="text-sm text-secondary mb-1">Minting Cost</div>
                  <div className="text-2xl font-bold text-warning stat-font">{tier.mintCost}</div>
                </div>

                {tier.unlocked ? (
                  <button
                    onClick={handleMint}
                    disabled={minting || confirmed}
                    className={`w-full py-3 rounded-lg font-bold text-white transition ${
                      minting || confirmed
                        ? 'bg-primary/50 cursor-not-allowed'
                        : `bg-gradient-to-r ${tierColors[tier.tier]} hover:scale-105`
                    }`}
                  >
                    {minting ? 'Minting...' : confirmed ? '✓ Minted!' : 'Mint NFT'}
                  </button>
                ) : (
                  <div className="w-full py-3 rounded-lg bg-primary/30 text-secondary font-bold flex items-center justify-center gap-2">
                    <Lock size={18} />
                    Requirements Not Met
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

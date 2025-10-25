import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import type { NFT } from '../../../hooks/useNFTs';
import Confetti from 'react-confetti';

interface NFTRevealModalProps {
  isOpen: boolean;
  nft: NFT | null;
  onClose: () => void;
}

export const NFTRevealModal: React.FC<NFTRevealModalProps> = ({ isOpen, nft, onClose }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!nft) return null;

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'BRONZE': return 'from-orange-600 to-orange-800';
      case 'SILVER': return 'from-gray-400 to-gray-600';
      case 'GOLD': return 'from-yellow-400 to-yellow-600';
      default: return 'from-purple-600 to-purple-800';
    }
  };

  const getTierGlow = (tier: string) => {
    switch (tier) {
      case 'BRONZE': return 'shadow-orange-500/50';
      case 'SILVER': return 'shadow-gray-400/50';
      case 'GOLD': return 'shadow-yellow-400/50';
      default: return 'shadow-purple-500/50';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {showConfetti && (
            <Confetti
              width={windowSize.width}
              height={windowSize.height}
              recycle={false}
              numberOfPieces={500}
              gravity={0.3}
            />
          )}
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.5, rotateY: -180 }}
              animate={{ scale: 1, rotateY: 0 }}
              exit={{ scale: 0.5, rotateY: 180 }}
              transition={{ type: "spring", duration: 0.8 }}
              className="relative max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute -top-4 -right-4 z-10 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Main card */}
              <div className={`bg-gradient-to-br ${getTierColor(nft.tier)} rounded-2xl p-8 shadow-2xl ${getTierGlow(nft.tier)} border-4 border-white/20`}>
                {/* Header */}
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-center mb-6"
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
                    <h2 className="text-4xl font-bold text-white drop-shadow-lg">
                      NFT MINTED!
                    </h2>
                    <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
                  </div>
                  <p className="text-white/90 text-lg">{nft.tier} Tier Unlocked</p>
                </motion.div>

                {/* NFT Display */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                  className="bg-black/40 rounded-xl p-6 mb-6 backdrop-blur-sm"
                >
                  {/* NFT Image placeholder */}
                  <div className="aspect-square bg-gradient-to-br from-purple-900 to-black rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="text-white text-6xl"
                    >
                      {nft.tier === 'BRONZE' && '👻'}
                      {nft.tier === 'SILVER' && '💀'}
                      {nft.tier === 'GOLD' && '🏰'}
                    </motion.div>
                  </div>

                  {/* NFT Name */}
                  <h3 className="text-2xl font-bold text-white text-center mb-2">
                    {nft.name}
                  </h3>
                  <p className="text-white/70 text-center">
                    Token ID: #{nft.tokenId || nft.id}
                  </p>
                </motion.div>

                {/* Attributes */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="bg-black/40 rounded-xl p-6 backdrop-blur-sm"
                >
                  <h4 className="text-xl font-bold text-white mb-4 text-center">
                    NFT Benefits
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">XP Boost:</span>
                      <span className="text-green-400 font-bold">+{nft.attributes.xpBoost}%</span>
                    </div>
                    {nft.attributes.specialAbility && (
                      <div className="flex justify-between items-center">
                        <span className="text-white/80">Special Ability:</span>
                        <span className="text-purple-400 font-bold">{nft.attributes.specialAbility}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Tier:</span>
                      <span className={`font-bold ${
                        nft.tier === 'BRONZE' ? 'text-orange-400' :
                        nft.tier === 'SILVER' ? 'text-gray-300' :
                        'text-yellow-400'
                      }`}>
                        {nft.tier}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Action button */}
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  onClick={onClose}
                  className="w-full mt-6 bg-white hover:bg-gray-100 text-gray-900 font-bold py-4 px-6 rounded-xl transition-colors shadow-lg"
                >
                  View in Gallery
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

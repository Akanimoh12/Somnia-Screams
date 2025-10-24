import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';

export interface NFT {
  id: number;
  name: string;
  tier: 'BRONZE' | 'SILVER' | 'GOLD';
  image: string;
  mintedAt: number;
  attributes: {
    xpBoost: number;
    specialAbility?: string;
  };
}

export interface NFTTierRequirements {
  tier: 'BRONZE' | 'SILVER' | 'GOLD';
  name: string;
  points: number;
  level: number;
  additionalReqs?: string;
  mintCost: string;
  benefits: string[];
  unlocked: boolean;
}

export const useNFTs = () => {
  const { address } = useAccount();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [tierRequirements, setTierRequirements] = useState<NFTTierRequirements[]>([]);
  const [loading, setLoading] = useState(true);
  const [minting, setMinting] = useState(false);

  const fetchNFTs = useCallback(async () => {
    if (!address) return;
    
    setLoading(true);
    
    setTimeout(() => {
      const mockNFTs: NFT[] = [
        {
          id: 1,
          name: 'Ghostly Apprentice #1',
          tier: 'BRONZE',
          image: '/nfts/bronze-1.png',
          mintedAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
          attributes: {
            xpBoost: 5,
          },
        },
      ];
      
      const mockTiers: NFTTierRequirements[] = [
        {
          tier: 'BRONZE',
          name: 'Ghostly Apprentice',
          points: 1000,
          level: 10,
          mintCost: '0.001 STT',
          benefits: ['+5% XP boost', 'Special badge', 'Bronze chat access'],
          unlocked: true,
        },
        {
          tier: 'SILVER',
          name: 'Soul Reaper',
          points: 5000,
          level: 25,
          additionalReqs: '10 Battle Wins',
          mintCost: '0.005 STT',
          benefits: ['+10% XP boost', 'Exclusive power-ups', 'Silver frame', 'Priority matchmaking'],
          unlocked: false,
        },
        {
          tier: 'GOLD',
          name: 'Manor Master',
          points: 10000,
          level: 50,
          additionalReqs: 'Top 100 Leaderboard',
          mintCost: '0.01 STT',
          benefits: ['+20% XP boost', 'Legendary power-ups', 'Animated avatar', 'Hall of Fame', 'Governance rights'],
          unlocked: false,
        },
      ];
      
      setNfts(mockNFTs);
      setTierRequirements(mockTiers);
      setLoading(false);
    }, 800);
  }, [address]);

  const mintNFT = useCallback(async (tier: 'BRONZE' | 'SILVER' | 'GOLD') => {
    setMinting(true);
    
    setTimeout(() => {
      const newNFT: NFT = {
        id: nfts.length + 1,
        name: `${tier === 'BRONZE' ? 'Ghostly Apprentice' : tier === 'SILVER' ? 'Soul Reaper' : 'Manor Master'} #${nfts.length + 1}`,
        tier,
        image: `/nfts/${tier.toLowerCase()}-${nfts.length + 1}.png`,
        mintedAt: Date.now(),
        attributes: {
          xpBoost: tier === 'BRONZE' ? 5 : tier === 'SILVER' ? 10 : 20,
          specialAbility: tier === 'GOLD' ? 'Governance Voting' : undefined,
        },
      };
      
      setNfts((prev) => [...prev, newNFT]);
      setMinting(false);
    }, 2000);
  }, [nfts.length]);

  useEffect(() => {
    fetchNFTs();
  }, [fetchNFTs]);

  return {
    nfts,
    tierRequirements,
    loading,
    minting,
    mintNFT,
    refetch: fetchNFTs,
  };
};

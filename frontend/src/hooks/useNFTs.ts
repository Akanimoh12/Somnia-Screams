/**
 * useNFTs Hook
 * 
 * Manages Halloween NFT minting, tier checking, and upgrade functionality.
 * 
 * ⚠️ TIER REQUIREMENTS - STATIC DATA MATCHING CONTRACT
 * ══════════════════════════════════════════════════════════════
 * The tier requirements in this file are STATIC and match the on-chain
 * contract values exactly. They are NOT fetched dynamically because they
 * are immutable constants defined in GameConstants.sol.
 * 
 * ✅ VERIFIED CONTRACT VALUES:
 * ────────────────────────────────────────────────────────────
 * BRONZE: 1000 points, level 10
 *   → GameConstants.sol: BRONZE_POINTS_REQUIRED = 1000
 *   → GameConstants.sol: BRONZE_LEVEL_REQUIRED = 10
 * 
 * SILVER: 5000 points, level 25, 10 battles
 *   → GameConstants.sol: SILVER_POINTS_REQUIRED = 5000
 *   → GameConstants.sol: SILVER_LEVEL_REQUIRED = 25
 *   → GameConstants.sol: SILVER_BATTLES_REQUIRED = 10
 * 
 * GOLD: 10000 points, level 50, top 100 leaderboard
 *   → GameConstants.sol: GOLD_POINTS_REQUIRED = 10000
 *   → GameConstants.sol: GOLD_LEVEL_REQUIRED = 50
 *   → GameConstants.sol: GOLD_LEADERBOARD_POSITION = 100
 * 
 * ⚠️ MAINTENANCE WARNING:
 * ────────────────────────────────────────────────────────────
 * If tier requirements need to change, you MUST update BOTH:
 *   1. Smart contract: contract/src/utils/GameConstants.sol
 *   2. Frontend: frontend/src/hooks/useNFTs.ts (this file)
 * 
 * Failure to update both will cause eligibility mismatches!
 * ══════════════════════════════════════════════════════════════
 */
import { useState, useCallback, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWatchContractEvent, useWaitForTransactionReceipt, useReadContracts } from 'wagmi';
import { CONTRACTS } from '../contracts/addresses';
import { HalloweenNFTABI } from '../contracts/abis';

export type NFTTierNum = 0 | 1 | 2; // 0 = Bronze, 1 = Silver, 2 = Gold

export interface NFT {
  id: number;
  tokenId?: string;
  name: string;
  tier: 'BRONZE' | 'SILVER' | 'GOLD';
  tierNum?: NFTTierNum;
  image: string;
  mintedAt: number;
  attributes: {
    xpBoost: number;
    specialAbility?: string;
  };
  metadata?: NFTMetadata;
}

export interface NFTMetadata {
  description: string;
  external_url?: string;
  background_color?: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
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
  const [showMintModal, setShowMintModal] = useState(false);
  const [mintedNFT, setMintedNFT] = useState<NFT | null>(null);

  // Read owned NFT token IDs from contract
  const { data: nftIds, isLoading: isLoadingNFTs, refetch: refetchNFTs } = useReadContract({
    address: CONTRACTS.HalloweenNFT as `0x${string}`,
    abi: HalloweenNFTABI,
    functionName: 'getPlayerNFTs',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!CONTRACTS.HalloweenNFT,
      refetchInterval: 60000, // Refresh every minute
    }
  });

  // Check Bronze eligibility
  const { data: bronzeEligible } = useReadContract({
    address: CONTRACTS.HalloweenNFT as `0x${string}`,
    abi: HalloweenNFTABI,
    functionName: 'checkEligibility',
    args: address ? [address, 0] : undefined,
    query: {
      enabled: !!address && !!CONTRACTS.HalloweenNFT,
    }
  });

  // Check Silver eligibility
  const { data: silverEligible } = useReadContract({
    address: CONTRACTS.HalloweenNFT as `0x${string}`,
    abi: HalloweenNFTABI,
    functionName: 'checkEligibility',
    args: address ? [address, 1] : undefined,
    query: {
      enabled: !!address && !!CONTRACTS.HalloweenNFT,
    }
  });

  // Check Gold eligibility
  const { data: goldEligible } = useReadContract({
    address: CONTRACTS.HalloweenNFT as `0x${string}`,
    abi: HalloweenNFTABI,
    functionName: 'checkEligibility',
    args: address ? [address, 2] : undefined,
    query: {
      enabled: !!address && !!CONTRACTS.HalloweenNFT,
    }
  });

  // Write contract for minting
  const {
    data: mintHash,
    isPending: isMinting,
    writeContract
  } = useWriteContract();

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: mintHash,
  });

  // Listen for NFT minted events
  useWatchContractEvent({
    address: CONTRACTS.HalloweenNFT as `0x${string}`,
    abi: HalloweenNFTABI,
    eventName: 'NFTMinted',
    onLogs: (logs) => {
      logs.forEach((log: any) => {
        if (log.args.player?.toLowerCase() === address?.toLowerCase()) {
          const tierNum = log.args.tier as NFTTierNum;
          const tierName = ['BRONZE', 'SILVER', 'GOLD'][tierNum] as 'BRONZE' | 'SILVER' | 'GOLD';
          
          const newNFT: NFT = {
            id: Number(log.args.tokenId),
            tokenId: log.args.tokenId.toString(),
            name: `${tierName === 'BRONZE' ? 'Ghostly Apprentice' : tierName === 'SILVER' ? 'Soul Reaper' : 'Manor Master'} #${log.args.tokenId}`,
            tier: tierName,
            tierNum,
            image: `/nfts/${tierName.toLowerCase()}-${log.args.tokenId}.png`,
            mintedAt: Date.now(),
            attributes: {
              xpBoost: tierNum === 0 ? 5 : tierNum === 1 ? 10 : 20,
              specialAbility: tierNum === 2 ? 'Governance Voting' : undefined,
            },
          };
          
          setMintedNFT(newNFT);
          setShowMintModal(true);
          refetchNFTs();
        }
      });
    },
  });

  // Listen for NFT transfers
  useWatchContractEvent({
    address: CONTRACTS.HalloweenNFT as `0x${string}`,
    abi: HalloweenNFTABI,
    eventName: 'Transfer',
    onLogs: (logs) => {
      logs.forEach((log: any) => {
        const from = log.args.from?.toLowerCase();
        const to = log.args.to?.toLowerCase();
        const userAddress = address?.toLowerCase();
        
        // Refetch if user received or sent an NFT
        if (from === userAddress || to === userAddress) {
          refetchNFTs();
        }
      });
    },
  });

  // Fetch NFT tier data from contract
  const tierContracts = nftIds && Array.isArray(nftIds) && nftIds.length > 0
    ? (nftIds as bigint[]).map((tokenId) => ({
        address: CONTRACTS.HalloweenNFT as `0x${string}`,
        abi: HalloweenNFTABI,
        functionName: 'getNFTTier',
        args: [tokenId],
      }))
    : [];

  const { data: tierData } = useReadContracts({
    contracts: tierContracts,
    query: {
      enabled: tierContracts.length > 0,
    },
  });

  // Transform token IDs to NFT objects with real tier data and metadata
  useEffect(() => {
    if (!nftIds || !Array.isArray(nftIds) || nftIds.length === 0) {
      setNfts([]);
      return;
    }

    const transformedNFTs: NFT[] = (nftIds as bigint[]).map((tokenId, index) => {
      const id = Number(tokenId);
      
      // Get tier from contract data or default to Bronze
      let tierNum: NFTTierNum = 0;
      if (tierData && tierData[index] && tierData[index].status === 'success') {
        tierNum = Number(tierData[index].result) as NFTTierNum;
      }
      
      // Map tier number to tier name
      const tierName = tierNum === 2 ? 'GOLD' : tierNum === 1 ? 'SILVER' : 'BRONZE';
      const tierLabel = tierNum === 2 ? 'Manor Master' : tierNum === 1 ? 'Soul Reaper' : 'Ghostly Apprentice';
      
      // Set attributes based on tier
      const xpBoost = tierNum === 2 ? 20 : tierNum === 1 ? 10 : 5;
      const specialAbility = tierNum === 2 
        ? 'Legendary Power-ups Access' 
        : tierNum === 1 
        ? 'Exclusive Power-ups Access' 
        : undefined;
      
      // Create rich metadata
      const metadata: NFTMetadata = {
        description: `${tierLabel} - A ${tierName.toLowerCase()} tier Halloween NFT that grants special abilities and XP boosts in Somnia Screams.`,
        external_url: `https://somniascreams.io/nft/${id}`,
        background_color: tierNum === 2 ? 'FFD700' : tierNum === 1 ? 'C0C0C0' : 'CD7F32',
        attributes: [
          { trait_type: 'Tier', value: tierName },
          { trait_type: 'XP Boost', value: `${xpBoost}%` },
          { trait_type: 'Rarity', value: tierNum === 2 ? 'Legendary' : tierNum === 1 ? 'Rare' : 'Common' },
          { trait_type: 'Token ID', value: id },
          ...(specialAbility ? [{ trait_type: 'Special Ability', value: specialAbility }] : []),
        ],
      };
      
      return {
        id,
        tokenId: tokenId.toString(),
        name: `${tierLabel} #${id}`,
        tier: tierName,
        tierNum,
        image: `/nfts/${tierName.toLowerCase()}-${id}.png`,
        mintedAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
        attributes: {
          xpBoost,
          specialAbility,
        },
        metadata,
      };
    });
    
    setNfts(transformedNFTs);
  }, [nftIds, tierData]);

  // Update tier requirements based on eligibility
  // ⚠️ STATIC DATA MATCHING CONTRACT REQUIREMENTS
  // These tier requirements are hardcoded to match the on-chain contract logic exactly.
  // They are NOT fetched from the blockchain because they are immutable in the contracts.
  // 
  // Contract References:
  // - Bronze requirements: NFTRewards.sol (1000 points, level 10)
  // - Silver requirements: NFTRewards.sol (5000 points, level 25, 10 battles)
  // - Gold requirements: NFTRewards.sol (10000 points, level 50, top 100 leaderboard)
  // 
  // ⚠️ IMPORTANT: Any changes to tier requirements must be updated in BOTH:
  //   1. Smart contracts (NFTRewards.sol)
  //   2. Frontend (this file)
  useEffect(() => {
    const staticTiers: NFTTierRequirements[] = [
      {
        tier: 'BRONZE',
        name: 'Ghostly Apprentice',
        points: 1000,          // Matches NFTRewards.sol: BRONZE_POINTS_REQUIRED
        level: 10,             // Matches NFTRewards.sol: BRONZE_LEVEL_REQUIRED
        mintCost: '0.001 STT',
        benefits: ['+5% XP boost', 'Special badge', 'Bronze chat access'],
        unlocked: bronzeEligible === true,
      },
      {
        tier: 'SILVER',
        name: 'Soul Reaper',
        points: 5000,          // Matches NFTRewards.sol: SILVER_POINTS_REQUIRED
        level: 25,             // Matches NFTRewards.sol: SILVER_LEVEL_REQUIRED
        additionalReqs: '10 Battle Wins', // Matches NFTRewards.sol: SILVER_BATTLES_REQUIRED
        mintCost: '0.005 STT',
        benefits: ['+10% XP boost', 'Exclusive power-ups', 'Silver frame', 'Priority matchmaking'],
        unlocked: silverEligible === true,
      },
      {
        tier: 'GOLD',
        name: 'Manor Master',
        points: 10000,         // Matches NFTRewards.sol: GOLD_POINTS_REQUIRED
        level: 50,             // Matches NFTRewards.sol: GOLD_LEVEL_REQUIRED
        additionalReqs: 'Top 100 Leaderboard', // Matches NFTRewards.sol: GOLD_RANK_REQUIRED
        mintCost: '0.01 STT',
        benefits: ['+20% XP boost', 'Legendary power-ups', 'Animated avatar', 'Hall of Fame', 'Governance rights'],
        unlocked: goldEligible === true,
      },
    ];
    
    setTierRequirements(staticTiers);
  }, [bronzeEligible, silverEligible, goldEligible]);

  // Mint NFT function
  const mintNFT = useCallback(async (tier: 'BRONZE' | 'SILVER' | 'GOLD') => {
    if (!address || !CONTRACTS.HalloweenNFT) {
      console.error('No address or contract');
      return;
    }

    const tierNum: NFTTierNum = tier === 'BRONZE' ? 0 : tier === 'SILVER' ? 1 : 2;

    try {
      writeContract({
        address: CONTRACTS.HalloweenNFT as `0x${string}`,
        abi: HalloweenNFTABI,
        functionName: 'mintNFT',
        args: [address, tierNum],
      });
    } catch (error) {
      console.error('Failed to mint NFT:', error);
    }
  }, [address, writeContract]);

  // Upgrade NFT function
  const upgradeNFT = useCallback(async (tokenId: string, newTier: 'SILVER' | 'GOLD') => {
    if (!address || !CONTRACTS.HalloweenNFT) {
      console.error('No address or contract');
      return;
    }

    const newTierNum: NFTTierNum = newTier === 'SILVER' ? 1 : 2;

    // Check eligibility before upgrading
    if (newTier === 'SILVER' && silverEligible !== true) {
      console.error('Not eligible for Silver tier upgrade');
      return;
    }
    
    if (newTier === 'GOLD' && goldEligible !== true) {
      console.error('Not eligible for Gold tier upgrade');
      return;
    }

    try {
      writeContract({
        address: CONTRACTS.HalloweenNFT as `0x${string}`,
        abi: HalloweenNFTABI,
        functionName: 'upgradeNFT',
        args: [BigInt(tokenId), newTierNum],
      });
    } catch (error) {
      console.error('Failed to upgrade NFT:', error);
    }
  }, [address, silverEligible, goldEligible, writeContract]);

  const closeMintModal = useCallback(() => {
    setShowMintModal(false);
    setMintedNFT(null);
  }, []);

  return {
    nfts,
    tierRequirements,
    loading: isLoadingNFTs || isMinting || isConfirming,
    minting: isMinting || isConfirming,
    isMinting,
    isConfirming,
    showMintModal,
    mintedNFT,
    mintNFT,
    upgradeNFT,
    closeMintModal,
    refetch: refetchNFTs,
    // Eligibility checks for upgrades
    canUpgradeToSilver: silverEligible === true,
    canUpgradeToGold: goldEligible === true,
  };
};

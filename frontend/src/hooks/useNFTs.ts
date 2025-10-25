import { useState, useCallback, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWatchContractEvent, useWaitForTransactionReceipt } from 'wagmi';
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

  // Fetch NFT details from contract
  useEffect(() => {
    if (!nftIds || !Array.isArray(nftIds) || nftIds.length === 0) {
      setNfts([]);
      return;
    }

    // Transform token IDs to NFT objects
    const transformedNFTs: NFT[] = (nftIds as bigint[]).map((tokenId) => {
      const id = Number(tokenId);
      // For now, create placeholder NFTs - in production you'd fetch tier from contract
      return {
        id,
        tokenId: tokenId.toString(),
        name: `Ghostly Apprentice #${id}`,
        tier: 'BRONZE' as const,
        tierNum: 0,
        image: `/nfts/bronze-${id}.png`,
        mintedAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
        attributes: {
          xpBoost: 5,
        },
      };
    });
    
    setNfts(transformedNFTs);
  }, [nftIds]);

  // Update tier requirements based on eligibility
  useEffect(() => {
    const mockTiers: NFTTierRequirements[] = [
      {
        tier: 'BRONZE',
        name: 'Ghostly Apprentice',
        points: 1000,
        level: 10,
        mintCost: '0.001 STT',
        benefits: ['+5% XP boost', 'Special badge', 'Bronze chat access'],
        unlocked: bronzeEligible === true,
      },
      {
        tier: 'SILVER',
        name: 'Soul Reaper',
        points: 5000,
        level: 25,
        additionalReqs: '10 Battle Wins',
        mintCost: '0.005 STT',
        benefits: ['+10% XP boost', 'Exclusive power-ups', 'Silver frame', 'Priority matchmaking'],
        unlocked: silverEligible === true,
      },
      {
        tier: 'GOLD',
        name: 'Manor Master',
        points: 10000,
        level: 50,
        additionalReqs: 'Top 100 Leaderboard',
        mintCost: '0.01 STT',
        benefits: ['+20% XP boost', 'Legendary power-ups', 'Animated avatar', 'Hall of Fame', 'Governance rights'],
        unlocked: goldEligible === true,
      },
    ];
    
    setTierRequirements(mockTiers);
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
    closeMintModal,
    refetch: refetchNFTs,
  };
};

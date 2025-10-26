import { useState, useCallback, useEffect } from 'react';
import { useAccount, useReadContract, useWatchContractEvent } from 'wagmi';
import { CONTRACTS } from '../contracts/addresses';
import { LeaderboardABI, PlayerProfileABI, HalloweenNFTABI } from '../contracts/abis';
import { cachedMulticall, type ContractCall } from '../utils/multicall';

export interface LeaderboardEntry {
  rank: number;
  address: string;
  username?: string;
  points: number;
  level: number;
  battlesWon: number;
  nftsOwned: number;
  isCurrentUser?: boolean;
}

export type LeaderboardFilter = 'ALL_TIME' | 'WEEKLY' | 'DAILY';

export const useLeaderboard = (initialPage = 1, pageSize = 10) => {
  const { address } = useAccount();
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [filter, setFilter] = useState<LeaderboardFilter>('ALL_TIME');
  const [enrichedEntries, setEnrichedEntries] = useState<LeaderboardEntry[]>([]);
  const [crossContractLoading, setCrossContractLoading] = useState(false);

  // Calculate offset for pagination
  const offset = (currentPage - 1) * pageSize;

  // Read paginated leaderboard from contract
  const {
    data: leaderboardData,
    isLoading,
    refetch
  } = useReadContract({
    address: CONTRACTS.Leaderboard as `0x${string}`,
    abi: LeaderboardABI,
    functionName: 'getLeaderboardPage',
    args: [BigInt(offset), BigInt(pageSize)],
    query: {
      enabled: !!CONTRACTS.Leaderboard,
      refetchInterval: 120000, // Refetch every 2 minutes
    }
  });

  // Read total players count
  const { data: totalPlayersData } = useReadContract({
    address: CONTRACTS.Leaderboard as `0x${string}`,
    abi: LeaderboardABI,
    functionName: 'getTotalPlayers',
    query: {
      enabled: !!CONTRACTS.Leaderboard,
    }
  });

  // Read current user's rank
  const { data: userRankData } = useReadContract({
    address: CONTRACTS.Leaderboard as `0x${string}`,
    abi: LeaderboardABI,
    functionName: 'getPlayerRank',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!CONTRACTS.Leaderboard,
    }
  });

  // Read current user's score
  const { data: userScoreData } = useReadContract({
    address: CONTRACTS.Leaderboard as `0x${string}`,
    abi: LeaderboardABI,
    functionName: 'playerScores',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!CONTRACTS.Leaderboard,
    }
  });

  // Listen for leaderboard updates
  useWatchContractEvent({
    address: CONTRACTS.Leaderboard as `0x${string}`,
    abi: LeaderboardABI,
    eventName: 'LeaderboardUpdated',
    onLogs: () => {
      refetch();
    },
  });

  // Transform contract data to LeaderboardEntry[]
  const entries: LeaderboardEntry[] = leaderboardData 
    ? (leaderboardData as [string[], bigint[]])[0].map((playerAddress, index) => ({
        rank: offset + index + 1,
        address: playerAddress,
        username: `Player${offset + index + 1}`,
        points: Number((leaderboardData as [string[], bigint[]])[1][index]),
        level: 1, // Will be enriched via multicall
        battlesWon: 0, // Will be enriched via multicall
        nftsOwned: 0, // Will be enriched via multicall
        isCurrentUser: address?.toLowerCase() === playerAddress.toLowerCase()
      }))
    : [];

  // Fetch cross-contract data for leaderboard entries
  useEffect(() => {
    async function fetchCrossContractData() {
      if (!entries.length || !CONTRACTS.PlayerProfile || !CONTRACTS.HalloweenNFT) {
        setEnrichedEntries(entries);
        return;
      }

      setCrossContractLoading(true);

      try {
        // Extract all player addresses
        const playerAddresses = entries.map(entry => entry.address);

        // Build multicall batch for all players
        const calls: ContractCall[] = [];

        // Add PlayerProfile.profiles calls for all players
        for (const playerAddress of playerAddresses) {
          calls.push({
            address: CONTRACTS.PlayerProfile as `0x${string}`,
            abi: PlayerProfileABI,
            functionName: 'profiles',
            args: [playerAddress as `0x${string}`],
          });
        }

        // Add HalloweenNFT.balanceOf calls for all players
        for (const playerAddress of playerAddresses) {
          calls.push({
            address: CONTRACTS.HalloweenNFT as `0x${string}`,
            abi: HalloweenNFTABI,
            functionName: 'balanceOf',
            args: [playerAddress as `0x${string}`],
          });
        }

        // Execute multicall with 60-second cache
        const cacheKey = `leaderboard-page-${currentPage}-${playerAddresses.join(',')}`;
        const results = await cachedMulticall(cacheKey, calls, 60000);

        // Parse results and map back to entries
        const enriched = entries.map((entry, index) => {
          const profileIndex = index;
          const nftIndex = playerAddresses.length + index;

          // Extract level and battlesWon from PlayerProfile result
          const profileData = results[profileIndex];
          let level = 1;
          let battlesWon = 0;

          if (profileData && Array.isArray(profileData)) {
            // PlayerProfile.profiles returns: [level, totalSoulsCollected, battlesWon, roomsExplored, ...]
            level = Number(profileData[0]) || 1;
            battlesWon = Number(profileData[2]) || 0;
          }

          // Extract NFT count from HalloweenNFT.balanceOf result
          const nftBalance = results[nftIndex];
          const nftsOwned = nftBalance ? Number(nftBalance) : 0;

          return {
            ...entry,
            level,
            battlesWon,
            nftsOwned,
          };
        });

        setEnrichedEntries(enriched);
      } catch (error) {
        console.error('Failed to fetch cross-contract data for leaderboard:', error);
        // Fallback to default values on error
        setEnrichedEntries(entries);
      } finally {
        setCrossContractLoading(false);
      }
    }

    fetchCrossContractData();
  }, [entries.length, currentPage, entries.map(e => e.address).join(',')]);

  const totalPlayers = totalPlayersData ? Number(totalPlayersData) : 0;
  const totalPages = Math.ceil(totalPlayers / pageSize);

  // Fetch cross-contract data for user rank
  const [enrichedUserRank, setEnrichedUserRank] = useState<LeaderboardEntry | null>(null);

  useEffect(() => {
    async function fetchUserRankData() {
      if (!userRankData || !userScoreData || !address) {
        setEnrichedUserRank(null);
        return;
      }

      try {
        const calls: ContractCall[] = [
          {
            address: CONTRACTS.PlayerProfile as `0x${string}`,
            abi: PlayerProfileABI,
            functionName: 'profiles',
            args: [address],
          },
          {
            address: CONTRACTS.HalloweenNFT as `0x${string}`,
            abi: HalloweenNFTABI,
            functionName: 'balanceOf',
            args: [address],
          },
        ];

        const cacheKey = `user-rank-${address}`;
        const results = await cachedMulticall(cacheKey, calls, 60000);

        const profileData = results[0];
        let level = 1;
        let battlesWon = 0;

        if (profileData && Array.isArray(profileData)) {
          level = Number(profileData[0]) || 1;
          battlesWon = Number(profileData[2]) || 0;
        }

        const nftsOwned = results[1] ? Number(results[1]) : 0;

        setEnrichedUserRank({
          rank: Number(userRankData),
          address: address,
          username: 'You',
          points: Number(userScoreData),
          level,
          battlesWon,
          nftsOwned,
          isCurrentUser: true,
        });
      } catch (error) {
        console.error('Failed to fetch user rank cross-contract data:', error);
        // Fallback to default values
        setEnrichedUserRank({
          rank: Number(userRankData),
          address: address,
          username: 'You',
          points: Number(userScoreData),
          level: 1,
          battlesWon: 0,
          nftsOwned: 0,
          isCurrentUser: true,
        });
      }
    }

    fetchUserRankData();
  }, [userRankData, userScoreData, address]);

  const changePage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  const changeFilter = useCallback((newFilter: LeaderboardFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  }, []);

  return {
    entries: enrichedEntries,
    loading: isLoading || crossContractLoading,
    currentPage,
    totalPages,
    totalPlayers,
    filter,
    userRank: enrichedUserRank,
    changePage,
    changeFilter,
    refetch,
  };
};

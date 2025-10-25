import { useState, useCallback } from 'react';
import { useAccount, useReadContract, useWatchContractEvent } from 'wagmi';
import { CONTRACTS } from '../contracts/addresses';
import { LeaderboardABI } from '../contracts/abis';

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
        level: 1, // TODO: Fetch from player profile
        battlesWon: 0, // TODO: Fetch from player profile
        nftsOwned: 0, // TODO: Fetch from NFT contract
        isCurrentUser: address?.toLowerCase() === playerAddress.toLowerCase()
      }))
    : [];

  const totalPlayers = totalPlayersData ? Number(totalPlayersData) : 0;
  const totalPages = Math.ceil(totalPlayers / pageSize);

  const userRank: LeaderboardEntry | null = (userRankData && userScoreData) ? {
    rank: Number(userRankData),
    address: address || '0x0',
    username: 'You',
    points: Number(userScoreData),
    level: 1, // TODO: Fetch from player profile
    battlesWon: 0, // TODO: Fetch from player profile
    nftsOwned: 0, // TODO: Fetch from NFT contract
    isCurrentUser: true,
  } : null;

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
    entries,
    loading: isLoading,
    currentPage,
    totalPages,
    totalPlayers,
    filter,
    userRank,
    changePage,
    changeFilter,
    refetch,
  };
};

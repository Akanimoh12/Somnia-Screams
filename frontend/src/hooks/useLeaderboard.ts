import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';

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
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [filter, setFilter] = useState<LeaderboardFilter>('ALL_TIME');
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    
    setTimeout(() => {
      const mockEntries: LeaderboardEntry[] = Array.from({ length: pageSize }, (_, i) => {
        const rank = (currentPage - 1) * pageSize + i + 1;
        const mockAddress = `0x${Math.random().toString(16).slice(2, 42)}`;
        return {
          rank,
          address: mockAddress,
          username: `Player${rank}`,
          points: Math.max(10000 - rank * 100, 0),
          level: Math.max(50 - rank, 1),
          battlesWon: Math.max(100 - rank * 2, 0),
          nftsOwned: rank <= 10 ? 3 : rank <= 50 ? 2 : rank <= 100 ? 1 : 0,
          isCurrentUser: address && mockAddress.toLowerCase() === address.toLowerCase(),
        };
      });
      
      const mockUserRank: LeaderboardEntry = {
        rank: 156,
        address: address || '0x0',
        username: 'You',
        points: 3450,
        level: 28,
        battlesWon: 45,
        nftsOwned: 1,
        isCurrentUser: true,
      };
      
      setEntries(mockEntries);
      setTotalPages(20);
      setTotalPlayers(200);
      setUserRank(mockUserRank);
      setLoading(false);
    }, 600);
  }, [currentPage, pageSize, filter, address]);

  const changePage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  const changeFilter = useCallback((newFilter: LeaderboardFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  useEffect(() => {
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, [fetchLeaderboard]);

  return {
    entries,
    loading,
    currentPage,
    totalPages,
    totalPlayers,
    filter,
    userRank,
    changePage,
    changeFilter,
    refetch: fetchLeaderboard,
  };
};

import { useState } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { HauntedRoomsABI } from '../contracts/abis';
import { CONTRACTS } from '../config/contracts';

interface RoomData {
  difficulty: number;
  basePoints: number;
  soulCount: number;
  enemyType: number;
  hasChest: boolean;
  requiresPuzzle: boolean;
}

export const useRooms = () => {
  const { address } = useAccount();
  const [selectedRoomId, setSelectedRoomId] = useState<bigint | null>(null);

  // Get max rooms constant
  const { data: maxRooms } = useReadContract({
    address: CONTRACTS.HauntedRooms,
    abi: HauntedRoomsABI,
    functionName: 'MAX_ROOMS',
  });

  // Get room data
  const { data: roomData, refetch: refetchRoomData } = useReadContract({
    address: CONTRACTS.HauntedRooms,
    abi: HauntedRoomsABI,
    functionName: 'getRoomData',
    args: selectedRoomId ? [selectedRoomId] : undefined,
    query: {
      enabled: !!selectedRoomId && selectedRoomId > 0n,
    },
  });

  // Check if room completed
  const { data: hasCompletedRoom } = useReadContract({
    address: CONTRACTS.HauntedRooms,
    abi: HauntedRoomsABI,
    functionName: 'hasCompletedRoom',
    args: address && selectedRoomId ? [address, selectedRoomId] : undefined,
    query: {
      enabled: !!address && !!selectedRoomId && selectedRoomId > 0n,
    },
  });

  // Get completed room count
  const { data: completedCount } = useReadContract({
    address: CONTRACTS.HauntedRooms,
    abi: HauntedRoomsABI,
    functionName: 'getCompletedRoomCount',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Get player room history
  const { data: roomHistory } = useReadContract({
    address: CONTRACTS.HauntedRooms,
    abi: HauntedRoomsABI,
    functionName: 'getPlayerRoomHistory',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Enter room
  const { writeContractAsync: enterRoom, isPending: isEntering } = useWriteContract();

  // Generate random room
  const { writeContractAsync: generateRoom, isPending: isGenerating } = useWriteContract();

  const handleEnterRoom = async (roomId: bigint) => {
    if (!address) return;

    try {
      await enterRoom({
        address: CONTRACTS.HauntedRooms,
        abi: HauntedRoomsABI,
        functionName: 'enterRoom',
        args: [address, roomId],
      });
      refetchRoomData();
    } catch (error) {
      console.error('Failed to enter room:', error);
      throw error;
    }
  };

  const handleGenerateRandomRoom = async () => {
    if (!address) return;

    try {
      await generateRoom({
        address: CONTRACTS.HauntedRooms,
        abi: HauntedRoomsABI,
        functionName: 'generateRandomRoom',
        args: [address],
      });
    } catch (error) {
      console.error('Failed to generate random room:', error);
      throw error;
    }
  };

  return {
    // Data
    maxRooms: maxRooms ?? 50n,
    roomData: roomData as RoomData | undefined,
    hasCompletedRoom: hasCompletedRoom ?? false,
    completedCount: completedCount ?? 0n,
    roomHistory: (roomHistory as bigint[]) ?? [],
    selectedRoomId,

    // Actions
    setSelectedRoomId,
    enterRoom: handleEnterRoom,
    generateRandomRoom: handleGenerateRandomRoom,

    // Loading states
    isEntering,
    isGenerating,
  };
};

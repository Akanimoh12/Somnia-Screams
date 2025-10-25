import { useState, useCallback, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { PlayerInventoryABI } from '../contracts/abis';
import { CONTRACTS } from '../config/contracts';
import type { PlayerInventory } from '../types/player';

export function useInventory() {
  const { address } = useAccount();
  const [inventory, setInventory] = useState<PlayerInventory | null>(null);

  // Get player souls
  const { data: souls, refetch: refetchSouls } = useReadContract({
    address: CONTRACTS.PlayerInventory,
    abi: PlayerInventoryABI,
    functionName: 'getSouls',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 5000,
    },
  });

  // Get all items
  const { data: allItems, refetch: refetchItems } = useReadContract({
    address: CONTRACTS.PlayerInventory,
    abi: PlayerInventoryABI,
    functionName: 'getAllItems',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  }) as { data: [bigint[], bigint[]] | undefined; refetch: () => void };

  // Get active power-ups
  const { data: activePowerUps, refetch: refetchPowerUps } = useReadContract({
    address: CONTRACTS.PlayerInventory,
    abi: PlayerInventoryABI,
    functionName: 'getActivePowerUps',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 10000,
    },
  });

  // Add item
  const { writeContractAsync: addItem, isPending: isAddingItem } = useWriteContract();

  // Remove item
  const { writeContractAsync: removeItem, isPending: isRemovingItem } = useWriteContract();

  // Add power-up
  const { writeContractAsync: addPowerUp, isPending: isAddingPowerUp } = useWriteContract();

  const handleAddItem = async (itemId: bigint, quantity: bigint) => {
    if (!address) return;

    try {
      await addItem({
        address: CONTRACTS.PlayerInventory,
        abi: PlayerInventoryABI,
        functionName: 'addItem',
        args: [address, itemId, quantity],
      });
      refetchItems();
    } catch (error) {
      console.error('Failed to add item:', error);
      throw error;
    }
  };

  const handleRemoveItem = async (itemId: bigint, quantity: bigint) => {
    if (!address) return;

    try {
      await removeItem({
        address: CONTRACTS.PlayerInventory,
        abi: PlayerInventoryABI,
        functionName: 'removeItem',
        args: [address, itemId, quantity],
      });
      refetchItems();
    } catch (error) {
      console.error('Failed to remove item:', error);
      throw error;
    }
  };

  const handleAddPowerUp = async (powerUpId: bigint, duration: bigint) => {
    if (!address) return;

    try {
      await addPowerUp({
        address: CONTRACTS.PlayerInventory,
        abi: PlayerInventoryABI,
        functionName: 'addPowerUp',
        args: [address, powerUpId, duration],
      });
      refetchPowerUps();
    } catch (error) {
      console.error('Failed to add power-up:', error);
      throw error;
    }
  };

  const fetchInventory = useCallback(async () => {
    if (!address) return;

    try {
      refetchSouls();
      refetchItems();
      refetchPowerUps();
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
    }
  }, [address, refetchSouls, refetchItems, refetchPowerUps]);

  // Update inventory state when data changes
  useEffect(() => {
    if (souls !== undefined) {
      const [itemIds = [], quantities = []] = allItems || [[], []];
      const items = itemIds.map((id, index) => ({
        id: Number(id),
        name: `Item #${id}`,
        quantity: Number(quantities[index]),
        type: 'COLLECTIBLE' as const,
      }));

      const powerUps = (activePowerUps as bigint[] || []).map((id) => ({
        id: Number(id),
        name: `Power-Up #${id}`,
        description: 'Active power-up',
        expiry: Date.now() + 3600000, // 1 hour from now
        active: true,
      }));

      setInventory({
        souls: Number(souls),
        items,
        powerUps,
      });
    }
  }, [souls, allItems, activePowerUps]);

  const updateSouls = useCallback((newSouls: number) => {
    setInventory(prev => prev ? { ...prev, souls: newSouls } : null);
  }, []);

  return {
    // Data
    inventory,
    souls: souls ? Number(souls) : 0,
    activePowerUps: (activePowerUps as bigint[]) ?? [],
    
    // Actions
    addItem: handleAddItem,
    removeItem: handleRemoveItem,
    addPowerUp: handleAddPowerUp,
    fetchInventory,
    updateSouls,

    // Loading states
    loading: isAddingItem || isRemovingItem || isAddingPowerUp,
    isAddingItem,
    isRemovingItem,
    isAddingPowerUp,
  };
}

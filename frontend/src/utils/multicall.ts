import { readContracts } from '@wagmi/core';
import { config } from '../config/wagmi';

/**
 * Contract call configuration for multicall
 */
export interface ContractCall {
  address: `0x${string}`;
  abi: any;
  functionName: string;
  args?: any[];
}

/**
 * Multicall utility for efficient batch contract reads
 * Executes multiple contract read operations in a single blockchain request
 * 
 * @param calls - Array of contract calls to execute
 * @returns Array of results matching the input order
 * 
 * @example
 * ```typescript
 * const calls = [
 *   { address: CONTRACT_A, abi: ABI_A, functionName: 'getBalance', args: [address] },
 *   { address: CONTRACT_B, abi: ABI_B, functionName: 'getLevel', args: [address] }
 * ];
 * const [balance, level] = await multicall(calls);
 * ```
 */
export async function multicall<T = any>(calls: ContractCall[]): Promise<T[]> {
  try {
    const contracts = calls.map(call => ({
      address: call.address,
      abi: call.abi,
      functionName: call.functionName,
      args: call.args,
    }));

    const results = await readContracts(config, {
      contracts,
    });

    // Extract result values and handle errors
    return results.map((result, index) => {
      if (result.status === 'failure') {
        console.error(`Multicall error for call ${index}:`, result.error);
        return null as T;
      }
      return result.result as T;
    });
  } catch (error) {
    console.error('Multicall batch failed:', error);
    throw error;
  }
}

/**
 * Batch fetch player data across multiple contracts
 * Useful for fetching levels, battle stats, NFT counts, etc. for multiple players
 * 
 * @param addresses - Array of player addresses
 * @param contracts - Object containing contract addresses and ABIs
 * @returns Array of player data objects
 * 
 * @example
 * ```typescript
 * const playerData = await batchFetchPlayerData(
 *   ['0x123...', '0x456...'],
 *   {
 *     playerProfile: { address: CONTRACTS.PlayerProfile, abi: PlayerProfileABI },
 *     battles: { address: CONTRACTS.SpectralBattles, abi: SpectralBattlesABI }
 *   }
 * );
 * ```
 */
export async function batchFetchPlayerData(
  addresses: string[],
  contracts: {
    playerProfile?: { address: `0x${string}`; abi: any };
    battles?: { address: `0x${string}`; abi: any };
    nft?: { address: `0x${string}`; abi: any };
  }
): Promise<any[]> {
  const calls: ContractCall[] = [];

  // Build calls for each player and each contract
  addresses.forEach(address => {
    if (contracts.playerProfile) {
      // Get player level
      calls.push({
        address: contracts.playerProfile.address,
        abi: contracts.playerProfile.abi,
        functionName: 'getPlayerData',
        args: [address],
      });
    }

    if (contracts.battles) {
      // Get battle stats
      calls.push({
        address: contracts.battles.address,
        abi: contracts.battles.abi,
        functionName: 'getPlayerBattleStats',
        args: [address],
      });
    }

    if (contracts.nft) {
      // Get NFT balance
      calls.push({
        address: contracts.nft.address,
        abi: contracts.nft.abi,
        functionName: 'balanceOf',
        args: [address],
      });
    }
  });

  const results = await multicall(calls);

  // Organize results by player
  const contractCount = Object.keys(contracts).length;
  const playerData: any[] = [];

  for (let i = 0; i < addresses.length; i++) {
    const startIndex = i * contractCount;
    const data: any = { address: addresses[i] };

    let resultIndex = 0;
    if (contracts.playerProfile) {
      data.playerData = results[startIndex + resultIndex];
      resultIndex++;
    }
    if (contracts.battles) {
      data.battleStats = results[startIndex + resultIndex];
      resultIndex++;
    }
    if (contracts.nft) {
      data.nftBalance = results[startIndex + resultIndex];
      resultIndex++;
    }

    playerData.push(data);
  }

  return playerData;
}

/**
 * Cache for multicall results to avoid redundant requests
 */
const multicallCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 30000; // 30 seconds

/**
 * Cached multicall - uses cache if available and fresh
 * 
 * @param cacheKey - Unique key for caching this call set
 * @param calls - Array of contract calls
 * @param ttl - Time to live in milliseconds (default: 30s)
 * @returns Cached or fresh results
 */
export async function cachedMulticall<T = any>(
  cacheKey: string,
  calls: ContractCall[],
  ttl: number = CACHE_TTL
): Promise<T[]> {
  const cached = multicallCache.get(cacheKey);
  const now = Date.now();

  if (cached && (now - cached.timestamp) < ttl) {
    return cached.data as T[];
  }

  const data = await multicall<T>(calls);
  multicallCache.set(cacheKey, { data, timestamp: now });
  
  return data;
}

/**
 * Clear multicall cache (useful when data is known to have changed)
 */
export function clearMulticallCache(cacheKey?: string) {
  if (cacheKey) {
    multicallCache.delete(cacheKey);
  } else {
    multicallCache.clear();
  }
}

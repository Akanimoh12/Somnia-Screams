import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { DailyQuestsABI } from '../contracts/abis';
import { CONTRACTS } from '../config/contracts';

interface QuestData {
  questType: number;
  targetValue: number;
  rewardPoints: number;
  startTime: number;
  endTime: number;
  active: boolean;
}

interface QuestProgress {
  currentValue: number;
  completed: boolean;
  claimed: boolean;
}

export const useDailyQuests = () => {
  const { address } = useAccount();

  // Get quest counter
  const { data: questCounter } = useReadContract({
    address: CONTRACTS.DailyQuests,
    abi: DailyQuestsABI,
    functionName: 'questCounter',
  });

  // Get quest data
  const getQuestData = (questId: bigint) => {
    const { data } = useReadContract({
      address: CONTRACTS.DailyQuests,
      abi: DailyQuestsABI,
      functionName: 'getQuestData',
      args: [questId],
      query: {
        enabled: questId > 0n,
      },
    });
    return data as QuestData | undefined;
  };

  // Get player progress
  const getPlayerProgress = (questId: bigint) => {
    const { data } = useReadContract({
      address: CONTRACTS.DailyQuests,
      abi: DailyQuestsABI,
      functionName: 'getPlayerProgress',
      args: address ? [address, questId] : undefined,
      query: {
        enabled: !!address && questId > 0n,
      },
    });
    return data as QuestProgress | undefined;
  };

  // Claim reward
  const { writeContractAsync: claimReward, isPending: isClaiming } = useWriteContract();

  // Check daily reset
  const { writeContractAsync: checkReset, isPending: isResetting } = useWriteContract();

  const handleClaimReward = async (questId: bigint) => {
    if (!address) return;

    try {
      await claimReward({
        address: CONTRACTS.DailyQuests,
        abi: DailyQuestsABI,
        functionName: 'claimReward',
        args: [address, questId],
      });
    } catch (error) {
      console.error('Failed to claim quest reward:', error);
      throw error;
    }
  };

  const handleCheckDailyReset = async () => {
    try {
      await checkReset({
        address: CONTRACTS.DailyQuests,
        abi: DailyQuestsABI,
        functionName: 'checkDailyReset',
      });
    } catch (error) {
      console.error('Failed to check daily reset:', error);
      throw error;
    }
  };

  // Get all active quests (helper)
  const getAllActiveQuests = () => {
    const totalQuests = Number(questCounter ?? 0n);
    const quests: Array<{ id: bigint; data: QuestData | undefined; progress: QuestProgress | undefined }> = [];

    for (let i = 1; i <= totalQuests; i++) {
      const questId = BigInt(i);
      const data = getQuestData(questId);
      const progress = getPlayerProgress(questId);

      if (data?.active) {
        quests.push({ id: questId, data, progress });
      }
    }

    return quests;
  };

  return {
    // Data
    questCounter: questCounter ?? 0n,
    getAllActiveQuests,
    getQuestData,
    getPlayerProgress,

    // Actions
    claimReward: handleClaimReward,
    checkDailyReset: handleCheckDailyReset,

    // Loading states
    isClaiming,
    isResetting,
  };
};

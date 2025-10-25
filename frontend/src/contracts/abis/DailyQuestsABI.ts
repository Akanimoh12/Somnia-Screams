export const DailyQuestsABI = [
  {
    "type": "function",
    "name": "getQuestData",
    "inputs": [
      { "name": "questId", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct DailyQuests.Quest",
        "components": [
          { "name": "questType", "type": "uint8", "internalType": "uint8" },
          { "name": "targetValue", "type": "uint16", "internalType": "uint16" },
          { "name": "rewardPoints", "type": "uint16", "internalType": "uint16" },
          { "name": "startTime", "type": "uint32", "internalType": "uint32" },
          { "name": "endTime", "type": "uint32", "internalType": "uint32" },
          { "name": "active", "type": "bool", "internalType": "bool" }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getPlayerProgress",
    "inputs": [
      { "name": "player", "type": "address", "internalType": "address" },
      { "name": "questId", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct DailyQuests.PlayerQuestProgress",
        "components": [
          { "name": "currentValue", "type": "uint16", "internalType": "uint16" },
          { "name": "completed", "type": "bool", "internalType": "bool" },
          { "name": "claimed", "type": "bool", "internalType": "bool" }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "claimReward",
    "inputs": [
      { "name": "player", "type": "address", "internalType": "address" },
      { "name": "questId", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [
      { "name": "reward", "type": "uint256", "internalType": "uint256" }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "isQuestActive",
    "inputs": [
      { "name": "questId", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [
      { "name": "", "type": "bool", "internalType": "bool" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "checkDailyReset",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "questCounter",
    "inputs": [],
    "outputs": [
      { "name": "", "type": "uint256", "internalType": "uint256" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "QuestCompleted",
    "inputs": [
      { "name": "player", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "questId", "type": "uint256", "indexed": true, "internalType": "uint256" },
      { "name": "rewards", "type": "uint256", "indexed": false, "internalType": "uint256" }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "DailyQuestReset",
    "inputs": [
      { "name": "timestamp", "type": "uint256", "indexed": false, "internalType": "uint256" }
    ],
    "anonymous": false
  }
] as const;

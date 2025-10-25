export const SpectralBattlesABI = [
  {
    "type": "function",
    "name": "startBattle",
    "inputs": [
      { "name": "player", "type": "address", "internalType": "address" },
      { "name": "roomId", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [
      { "name": "battleId", "type": "uint256", "internalType": "uint256" }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "resolveBattle",
    "inputs": [
      { "name": "battleId", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [
      { "name": "victory", "type": "bool", "internalType": "bool" },
      { "name": "rewards", "type": "uint256", "internalType": "uint256" }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getBattleData",
    "inputs": [
      { "name": "battleId", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct SpectralBattles.Battle",
        "components": [
          { "name": "player", "type": "address", "internalType": "address" },
          { "name": "startTime", "type": "uint256", "internalType": "uint256" },
          { "name": "enemyType", "type": "uint8", "internalType": "uint8" },
          { "name": "enemyPower", "type": "uint16", "internalType": "uint16" },
          { "name": "playerPower", "type": "uint16", "internalType": "uint16" },
          { "name": "active", "type": "bool", "internalType": "bool" },
          { "name": "victory", "type": "bool", "internalType": "bool" }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getPlayerBattleStats",
    "inputs": [
      { "name": "player", "type": "address", "internalType": "address" }
    ],
    "outputs": [
      { "name": "total", "type": "uint256", "internalType": "uint256" },
      { "name": "won", "type": "uint256", "internalType": "uint256" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isInBattle",
    "inputs": [
      { "name": "player", "type": "address", "internalType": "address" }
    ],
    "outputs": [
      { "name": "", "type": "bool", "internalType": "bool" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "activeBattles",
    "inputs": [
      { "name": "", "type": "address", "internalType": "address" }
    ],
    "outputs": [
      { "name": "", "type": "uint256", "internalType": "uint256" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "battleCounter",
    "inputs": [],
    "outputs": [
      { "name": "", "type": "uint256", "internalType": "uint256" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "BattleStarted",
    "inputs": [
      { "name": "battleId", "type": "uint256", "indexed": true, "internalType": "uint256" },
      { "name": "player", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "enemyType", "type": "uint256", "indexed": false, "internalType": "uint256" }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "BattleEnded",
    "inputs": [
      { "name": "battleId", "type": "uint256", "indexed": true, "internalType": "uint256" },
      { "name": "player", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "victory", "type": "bool", "indexed": false, "internalType": "bool" },
      { "name": "rewards", "type": "uint256", "indexed": false, "internalType": "uint256" }
    ],
    "anonymous": false
  }
] as const;

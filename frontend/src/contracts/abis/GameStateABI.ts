export const GameStateABI = [
  {
    "type": "function",
    "name": "getGlobalState",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct GameState.GlobalState",
        "components": [
          { "name": "totalSessions", "type": "uint256", "internalType": "uint256" },
          { "name": "activeSessions", "type": "uint256", "internalType": "uint256" },
          { "name": "totalPlayers", "type": "uint256", "internalType": "uint256" },
          { "name": "totalSoulsCollected", "type": "uint256", "internalType": "uint256" },
          { "name": "totalBattles", "type": "uint256", "internalType": "uint256" },
          { "name": "maintenanceMode", "type": "bool", "internalType": "bool" }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isInMaintenance",
    "inputs": [],
    "outputs": [
      { "name": "", "type": "bool", "internalType": "bool" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "incrementTotalSessions",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "incrementActiveSessions",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "decrementActiveSessions",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "incrementTotalPlayers",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "addSoulsCollected",
    "inputs": [
      { "name": "amount", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "incrementTotalBattles",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getCurrentPhase",
    "inputs": [
      { "name": "sessionId", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [
      { "name": "", "type": "uint8", "internalType": "enum GameConstants.GamePhase" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "globalState",
    "inputs": [],
    "outputs": [
      { "name": "totalSessions", "type": "uint256", "internalType": "uint256" },
      { "name": "activeSessions", "type": "uint256", "internalType": "uint256" },
      { "name": "totalPlayers", "type": "uint256", "internalType": "uint256" },
      { "name": "totalSoulsCollected", "type": "uint256", "internalType": "uint256" },
      { "name": "totalBattles", "type": "uint256", "internalType": "uint256" },
      { "name": "maintenanceMode", "type": "bool", "internalType": "bool" }
    ],
    "stateMutability": "view"
  }
] as const;

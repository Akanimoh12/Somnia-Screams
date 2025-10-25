export const HauntedRoomsABI = [
  {
    "type": "function",
    "name": "enterRoom",
    "inputs": [
      { "name": "player", "type": "address", "internalType": "address" },
      { "name": "roomId", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [
      { "name": "points", "type": "uint256", "internalType": "uint256" }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getRoomData",
    "inputs": [
      { "name": "roomId", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct HauntedRooms.Room",
        "components": [
          { "name": "difficulty", "type": "uint8", "internalType": "uint8" },
          { "name": "basePoints", "type": "uint16", "internalType": "uint16" },
          { "name": "soulCount", "type": "uint16", "internalType": "uint16" },
          { "name": "enemyType", "type": "uint8", "internalType": "uint8" },
          { "name": "hasChest", "type": "bool", "internalType": "bool" },
          { "name": "requiresPuzzle", "type": "bool", "internalType": "bool" }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "hasCompletedRoom",
    "inputs": [
      { "name": "player", "type": "address", "internalType": "address" },
      { "name": "roomId", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [
      { "name": "", "type": "bool", "internalType": "bool" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getCompletedRoomCount",
    "inputs": [
      { "name": "player", "type": "address", "internalType": "address" }
    ],
    "outputs": [
      { "name": "", "type": "uint256", "internalType": "uint256" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getPlayerRoomHistory",
    "inputs": [
      { "name": "player", "type": "address", "internalType": "address" }
    ],
    "outputs": [
      { "name": "", "type": "uint256[]", "internalType": "uint256[]" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "generateRandomRoom",
    "inputs": [
      { "name": "player", "type": "address", "internalType": "address" }
    ],
    "outputs": [
      { "name": "", "type": "uint256", "internalType": "uint256" }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "MAX_ROOMS",
    "inputs": [],
    "outputs": [
      { "name": "", "type": "uint256", "internalType": "uint256" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "RoomEntered",
    "inputs": [
      { "name": "player", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "roomId", "type": "uint256", "indexed": true, "internalType": "uint256" },
      { "name": "timestamp", "type": "uint256", "indexed": false, "internalType": "uint256" }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "RoomCompleted",
    "inputs": [
      { "name": "player", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "roomId", "type": "uint256", "indexed": true, "internalType": "uint256" },
      { "name": "points", "type": "uint256", "indexed": false, "internalType": "uint256" }
    ],
    "anonymous": false
  }
] as const;

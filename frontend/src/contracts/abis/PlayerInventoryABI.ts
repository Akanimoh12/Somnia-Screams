export const PlayerInventoryABI = [
  {
    "type": "function",
    "name": "addItem",
    "inputs": [
      { "name": "player", "type": "address", "internalType": "address" },
      { "name": "itemId", "type": "uint256", "internalType": "uint256" },
      { "name": "quantity", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "removeItem",
    "inputs": [
      { "name": "player", "type": "address", "internalType": "address" },
      { "name": "itemId", "type": "uint256", "internalType": "uint256" },
      { "name": "quantity", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "addPowerUp",
    "inputs": [
      { "name": "player", "type": "address", "internalType": "address" },
      { "name": "powerUpId", "type": "uint256", "internalType": "uint256" },
      { "name": "duration", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "addSouls",
    "inputs": [
      { "name": "player", "type": "address", "internalType": "address" },
      { "name": "amount", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "removeSouls",
    "inputs": [
      { "name": "player", "type": "address", "internalType": "address" },
      { "name": "amount", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getItemQuantity",
    "inputs": [
      { "name": "player", "type": "address", "internalType": "address" },
      { "name": "itemId", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [
      { "name": "", "type": "uint256", "internalType": "uint256" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getAllItems",
    "inputs": [
      { "name": "player", "type": "address", "internalType": "address" }
    ],
    "outputs": [
      { "name": "", "type": "uint256[]", "internalType": "uint256[]" },
      { "name": "", "type": "uint256[]", "internalType": "uint256[]" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getSouls",
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
    "name": "getActivePowerUps",
    "inputs": [
      { "name": "player", "type": "address", "internalType": "address" }
    ],
    "outputs": [
      { "name": "", "type": "uint256[]", "internalType": "uint256[]" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "PowerUpActivated",
    "inputs": [
      { "name": "player", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "powerUpId", "type": "uint256", "indexed": false, "internalType": "uint256" },
      { "name": "duration", "type": "uint256", "indexed": false, "internalType": "uint256" }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "PowerUpExpired",
    "inputs": [
      { "name": "player", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "powerUpId", "type": "uint256", "indexed": false, "internalType": "uint256" }
    ],
    "anonymous": false
  }
] as const;

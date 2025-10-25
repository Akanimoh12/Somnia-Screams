export const SoulCollectorABI = [
  {
    type: 'function',
    name: 'collectSoul',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'player', type: 'address' },
      { name: 'sessionId', type: 'uint256' },
      { name: 'points', type: 'uint256' }
    ],
    outputs: []
  },
  {
    type: 'function',
    name: 'batchCollectSouls',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'player', type: 'address' },
      { name: 'sessionId', type: 'uint256' },
      { name: 'count', type: 'uint256' }
    ],
    outputs: [
      { name: 'totalPoints', type: 'uint256' }
    ]
  },
  {
    type: 'function',
    name: 'forceBatchProcess',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'player', type: 'address' },
      { name: 'sessionId', type: 'uint256' }
    ],
    outputs: [
      { name: '', type: 'uint256' }
    ]
  },
  {
    type: 'function',
    name: 'getCollectionData',
    stateMutability: 'view',
    inputs: [
      { name: 'player', type: 'address' },
      { name: 'sessionId', type: 'uint256' }
    ],
    outputs: [
      { name: 'soulsCollected', type: 'uint256' },
      { name: 'pendingBatchSize', type: 'uint256' },
      { name: 'lastCollectionTime', type: 'uint256' }
    ]
  },
  {
    type: 'function',
    name: 'getPendingBatchPoints',
    stateMutability: 'view',
    inputs: [
      { name: 'player', type: 'address' },
      { name: 'sessionId', type: 'uint256' }
    ],
    outputs: [
      { name: 'totalPoints', type: 'uint256' }
    ]
  },
  {
    type: 'function',
    name: 'resetSession',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'player', type: 'address' },
      { name: 'sessionId', type: 'uint256' }
    ],
    outputs: []
  },
  {
    type: 'function',
    name: 'sessions',
    stateMutability: 'view',
    inputs: [
      { name: '', type: 'address' },
      { name: '', type: 'uint256' }
    ],
    outputs: [
      { name: 'soulsCollected', type: 'uint256' },
      { name: 'lastCollectionTime', type: 'uint256' }
    ]
  },
  {
    type: 'event',
    name: 'SoulCollected',
    inputs: [
      { name: 'player', type: 'address', indexed: true },
      { name: 'sessionId', type: 'uint256', indexed: true },
      { name: 'count', type: 'uint256', indexed: false }
    ]
  },
  {
    type: 'event',
    name: 'SoulsBatchCollected',
    inputs: [
      { name: 'player', type: 'address', indexed: true },
      { name: 'sessionId', type: 'uint256', indexed: true },
      { name: 'totalPoints', type: 'uint256', indexed: false }
    ]
  }
] as const;

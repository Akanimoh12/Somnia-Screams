import { defineChain } from 'viem';

// Somnia Devnet Chain Configuration
export const somniaDevnet = defineChain({
  id: 50312,
  name: 'Somnia Devnet',
  nativeCurrency: {
    decimals: 18,
    name: 'STT',
    symbol: 'STT',
  },
  rpcUrls: {
    default: {
      http: ['https://dream-rpc.somnia.network'],
    },
    public: {
      http: ['https://dream-rpc.somnia.network'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Somnia Explorer',
      url: 'https://explorer.somnia.network',
    },
  },
  testnet: true,
});

// Export for easy access
export const somniaChain = somniaDevnet;

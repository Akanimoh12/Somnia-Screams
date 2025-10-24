import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { somniaDevnet } from './chains';

// Wagmi configuration for Somnia Screams
export const wagmiConfig = getDefaultConfig({
  appName: 'Somnia Screams',
  projectId: process.env.VITE_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [somniaDevnet],
  ssr: false,
});

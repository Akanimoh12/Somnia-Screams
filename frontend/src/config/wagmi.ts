import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { somniaDevnet } from './chains';

export const wagmiConfig = getDefaultConfig({
  appName: 'Somnia Screams',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '8fa4b535784defa6b860ee8c1dac3306',
  chains: [somniaDevnet],
  ssr: false,
});

// Export as 'config' for wagmi core functions
export const config = wagmiConfig;

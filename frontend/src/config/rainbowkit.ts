import { darkTheme } from '@rainbow-me/rainbowkit';

// Custom Halloween-themed RainbowKit configuration
export const rainbowKitTheme = darkTheme({
  accentColor: '#ff6b35', // Halloween orange
  accentColorForeground: 'white',
  borderRadius: 'medium',
  fontStack: 'system',
  overlayBlur: 'small',
});

// Custom RainbowKit strings
export const rainbowKitStrings = {
  connectWallet: {
    label: 'Connect Wallet',
  },
  connecting: {
    label: 'Connecting...',
  },
  wrongNetwork: {
    label: 'Wrong Network',
    description: 'Please switch to Somnia Devnet',
  },
};

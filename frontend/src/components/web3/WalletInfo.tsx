import { useAccount, useBalance } from 'wagmi';
import { motion } from 'framer-motion';
import { Wallet, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export default function WalletInfo() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const [copied, setCopied] = useState(false);

  if (!isConnected || !address) {
    return null;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
  const formattedBalance = balance 
    ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}`
    : '0.0000';

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center space-x-3 bg-bg-card rounded-lg px-3 py-2 border border-border-color"
    >
      <div className="flex items-center space-x-2">
        <Wallet className="w-4 h-4 text-accent-orange" />
        <div className="flex flex-col">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 text-xs ui-font font-semibold text-white hover:text-accent-orange transition-colors"
            title="Click to copy address"
          >
            <span>{shortAddress}</span>
            {copied ? (
              <Check className="w-3 h-3 text-success" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </button>
          <span className="text-xs text-text-muted ui-font">
            {formattedBalance}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

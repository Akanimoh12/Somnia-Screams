import { useAccount, useChainId } from 'wagmi';
import { motion } from 'framer-motion';
import { Wifi, AlertCircle } from 'lucide-react';

const SOMNIA_CHAIN_ID = 50311;
const SOMNIA_TESTNET_NAME = 'Somnia Testnet';

export default function NetworkStatus() {
  const { isConnected } = useAccount();
  const chainId = useChainId();

  if (!isConnected) {
    return null;
  }

  const isCorrectNetwork = chainId === SOMNIA_CHAIN_ID;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`
        flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold ui-font
        ${isCorrectNetwork
          ? 'bg-success/10 text-success border border-success/30'
          : 'bg-error/10 text-error border border-error/30'
        }
      `}
    >
      {isCorrectNetwork ? (
        <>
          <Wifi className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{SOMNIA_TESTNET_NAME}</span>
          <span className="sm:hidden">Connected</span>
        </>
      ) : (
        <>
          <AlertCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Wrong Network</span>
          <span className="sm:hidden">Switch Network</span>
        </>
      )}
    </motion.div>
  );
}

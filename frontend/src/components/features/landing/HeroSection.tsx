import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Skull, Flame, Ghost, Sparkles } from 'lucide-react';

export default function HeroSection() {
  const navigate = useNavigate();
  const { isConnected } = useAccount();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a]">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 animate-float">
          <Ghost className="w-12 h-12 text-accent-orange" />
        </div>
        <div className="absolute top-40 right-20 animate-float-delayed">
          <Skull className="w-16 h-16 text-accent-purple" />
        </div>
        <div className="absolute bottom-32 left-1/4 animate-float">
          <Flame className="w-10 h-10 text-accent-red" />
        </div>
      </div>

      <div className="container mx-auto px-4 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.h1
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="title-font text-6xl md:text-8xl lg:text-9xl mb-6 glow-text stroke-text"
          >
            SOMNIA SCREAMS
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="fire-font text-2xl md:text-4xl mb-4 text-accent-orange"
          >
            Enter the Haunted Manor
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="ui-font text-lg md:text-xl text-text-secondary mb-12 max-w-2xl mx-auto"
          >
            Explore haunted rooms, collect souls, battle spectral enemies, and mint exclusive Halloween NFTs every 2 minutes
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            {isConnected ? (
              <>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="group relative px-8 py-4 bg-accent-orange hover:bg-accent-red transition-all duration-300 rounded-lg ui-font font-bold text-lg overflow-hidden shadow-lg shadow-accent-orange/50 hover:shadow-accent-red/50"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Go to Dashboard
                  </span>
                  <div className="absolute inset-0 bg-linear-to-r from-accent-red to-accent-orange opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>

                <button
                  onClick={() => navigate('/game')}
                  className="group relative px-8 py-4 bg-accent-purple hover:bg-purple-600 transition-all duration-300 rounded-lg ui-font font-bold text-lg overflow-hidden shadow-lg shadow-accent-purple/50"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Flame className="w-5 h-5" />
                    Play Now
                  </span>
                </button>
              </>
            ) : (
              <>
                <div className="transform hover:scale-105 transition-transform">
                  <ConnectButton.Custom>
                    {({ openConnectModal }) => (
                      <button
                        onClick={openConnectModal}
                        className="group relative px-8 py-4 bg-accent-orange hover:bg-accent-red transition-all duration-300 rounded-lg ui-font font-bold text-lg overflow-hidden shadow-lg shadow-accent-orange/50 hover:shadow-accent-red/50"
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          <Sparkles className="w-5 h-5" />
                          Connect Wallet
                        </span>
                        <div className="absolute inset-0 bg-linear-to-r from-accent-red to-accent-orange opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </button>
                    )}
                  </ConnectButton.Custom>
                </div>

                <button
                  onClick={() => navigate('/how-to-play')}
                  className="px-8 py-4 border-2 border-accent-orange hover:bg-accent-orange/10 transition-all duration-300 rounded-lg ui-font font-bold text-lg"
                >
                  How to Play
                </button>
              </>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {[
              { id: 'active-players', label: 'Active Players', value: '1,234' },
              { id: 'souls-collected', label: 'Souls Collected', value: '50K+' },
              { id: 'nfts-minted', label: 'NFTs Minted', value: '892' },
              { id: 'battles-won', label: 'Battles Won', value: '2,456' },
            ].map((stat) => (
              <div key={stat.id} className="text-center">
                <div className="stat-font text-3xl md:text-4xl text-accent-orange mb-2">
                  {stat.value}
                </div>
                <div className="ui-font text-sm text-text-muted">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-[#0a0a0a] to-transparent" />
    </section>
  );
}

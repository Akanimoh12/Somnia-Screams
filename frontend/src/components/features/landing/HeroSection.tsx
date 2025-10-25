import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Skull, Sparkles } from 'lucide-react';

export default function HeroSection() {
  const navigate = useNavigate();

  const handleEnterGame = () => {
    console.log('Enter Game clicked, navigating to /dashboard');
    navigate('/dashboard');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a]">
      {/* Spooky Background Effects */}
      <div className="absolute inset-0 opacity-30">
        {/* Large Scary Skull - Top Left */}
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [-5, 5, -5],
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-10 left-10 md:top-20 md:left-20"
        >
          <div className="relative">
            <Skull className="w-32 h-32 md:w-48 md:h-48 text-accent-red drop-shadow-[0_0_30px_rgba(255,68,68,0.5)]" strokeWidth={1.5} />
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 blur-2xl bg-accent-red/30"
            />
          </div>
        </motion.div>

        {/* Large Pumpkin/Jack-o-lantern - Top Right */}
        <motion.div
          animate={{ 
            y: [0, 20, 0],
            rotate: [5, -5, 5],
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 right-10 md:top-32 md:right-20"
        >
          <div className="relative text-8xl md:text-9xl">
            🎃
            <motion.div
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 blur-3xl bg-accent-orange/40"
            />
          </div>
        </motion.div>

        {/* Ghost - Middle Left */}
        <motion.div
          animate={{ 
            x: [-10, 10, -10],
            y: [0, -15, 0],
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute left-5 top-1/3 md:left-10"
        >
          <div className="relative text-6xl md:text-8xl opacity-80">
            👻
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 blur-2xl bg-white/20"
            />
          </div>
        </motion.div>

        {/* Bat - Flying across */}
        <motion.div
          animate={{ 
            x: ['-100%', '200vw'],
            y: [0, -30, 0, 30, 0],
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 text-4xl md:text-6xl"
        >
          🦇
        </motion.div>

        {/* Spider Web - Top Right Corner */}
        <div className="absolute top-0 right-0 text-6xl md:text-8xl opacity-60">
          🕸️
        </div>

        {/* Scary Face - Bottom Left */}
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [-2, 2, -2]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-20 left-10 md:bottom-32 md:left-20"
        >
          <div className="relative">
            <Skull className="w-24 h-24 md:w-40 md:h-40 text-accent-purple drop-shadow-[0_0_25px_rgba(168,85,247,0.6)]" strokeWidth={1.5} />
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="absolute inset-0 blur-xl bg-accent-purple/40"
            />
          </div>
        </motion.div>

        {/* Candy/Treat - Bottom Right */}
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 10, 0]
          }}
          transition={{ 
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-32 right-10 md:bottom-40 md:right-24 text-5xl md:text-7xl"
        >
          🍬
        </motion.div>

        {/* Witch Hat - Middle Right */}
        <motion.div
          animate={{ 
            rotate: [-5, 5, -5],
            y: [0, 10, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute right-5 top-1/2 md:right-16 text-5xl md:text-7xl opacity-75"
        >
          🎩
        </motion.div>

        {/* Skull Emoji - Floating */}
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            x: [-5, 5, -5]
          }}
          transition={{ 
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute left-1/4 bottom-1/4 text-4xl md:text-6xl opacity-70"
        >
          💀
        </motion.div>

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [-20, -100],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{ 
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeOut"
            }}
            className="absolute text-accent-orange"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: `${Math.random() * 30}%`,
            }}
          >
            ✨
          </motion.div>
        ))}
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
            <button
              onClick={handleEnterGame}
              className="group relative px-8 py-4 bg-accent-orange hover:bg-accent-red transition-all duration-300 rounded-lg ui-font font-bold text-lg overflow-hidden shadow-lg shadow-accent-orange/50 hover:shadow-accent-red/50"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Enter Game
              </span>
              <div className="absolute inset-0 bg-linear-to-r from-accent-red to-accent-orange opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>

            <button
              onClick={() => navigate('/how-to-play')}
              className="px-8 py-4 border-2 border-accent-orange hover:bg-accent-orange/10 transition-all duration-300 rounded-lg ui-font font-bold text-lg"
            >
              How to Play
            </button>
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

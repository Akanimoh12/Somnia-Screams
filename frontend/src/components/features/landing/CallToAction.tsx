import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Flame, ArrowRight } from 'lucide-react';

export default function CallToAction() {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-4 bg-linear-to-b from-bg-primary via-bg-secondary to-bg-primary relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-accent-orange rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-accent-purple rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            className="inline-block mb-6"
          >
            <Flame className="w-16 h-16 text-accent-orange" />
          </motion.div>

          <h2 className="fire-font text-5xl md:text-7xl mb-6 glow-text">
            Ready to Face Your Fears?
          </h2>

          <p className="ui-font text-xl text-text-secondary mb-10 leading-relaxed">
            Join thousands of players in the ultimate Halloween blockchain adventure. Explore haunted rooms, battle spectral enemies, and claim exclusive NFT rewards on Somnia Devnet.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/game')}
              className="group relative px-10 py-5 bg-accent-orange hover:bg-accent-red transition-all duration-300 rounded-lg ui-font font-bold text-xl overflow-hidden w-full sm:w-auto"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Enter the Manor
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <motion.div
                className="absolute inset-0 bg-linear-to-r from-accent-red to-accent-orange"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/leaderboard')}
              className="px-10 py-5 border-2 border-accent-orange hover:bg-accent-orange/10 transition-all duration-300 rounded-lg ui-font font-bold text-xl w-full sm:w-auto"
            >
              View Leaderboard
            </motion.button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Session Duration', value: '2 min' },
              { label: 'Min Level', value: 'None' },
              { label: 'Entry Fee', value: 'Free' },
              { label: 'Network', value: 'Somnia' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-bg-card border border-border-color rounded-lg p-4"
              >
                <p className="stat-font text-2xl text-accent-orange mb-1">{item.value}</p>
                <p className="ui-font text-sm text-text-muted">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useState } from 'react';

export default function GamePreview() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  return (
    <section className="py-24 px-4 bg-bg-secondary">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="header-font text-5xl md:text-6xl mb-4 text-accent-orange">
            Game Preview
          </h2>
          <p className="ui-font text-lg text-text-secondary max-w-2xl mx-auto">
            Watch the haunted manor come to life
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative aspect-video bg-bg-card border-2 border-accent-orange rounded-lg overflow-hidden group">
            <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-bg-primary to-bg-secondary">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-accent-orange/10 border-2 border-accent-orange flex items-center justify-center">
                  <Play className="w-12 h-12 text-accent-orange" />
                </div>
                <p className="ui-font text-text-muted">Preview Coming Soon</p>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-bg-primary/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-10 h-10 rounded-full bg-accent-orange hover:bg-accent-red transition-colors duration-300 flex items-center justify-center"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </button>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="w-10 h-10 rounded-full bg-bg-secondary hover:bg-bg-card transition-colors duration-300 flex items-center justify-center"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {[
              { label: 'Haunted Rooms', image: '🏚️' },
              { label: 'Spectral Battles', image: '⚔️' },
              { label: 'Soul Collection', image: '👻' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="aspect-video bg-bg-card border border-border-color rounded-lg flex flex-col items-center justify-center hover:border-accent-orange transition-colors duration-300"
              >
                <span className="text-5xl mb-2">{item.image}</span>
                <span className="ui-font text-sm text-text-secondary">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

import { motion } from 'framer-motion';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/features/landing/HeroSection';
import Features from '../components/features/landing/Features';
import HowToPlay from '../components/features/landing/HowToPlay';
import GamePreview from '../components/features/landing/GamePreview';
import GameStats from '../components/features/landing/GameStats';
import LeaderboardPreview from '../components/features/landing/LeaderboardPreview';
import Tokenomics from '../components/features/landing/Tokenomics';
import CallToAction from '../components/features/landing/CallToAction';

export default function LandingPage() {
  return (
    <>
      <Header />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-bg-primary"
      >
        <HeroSection />
        <Features />
        <GameStats />
        <LeaderboardPreview />
        <HowToPlay />
        <GamePreview />
        <Tokenomics />
        <CallToAction />
      </motion.div>
      <Footer />
    </>
  );
}

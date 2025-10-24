import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Skull, Gamepad2, Trophy, User, Package, Award, BookOpen, Settings } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ROUTES } from '../../utils/constants';

const navItems = [
  { path: ROUTES.DASHBOARD, label: 'Dashboard', icon: Gamepad2 },
  { path: ROUTES.GAME, label: 'Play Game', icon: Skull },
  { path: ROUTES.LEADERBOARD, label: 'Leaderboard', icon: Trophy },
  { path: ROUTES.PROFILE, label: 'Profile', icon: User },
  { path: ROUTES.INVENTORY, label: 'Inventory', icon: Package },
  { path: ROUTES.ACHIEVEMENTS, label: 'Achievements', icon: Award },
  { path: ROUTES.HOW_TO_PLAY, label: 'How to Play', icon: BookOpen },
  { path: ROUTES.SETTINGS, label: 'Settings', icon: Settings },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  const isLandingPage = location.pathname === ROUTES.HOME;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/95 backdrop-blur-md border-b border-border-color"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to={ROUTES.HOME}
            className="flex items-center space-x-3 group"
          >
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="text-accent-orange"
            >
              <Skull className="w-8 h-8" />
            </motion.div>
            <span className="text-2xl font-bold title-font text-white">
              Somnia Screams
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            {!isLandingPage && navItems.slice(0, 4).map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center space-x-2 px-3 py-2 rounded-lg
                    transition-all duration-200 ui-font text-sm font-semibold
                    ${isActive(item.path)
                      ? 'bg-accent-orange text-white'
                      : 'text-text-secondary hover:text-white hover:bg-bg-card'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <ConnectButton
                chainStatus="icon"
                showBalance={false}
                accountStatus={{
                  smallScreen: 'avatar',
                  largeScreen: 'full',
                }}
              />
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-bg-card transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border-color bg-bg-secondary"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-lg
                      transition-all duration-200 ui-font font-semibold
                      ${isActive(item.path)
                        ? 'bg-accent-orange text-white'
                        : 'text-text-secondary hover:text-white hover:bg-bg-card'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              <div className="pt-4 border-t border-border-color">
                <ConnectButton
                  chainStatus="icon"
                  showBalance={false}
                  accountStatus="full"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

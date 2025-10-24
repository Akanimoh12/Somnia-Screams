import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Gamepad2, 
  Skull, 
  Trophy, 
  User, 
  Package, 
  Award, 
  BookOpen, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import { ROUTES } from '../../utils/constants';

const menuItems = [
  { path: ROUTES.DASHBOARD, label: 'Dashboard', icon: Gamepad2, color: 'text-blue-400' },
  { path: ROUTES.GAME, label: 'Play Game', icon: Skull, color: 'text-accent-orange' },
  { path: ROUTES.LEADERBOARD, label: 'Leaderboard', icon: Trophy, color: 'text-yellow-400' },
  { path: ROUTES.PROFILE, label: 'Profile', icon: User, color: 'text-purple-400' },
  { path: ROUTES.INVENTORY, label: 'Inventory', icon: Package, color: 'text-green-400' },
  { path: ROUTES.ACHIEVEMENTS, label: 'Achievements', icon: Award, color: 'text-amber-400' },
  { path: ROUTES.HOW_TO_PLAY, label: 'How to Play', icon: BookOpen, color: 'text-cyan-400' },
  { path: ROUTES.SETTINGS, label: 'Settings', icon: Settings, color: 'text-gray-400' },
];

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className = '' }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.aside
      initial={{ x: -100 }}
      animate={{ x: 0, width: collapsed ? '80px' : '240px' }}
      transition={{ duration: 0.3 }}
      className={`
        fixed left-0 top-16 bottom-0 z-40
        bg-bg-secondary border-r border-border-color
        hidden lg:block
        ${className}
      `}
    >
      <div className="flex flex-col h-full">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="
            absolute -right-3 top-4 w-6 h-6 rounded-full
            bg-bg-card border border-border-color
            flex items-center justify-center
            hover:bg-accent-orange hover:border-accent-orange
            transition-all duration-200
          "
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-white" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-white" />
          )}
        </button>

        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center space-x-3 px-3 py-3 rounded-lg
                  transition-all duration-200 group relative
                  ${active
                    ? 'bg-accent-orange text-white shadow-lg shadow-accent-orange/30'
                    : 'text-text-secondary hover:text-white hover:bg-bg-card'
                  }
                `}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={`
                  w-5 h-5 shrink-0
                  ${active ? 'text-white' : item.color}
                  group-hover:scale-110 transition-transform
                `} />
                
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="ui-font font-semibold text-sm whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}

                {active && !collapsed && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 w-1 h-8 bg-white rounded-r-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 border-t border-border-color"
          >
            <div className="text-xs text-text-muted ui-font text-center">
              <p>Somnia Screams v1.0</p>
              <p className="mt-1">Halloween Mini-Game</p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.aside>
  );
}

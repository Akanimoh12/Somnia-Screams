import type { ReactNode } from 'react';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { ROUTES } from '../../utils/constants';

interface GameLayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
  showSidebar?: boolean;
  showFooter?: boolean;
}

export default function GameLayout({ 
  children, 
  requireAuth = false,
  showSidebar = true,
  showFooter = false
}: GameLayoutProps) {
  const { isConnected } = useAccount();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (requireAuth && !isConnected) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      {/* Header - Always visible */}
      <Header onMobileMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
      
      {/* Main Content Area with Sidebar */}
      <div className="flex flex-1 pt-16">
        {/* Sidebar - Collapsible on desktop, slide-in on mobile */}
        {showSidebar && (
          <Sidebar 
            mobileOpen={mobileSidebarOpen} 
            onMobileClose={() => setMobileSidebarOpen(false)} 
          />
        )}
        
        {/* Main Content - Responsive with proper spacing */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={`
            flex-1 min-h-[calc(100vh-4rem)]
            ${showSidebar ? 'lg:ml-60' : ''}
            w-full
          `}
        >
          {/* Responsive Container with breakpoint-aware padding */}
          <div className="
            w-full h-full
            px-4 py-6
            sm:px-6 sm:py-8
            lg:px-8
            max-w-7xl mx-auto
          ">
            {children}
          </div>
        </motion.main>
      </div>

      {/* Footer - Optional */}
      {showFooter && <Footer />}
    </div>
  );
}

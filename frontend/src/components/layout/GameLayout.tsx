import type { ReactNode } from 'react';
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

  if (requireAuth && !isConnected) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />
      
      <div className="flex pt-16">
        {showSidebar && <Sidebar />}
        
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={`
            flex-1 min-h-[calc(100vh-4rem)]
            ${showSidebar ? 'lg:ml-60' : ''}
          `}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </motion.main>
      </div>

      {showFooter && <Footer />}
    </div>
  );
}

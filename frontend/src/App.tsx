import { ErrorBoundary } from './components/ui/ErrorFallback';
import { InstallPrompt } from './components/ui/InstallPrompt';
import { OfflineIndicator } from './components/ui/OfflineIndicator';
import ProfileCreationModal from './components/common/modals/ProfileCreationModal';
import { Web3Provider } from './contexts/Web3Context';
import { GameProvider } from './contexts/GameContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AppRouter } from './config/router';
import { usePlayerRegistration } from './hooks/usePlayerRegistration';
import '@rainbow-me/rainbowkit/styles.css';
import './App.css';

function AppContent() {
  const { shouldShowModal, setShowModal } = usePlayerRegistration();

  return (
    <>
      <OfflineIndicator />
      <AppRouter />
      <InstallPrompt />
      {/* Modal only shows when manually triggered */}
      <ProfileCreationModal
        isOpen={shouldShowModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => {
          setShowModal(false);
        }}
      />
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Web3Provider>
        <ThemeProvider>
          <NotificationProvider>
            <GameProvider>
              <AppContent />
            </GameProvider>
          </NotificationProvider>
        </ThemeProvider>
      </Web3Provider>
    </ErrorBoundary>
  );
}

export default App;

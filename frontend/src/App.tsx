import { ErrorBoundary } from './components/ui/ErrorFallback';
import { InstallPrompt } from './components/ui/InstallPrompt';
import { OfflineIndicator } from './components/ui/OfflineIndicator';
import ProfileCreationModal from './components/common/modals/ProfileCreationModal';
import { Web3Provider } from './contexts/Web3Context';
import { GameProvider } from './contexts/GameContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { PlayerRegistrationProvider, usePlayerRegistrationContext } from './contexts/PlayerRegistrationContext';
import { AppRouter } from './config/router';
import '@rainbow-me/rainbowkit/styles.css';
import './App.css';

function AppContent() {
  const { shouldShowModal, setShowModal } = usePlayerRegistrationContext();

  console.log('🎭 [App] shouldShowModal:', shouldShowModal);

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
            <PlayerRegistrationProvider>
              <GameProvider>
                <AppContent />
              </GameProvider>
            </PlayerRegistrationProvider>
          </NotificationProvider>
        </ThemeProvider>
      </Web3Provider>
    </ErrorBoundary>
  );
}

export default App;

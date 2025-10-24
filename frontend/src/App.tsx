import { ErrorBoundary } from './components/ui/ErrorFallback';
import { InstallPrompt } from './components/ui/InstallPrompt';
import { OfflineIndicator } from './components/ui/OfflineIndicator';
import { Web3Provider } from './contexts/Web3Context';
import { GameProvider } from './contexts/GameContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AppRouter } from './config/router';
import '@rainbow-me/rainbowkit/styles.css';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <Web3Provider>
        <ThemeProvider>
          <NotificationProvider>
            <GameProvider>
              <OfflineIndicator />
              <AppRouter />
              <InstallPrompt />
            </GameProvider>
          </NotificationProvider>
        </ThemeProvider>
      </Web3Provider>
    </ErrorBoundary>
  );
}

export default App;

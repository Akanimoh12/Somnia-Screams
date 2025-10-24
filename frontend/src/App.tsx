import { ErrorBoundary } from 'react-error-boundary';
import { Web3Provider } from './contexts/Web3Context';
import { GameProvider } from './contexts/GameContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AppRouter } from './config/router';
import '@rainbow-me/rainbowkit/styles.css';
import './App.css';

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div role="alert" className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">Something went wrong</h1>
        <pre className="text-sm text-gray-400">{error.message}</pre>
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Web3Provider>
        <ThemeProvider>
          <NotificationProvider>
            <GameProvider>
              <AppRouter />
            </GameProvider>
          </NotificationProvider>
        </ThemeProvider>
      </Web3Provider>
    </ErrorBoundary>
  );
}

export default App;

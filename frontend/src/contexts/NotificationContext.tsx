import { createContext, useContext, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import toast, { Toaster } from 'react-hot-toast';

interface NotificationContextType {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
  loading: (message: string) => string;
  dismiss: (toastId: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: Readonly<{ children: ReactNode }>) {
  const success = useCallback((message: string) => {
    toast.success(message, {
      duration: 3000,
      style: {
        background: '#151515',
        color: '#ffffff',
        border: '2px solid #10b981',
        borderRadius: '8px',
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: 700,
      },
      iconTheme: {
        primary: '#10b981',
        secondary: '#151515',
      },
    });
  }, []);

  const error = useCallback((message: string) => {
    toast.error(message, {
      duration: 4000,
      style: {
        background: '#151515',
        color: '#ffffff',
        border: '2px solid #ef4444',
        borderRadius: '8px',
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: 700,
      },
      iconTheme: {
        primary: '#ef4444',
        secondary: '#151515',
      },
    });
  }, []);

  const info = useCallback((message: string) => {
    toast(message, {
      duration: 3000,
      icon: '💀',
      style: {
        background: '#151515',
        color: '#ffffff',
        border: '2px solid #3b82f6',
        borderRadius: '8px',
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: 700,
      },
    });
  }, []);

  const warning = useCallback((message: string) => {
    toast(message, {
      duration: 3500,
      icon: '⚠️',
      style: {
        background: '#151515',
        color: '#ffffff',
        border: '2px solid #f59e0b',
        borderRadius: '8px',
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: 700,
      },
    });
  }, []);

  const loading = useCallback((message: string) => {
    return toast.loading(message, {
      style: {
        background: '#151515',
        color: '#ffffff',
        border: '2px solid #ff6b35',
        borderRadius: '8px',
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: 700,
      },
    });
  }, []);

  const dismiss = useCallback((toastId: string) => {
    toast.dismiss(toastId);
  }, []);

  const value = useMemo<NotificationContextType>(() => ({
    success,
    error,
    info,
    warning,
    loading,
    dismiss,
  }), [success, error, info, warning, loading, dismiss]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          className: '',
          duration: 3000,
        }}
      />
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}

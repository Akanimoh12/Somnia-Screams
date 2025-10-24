import React, { Component } from 'react';
import type { ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="min-h-screen bg-primary flex items-center justify-center p-6"
        >
          <div className="max-w-md w-full bg-secondary border-2 border-error rounded-lg p-8 text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-error/20 flex items-center justify-center">
              <AlertTriangle size={40} className="text-error" />
            </div>
            
            <div>
              <h1 className="text-2xl font-bold text-white title-font mb-2">
                Something Went Wrong
              </h1>
              <p className="text-secondary text-sm">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
            </div>

            <button
              onClick={this.handleReset}
              className="w-full py-3 bg-error hover:bg-error/80 text-white font-bold rounded-lg transition flex items-center justify-center gap-2"
            >
              <RefreshCw size={20} />
              Try Again
            </button>
          </div>
        </motion.div>
      );
    }

    return this.props.children;
  }
}

export default function ErrorFallback() {
  return null;
}

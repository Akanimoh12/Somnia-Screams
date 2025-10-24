import { useState, useCallback } from 'react';

interface RetryOptions {
  maxAttempts?: number;
  delay?: number;
  backoff?: boolean;
}

export const useRetry = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: RetryOptions = {}
) => {
  const { maxAttempts = 3, delay = 1000, backoff = true } = options;
  const [isRetrying, setIsRetrying] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);

  const executeWithRetry = useCallback(
    async (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
      let lastError: Error | null = null;
      
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
          setAttemptCount(attempt + 1);
          setIsRetrying(attempt > 0);
          
          const result = await fn(...args);
          
          setIsRetrying(false);
          setAttemptCount(0);
          return result;
        } catch (error) {
          lastError = error as Error;
          
          if (attempt < maxAttempts - 1) {
            const waitTime = backoff ? delay * Math.pow(2, attempt) : delay;
            await new Promise(resolve => setTimeout(resolve, waitTime));
          }
        }
      }
      
      setIsRetrying(false);
      throw lastError;
    },
    [fn, maxAttempts, delay, backoff]
  );

  return {
    execute: executeWithRetry,
    isRetrying,
    attemptCount,
  };
};

export const useErrorHandler = () => {
  const [error, setError] = useState<Error | null>(null);

  const handleError = useCallback((err: Error | unknown) => {
    if (err instanceof Error) {
      setError(err);
    } else {
      setError(new Error(String(err)));
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    handleError,
    clearError,
  };
};

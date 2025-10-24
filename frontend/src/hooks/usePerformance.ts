import { useEffect, useCallback } from 'react';

export const usePerformanceMonitoring = () => {
  useEffect(() => {
    if ('performance' in window && 'PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            console.log('LCP:', entry.startTime);
          }
          if (entry.entryType === 'first-input') {
            console.log('FID:', (entry as any).processingStart - entry.startTime);
          }
          if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
            console.log('CLS:', (entry as any).value);
          }
        }
      });

      try {
        observer.observe({ 
          entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] 
        });
      } catch (e) {
        console.warn('Performance monitoring not fully supported');
      }

      return () => observer.disconnect();
    }
  }, []);

  const measureRender = useCallback((componentName: string) => {
    if ('performance' in window && performance.mark) {
      const startMark = `${componentName}-start`;
      const endMark = `${componentName}-end`;
      const measureName = `${componentName}-render`;

      performance.mark(startMark);

      return () => {
        performance.mark(endMark);
        performance.measure(measureName, startMark, endMark);
        const measure = performance.getEntriesByName(measureName)[0];
        if (measure) {
          console.log(`${componentName} render time:`, measure.duration.toFixed(2), 'ms');
        }
        performance.clearMarks(startMark);
        performance.clearMarks(endMark);
        performance.clearMeasures(measureName);
      };
    }
    return () => {};
  }, []);

  return { measureRender };
};

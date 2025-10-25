import type { ReactNode } from 'react';

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  grid?: boolean;
  gridCols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
}

/**
 * ResponsiveContainer - Breakpoint-aware container component
 * 
 * Breakpoints:
 * - Mobile: 320px-768px (single column by default)
 * - Tablet: 768px-1024px (two columns by default)
 * - Desktop: 1024px+ (three columns by default)
 * 
 * Features:
 * - Max-width constraints
 * - Responsive padding
 * - Optional grid layout
 * - Customizable column counts per breakpoint
 */
export default function ResponsiveContainer({
  children,
  className = '',
  maxWidth = '7xl',
  padding = 'md',
  grid = false,
  gridCols = { mobile: 1, tablet: 2, desktop: 3 },
}: ResponsiveContainerProps) {
  // Max width classes
  const maxWidthClasses = {
    sm: 'max-w-sm',      // 384px
    md: 'max-w-md',      // 448px
    lg: 'max-w-lg',      // 512px
    xl: 'max-w-xl',      // 576px
    '2xl': 'max-w-2xl',  // 672px
    '7xl': 'max-w-7xl',  // 1280px
    full: 'max-w-full',
  };

  // Padding classes - Breakpoint aware
  // Mobile (320px-768px): Smaller padding
  // Tablet (768px-1024px): Medium padding
  // Desktop (1024px+): Larger padding
  const paddingClasses = {
    none: '',
    sm: 'px-2 py-2 sm:px-3 sm:py-3 lg:px-4 lg:py-4',
    md: 'px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8',
    lg: 'px-6 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-12',
  };

  // Grid classes - Responsive columns
  const gridClasses = grid
    ? `grid gap-4 sm:gap-6 grid-cols-${gridCols.mobile} md:grid-cols-${gridCols.tablet} lg:grid-cols-${gridCols.desktop}`
    : '';

  return (
    <div
      className={`
        w-full
        ${maxWidthClasses[maxWidth]}
        ${paddingClasses[padding]}
        mx-auto
        ${gridClasses}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

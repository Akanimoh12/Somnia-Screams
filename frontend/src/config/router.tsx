import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ROUTES } from '../utils/constants';
import { Skeleton } from '../components/ui/Skeleton';
import GameLayout from '../components/layout/GameLayout';

const LandingPage = lazy(() => import('../pages/LandingPage'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const GameArena = lazy(() => import('../pages/GameArena'));
const LeaderboardPage = lazy(() => import('../pages/LeaderboardPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const InventoryPage = lazy(() => import('../pages/InventoryPage'));
const AchievementsPage = lazy(() => import('../pages/AchievementsPage'));
const HowToPlayPage = lazy(() => import('../pages/HowToPlayPage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

const PageLoader = () => (
  <div className="min-h-screen bg-primary flex items-center justify-center p-6">
    <div className="w-full max-w-4xl space-y-4">
      <Skeleton height={200} />
      <Skeleton height={400} />
    </div>
  </div>
);

const withSuspense = (Component: React.LazyExoticComponent<React.ComponentType<any>>) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

const withLayout = (
  Component: React.LazyExoticComponent<React.ComponentType<any>>, 
  requireAuth = false,
  showSidebar = true,
  showFooter = false
) => (
  <Suspense fallback={<PageLoader />}>
    <GameLayout requireAuth={requireAuth} showSidebar={showSidebar} showFooter={showFooter}>
      <Component />
    </GameLayout>
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: withSuspense(LandingPage),
  },
  {
    path: ROUTES.DASHBOARD,
    element: withLayout(Dashboard, false, true, false), // Allow access without wallet
  },
  {
    path: ROUTES.GAME,
    element: withLayout(GameArena, false, false, false), // Allow access without wallet
  },
  {
    path: ROUTES.LEADERBOARD,
    element: withLayout(LeaderboardPage, false, true, false),
  },
  {
    path: ROUTES.PROFILE,
    element: withLayout(ProfilePage, true, true, false), // Requires wallet - has user data
  },
  {
    path: ROUTES.INVENTORY,
    element: withLayout(InventoryPage, true, true, false), // Requires wallet - has user items
  },
  {
    path: ROUTES.ACHIEVEMENTS,
    element: withLayout(AchievementsPage, false, true, false),
  },
  {
    path: ROUTES.HOW_TO_PLAY,
    element: withLayout(HowToPlayPage, false, true, true),
  },
  {
    path: ROUTES.SETTINGS,
    element: withLayout(SettingsPage, true, true, false), // Requires wallet - has user settings
  },
  {
    path: '*',
    element: withSuspense(NotFoundPage),
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

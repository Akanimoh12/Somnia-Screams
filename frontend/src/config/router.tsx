import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ROUTES } from '../utils/constants';

// Pages
import LandingPage from '../pages/LandingPage';
import Dashboard from '../pages/Dashboard';
import GameArena from '../pages/GameArena';
import LeaderboardPage from '../pages/LeaderboardPage';
import ProfilePage from '../pages/ProfilePage';
import InventoryPage from '../pages/InventoryPage';
import AchievementsPage from '../pages/AchievementsPage';
import HowToPlayPage from '../pages/HowToPlayPage';
import SettingsPage from '../pages/SettingsPage';
import NotFoundPage from '../pages/NotFoundPage';

// Router configuration
export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <LandingPage />,
  },
  {
    path: ROUTES.DASHBOARD,
    element: <Dashboard />,
  },
  {
    path: ROUTES.GAME,
    element: <GameArena />,
  },
  {
    path: ROUTES.LEADERBOARD,
    element: <LeaderboardPage />,
  },
  {
    path: ROUTES.PROFILE,
    element: <ProfilePage />,
  },
  {
    path: ROUTES.INVENTORY,
    element: <InventoryPage />,
  },
  {
    path: ROUTES.ACHIEVEMENTS,
    element: <AchievementsPage />,
  },
  {
    path: ROUTES.HOW_TO_PLAY,
    element: <HowToPlayPage />,
  },
  {
    path: ROUTES.SETTINGS,
    element: <SettingsPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

// Router component
export function AppRouter() {
  return <RouterProvider router={router} />;
}

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from './pages/Home.page';
import GameReviewList from './pages/game-review/GameReviewList.page';
import NotFoundPage from './pages/NotFound.page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: '/game-reviews',
        element: <GameReviewList />,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}

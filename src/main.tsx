import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import App from './App';
import GameReviewList from './pages/game-review/GameReviewList';

const router = createBrowserRouter([
  {
    path: '/',
    children: [
      {
        path: '/game-review',
        element: <GameReviewList />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider>
      <RouterProvider router={router} />
    </MantineProvider>
  </React.StrictMode>
);

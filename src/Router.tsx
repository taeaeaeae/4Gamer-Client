import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ChannelsPage from '@/pages/channels/ChannelsPage';
import ChannelDetailPage from '@/pages/channels/ChannelDetailPage';
import ChannerCreate from "@/pages/channels/CreateChannel"

const router = createBrowserRouter([
  {
    path: '/channels',
    children: [
      {
        path: '',
        element: <ChannelsPage />,
      },
      {
        path: ':id',
        element: <ChannelDetailPage />,
      },
      {
        path: 'new',
        element: <ChannerCreate />,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
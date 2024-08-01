import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ChannelsPage from '@/pages/channels/ChannelsPage';
import ChannelDetailPage from '@/pages/channels/ChannelDetailPage';
import ChannerCreate from "@/pages/channels/CreateChannel"
import ChannelAdminPage from "@/pages/channels/ChannelAdminPage"

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
      {
        path: 'admin',
        element: <ChannelAdminPage />,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
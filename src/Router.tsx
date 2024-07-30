import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ChannelsPage from '@/pages/channels/ChannelsPage';
import ChannelDetailPage from '@/pages/channels/ChannelDetailPage';

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
    ],
  },
]);

export default router;

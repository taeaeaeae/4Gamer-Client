import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Header from './components/layout/WebsocketConnection';
import { HomePage } from './pages/Home.page';
import LoginPage from './pages/Login.page';
import MemberPage from './pages/Member.page';
import BlackListPage from './pages/BlackList.page';
import MessagePage from './pages/Message.page';
import PostPage from './pages/Post.page';
import GameReviewList from './pages/game-review/GameReviewList.page';
import ChannelsPage from './pages/channels/ChannelsPage';
import ChannelDetailPage from './pages/channels/ChannelDetailPage';
import ChannerCreate from "./pages/channels/CreateChannel"
import ChannelModify from "./pages/channels/ModifyChannel"
import ChannelAdminPage from "./pages/channels/ChannelAdminPage"
import BoardCreate from "./pages/channels/CreateBoard"
import BoardModify from "./pages/channels/ModifyBoard"
import { GoogleLogin } from './pages/GoogleLogin.page';
import TopGamePage from './pages/TopGame.page';

const router = createBrowserRouter([
  {
    path: '',
    element: <Header />,
  },

  {
    path: '/main',
    element: <HomePage />,
  },

  {
    path: '/login',
    element: <LoginPage />,
  },

  {
    path: '/member',
    element: <MemberPage />,
  },

  {
    path: '/posts',
    element: <PostPage />,
  },

  {
    path: '/blacklist/:channelId',
    element: <BlackListPage />,
  },
  {
    path: "/login/google",
    element: <GoogleLogin />,
  },

  {
    path: '/message',
    element: <MessagePage />,
  }, {
    path: '/channels',
    children: [
      {
        path: '',
        element: <ChannelsPage />,
      },
      {
        path: ':channelId',
        element: <ChannelDetailPage />
      },
      {
        path: ':channelId/edit',
        element: <ChannelModify />
      },
      {
        path: 'new',
        element: <ChannerCreate />,
      },
      {
        path: ':channelId/admin',
        element: <ChannelAdminPage />,
      },
      {
        path: ':channelId/boards/new',
        element: <BoardCreate />,
      },
      {
        path: ':channelId/boards/:boardId/edit',
        element: <BoardModify />,
      },
    ],
  },
  {
    path: '/game-reviews',
    element: <GameReviewList />,
  },

  {
    path: '/top-game',
    element: <TopGamePage />
  }
]);

export function Router() {
  return <RouterProvider router={router} />;
}

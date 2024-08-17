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
import ChannerCreate from './pages/channels/CreateChannel';
import ChannelModify from './pages/channels/ModifyChannel';
import { ChannelAdminPage } from './pages/channels/ChannelAdminPage';
import BoardCreate from './pages/channels/CreateBoard';
import BoardModify from './pages/channels/ModifyBoard';
import { GoogleLogin } from './pages/GoogleLogin.page';
import TopGamePage from './pages/TopGame.page';

import { PostEditPage } from './pages/post/PostEdit.page';
import { PostListPage } from './pages/post/PostList.page';
import { PostDetailPage } from './pages/post/PostDetail.page';
import { NewPostPage } from './pages/post/NewPost.page';

const router = createBrowserRouter([
  // {
  //   path: '',
  //   element: <Header />,
  // },

  // {
  //   path: '/main',
  //   element: <HomePage />,
  // },

  {
    path: '',
    element: <ChannelsPage />,
  },
  {
    path: '/login',
    children: [
      {
        path: '',
        element: <LoginPage />,
      },
      {
        path: 'google',
        element: <GoogleLogin />,
      },
    ],
  },

  {
    path: '/member',
    children: [
      {
        path: '',
        element: <MemberPage />,
      },
      {
        path: 'message',
        element: <MessagePage />,
      },
      {
        path: 'posts',
        element: <PostPage />,
      },
    ],
  },

  // {
  //   path: '/blacklist/:channelId',
  //   element: <BlackListPage />,
  // },
  {
    path: '/channels',
    children: [
      {
        path: '',
        element: <ChannelsPage />,
      },
      {
        path: 'new',
        element: <ChannerCreate />,
      },
      {
        path: ':channelId',
        children: [
          {
            path: '',
            element: <ChannelDetailPage />,
          },
          {
            path: 'edit',
            element: <ChannelModify />,
          },
          {
            path: 'admin',
            children: [
              {
                path: '',
                element: <ChannelAdminPage />,
              },
              {
                path: 'blacklist',
                element: <BlackListPage />,
              },
            ],
          },
          {
            path: 'boards',
            children: [
              {
                path: 'new',
                element: <BoardCreate />,
              },
              {
                path: ':boardId',
                children: [
                  {
                    path: 'edit',
                    element: <BoardModify />,
                  },
                  {
                    path: 'posts',
                    children: [
                      {
                        path: '',
                        element: <PostListPage />,
                      },
                      {
                        path: 'new',
                        element: <NewPostPage />,
                      },
                      {
                        path: ':postId',
                        children: [
                          {
                            path: '',
                            element: <PostDetailPage />,
                          },
                          {
                            path: 'edit',
                            element: <PostEditPage />,
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '/game-reviews',
    element: <GameReviewList />,
  },
  {
    path: '/top-game',
    element: <TopGamePage />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}

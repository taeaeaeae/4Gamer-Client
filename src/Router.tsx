import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Header from './components/layout/Header';
import { HomePage } from './pages/Home.page';
import LoginPage from './pages/Login.page';
import MemberPage from './pages/Member.page';
import BlackListPage from './pages/BlackList.page';
import MessagePage from './pages/Message.page';
import PostPage from './pages/Post.page';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Header />,
  },

  {
    path: "/main",
    element: <HomePage />,
  },

  {
    path: "/login",
    element: <LoginPage />,
  },

  {
    path: "/member",
    element: <MemberPage />,
  },

  {
    path: "/post",
    element: <PostPage />,
  },

  {
    path: "/blacklist",
    element: <BlackListPage />,
  },

  {
    path: "/message",
    element: <MessagePage />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}

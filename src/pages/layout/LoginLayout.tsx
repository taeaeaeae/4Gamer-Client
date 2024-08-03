import { Navigate, Outlet } from "react-router-dom";

const LoginLayout = () => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    return <Navigate to="/main" />;
  }

  return <Outlet />;
};

export default LoginLayout;

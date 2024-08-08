import { Navigate, Outlet } from "react-router-dom";
import WebsocketConnection from "@/components/layout/WebsocketConnection";

const RootLayout = () => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return <Navigate to="/main" />;
  }
  return (
    <main>
      <WebsocketConnection />
      <Outlet />
    </main>
  );
};

export default RootLayout;

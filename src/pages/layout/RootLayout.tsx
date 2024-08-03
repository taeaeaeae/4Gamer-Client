import { Navigate, Outlet } from "react-router-dom";
import Header from "@/components/layout/Header";

const RootLayout = () => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return <Navigate to="/main" />;
  }
  return (
    <main>
      <Header /> 
      <Outlet />
    </main>
  );
};

export default RootLayout;

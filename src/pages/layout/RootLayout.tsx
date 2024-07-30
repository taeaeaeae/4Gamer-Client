import { Navigate, Outlet } from "react-router-dom";
// import Header from "../../components/layout/Header";

const RootLayout = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <main>
      {/* <Header /> */}
      <Outlet />
    </main>
  );
};

export default RootLayout;
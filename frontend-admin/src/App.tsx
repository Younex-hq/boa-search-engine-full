import { RouterProvider, createBrowserRouter } from "react-router";
import { routes } from "@/routes/index-routes";
import { useEffect } from "react";
import { useAuthStore } from "./store/auth";

const router = createBrowserRouter(routes);

function App() {
  const { logout } = useAuthStore();

  useEffect(() => {
    const handleLogout = () => {
      logout();
    };

    window.addEventListener("logout", handleLogout);

    return () => {
      window.removeEventListener("logout", handleLogout);
    };
  }, [logout]);

  return <RouterProvider router={router} />;
}

export default App;

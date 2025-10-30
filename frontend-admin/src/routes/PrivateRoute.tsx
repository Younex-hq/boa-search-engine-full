import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "@/store/auth";

export default function PrivateRoute() {
  const token = useAuthStore((state) => state.token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

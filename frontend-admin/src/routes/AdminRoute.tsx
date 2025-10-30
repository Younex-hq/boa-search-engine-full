import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "@/store/auth";

export default function AdminRoute() {
  const { user } = useAuthStore();

  if (!user?.is_admin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
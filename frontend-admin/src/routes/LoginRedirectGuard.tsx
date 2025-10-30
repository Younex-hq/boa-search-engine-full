import { Navigate } from "react-router";
import Login from "@/pages/login-pages/LoginPage";
import Cookies from "js-cookie";

export default function LoginRedirectGuard() {
  const token = Cookies.get("auth_token");
  if (token) return <Navigate to="/home" replace />;
  return <Login />;
}

import { Navigate } from "react-router";
import Cookies from "js-cookie";

export default function NotFoundRedirect() {
  const token = Cookies.get("auth_token");
  return <Navigate to={token ? "/home" : "/login"} replace />;
}

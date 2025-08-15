import { Navigate, Outlet } from "react-router-dom";
import { authService } from "@/lib/auth-service";

const ProtectedRoute = () => {
  const authed = authService.isAuthenticated();
  return authed ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;

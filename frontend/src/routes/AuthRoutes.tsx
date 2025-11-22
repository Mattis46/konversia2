import { useLocation, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import VerifyEmail from "../pages/VerifyEmail";
import { useAuth } from "../context/AuthContext";

export const AuthRoutes = () => {
  const { token } = useAuth();
  const location = useLocation();
  if (token) return <Navigate to="/dashboard" replace />;
  if (location.pathname === "/register") return <Register />;
  if (location.pathname === "/forgot-password") return <ForgotPassword />;
  if (location.pathname.startsWith("/reset-password")) return <ResetPassword />;
  if (location.pathname.startsWith("/verify-email")) return <VerifyEmail />;
  return <Login />;
};

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext.tsx";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: "admin" | "user";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

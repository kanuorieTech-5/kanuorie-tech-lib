import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({
  children,
  adminOnly = false,
}) {
  const { user, token, loading } = useContext(AuthContext);

  // ⏳ Wait for auth check
  if (loading) {
    return <div>Loading...</div>;
  }

  // ⛔ Not logged in
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  // 🔐 Admin only
  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
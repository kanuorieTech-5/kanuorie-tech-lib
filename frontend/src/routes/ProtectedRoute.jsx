import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts";

export default function ProtectedRoute() {
  const { user, loadingAuth } = useAuth();

  const location = useLocation();

  if (loadingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-slate-500">Checking authentication...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

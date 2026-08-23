import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts";

export default function AdminRoute() {
  const {
    user,
    loadingAuth,
    isAdmin,
  } = useAuth();

  if (loadingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-slate-500">
          Checking authorization...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (!isAdmin) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return <Outlet />;
}
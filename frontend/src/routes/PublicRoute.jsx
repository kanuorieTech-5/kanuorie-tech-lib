import { Outlet } from "react-router-dom";
import { useAuth } from "../contexts";

export default function PublicRoute() {
  const { loadingAuth } = useAuth();

  if (loadingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-slate-500">
          Checking authentication...
        </p>
      </div>
    );
  }

  return <Outlet />;
}
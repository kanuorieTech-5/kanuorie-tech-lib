import { Outlet } from "react-router-dom";
import { useAuth } from "../contexts";

export default function PublicRoute() {
  const { loadingAuth } = useAuth();

  if (loadingAuth) {
    return (
      <div className="flex min-h-screen items-cente justify-cente">
        <p className="text-sm text-slate-500 dark:text-slate-400">Checking authentication...</p>
      </div>
    );
  }

  return (
  <div className="w-full min-h-screen">
   <Outlet />;
  </div>
  )
}



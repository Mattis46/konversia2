import { Link, Outlet } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/AuthContext";
import { Avatar, AvatarFallback } from "../components/ui/avatar";

export const AppLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <header className="border-b bg-white/80 backdrop-blur">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/app/dashboard" className="text-lg font-semibold">Konversia</Link>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{user?.email?.slice(0, 2).toUpperCase() || "US"}</AvatarFallback>
            </Avatar>
            <div className="text-sm leading-tight">
              <div className="font-medium">{user?.email}</div>
              {user?.roleName && <div className="text-muted-foreground">{user.roleName}</div>}
            </div>
            <Button variant="secondary" onClick={logout}>Logout</Button>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="w-64 border-r bg-white">
          <nav className="p-4 space-y-2 text-sm">
            <Link className="block rounded-md px-3 py-2 hover:bg-muted" to="/app/dashboard">Dashboard</Link>
            <Link className="block rounded-md px-3 py-2 hover:bg-muted" to="/app/conversations">Konversationen</Link>
            <Link className="block rounded-md px-3 py-2 hover:bg-muted" to="/app/bots">Bots</Link>
            <Link className="block rounded-md px-3 py-2 hover:bg-muted" to="/app/settings">Einstellungen</Link>
          </nav>
        </aside>
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

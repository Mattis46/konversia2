import { Outlet, Link } from "react-router-dom";
import { Button } from "../components/ui/button";

export const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="border-b bg-white/80 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between py-4">
          <Link to="/" className="text-xl font-semibold">Konversia</Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link to="/features" className="hover:text-primary">Features</Link>
            <Link to="/pricing" className="hover:text-primary">Preise</Link>
            <Link to="/contact" className="hover:text-primary">Kontakt</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/app/login" className="text-sm text-muted-foreground hover:text-primary">Login</Link>
            <Button asChild>
              <Link to="/app/register">Kostenlos starten</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t bg-white/70">
        <div className="container mx-auto py-4 text-sm text-muted-foreground flex items-center justify-between">
          <span>© {new Date().getFullYear()} Konversia</span>
          <div className="flex gap-3">
            <Link to="/contact">Support</Link>
            <a href="mailto:hello@konversia.dev">hello@konversia.dev</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

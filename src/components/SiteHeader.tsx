import { Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/15 text-primary">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <span className="font-bold tracking-tight">CertChain</span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            v1.0
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            to="/"
            activeOptions={{ exact: true }}
            activeProps={{ className: "text-primary" }}
            inactiveProps={{ className: "text-muted-foreground" }}
            className="rounded-md px-3 py-1.5 transition hover:text-foreground"
          >
            Home
          </Link>
          <Link
            to="/generate"
            activeProps={{ className: "text-primary" }}
            inactiveProps={{ className: "text-muted-foreground" }}
            className="rounded-md px-3 py-1.5 transition hover:text-foreground"
          >
            Generate
          </Link>
          <Link
            to="/verify"
            activeProps={{ className: "text-primary" }}
            inactiveProps={{ className: "text-muted-foreground" }}
            className="rounded-md px-3 py-1.5 transition hover:text-foreground"
          >
            Verifikasi
          </Link>
        </nav>
      </div>
    </header>
  );
}
import { Menu, ShieldCheck } from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { appConfig } from "@/config/app";
import { cn } from "@/lib/utils/cn";

const navigation = [
  { to: "/", label: "Beranda", end: true },
  { to: "/#cara-kerja", label: "Cara kerja", end: false },
  { to: "/dashboard", label: "Dashboard", end: false },
];

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2 rounded-full font-serif text-lg font-bold sm:text-xl">
      <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <ShieldCheck className="size-5" aria-hidden="true" />
      </span>
      <span className="hidden min-[380px]:inline">{appConfig.name}</span>
    </Link>
  );
}

export function AppShell() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[70] -translate-y-24 rounded-full bg-primary px-4 py-2 text-primary-foreground focus:translate-y-0"
      >
        Lewati ke konten
      </a>
      <header className="fixed inset-x-0 top-3 z-40 px-3 sm:top-5 sm:px-6">
        <div className="glass mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-3 rounded-full border px-3 shadow-soft sm:px-5">
          <Brand />
          <nav aria-label="Navigasi utama" className="hidden items-center gap-1 md:flex">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "rounded-full px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-surface-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2",
                    isActive && item.to !== "/#cara-kerja" && "bg-accent text-foreground",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Buka menu navigasi">
                  <Menu className="size-5" aria-hidden="true" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle className="pr-10 font-serif text-2xl">Navigasi</DialogTitle>
                <DialogDescription className="mt-2 text-muted-foreground">
                  Jelajahi SiagaNusantara
                </DialogDescription>
                <nav aria-label="Navigasi seluler" className="mt-6 grid gap-2">
                  {navigation.map((item) => (
                    <DialogClose asChild key={item.to}>
                      <Link
                        to={item.to}
                        className="flex min-h-12 items-center rounded-xl px-4 font-medium hover:bg-surface-muted focus-visible:outline-2"
                      >
                        {item.label}
                      </Link>
                    </DialogClose>
                  ))}
                </nav>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>
      <main id="main-content" tabIndex={-1} className="outline-none">
        <Outlet />
      </main>
      <footer className="border-t px-4 py-10 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left">
          <div>
            <Brand />
            <p className="mt-3 text-sm text-muted-foreground">
              Prototipe lokal · Bukan sistem peringatan dini resmi
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <Link className="hover:text-foreground hover:underline" to="/#batasan">Batasan sistem</Link>
            <a className="hover:text-foreground hover:underline" href="https://github.com/malvinjauhari/deteksi-bencana">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

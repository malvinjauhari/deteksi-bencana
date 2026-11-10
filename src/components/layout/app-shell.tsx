import { NavLink, Outlet } from "react-router-dom";
import { appConfig } from "@/config/app";

const navigation = [
  { to: "/", label: "Beranda", end: true },
  { to: "/dashboard", label: "Dashboard", end: false },
];

export function AppShell() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-50 -translate-y-24 rounded-full bg-slate-900 px-4 py-2 text-white focus:translate-y-0"
      >
        Lewati ke konten
      </a>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <NavLink to="/" className="font-serif text-xl font-bold">
            {appConfig.name}
          </NavLink>
          <nav aria-label="Navigasi utama" className="flex gap-1">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `rounded-full px-3 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 ${
                    isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main id="main-content" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 px-4 py-6 text-center text-sm text-slate-600">
        Prototipe lokal · Bukan sistem peringatan dini resmi
      </footer>
    </div>
  );
}

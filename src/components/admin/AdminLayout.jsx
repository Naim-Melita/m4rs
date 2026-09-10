import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutGrid, Package, Users, ShoppingBag, Images, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../theme/ThemeProvider";
import logo from "../../assets/logo3.png";

const NAV = [
  { to: "/admin",           label: "Dashboard", icon: LayoutGrid, end: true },
  { to: "/admin/productos", label: "Productos", icon: Package },
  { to: "/admin/ordenes",   label: "Órdenes",   icon: ShoppingBag },
  { to: "/admin/universo",  label: "Universo",  icon: Images },
  { to: "/admin/usuarios",  label: "Usuarios",  icon: Users },
];

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-3 py-3 text-[11px] font-semibold uppercase tracking-[0.25em] no-underline transition-opacity ${
    isActive ? "text-[var(--text-main)]" : "text-[var(--text-soft)] hover:text-[var(--text-main)]"
  }`;

function NavList({ onNavigate }) {
  return (
    <nav className="flex flex-1 flex-col gap-0.5 px-3 py-4">
      {NAV.map(({ to, label, icon: Icon, end }) => (
        <NavLink key={to} to={to} end={end} onClick={onNavigate} className={linkClass}>
          <Icon className="size-4 shrink-0" strokeWidth={1.5} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

function SidebarFooter({ user, onLogout }) {
  return (
    <div className="border-t border-[var(--border)] px-4 py-4">
      <p className="mb-3 truncate text-[10px] text-[var(--text-soft)]">
        {[user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.name}
      </p>
      <button
        type="button"
        onClick={onLogout}
        className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-[var(--text-soft)] transition-opacity hover:opacity-50"
      >
        <LogOut className="size-3.5" strokeWidth={1.5} />
        Salir
      </button>
    </div>
  );
}

export default function AdminLayout() {
  const { logout, user } = useAuth();
  const { theme } = useTheme();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Cierra el drawer al navegar
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  // Bloquea el scroll del fondo y permite cerrar con Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => { if (e.key === "Escape") setMenuOpen(false); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const logoStyle = { filter: theme === "light" ? "invert(1)" : "none" };

  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg-page)" }}>

      {/* ── Sidebar fijo — desktop ── */}
      <aside
        className="hidden w-56 shrink-0 flex-col border-r border-[var(--border)] md:flex"
        style={{ background: "var(--bg-page)" }}
      >
        <div className="flex h-16 items-center border-b border-[var(--border)] px-6">
          <img src={logo} alt="M4RS" className="w-16 object-contain" style={logoStyle} />
        </div>
        <NavList />
        <SidebarFooter user={user} onLogout={handleLogout} />
      </aside>

      {/* ── Drawer — mobile ── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-[140] md:hidden"
              style={{ background: "rgba(0,0,0,0.5)" }}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed inset-y-0 left-0 z-[150] flex w-64 flex-col border-r border-[var(--border)] md:hidden"
              style={{ background: "var(--bg-page)" }}
            >
              <div className="flex h-14 items-center justify-between border-b border-[var(--border)] px-5">
                <img src={logo} alt="M4RS" className="w-14 object-contain" style={logoStyle} />
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Cerrar menú"
                  className="-mr-2 p-2 text-[var(--text-soft)] transition-opacity hover:opacity-50"
                >
                  <X className="size-5" strokeWidth={1.5} />
                </button>
              </div>
              <NavList onNavigate={() => setMenuOpen(false)} />
              <SidebarFooter user={user} onLogout={handleLogout} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Contenido ── */}
      <div className="flex min-w-0 flex-1 flex-col">

        {/* Topbar — solo mobile */}
        <header
          className="sticky top-0 z-[130] flex h-14 items-center gap-3 border-b border-[var(--border)] px-5 md:hidden"
          style={{ background: "var(--bg-page)" }}
        >
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menú"
            className="-ml-2 p-2 text-[var(--text-main)] transition-opacity hover:opacity-50"
          >
            <Menu className="size-5" strokeWidth={1.5} />
          </button>
          <img src={logo} alt="M4RS" className="w-14 object-contain" style={logoStyle} />
          <span className="ml-auto text-[9px] font-semibold uppercase tracking-[0.3em] text-[var(--text-soft)]">
            Admin
          </span>
        </header>

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

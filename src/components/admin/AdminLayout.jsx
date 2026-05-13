import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutGrid, Package, Users, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../theme/ThemeProvider";
import logo from "../../assets/logo3.png";

const NAV = [
  { to: "/admin",          label: "Dashboard",  icon: LayoutGrid, end: true },
  { to: "/admin/productos", label: "Productos",  icon: Package },
  { to: "/admin/usuarios",  label: "Usuarios",   icon: Users },
];

export default function AdminLayout() {
  const { logout, user } = useAuth();
  const { theme } = useTheme();
  const navigate  = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg-page)" }}>

      {/* ── Sidebar ── */}
      <aside
        className="flex w-56 shrink-0 flex-col border-r border-[var(--border)]"
        style={{ background: "var(--bg-page)" }}
      >
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-[var(--border)] px-6">
          <img
            src={logo}
            alt="M4RS"
            className="w-16 object-contain"
            style={{ filter: theme === "light" ? "invert(1)" : "none" }}
          />
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-0.5 px-3 py-4">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.25em] transition-opacity ${
                  isActive
                    ? "text-[var(--text-main)]"
                    : "text-[var(--text-soft)] hover:text-[var(--text-main)]"
                }`
              }
            >
              <Icon className="size-4 shrink-0" strokeWidth={1.5} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-[var(--border)] px-4 py-4">
          <p className="mb-3 truncate text-[10px] text-[var(--text-soft)]">
            {user?.firstName} {user?.lastName}
          </p>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-[var(--text-soft)] transition-opacity hover:opacity-50"
          >
            <LogOut className="size-3.5" strokeWidth={1.5} />
            Salir
          </button>
        </div>
      </aside>

      {/* ── Contenido ── */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

import { useAuth } from "../../context/AuthContext";

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="px-10 py-12">
      <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[var(--text-soft)]">
        M4RS — Admin
      </p>
      <h1 className="mt-2 text-2xl font-light text-[var(--text-main)]">
        Bienvenido, {user?.firstName}
      </h1>
      <p className="mt-2 text-xs text-[var(--text-soft)]">
        Desde acá podés gestionar productos y usuarios del sitio.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "Productos",       href: "/admin/productos", desc: "Crear, editar y eliminar productos." },
          { label: "Usuarios",        href: "/admin/usuarios",  desc: "Ver y gestionar cuentas de clientes." },
        ].map(({ label, href, desc }) => (
          <a
            key={href}
            href={href}
            className="block border border-[var(--border)] p-6 no-underline transition-opacity hover:opacity-60"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[var(--text-soft)]">
              {label}
            </p>
            <p className="mt-2 text-xs text-[var(--text-soft)]">{desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

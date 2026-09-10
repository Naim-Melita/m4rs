import { Link } from "react-router-dom";
import { Images, Package, ShoppingBag, Users } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { AdminPage } from "../../components/admin/AdminPage";

const SECTIONS = [
  { label: "Productos", to: "/admin/productos", icon: Package,     desc: "Crear, editar y eliminar productos." },
  { label: "Órdenes",   to: "/admin/ordenes",   icon: ShoppingBag, desc: "Ver pedidos y actualizar su estado." },
  { label: "Universo",  to: "/admin/universo",  icon: Images,      desc: "Subir y ordenar las imágenes del universo visual." },
  { label: "Usuarios",  to: "/admin/usuarios",  icon: Users,       desc: "Ver y gestionar cuentas de clientes." },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const firstName = user?.firstName || user?.name?.split(" ")[0] || "";

  return (
    <AdminPage>
      <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[var(--text-soft)]">
        M4RS — Admin
      </p>
      <h1 className="mt-2 text-xl font-light text-[var(--text-main)] md:text-2xl">
        Bienvenido{firstName ? `, ${firstName}` : ""}
      </h1>
      <p className="mt-2 text-xs text-[var(--text-soft)]">
        Desde acá podés gestionar el catálogo, los pedidos y los usuarios del sitio.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 md:mt-12 md:gap-6 lg:grid-cols-3">
        {SECTIONS.map(({ label, to, icon: Icon, desc }) => (
          <Link
            key={to}
            to={to}
            className="block border border-[var(--border)] p-5 no-underline transition-opacity hover:opacity-60 md:p-6"
          >
            <Icon className="size-4 text-[var(--text-soft)]" strokeWidth={1.5} />
            <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.35em] text-[var(--text-main)]">
              {label}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-[var(--text-soft)]">{desc}</p>
          </Link>
        ))}
      </div>
    </AdminPage>
  );
}

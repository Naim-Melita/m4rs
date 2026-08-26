import { useEffect, useState } from "react";
import api from "../../api/config";
import { AdminPage, PageHeader } from "../../components/admin/AdminPage";

export default function AdminUsers() {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/admin/users")
      .then((r) => setUsers(r.data.users))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminPage>
      <PageHeader title="Usuarios" meta={!loading ? `${users.length} total` : undefined} />

      {loading ? (
        <p className="text-xs text-[var(--text-soft)]">Cargando...</p>
      ) : (
        <div className="border-t border-[var(--border)]">
          {users.map((u) => {
            const fullName =
              [u.firstName, u.lastName].filter(Boolean).join(" ") || u.name || "—";

            return (
              <div
                key={u.id}
                className="flex items-start gap-4 border-b border-[var(--border)] py-4 md:items-center md:gap-6"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-[var(--text-main)]">
                    {fullName}
                  </p>
                  <p className="mt-0.5 truncate text-[10px] text-[var(--text-soft)]">{u.email}</p>

                  {/* La fecha baja acá en mobile */}
                  <p className="mt-1 text-[10px] text-[var(--text-soft)] md:hidden">
                    Alta {new Date(u.createdAt).toLocaleDateString("es-AR")}
                  </p>
                </div>

                <span
                  className={`shrink-0 text-[10px] font-semibold uppercase tracking-[0.25em] ${
                    u.role === "ADMIN" ? "text-[var(--text-main)]" : "text-[var(--text-soft)]"
                  }`}
                >
                  {u.role}
                </span>

                <p className="hidden shrink-0 text-[10px] text-[var(--text-soft)] md:block">
                  {new Date(u.createdAt).toLocaleDateString("es-AR")}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </AdminPage>
  );
}

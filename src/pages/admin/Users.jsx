import { useEffect, useState } from "react";
import api from "../../api/config";

export default function AdminUsers() {
  const [users, setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/admin/users")
      .then((r) => setUsers(r.data.users))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="px-10 py-12">
      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[var(--text-soft)]">
          Admin
        </p>
        <h1 className="mt-1 text-2xl font-light text-[var(--text-main)]">Usuarios</h1>
      </div>

      {loading ? (
        <p className="text-xs text-[var(--text-soft)]">Cargando...</p>
      ) : (
        <div className="border-t border-[var(--border)]">
          {users.map((u) => (
            <div
              key={u.id}
              className="flex items-center gap-6 border-b border-[var(--border)] py-4"
            >
              <div className="flex-1">
                <p className="text-xs font-medium text-[var(--text-main)]">
                  {u.firstName} {u.lastName}
                </p>
                <p className="mt-0.5 text-[10px] text-[var(--text-soft)]">{u.email}</p>
              </div>
              <span
                className={`text-[10px] font-semibold uppercase tracking-[0.25em] ${
                  u.role === "ADMIN" ? "text-[var(--text-main)]" : "text-[var(--text-soft)]"
                }`}
              >
                {u.role}
              </span>
              <p className="text-[10px] text-[var(--text-soft)]">
                {new Date(u.createdAt).toLocaleDateString("es-AR")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil } from "lucide-react";
import { getAdminProducts } from "../../api/admin";
import { AdminPage, PageHeader } from "../../components/admin/AdminPage";

const formatCurrency = (n) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    getAdminProducts()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminPage>
      <PageHeader
        title="Productos"
        meta={!loading ? `${products.length} total` : undefined}
        action={
          <Link
            to="/admin/productos/nuevo"
            className="flex items-center justify-center gap-2 border border-[var(--text-main)] bg-[var(--text-main)] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--bg-page)] no-underline transition-opacity hover:opacity-80 sm:py-2.5"
          >
            <Plus className="size-3.5" />
            Nuevo
          </Link>
        }
      />

      {loading ? (
        <p className="text-xs text-[var(--text-soft)]">Cargando...</p>
      ) : (
        <div className="border-t border-[var(--border)]">
          {products.length === 0 && (
            <p className="py-8 text-xs text-[var(--text-soft)]">No hay productos todavía.</p>
          )}
          {products.map((p) => {
            const minPrice = p.variants?.length
              ? Math.min(...p.variants.map((v) => v.price))
              : null;
            const primaryImg = p.images?.find((i) => i.isPrimary)?.url ?? p.images?.[0]?.url;

            return (
              <div
                key={p.id}
                className="flex items-center gap-4 border-b border-[var(--border)] py-4"
              >
                {primaryImg ? (
                  <img src={primaryImg} alt={p.name} className="h-16 w-12 shrink-0 object-cover md:h-14 md:w-10" />
                ) : (
                  <div className="h-16 w-12 shrink-0 bg-[var(--border)] md:h-14 md:w-10" />
                )}

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-[var(--text-main)]">{p.name}</p>
                  <p className="mt-0.5 truncate text-[10px] text-[var(--text-soft)]">
                    {p.categories?.map((c) => c.category?.name ?? c.name).filter(Boolean).join(", ")}
                  </p>

                  {/* Estado y precio bajan acá en mobile */}
                  <div className="mt-1.5 flex items-center gap-3 md:hidden">
                    <span
                      className={`text-[9px] font-semibold uppercase tracking-[0.2em] ${
                        p.isActive ? "text-emerald-400" : "text-[var(--text-soft)]"
                      }`}
                    >
                      {p.isActive ? "Activo" : "Inactivo"}
                    </span>
                    {minPrice !== null && (
                      <span className="text-[11px] text-[var(--text-main)]">
                        {formatCurrency(minPrice)}
                      </span>
                    )}
                  </div>
                </div>

                <span
                  className={`hidden shrink-0 text-[9px] font-semibold uppercase tracking-[0.2em] md:inline ${
                    p.isActive ? "text-emerald-400" : "text-[var(--text-soft)]"
                  }`}
                >
                  {p.isActive ? "Activo" : "Inactivo"}
                </span>

                {minPrice !== null && (
                  <p className="hidden shrink-0 text-xs text-[var(--text-main)] md:block">
                    {formatCurrency(minPrice)}
                  </p>
                )}

                <Link
                  to={`/admin/productos/${p.slug}`}
                  aria-label={`Editar ${p.name}`}
                  className="-mr-2 shrink-0 p-2 text-[var(--text-soft)] transition-opacity hover:opacity-50 md:ml-4 md:mr-0 md:p-0"
                >
                  <Pencil className="size-4" strokeWidth={1.5} />
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </AdminPage>
  );
}

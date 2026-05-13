import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil } from "lucide-react";
import { getAdminProducts } from "../../api/admin";

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
    <div className="px-10 py-12">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[var(--text-soft)]">
            Admin
          </p>
          <h1 className="mt-1 text-2xl font-light text-[var(--text-main)]">Productos</h1>
        </div>
        <Link
          to="/admin/productos/nuevo"
          className="flex items-center gap-2 border border-[var(--text-main)] bg-[var(--text-main)] px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--bg-page)] no-underline transition-opacity hover:opacity-80"
        >
          <Plus className="size-3.5" />
          Nuevo
        </Link>
      </div>

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
                  <img src={primaryImg} alt={p.name} className="h-14 w-10 shrink-0 object-cover" />
                ) : (
                  <div className="h-14 w-10 shrink-0 bg-[var(--border)]" />
                )}

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-[var(--text-main)]">{p.name}</p>
                  <p className="mt-0.5 text-[10px] text-[var(--text-soft)]">
                    {p.categories?.map((c) => c.category?.name ?? c.name).filter(Boolean).join(", ")}
                  </p>
                </div>

                {/* Estado activo/inactivo */}
                <span
                  className={`shrink-0 text-[9px] font-semibold uppercase tracking-[0.2em] ${
                    p.isActive ? "text-emerald-400" : "text-[var(--text-soft)]"
                  }`}
                >
                  {p.isActive ? "Activo" : "Inactivo"}
                </span>

                {minPrice !== null && (
                  <p className="shrink-0 text-xs text-[var(--text-main)]">
                    {formatCurrency(minPrice)}
                  </p>
                )}

                <Link
                  to={`/admin/productos/${p.slug}`}
                  className="ml-4 shrink-0 text-[var(--text-soft)] transition-opacity hover:opacity-50"
                >
                  <Pencil className="size-4" strokeWidth={1.5} />
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

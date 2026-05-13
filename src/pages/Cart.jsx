import { Link } from "react-router-dom";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/footer";
import useCartStore from "../hooks/useCarritoStore";
import { getDiscount } from "../utils/getDiscount";

const formatCurrency = (value) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);

export default function CartPage() {
  const items     = useCartStore((s) => s.items ?? []);
  const addItem   = useCartStore((s) => s.addItem);
  const removeOne = useCartStore((s) => s.removeOne);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);

  const subtotal = items.reduce((sum, item) => {
    const price = getDiscount(item.price ?? 0, Number(item.discountPercentage ?? 0));
    return sum + price * (item.quantity ?? 1);
  }, 0);

  const shipping = items.length > 0 && subtotal < 80000 ? 6500 : 0;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
      <Header darkOnTop />

      <main className="mx-auto max-w-6xl px-6 pb-24 pt-24 sm:px-10 lg:px-16">

        {/* Header */}
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[var(--text-soft)]">
              M4RS
            </p>
            <h1 className="mt-2 text-2xl font-light tracking-wide text-[var(--text-main)] md:text-3xl">
              Tu selección
            </h1>
          </div>
          {items.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--text-soft)] transition-opacity hover:opacity-50"
            >
              Vaciar
            </button>
          )}
        </div>

        {/* ── Vacío ─────────────────────────────────── */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <ShoppingBag className="mb-6 size-8 text-[var(--text-soft)]" strokeWidth={1} />
            <p className="text-sm font-light text-[var(--text-muted)]">
              Tu carrito está vacío
            </p>
            <Link
              to="/"
              className="mt-8 border-b border-[var(--text-main)] pb-0.5 text-[10px] font-semibold uppercase tracking-[0.35em] text-[var(--text-main)] no-underline transition-opacity hover:opacity-50"
            >
              Explorar colección
            </Link>
          </div>
        ) : (
          <div className="grid gap-16 lg:grid-cols-[1fr_300px] lg:items-start">

            {/* ── Items ─────────────────────────────── */}
            <div>
              {/* Encabezado de columnas */}
              <div className="mb-4 hidden grid-cols-[1fr_auto] gap-4 md:grid">
                <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[var(--text-soft)]">
                  Producto
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[var(--text-soft)]">
                  Total
                </span>
              </div>

              <div className="border-t border-[var(--border)]">
                {items.map((item) => {
                  const qty = item.quantity ?? 1;
                  const unitPrice = getDiscount(item.price ?? 0, Number(item.discountPercentage ?? 0));
                  const lineTotal = unitPrice * qty;

                  return (
                    <article
                      key={item.id}
                      className="grid grid-cols-[auto_1fr_auto] gap-5 border-b border-[var(--border)] py-6"
                    >
                      {/* Imagen */}
                      <Link to={`/producto/${item.slug ?? item.id}`}>
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-24 w-20 object-cover"
                        />
                      </Link>

                      {/* Info */}
                      <div className="flex flex-col justify-between">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--text-soft)]">
                            {item.categories?.[0]?.name ?? "M4RS"}
                          </p>
                          <p className="mt-1 text-sm font-medium text-[var(--text-main)]">
                            {item.title}
                          </p>
                          <p className="mt-0.5 text-xs text-[var(--text-soft)]">
                            {formatCurrency(unitPrice)} c/u
                          </p>
                        </div>

                        {/* Cantidad */}
                        <div className="mt-4 flex items-center gap-3">
                          <div className="flex items-center border border-[var(--border)]">
                            <button
                              type="button"
                              onClick={() => removeOne(item.id)}
                              className="flex h-8 w-8 items-center justify-center text-[var(--text-soft)] transition-opacity hover:opacity-50"
                              aria-label="Disminuir"
                            >
                              <Minus className="size-3" />
                            </button>
                            <span className="w-8 text-center text-xs font-medium text-[var(--text-main)]">
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => addItem(item, 1)}
                              className="flex h-8 w-8 items-center justify-center text-[var(--text-soft)] transition-opacity hover:opacity-50"
                              aria-label="Aumentar"
                            >
                              <Plus className="size-3" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--text-soft)] transition-opacity hover:opacity-50"
                          >
                            Quitar
                          </button>
                        </div>
                      </div>

                      {/* Precio total */}
                      <p className="text-sm font-medium text-[var(--text-main)]">
                        {formatCurrency(lineTotal)}
                      </p>
                    </article>
                  );
                })}
              </div>
            </div>

            {/* ── Resumen ────────────────────────────── */}
            <aside className="lg:sticky lg:top-24">
              <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[var(--text-soft)]">
                Resumen
              </p>

              <div className="mt-6 space-y-4 border-t border-[var(--border)] pt-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text-muted)]">Subtotal</span>
                  <span className="font-medium text-[var(--text-main)]">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text-muted)]">Envío</span>
                  <span className="font-medium text-[var(--text-main)]">
                    {shipping === 0 ? "Gratis" : formatCurrency(shipping)}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-[var(--border)] pt-6">
                <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[var(--text-main)]">
                  Total
                </span>
                <span className="text-xl font-light text-[var(--text-main)]">
                  {formatCurrency(total)}
                </span>
              </div>

              {shipping > 0 && (
                <p className="mt-3 text-[11px] text-[var(--text-soft)]">
                  Sumá {formatCurrency(80000 - subtotal)} más para envío gratis.
                </p>
              )}

              <div className="mt-8 space-y-3">
                <Link
                  to="/checkout"
                  className="block border border-[var(--text-main)] bg-[var(--text-main)] py-3.5 text-center text-xs font-semibold uppercase tracking-[0.2em] text-[var(--bg-page)] no-underline transition-opacity hover:opacity-80"
                >
                  Finalizar compra
                </Link>
                <Link
                  to="/"
                  className="block py-3.5 text-center text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--text-soft)] no-underline transition-opacity hover:opacity-50"
                >
                  Seguir comprando
                </Link>
              </div>
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

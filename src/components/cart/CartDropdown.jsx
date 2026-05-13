import { X, Plus, Minus } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import useCartStore from "../../hooks/useCarritoStore";
import { getDiscount } from "../../utils/getDiscount";

function formatCurrency(n) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function CartDropdown({ open, onClose, anchorRight = true }) {
  const ref = useRef(null);

  const items     = useCartStore((s) => s.items ?? []);
  const addItem   = useCartStore((s) => s.addItem);
  const removeOne = useCartStore((s) => s.removeOne);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);

  const total = items.reduce((sum, it) => {
    const unitPrice = getDiscount(it.price ?? 0, Number(it.discountPercentage ?? 0));
    return sum + unitPrice * (it.quantity ?? 1);
  }, 0);

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    const handleEsc   = (e) => { if (e.key === "Escape") onClose(); };
    if (open) {
      document.addEventListener("mousedown", handleClick);
      document.addEventListener("keydown", handleEsc);
    }
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className={`absolute top-full z-50 mt-3 flex w-80 flex-col overflow-hidden border border-[var(--border)] ${
        anchorRight ? "right-0" : "left-0"
      }`}
      style={{ background: "var(--bg-page)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[var(--text-main)]">
          Carrito
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar carrito"
          className="text-[var(--text-soft)] transition-opacity hover:opacity-50"
        >
          <X size={14} />
        </button>
      </div>

      {/* Items */}
      <div className="max-h-[52vh] overflow-y-auto">
        {items.length === 0 ? (
          <p className="px-5 py-8 text-center text-xs text-[var(--text-soft)]">
            Tu carrito está vacío
          </p>
        ) : (
          <ul className="divide-y divide-[var(--border)]">
            {items.map((it) => {
              const qty       = it.quantity ?? 1;
              const unitPrice = getDiscount(it.price ?? 0, Number(it.discountPercentage ?? 0));

              return (
                <li key={it.id} className="flex gap-4 px-5 py-4">
                  {/* Imagen */}
                  <img
                    src={it.image}
                    alt={it.title}
                    className="h-16 w-12 shrink-0 object-cover"
                  />

                  {/* Info */}
                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--text-soft)]">
                        {it.categories?.[0]?.name ?? "M4RS"}
                      </p>
                      <p className="mt-0.5 truncate text-xs font-medium text-[var(--text-main)]">
                        {it.title}
                      </p>
                      <p className="mt-0.5 text-xs text-[var(--text-soft)]">
                        {formatCurrency(unitPrice)} c/u
                      </p>
                    </div>

                    {/* Cantidad */}
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center border border-[var(--border)]">
                        <button
                          type="button"
                          onClick={() => removeOne(it.id)}
                          aria-label="Disminuir"
                          className="flex h-7 w-7 items-center justify-center text-[var(--text-soft)] transition-opacity hover:opacity-50"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="w-7 text-center text-xs font-medium text-[var(--text-main)]">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => addItem(it, 1)}
                          aria-label="Aumentar"
                          className="flex h-7 w-7 items-center justify-center text-[var(--text-soft)] transition-opacity hover:opacity-50"
                        >
                          <Plus size={11} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(it.id)}
                        className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--text-soft)] transition-opacity hover:opacity-50"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <p className="shrink-0 text-xs font-medium text-[var(--text-main)]">
                    {formatCurrency(unitPrice * qty)}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Footer */}
      {items.length > 0 && (
        <div className="border-t border-[var(--border)] px-5 py-4">
          {/* Total */}
          <div className="mb-4 flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[var(--text-soft)]">
              Total
            </span>
            <span className="text-sm font-light text-[var(--text-main)]">
              {formatCurrency(total)}
            </span>
          </div>

          {/* CTAs */}
          <div className="flex gap-2">
            <Link
              to="/carrito"
              onClick={onClose}
              className="flex h-9 flex-1 items-center justify-center border border-[var(--border)] text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-main)] no-underline transition-opacity hover:opacity-60"
            >
              Ver carrito
            </Link>
            <Link
              to="/checkout"
              onClick={onClose}
              className="flex h-9 flex-1 items-center justify-center border border-[var(--text-main)] bg-[var(--text-main)] text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--bg-page)] no-underline transition-opacity hover:opacity-80"
            >
              Comprar
            </Link>
          </div>

          <button
            type="button"
            onClick={() => { clearCart(); onClose(); }}
            className="mt-3 w-full text-center text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--text-soft)] transition-opacity hover:opacity-50"
          >
            Vaciar carrito
          </button>
        </div>
      )}
    </div>
  );
}

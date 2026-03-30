"use client";

import { X, Plus, Minus, Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import useCartStore from "../../hooks/useCarritoStore"; // o "@/stores/useCartStore"
import { getDiscount } from "../../utils/getDiscount";

function formatCurrency(n) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);
}

export default function CartDropdown({ open, onClose, anchorRight = true }) {
  const ref = useRef(null);

  const items = useCartStore((s) => s.items ?? []);
  const addItem = useCartStore((s) => s.addItem ?? ((p) => {}));
  const removeOne = useCartStore((s) => s.removeOne ?? ((id) => {}));
  const removeItem = useCartStore((s) => s.removeItem ?? ((id) => {}));
  const clearCart = useCartStore((s) => s.clearCart ?? (() => {}));

  const total = items.reduce((sum, it) => {
    const discount = Number(it.discountPercentage ?? 0);
    const unitPrice = getDiscount(it.price ?? 0, discount);
    return sum + unitPrice * (it.quantity ?? 1);
  }, 0);

  // cerrar al click afuera / ESC
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    function handleEsc(e) {
      if (e.key === "Escape") onClose();
    }
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
      className={`theme-panel absolute top-full z-50 mt-2 max-h-[70vh] w-[360px] overflow-auto text-[var(--text-main)] ${
        anchorRight ? "right-0" : "left-0"
      }`}
    >
      <div className="theme-border flex items-center justify-between border-b px-4 py-3">
        <h3 className="font-semibold text-sm">Tu carrito</h3>
        <button className="theme-panel-soft rounded p-1" aria-label="Cerrar carrito">
          <X onClick={onClose} size={18} />
        </button>
      </div>

      <ul className="theme-border divide-y">
        {items.length === 0 ? (
          <li className="theme-muted px-4 py-6 text-sm">El carrito está vacío</li>
        ) : (
          items.map((it) => {
            const discount = Number(it.discountPercentage ?? 0);
            const quantity = it.quantity ?? 1;
            const hasDiscount = discount > 0;
            const unitPrice = getDiscount(it.price ?? 0, discount);
            const subtotal = unitPrice * quantity;

            return (
              <li key={it.id} className="px-4 py-3 flex items-center gap-3">
                <img
                  src={it.image ?? "/images/placeholder.jpg"}
                  alt={it.title}
                  className="theme-panel-soft h-14 w-14 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{it.title}</div>
                  <div className="theme-muted text-xs truncate">
                    {it.categories?.map((c) => c.name).join(", ")}
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    {/* Controles cantidad */}
                    <div className="theme-border inline-flex items-center overflow-hidden rounded-lg ring-1">
                      <button
                        className="h-8 w-8 grid place-items-center transition hover:bg-[var(--accent-soft)]"
                        onClick={() => removeOne(it.id)}
                        aria-label="Disminuir cantidad"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center text-sm font-medium select-none">{it.quantity ?? 1}</span>
                      <button
                        className="h-8 w-8 grid place-items-center transition hover:bg-[var(--accent-soft)]"
                        onClick={() => addItem(it, 1)}
                        aria-label="Aumentar cantidad"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* precio por unidad y subtotal */}
                    <div className="ml-auto text-right">
                      {hasDiscount ? (
                        <>
                          <div className="theme-soft-text text-xs line-through">
                            {formatCurrency(it.price ?? 0)} c/u
                          </div>
                          <div className="theme-accent-text text-sm font-semibold">
                            {formatCurrency(unitPrice)} c/u (-{Math.round(discount)}%)
                          </div>
                        </>
                      ) : (
                        <div className="text-sm font-semibold">{formatCurrency(unitPrice)} c/u</div>
                      )}
                      <div className="theme-muted text-xs">Subtotal {formatCurrency(subtotal)}</div>
                    </div>
                  </div>
                </div>

                <button
                  className="theme-muted rounded-lg p-2 transition hover:bg-[var(--danger-soft)] hover:text-red-500"
                  onClick={() => removeItem(it.id)}
                  aria-label="Quitar producto"
                  title="Quitar producto"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            );
          })
        )}
      </ul>

      <div className="theme-border border-t px-4 py-3">
        <div className="flex items-center justify-between text-sm">
          <span className="theme-muted">Total</span>
          <span className="font-semibold">{formatCurrency(total)}</span>
        </div>
        <div className="mt-3 flex gap-2">
          <Link
            to="/carrito"
            className="theme-button-secondary flex-1 h-10 inline-flex items-center justify-center cursor-pointer no-underline"
            onClick={onClose}
          >
            Ver carrito
          </Link>
          <Link
            to="/checkout"
            className="theme-button-primary flex-1 h-10 inline-flex items-center justify-center cursor-pointer no-underline"
            onClick={onClose}
          >
            Comprar
          </Link>
        </div>
        <button
          onClick={() => {
            clearCart();
            onClose();
          }}
          className="theme-muted mt-2 w-full text-xs transition hover:text-[var(--accent)]"
        >
          Vaciar carrito
        </button>
      </div>
    </div>
  );
}

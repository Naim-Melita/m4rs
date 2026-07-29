import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Package } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/footer";
import { useAuth } from "../context/AuthContext";
import { getMyOrders } from "../api/orders";

const STATUS = {
  IN_PREPARATION: { label: "En preparación", color: "text-yellow-500" },
  READY:          { label: "Listo para enviar", color: "text-blue-400" },
  SHIPPED:        { label: "Enviado", color: "text-purple-400" },
  DELIVERED:      { label: "Entregado", color: "text-green-500" },
  CANCELLED:      { label: "Cancelado", color: "text-red-400" },
};

// Pasos del timeline en orden
const STEPS = ["IN_PREPARATION", "READY", "SHIPPED", "DELIVERED"];

const formatCurrency = (n) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);

const formatDate = (d) =>
  new Date(d).toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" });

function StatusTimeline({ status }) {
  if (status === "CANCELLED") {
    return (
      <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-red-400">
        Pedido cancelado
      </p>
    );
  }

  const current = STEPS.indexOf(status);

  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, i) => {
        const done    = i <= current;
        const isLast  = i === STEPS.length - 1;
        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full border text-[9px] font-bold transition-colors ${
                  done
                    ? "border-[var(--text-main)] bg-[var(--text-main)] text-[var(--bg-page)]"
                    : "border-[var(--border)] text-[var(--text-soft)]"
                }`}
              >
                {i + 1}
              </div>
              <p className={`mt-1 hidden w-20 text-center text-[9px] uppercase tracking-wide sm:block ${
                done ? "text-[var(--text-main)]" : "text-[var(--text-soft)]"
              }`}>
                {STATUS[step].label}
              </p>
            </div>
            {!isLast && (
              <div className={`mx-1 mb-5 h-px w-8 sm:w-12 transition-colors ${
                i < current ? "bg-[var(--text-main)]" : "bg-[var(--border)]"
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function MyOrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate  = useNavigate();
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/"); return; }
    getMyOrders()
      .then((d) => { setOrders(d.orders); setExpanded(d.orders[0]?.id ?? null); })
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
      <Header darkOnTop />

      <main className="mx-auto max-w-3xl px-6 pb-24 pt-28 sm:px-10">
        <div className="mb-12">
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[var(--text-soft)]">M4RS</p>
          <h1 className="mt-2 text-2xl font-light text-[var(--text-main)]">Mis pedidos</h1>
        </div>

        {loading ? (
          <p className="text-xs text-[var(--text-soft)]">Cargando...</p>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <Package className="mb-5 size-8 text-[var(--text-soft)]" strokeWidth={1} />
            <p className="text-sm font-light text-[var(--text-muted)]">Todavía no hiciste ningún pedido.</p>
            <Link
              to="/"
              className="mt-7 border-b border-[var(--text-main)] pb-0.5 text-[10px] font-semibold uppercase tracking-[0.35em] text-[var(--text-main)] no-underline transition-opacity hover:opacity-50"
            >
              Explorar colección
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const info = STATUS[order.status] ?? STATUS.IN_PREPARATION;
              const open = expanded === order.id;
              return (
                <div key={order.id} className="border border-[var(--border)]">

                  {/* Header de la orden */}
                  <button
                    type="button"
                    onClick={() => setExpanded(open ? null : order.id)}
                    className="flex w-full items-start justify-between px-6 py-5 text-left transition-opacity hover:opacity-70"
                  >
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--text-soft)]">
                        {formatDate(order.createdAt)}
                      </p>
                      <p className="mt-1 text-sm font-medium text-[var(--text-main)]">
                        {order.items.length} {order.items.length === 1 ? "producto" : "productos"} · {formatCurrency(order.total)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-semibold uppercase tracking-[0.25em] ${info.color}`}>
                        {info.label}
                      </span>
                      <span className="text-lg font-light text-[var(--text-soft)]">
                        {open ? "−" : "+"}
                      </span>
                    </div>
                  </button>

                  {/* Detalle */}
                  {open && (
                    <div className="border-t border-[var(--border)] px-6 py-6 space-y-8">

                      {/* Timeline */}
                      <div>
                        <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.35em] text-[var(--text-soft)]">
                          Estado del pedido
                        </p>
                        <StatusTimeline status={order.status} />
                      </div>

                      {/* Productos */}
                      <div>
                        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.35em] text-[var(--text-soft)]">
                          Productos
                        </p>
                        <ul className="divide-y divide-[var(--border)]">
                          {order.items.map((item) => (
                            <li key={item.id} className="flex justify-between py-3 text-xs text-[var(--text-main)]">
                              <span>
                                {item.name}
                                {item.size ? <span className="text-[var(--text-soft)]"> — {item.size}</span> : null}
                                <span className="text-[var(--text-soft)]"> × {item.quantity}</span>
                              </span>
                              <span>{formatCurrency(item.totalPrice)}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-3 flex justify-between border-t border-[var(--border)] pt-3 text-xs">
                          <span className="text-[var(--text-soft)]">Envío</span>
                          <span className="text-[var(--text-main)]">
                            {order.shippingCost === 0 ? "Gratis" : formatCurrency(order.shippingCost)}
                          </span>
                        </div>
                        <div className="mt-2 flex justify-between text-sm font-medium text-[var(--text-main)]">
                          <span>Total</span>
                          <span>{formatCurrency(order.total)}</span>
                        </div>
                      </div>

                      {/* Entrega */}
                      <div>
                        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-[var(--text-soft)]">
                          Dirección de entrega
                        </p>
                        <p className="text-xs text-[var(--text-main)]">{order.address}</p>
                        {order.notes && (
                          <p className="mt-1 text-xs text-[var(--text-soft)]">Nota: {order.notes}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

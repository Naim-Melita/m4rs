import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { getAdminOrders, updateOrderStatus } from "../../api/admin";
import { useToast } from "../../context/ToastContext";
import { AdminPage, PageHeader } from "../../components/admin/AdminPage";

const STATUS = {
  IN_PREPARATION: { label: "En preparación", color: "text-yellow-500" },
  READY:          { label: "Listo para enviar", color: "text-blue-400" },
  SHIPPED:        { label: "Enviado",           color: "text-purple-400" },
  DELIVERED:      { label: "Entregado",         color: "text-green-500" },
  CANCELLED:      { label: "Cancelado",         color: "text-red-400" },
};

const formatCurrency = (n) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);

const formatDate = (d) =>
  new Date(d).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

function buildWAContactUrl(phone, name) {
  const clean = phone?.replace(/\D/g, "") ?? "";
  const number = clean.startsWith("54") ? clean : `54${clean}`;
  const text = encodeURIComponent(`Hola ${name}, te contactamos desde M4RS por tu pedido.`);
  return `https://wa.me/${number}?text=${text}`;
}

export default function AdminOrders() {
  const toast = useToast();
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    getAdminOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  const handleStatus = async (id, status) => {
    try {
      const updated = await updateOrderStatus(id, status);
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: updated.status } : o)));
      toast("Estado actualizado", { type: "success" });
    } catch {
      toast("Error al actualizar estado", { type: "error" });
    }
  };

  return (
    <AdminPage>
      <PageHeader title="Órdenes" meta={!loading ? `${orders.length} total` : undefined} />

      {loading ? (
        <p className="text-xs text-[var(--text-soft)]">Cargando...</p>
      ) : orders.length === 0 ? (
        <p className="text-xs text-[var(--text-soft)]">No hay órdenes todavía.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const info = STATUS[order.status] ?? STATUS.IN_PREPARATION;
            const open = expanded === order.id;

            return (
              <div key={order.id} className="border border-[var(--border)]">

                {/* Header */}
                <button
                  type="button"
                  onClick={() => setExpanded(open ? null : order.id)}
                  className="flex w-full items-start justify-between gap-4 px-4 py-4 text-left transition-opacity hover:opacity-70 md:items-center md:px-6"
                >
                  <div className="flex min-w-0 flex-1 items-start gap-8">
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--text-soft)]">
                        {formatDate(order.createdAt)}
                      </p>
                      <p className="mt-0.5 truncate text-sm font-medium text-[var(--text-main)]">
                        {order.firstName} {order.lastName}
                      </p>
                      <p className="truncate text-[11px] text-[var(--text-soft)]">{order.email}</p>

                      {/* Estado y total bajan acá en mobile */}
                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 md:hidden">
                        <span className={`text-[10px] font-semibold uppercase tracking-[0.25em] ${info.color}`}>
                          {info.label}
                        </span>
                        <span className="text-[11px] text-[var(--text-main)]">
                          {formatCurrency(order.total)}
                        </span>
                      </div>
                    </div>

                    <div className="hidden md:block">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--text-soft)]">Total</p>
                      <p className="mt-0.5 text-sm text-[var(--text-main)]">{formatCurrency(order.total)}</p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-4">
                    <span className={`hidden text-[10px] font-semibold uppercase tracking-[0.25em] md:inline ${info.color}`}>
                      {info.label}
                    </span>
                    <span className="text-lg leading-none text-[var(--text-soft)]">{open ? "−" : "+"}</span>
                  </div>
                </button>

                {/* Detalle expandido */}
                {open && (
                  <div className="border-t border-[var(--border)] px-4 py-5 md:px-6">
                    <div className="grid gap-8 md:grid-cols-2">

                      {/* Productos */}
                      <div>
                        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.35em] text-[var(--text-soft)]">
                          Productos
                        </p>
                        <ul className="space-y-2">
                          {order.items.map((item) => (
                            <li key={item.id} className="flex justify-between text-xs text-[var(--text-main)]">
                              <span>
                                {item.name}
                                {item.size ? ` — ${item.size}` : ""} × {item.quantity}
                              </span>
                              <span>{formatCurrency(item.totalPrice)}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-3 flex justify-between border-t border-[var(--border)] pt-3 text-xs text-[var(--text-soft)]">
                          <span>Envío</span>
                          <span>{order.shippingCost === 0 ? "Gratis" : formatCurrency(order.shippingCost)}</span>
                        </div>
                        <div className="mt-2 flex justify-between text-xs font-semibold text-[var(--text-main)]">
                          <span>Total</span>
                          <span>{formatCurrency(order.total)}</span>
                        </div>
                      </div>

                      {/* Datos + acciones */}
                      <div className="space-y-5">

                        {/* Entrega */}
                        <div>
                          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-[var(--text-soft)]">
                            Entrega
                          </p>
                          <p className="text-xs text-[var(--text-main)]">{order.address}</p>
                          <p className="text-xs text-[var(--text-soft)]">{order.phone}</p>
                          {order.notes && (
                            <p className="mt-1 text-xs text-[var(--text-soft)]">Nota: {order.notes}</p>
                          )}
                        </div>

                        {/* Contactar */}
                        <a
                          href={buildWAContactUrl(order.phone, order.firstName)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex w-full items-center justify-center gap-2 border border-[var(--border)] px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-main)] no-underline transition-opacity hover:opacity-50 md:inline-flex md:w-auto md:py-2.5"
                        >
                          <MessageCircle className="size-3.5" />
                          Contactar por WhatsApp
                        </a>

                        {/* Cambiar estado */}
                        <div>
                          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-[var(--text-soft)]">
                            Estado del pedido
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(STATUS).map(([key, val]) => (
                              <button
                                key={key}
                                type="button"
                                onClick={() => handleStatus(order.id, key)}
                                className={`border px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors md:py-1.5 ${
                                  order.status === key
                                    ? "border-[var(--text-main)] bg-[var(--text-main)] text-[var(--bg-page)]"
                                    : "border-[var(--border)] text-[var(--text-soft)] hover:border-[var(--text-main)] hover:text-[var(--text-main)]"
                                }`}
                              >
                                {val.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </AdminPage>
  );
}

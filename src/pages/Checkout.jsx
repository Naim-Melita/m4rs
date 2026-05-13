import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/footer";
import AuthModal from "../components/auth/AuthModal";
import useCartStore from "../hooks/useCarritoStore";
import { getDiscount } from "../utils/getDiscount";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../api/auth";

// ── MP (comentado hasta terminar integración) ──────────────
// import PaymentBrick from "../components/checkout/PaymentBrick";
// import WalletBrick  from "../components/checkout/WalletBrick";
// import { processPayment } from "../api/payments";

const formatCurrency = (value) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);

const inputClass =
  "w-full border-b border-[var(--border)] bg-transparent py-3 text-sm text-[var(--text-main)] placeholder:text-[var(--text-soft)] outline-none transition-colors focus:border-[var(--text-main)]";

const Field = ({ label, children }) => (
  <label className="block">
    <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.35em] text-[var(--text-soft)]">
      {label}
    </span>
    {children}
  </label>
);

// ─────────────────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  const items    = useCartStore((s) => s.items ?? []);
  const clearCart = useCartStore((s) => s.clearCart);

  const [contact, setContact] = useState({
    firstName: user?.firstName ?? "",
    lastName:  user?.lastName  ?? "",
    email:     user?.email     ?? "",
    phone:     user?.phone     ?? "",
    address:   user?.address   ?? "",
    notes:     "",
  });

  // Cuando el usuario termina de cargar, rellena el form con sus datos
  useEffect(() => {
    if (!user) return;
    setContact((prev) => ({
      firstName: prev.firstName || user.firstName || "",
      lastName:  prev.lastName  || user.lastName  || "",
      email:     prev.email     || user.email     || "",
      phone:     prev.phone     || user.phone     || "",
      address:   prev.address   || user.address   || "",
      notes:     prev.notes,
    }));
  }, [user]);

  const handleChange = (e) =>
    setContact((p) => ({ ...p, [e.target.name]: e.target.value }));

  const subtotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        const price = getDiscount(item.price ?? 0, Number(item.discountPercentage ?? 0));
        return sum + price * (item.quantity ?? 1);
      }, 0),
    [items]
  );

  const shipping = items.length > 0 && subtotal < 80000 ? 6500 : 0;
  const total    = subtotal + shipping;
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER?.replace(/\D/g, "");

  const buildMessage = () => {
    const lines = [
      "Hola M4RS, quiero confirmar este pedido:",
      "",
      `Nombre: ${contact.firstName} ${contact.lastName}`,
      `Email: ${contact.email}`,
      `Teléfono: ${contact.phone}`,
      `Dirección: ${contact.address}`,
    ];
    if (contact.notes.trim()) lines.push(`Notas: ${contact.notes.trim()}`);
    lines.push("", "Productos:");
    items.forEach((item) => {
      const qty       = item.quantity ?? 1;
      const unitPrice = getDiscount(item.price ?? 0, Number(item.discountPercentage ?? 0));
      lines.push(`- ${item.title} x${qty} | ${formatCurrency(unitPrice * qty)}`);
    });
    lines.push("", `Subtotal: ${formatCurrency(subtotal)}`);
    lines.push(`Envío: ${shipping === 0 ? "Gratis" : formatCurrency(shipping)}`);
    lines.push(`Total: ${formatCurrency(total)}`);
    return lines.join("\n");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Guardar teléfono y dirección en el perfil
    updateProfile({
      firstName: contact.firstName,
      lastName:  contact.lastName,
      phone:     contact.phone,
      address:   contact.address,
    }).catch(() => {});

    const message = encodeURIComponent(buildMessage());
    const url = whatsappNumber
      ? `https://wa.me/${whatsappNumber}?text=${message}`
      : `https://wa.me/?text=${message}`;

    clearCart();
    window.location.href = url;
  };

  // ── Auth gate ─────────────────────────────────────────────
  if (!authLoading && !user) {
    return (
      <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
        <Header darkOnTop />
        <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[var(--text-soft)]">
            M4RS
          </p>
          <h2 className="mt-3 text-xl font-light text-[var(--text-main)]">
            Iniciá sesión para continuar
          </h2>
          <p className="mt-3 max-w-xs text-xs text-[var(--text-soft)]">
            Necesitás una cuenta para completar tu compra.
          </p>
          <button
            type="button"
            onClick={() => setAuthOpen(true)}
            className="mt-8 border border-[var(--text-main)] bg-[var(--text-main)] px-10 py-3.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--bg-page)] transition-opacity hover:opacity-80"
          >
            Iniciar sesión
          </button>
          <Link
            to="/"
            className="mt-6 border-b border-[var(--text-soft)] pb-0.5 text-[10px] font-semibold uppercase tracking-[0.35em] text-[var(--text-soft)] no-underline transition-opacity hover:opacity-50"
          >
            Volver al inicio
          </Link>
        </main>
        <Footer />
        <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      </div>
    );
  }

  // ── Carrito vacío ─────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
        <Header darkOnTop />
        <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
          <ShoppingBag className="mb-6 size-8 text-[var(--text-soft)]" strokeWidth={1} />
          <p className="text-sm font-light text-[var(--text-muted)]">
            No hay productos para pagar
          </p>
          <Link
            to="/"
            className="mt-8 border-b border-[var(--text-main)] pb-0.5 text-[10px] font-semibold uppercase tracking-[0.35em] text-[var(--text-main)] no-underline transition-opacity hover:opacity-50"
          >
            Explorar colección
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Checkout ──────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
      <Header darkOnTop />

      <main className="mx-auto max-w-6xl px-6 pb-24 pt-24 sm:px-10 lg:px-16">

        <div className="mb-14">
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[var(--text-soft)]">
            M4RS
          </p>
          <h1 className="mt-2 text-2xl font-light tracking-wide text-[var(--text-main)] md:text-3xl">
            Confirmar pedido
          </h1>
        </div>

        <div className="grid gap-16 lg:grid-cols-[1fr_340px] lg:items-start">

          {/* ── Formulario ──────────────────────────────── */}
          <form onSubmit={handleSubmit} className="space-y-12">

            <div>
              <p className="mb-8 text-[10px] font-semibold uppercase tracking-[0.4em] text-[var(--text-soft)]">
                Datos de contacto
              </p>
              <div className="grid gap-8 md:grid-cols-2">
                <Field label="Nombre">
                  <input
                    required
                    name="firstName"
                    value={contact.firstName}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </Field>
                <Field label="Apellido">
                  <input
                    required
                    name="lastName"
                    value={contact.lastName}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </Field>
                <Field label="Email">
                  <input
                    required
                    type="email"
                    name="email"
                    value={contact.email}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </Field>
                <Field label="Teléfono">
                  <input
                    required
                    name="phone"
                    value={contact.phone}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </Field>
                <Field label="Dirección de entrega">
                  <input
                    required
                    name="address"
                    value={contact.address}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </Field>
              </div>
            </div>

            <div>
              <p className="mb-8 text-[10px] font-semibold uppercase tracking-[0.4em] text-[var(--text-soft)]">
                Notas del pedido
              </p>
              <Field label="Opcional">
                <textarea
                  name="notes"
                  rows={3}
                  value={contact.notes}
                  onChange={handleChange}
                  placeholder="Horarios, aclaraciones o referencias de entrega."
                  className={`${inputClass} resize-none`}
                />
              </Field>
            </div>

            <div className="space-y-3 border-t border-[var(--border)] pt-8">
              {[
                "Envíos a todo el país con seguimiento del pedido.",
                "Te contactamos para coordinar el pago y la entrega.",
                "Tu información no sale del flujo del sitio.",
              ].map((text) => (
                <p key={text} className="flex items-start gap-3 text-xs text-[var(--text-soft)]">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--text-soft)]" />
                  {text}
                </p>
              ))}
            </div>

            <button
              type="submit"
              className="block w-full border border-[var(--text-main)] bg-[var(--text-main)] py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--bg-page)] transition-opacity hover:opacity-80"
            >
              Confirmar pedido vía WhatsApp
            </button>
          </form>

          {/* ── Resumen ─────────────────────────────────── */}
          <aside className="lg:sticky lg:top-24">
            <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.4em] text-[var(--text-soft)]">
              Tu pedido
            </p>

            <div className="border-t border-[var(--border)]">
              {items.map((item) => {
                const qty       = item.quantity ?? 1;
                const unitPrice = getDiscount(item.price ?? 0, Number(item.discountPercentage ?? 0));
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 border-b border-[var(--border)] py-4"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-16 w-14 shrink-0 object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-[var(--text-main)]">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-[10px] text-[var(--text-soft)]">
                        Cantidad: {qty}
                      </p>
                    </div>
                    <p className="shrink-0 text-xs font-medium text-[var(--text-main)]">
                      {formatCurrency(unitPrice * qty)}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                <span>Envío</span>
                <span>{shipping === 0 ? "Gratis" : formatCurrency(shipping)}</span>
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

            <Link
              to="/carrito"
              className="mt-8 block text-center text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--text-soft)] no-underline transition-opacity hover:opacity-50"
            >
              ← Volver al carrito
            </Link>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

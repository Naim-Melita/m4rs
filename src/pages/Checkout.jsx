import { useMemo, useState } from "react";
import { CreditCard, MapPin, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
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

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items ?? []);
  const clearCart = useCartStore((state) => state.clearCart);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });

  const subtotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        const price = getDiscount(
          item.price ?? 0,
          Number(item.discountPercentage ?? 0)
        );
        return sum + price * (item.quantity ?? 1);
      }, 0),
    [items]
  );

  const shipping = items.length > 0 && subtotal < 80000 ? 6500 : 0;
  const total = subtotal + shipping;
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER?.replace(/\D/g, "");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const buildWhatsappMessage = () => {
    const lines = [
      "Hola M4RS, quiero confirmar este pedido:",
      "",
      "Cliente:",
      `Nombre: ${formData.fullName}`,
      `Email: ${formData.email}`,
      `Telefono: ${formData.phone}`,
      `Direccion: ${formData.address}`,
    ];

    if (formData.notes.trim()) {
      lines.push(`Notas: ${formData.notes.trim()}`);
    }

    lines.push("", "Productos:");

    items.forEach((item) => {
      const quantity = item.quantity ?? 1;
      const unitPrice = getDiscount(
        item.price ?? 0,
        Number(item.discountPercentage ?? 0)
      );
      const lineTotal = unitPrice * quantity;
      lines.push(`- ${item.title} x${quantity} | ${formatCurrency(lineTotal)}`);
    });

    lines.push("");
    lines.push(`Subtotal: ${formatCurrency(subtotal)}`);
    lines.push(`Envio: ${shipping === 0 ? "Gratis" : formatCurrency(shipping)}`);
    lines.push(`Total: ${formatCurrency(total)}`);

    return lines.join("\n");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const message = encodeURIComponent(buildWhatsappMessage());
    const whatsappUrl = whatsappNumber
      ? `https://wa.me/${whatsappNumber}?text=${message}`
      : `https://wa.me/?text=${message}`;

    clearCart();
    window.location.href = whatsappUrl;
  };

  return (
    <div className="theme-page min-h-screen">
      <Header darkOnTop />
      <main className="pb-16 pt-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {items.length === 0 ? (
            <section className="grid min-h-[60vh] place-items-center">
              <div className="theme-panel max-w-xl rounded-[2rem] p-10 text-center">
                <h1 className="text-3xl font-semibold tracking-tight">
                  No hay productos para pagar
                </h1>
                <p className="theme-muted mt-4 text-sm leading-relaxed">
                  Tu carrito está vacío. Agregá productos antes de pasar al
                  checkout.
                </p>
                <Link
                  to="/"
                  className="theme-button-primary mt-8 inline-flex rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-wide no-underline"
                >
                  Explorar productos
                </Link>
              </div>
            </section>
          ) : (
            <section className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.8fr)]">
              <div>
                <p className="theme-eyebrow text-xs font-semibold uppercase tracking-[0.35em]">
                  M4RS
                </p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
                  Checkout
                </h1>
                <p className="theme-muted mt-3 max-w-2xl text-sm md:text-base">
                  Completá tus datos para cerrar el pedido manteniendo la misma
                  identidad visual en ambos modos.
                </p>

                {!whatsappNumber ? (
                  <p className="mt-4 rounded-2xl border border-[var(--border-strong)] bg-[var(--accent-soft)] px-4 py-3 text-sm text-[var(--text-main)]">
                    No hay un número configurado en `VITE_WHATSAPP_NUMBER`. Se
                    abrirá WhatsApp con el mensaje precargado para compartirlo.
                  </p>
                ) : null}

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="block">
                      <span className="theme-muted mb-2 block text-xs font-semibold uppercase tracking-wide">
                        Nombre completo
                      </span>
                      <input
                        required
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="theme-input h-12 w-full rounded-2xl px-4 text-sm transition"
                      />
                    </label>
                    <label className="block">
                      <span className="theme-muted mb-2 block text-xs font-semibold uppercase tracking-wide">
                        Email
                      </span>
                      <input
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="theme-input h-12 w-full rounded-2xl px-4 text-sm transition"
                      />
                    </label>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="block">
                      <span className="theme-muted mb-2 block text-xs font-semibold uppercase tracking-wide">
                        Teléfono
                      </span>
                      <input
                        required
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="theme-input h-12 w-full rounded-2xl px-4 text-sm transition"
                      />
                    </label>
                    <label className="block">
                      <span className="theme-muted mb-2 block text-xs font-semibold uppercase tracking-wide">
                        Dirección
                      </span>
                      <input
                        required
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="theme-input h-12 w-full rounded-2xl px-4 text-sm transition"
                      />
                    </label>
                  </div>

                  <label className="block">
                    <span className="theme-muted mb-2 block text-xs font-semibold uppercase tracking-wide">
                      Notas del pedido
                    </span>
                    <textarea
                      name="notes"
                      rows="5"
                      value={formData.notes}
                      onChange={handleChange}
                      className="theme-input w-full rounded-[1.5rem] px-4 py-3 text-sm transition"
                      placeholder="Opcional: horarios, aclaraciones o referencias de entrega."
                    />
                  </label>

                  <button
                    type="submit"
                    className="theme-button-primary inline-flex h-12 w-full items-center justify-center rounded-full px-6 text-sm font-semibold uppercase tracking-wide"
                  >
                    Confirmar pedido
                  </button>
                </form>
              </div>

              <aside className="lg:sticky lg:top-28">
                <div className="theme-panel rounded-[2rem] p-6">
                  <h2 className="text-xl font-semibold text-[var(--text-main)]">
                    Resumen del pedido
                  </h2>

                  <div className="mt-6 space-y-4">
                    {items.map((item) => {
                      const quantity = item.quantity ?? 1;
                      const unitPrice = getDiscount(
                        item.price ?? 0,
                        Number(item.discountPercentage ?? 0)
                      );

                      return (
                        <div
                          key={item.id}
                          className="theme-panel-soft flex items-center gap-3 rounded-2xl p-3"
                        >
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-16 w-16 rounded-xl object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-[var(--text-main)]">
                              {item.title}
                            </p>
                            <p className="theme-muted mt-1 text-xs">
                              Cantidad {quantity}
                            </p>
                          </div>
                          <p className="text-sm font-semibold text-[var(--text-main)]">
                            {formatCurrency(unitPrice * quantity)}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="theme-muted theme-border mt-6 space-y-4 border-t pt-5 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Subtotal</span>
                      <span className="font-medium text-[var(--text-main)]">
                        {formatCurrency(subtotal)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Envío</span>
                      <span className="font-medium text-[var(--text-main)]">
                        {shipping === 0 ? "Gratis" : formatCurrency(shipping)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-base font-semibold text-[var(--text-main)]">
                      <span>Total</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>

                  <div className="theme-muted mt-6 space-y-3 text-sm">
                    <div className="theme-panel-soft flex items-start gap-3 rounded-2xl p-4">
                      <CreditCard className="mt-0.5 size-4 text-[var(--accent)]" />
                      <p>Pagos protegidos y cuotas con tarjetas seleccionadas.</p>
                    </div>
                    <div className="theme-panel-soft flex items-start gap-3 rounded-2xl p-4">
                      <MapPin className="mt-0.5 size-4 text-[var(--accent)]" />
                      <p>Envíos a todo el país con seguimiento del pedido.</p>
                    </div>
                    <div className="theme-panel-soft flex items-start gap-3 rounded-2xl p-4">
                      <ShieldCheck className="mt-0.5 size-4 text-[var(--accent)]" />
                      <p>Tu información queda contenida dentro del flujo del sitio.</p>
                    </div>
                  </div>
                </div>
              </aside>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

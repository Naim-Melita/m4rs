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
    <div className="min-h-screen bg-white text-neutral-900">
      <Header darkOnTop />
      <main className="pb-16 pt-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {items.length === 0 ? (
            <section className="grid min-h-[60vh] place-items-center">
              <div className="max-w-xl rounded-[2rem] border border-neutral-200 bg-neutral-50 p-10 text-center">
                <h1 className="text-3xl font-semibold tracking-tight">
                  No hay productos para pagar
                </h1>
                <p className="mt-4 text-sm leading-relaxed text-neutral-500">
                  Tu carrito está vacío. Agregá productos antes de pasar al
                  checkout.
                </p>
                <Link
                  to="/"
                  className="mt-8 inline-flex rounded-full bg-black px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white no-underline transition hover:bg-neutral-900"
                >
                  Explorar productos
                </Link>
              </div>
            </section>
          ) : (
            <section className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.8fr)]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-neutral-400">
                  M4RS
                </p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
                  Checkout
                </h1>
                <p className="mt-3 max-w-2xl text-sm text-neutral-500 md:text-base">
                  Completá tus datos para cerrar el pedido con el mismo lenguaje
                  limpio y directo del resto del sitio.
                </p>
                {!whatsappNumber ? (
                  <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    No hay un número configurado en `VITE_WHATSAPP_NUMBER`. Se
                    abrirá WhatsApp con el mensaje precargado para compartirlo.
                  </p>
                ) : null}

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
                        Nombre completo
                      </span>
                      <input
                        required
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="h-12 w-full rounded-2xl border border-neutral-300 px-4 text-sm outline-none transition focus:border-neutral-800"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
                        Email
                      </span>
                      <input
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="h-12 w-full rounded-2xl border border-neutral-300 px-4 text-sm outline-none transition focus:border-neutral-800"
                      />
                    </label>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
                        Teléfono
                      </span>
                      <input
                        required
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="h-12 w-full rounded-2xl border border-neutral-300 px-4 text-sm outline-none transition focus:border-neutral-800"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
                        Dirección
                      </span>
                      <input
                        required
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="h-12 w-full rounded-2xl border border-neutral-300 px-4 text-sm outline-none transition focus:border-neutral-800"
                      />
                    </label>
                  </div>

                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
                      Notas del pedido
                    </span>
                    <textarea
                      name="notes"
                      rows="5"
                      value={formData.notes}
                      onChange={handleChange}
                      className="w-full rounded-[1.5rem] border border-neutral-300 px-4 py-3 text-sm outline-none transition focus:border-neutral-800"
                      placeholder="Opcional: horarios, aclaraciones o referencias de entrega."
                    />
                  </label>

                  <button
                    type="submit"
                    className="inline-flex h-12 w-full items-center justify-center rounded-full bg-black px-6 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-neutral-900"
                  >
                    Confirmar pedido
                  </button>
                </form>
              </div>

              <aside className="lg:sticky lg:top-28">
                <div className="rounded-[2rem] border border-neutral-200 bg-neutral-50 p-6 shadow-sm shadow-neutral-100">
                  <h2 className="text-xl font-semibold text-neutral-900">
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
                          className="flex items-center gap-3 rounded-2xl bg-white p-3 ring-1 ring-neutral-200/70"
                        >
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-16 w-16 rounded-xl object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-neutral-900">
                              {item.title}
                            </p>
                            <p className="mt-1 text-xs text-neutral-500">
                              Cantidad {quantity}
                            </p>
                          </div>
                          <p className="text-sm font-semibold text-neutral-900">
                            {formatCurrency(unitPrice * quantity)}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 space-y-4 border-t border-neutral-200 pt-5 text-sm text-neutral-600">
                    <div className="flex items-center justify-between">
                      <span>Subtotal</span>
                      <span className="font-medium text-neutral-900">
                        {formatCurrency(subtotal)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Envío</span>
                      <span className="font-medium text-neutral-900">
                        {shipping === 0 ? "Gratis" : formatCurrency(shipping)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-base font-semibold text-neutral-900">
                      <span>Total</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3 text-sm text-neutral-600">
                    <div className="flex items-start gap-3 rounded-2xl bg-white p-4 ring-1 ring-neutral-200/70">
                      <CreditCard className="mt-0.5 size-4 text-neutral-900" />
                      <p>Pagos protegidos y cuotas con tarjetas seleccionadas.</p>
                    </div>
                    <div className="flex items-start gap-3 rounded-2xl bg-white p-4 ring-1 ring-neutral-200/70">
                      <MapPin className="mt-0.5 size-4 text-neutral-900" />
                      <p>Envíos a todo el país con seguimiento del pedido.</p>
                    </div>
                    <div className="flex items-start gap-3 rounded-2xl bg-white p-4 ring-1 ring-neutral-200/70">
                      <ShieldCheck className="mt-0.5 size-4 text-neutral-900" />
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

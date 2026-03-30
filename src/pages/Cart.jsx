import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
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
  const items = useCartStore((state) => state.items ?? []);
  const addItem = useCartStore((state) => state.addItem);
  const removeOne = useCartStore((state) => state.removeOne);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);

  const subtotal = items.reduce((sum, item) => {
    const price = getDiscount(
      item.price ?? 0,
      Number(item.discountPercentage ?? 0)
    );
    return sum + price * (item.quantity ?? 1);
  }, 0);

  const shipping = items.length > 0 && subtotal < 80000 ? 6500 : 0;
  const total = subtotal + shipping;

  return (
    <div className="theme-page min-h-screen">
      <Header darkOnTop />
      <main className="pb-16 pt-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="theme-eyebrow text-xs font-semibold uppercase tracking-[0.35em]">
                M4RS
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
                Tu carrito
              </h1>
              <p className="theme-muted mt-3 max-w-2xl text-sm md:text-base">
                Revisá tus piezas, ajustá cantidades y continuá al checkout sin
                salir del flujo.
              </p>
            </div>
            {items.length > 0 ? (
              <button
                type="button"
                onClick={clearCart}
                className="theme-button-secondary inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-semibold uppercase cursor-pointer tracking-wide"
              >
                Vaciar carrito
              </button>
            ) : null}
          </div>

          {items.length === 0 ? (
            <section className="theme-panel grid min-h-[50vh] place-items-center rounded-[2rem] px-6 py-16 text-center">
              <div className="max-w-md">
                <span className="theme-button-primary mx-auto grid h-16 w-16 place-items-center rounded-full">
                  <ShoppingBag className="size-7" />
                </span>
                <h2 className="mt-6 text-2xl font-semibold">
                  Tu carrito está vacío
                </h2>
                <p className="theme-muted mt-3 text-sm leading-relaxed">
                  Todavía no agregaste productos. Volvé a la tienda y armá tu
                  selección.
                </p>
                <Link
                  to="/"
                  className="theme-button-primary mt-6 inline-flex rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-wide no-underline"
                >
                  Volver al inicio
                </Link>
              </div>
            </section>
          ) : (
            <section className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.8fr)]">
              <div className="space-y-4">
                {items.map((item) => {
                  const quantity = item.quantity ?? 1;
                  const discount = Number(item.discountPercentage ?? 0);
                  const unitPrice = getDiscount(item.price ?? 0, discount);
                  const lineTotal = unitPrice * quantity;

                  return (
                    <article
                      key={item.id}
                      className="theme-panel rounded-[2rem] p-4 md:p-6"
                    >
                      <div className="flex flex-col gap-5 sm:flex-row">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="theme-panel-soft h-40 w-full rounded-[1.5rem] object-cover sm:w-36"
                        />

                        <div className="flex min-w-0 flex-1 flex-col justify-between gap-5">
                          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div>
                              <h2 className="text-lg font-semibold text-[var(--text-main)]">
                                {item.title}
                              </h2>
                              <p className="theme-muted mt-1 text-sm">
                                {item.categories?.map((category) => category.name).join(", ")}
                              </p>
                            </div>

                            <div className="text-left md:text-right">
                              <p className="theme-soft-text text-sm">
                                {formatCurrency(unitPrice)} c/u
                              </p>
                              <p className="text-xl font-semibold text-[var(--text-main)]">
                                {formatCurrency(lineTotal)}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="theme-border inline-flex items-center rounded-full border">
                              <button
                                type="button"
                                onClick={() => removeOne(item.id)}
                                className="grid h-11 w-11 place-items-center rounded-l-full transition hover:bg-[var(--accent-soft)]"
                                aria-label="Disminuir cantidad"
                              >
                                <Minus className="size-4" />
                              </button>
                              <span className="w-12 text-center text-sm font-semibold">
                                {quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => addItem(item, 1)}
                                className="grid h-11 w-11 place-items-center rounded-r-full transition hover:bg-[var(--accent-soft)]"
                                aria-label="Aumentar cantidad"
                              >
                                <Plus className="size-4" />
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="theme-muted inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide transition hover:text-red-500"
                            >
                              <Trash2 className="size-4" />
                              Quitar
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              <aside className="lg:sticky lg:top-28">
                <div className="theme-panel rounded-[2rem] p-6">
                  <h2 className="text-xl font-semibold text-[var(--text-main)]">
                    Resumen
                  </h2>

                  <div className="theme-muted mt-6 space-y-4 text-sm">
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
                    <div className="theme-border border-t pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-base font-semibold text-[var(--text-main)]">
                          Total
                        </span>
                        <span className="text-2xl font-semibold text-[var(--text-main)]">
                          {formatCurrency(total)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <Link
                      to="/checkout"
                      className="theme-button-primary inline-flex h-12 w-full items-center justify-center rounded-full px-6 text-sm font-semibold uppercase tracking-wide no-underline"
                    >
                      Finalizar compra
                    </Link>
                    <Link
                      to="/"
                      className="theme-button-secondary inline-flex h-12 w-full items-center justify-center rounded-full px-6 text-sm font-semibold uppercase tracking-wide no-underline"
                    >
                      Seguir comprando
                    </Link>
                  </div>

                  <p className="theme-muted mt-6 text-xs leading-relaxed">
                    Envío gratis superando los $80.000. El total final se
                    confirma en el checkout antes de enviar tu pedido.
                  </p>
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

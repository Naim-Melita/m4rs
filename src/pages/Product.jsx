import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Plus, Minus } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/footer";
import useCartStore from "../hooks/useCarritoStore";
import { useProduct } from "../hooks/useProduct";
import { getDiscount } from "../utils/getDiscount";

const formatCurrency = (value) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);

function Accordion({ label, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-[var(--border)]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[var(--text-main)]">
          {label}
        </span>
        <span className="text-lg font-light text-[var(--text-soft)]">
          {open ? "−" : "+"}
        </span>
      </button>
      {open && <div className="pb-6 text-sm leading-relaxed text-[var(--text-muted)]">{children}</div>}
    </div>
  );
}

export default function ProductPage() {
  const { slug } = useParams();
  const { product, loading } = useProduct(slug);
  const hasSizes = Boolean(product?.sizes?.length);
  const [activeImage, setActiveImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (!product) return;
    setActiveImage(product.images?.[0] ?? "");
    setSelectedSize(product.sizes?.[0] ?? "");
    setQuantity(1);
    setAdded(false);
  }, [product]);

  const computedPrice = useMemo(() => {
    if (!product) return 0;
    if (product.price) return product.price;
    return getDiscount(product.compareAtPrice ?? 0, product.discountPercentage ?? 0);
  }, [product?.compareAtPrice, product?.discountPercentage, product?.price]);

  const compareAtPrice = useMemo(() => {
    if (!product) return 0;
    if (product.compareAtPrice) return product.compareAtPrice;
    const discount = Number(product.discountPercentage ?? 0);
    if (discount <= 0) return computedPrice;
    return Math.round(computedPrice / (1 - discount / 100));
  }, [computedPrice, product?.compareAtPrice, product?.discountPercentage]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(
      {
        id: hasSizes ? `${product.id}-${selectedSize || "unico"}` : product.id,
        title: hasSizes
          ? `${product.name}${selectedSize ? ` — ${selectedSize}` : ""}`
          : product.name,
        price: computedPrice,
        discountPercentage: product.discountPercentage ?? 0,
        image: activeImage,
        categories: product.categories,
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // ── Loading ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
        <Header darkOnTop />
        <main className="mx-auto max-w-6xl px-6 pb-24 pt-24 sm:px-10 lg:px-16">
          <div className="grid gap-12 lg:grid-cols-[1fr_420px] lg:items-start">
            <div className="grid gap-3 lg:grid-cols-[64px_1fr]">
              <div className="flex gap-2 lg:flex-col">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="aspect-square w-16 animate-pulse bg-neutral-500/10" />
                ))}
              </div>
              <div className="aspect-[4/5] w-full animate-pulse bg-neutral-500/10" />
            </div>
            <div className="space-y-5 pt-2">
              <div className="h-3 w-24 animate-pulse bg-neutral-500/10" />
              <div className="h-8 w-3/4 animate-pulse bg-neutral-500/10" />
              <div className="h-5 w-28 animate-pulse bg-neutral-500/10" />
              <div className="h-px w-full bg-neutral-500/10" />
              <div className="space-y-2">
                <div className="h-3 w-full animate-pulse bg-neutral-500/10" />
                <div className="h-3 w-5/6 animate-pulse bg-neutral-500/10" />
                <div className="h-3 w-4/6 animate-pulse bg-neutral-500/10" />
              </div>
              <div className="h-12 w-full animate-pulse bg-neutral-500/10" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ── 404 ─────────────────────────────────────────────────
  if (!product) {
    return (
      <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
        <Header darkOnTop />
        <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[var(--text-soft)]">
            M4RS
          </p>
          <h1 className="mt-4 text-2xl font-light text-[var(--text-main)]">
            Producto no encontrado
          </h1>
          <Link
            to="/"
            className="mt-8 border-b border-[var(--text-main)] pb-0.5 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--text-main)] no-underline transition-opacity hover:opacity-50"
          >
            Volver al inicio
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const category = product.categories?.[0]?.name ?? "M4RS";

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
      <Header darkOnTop />

      <main className="mx-auto max-w-6xl px-6 pb-24 pt-24 sm:px-10 lg:px-16">

        {/* Breadcrumb */}
        <nav className="mb-10 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[var(--text-soft)]">
          <Link to="/" className="text-inherit no-underline transition-opacity hover:opacity-50">
            Inicio
          </Link>
          <span>/</span>
          <span>{category}</span>
          <span>/</span>
          <span className="text-[var(--text-main)]">{product.name}</span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-[1fr_400px] lg:items-start">

          {/* ── Galería ───────────────────────────────────── */}
          <div className="grid items-start gap-3 lg:grid-cols-[64px_1fr]">

            {/* Thumbnails */}
            <div className="order-2 flex gap-2 overflow-x-auto lg:order-1 lg:flex-col lg:overflow-visible">
              {product.images.map((img, i) => {
                const isActive = img === activeImage;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`aspect-square w-16 shrink-0 overflow-hidden transition-opacity lg:w-full ${
                      isActive ? "opacity-100" : "opacity-40 hover:opacity-70"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                );
              })}
            </div>

            {/* Imagen principal */}
            <div className="order-1 aspect-[4/5] w-full overflow-hidden lg:order-2">
              <img
                key={activeImage}
                src={activeImage}
                alt={product.name}
                className="h-full w-full object-cover transition-opacity duration-300"
              />
            </div>
          </div>

          {/* ── Info ──────────────────────────────────────── */}
          <div className="lg:sticky lg:top-24">

            {/* Eyebrow + nombre + precio */}
            <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[var(--text-soft)]">
              {category}
            </p>
            <h1 className="mt-2 text-2xl font-light tracking-wide text-[var(--text-main)] md:text-3xl">
              {product.name}
            </h1>

            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-lg font-medium text-[var(--text-main)]">
                {formatCurrency(computedPrice)}
              </span>
              {compareAtPrice > computedPrice && (
                <span className="text-sm text-[var(--text-soft)] line-through">
                  {formatCurrency(compareAtPrice)}
                </span>
              )}
              {product.discountPercentage > 0 && (
                <span className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">
                  −{product.discountPercentage}%
                </span>
              )}
            </div>

            <div className="my-6 h-px bg-[var(--border)]" />

            {/* Descripción */}
            <p className="text-sm leading-relaxed text-[var(--text-muted)]">
              {product.description}
            </p>

            <div className="my-6 h-px bg-[var(--border)]" />

            {/* Selector de talles */}
            {hasSizes && (
              <div className="mb-6">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[var(--text-main)]">
                    Talle
                  </span>
                  <button
                    type="button"
                    className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--text-soft)] transition-opacity hover:opacity-50"
                  >
                    Guía de talles
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => {
                    const isSelected = size === selectedSize;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[52px] border py-2 px-4 text-xs font-medium uppercase tracking-wide transition-colors ${
                          isSelected
                            ? "border-[var(--text-main)] bg-[var(--text-main)] text-[var(--bg-page)]"
                            : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--text-main)]"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
                {product.fitGuide && (
                  <p className="mt-3 text-[11px] text-[var(--text-soft)]">{product.fitGuide}</p>
                )}
              </div>
            )}

            {/* Cantidad + CTA */}
            <div className="flex gap-3">
              <div className="flex items-center border border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-12 w-11 items-center justify-center text-[var(--text-muted)] transition-opacity hover:opacity-50"
                  aria-label="Disminuir"
                >
                  <Minus className="size-3" />
                </button>
                <span className="w-8 text-center text-sm font-medium text-[var(--text-main)]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex h-12 w-11 items-center justify-center text-[var(--text-muted)] transition-opacity hover:opacity-50"
                  aria-label="Aumentar"
                >
                  <Plus className="size-3" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={added}
                className="flex-1 border text-xs font-semibold uppercase tracking-[0.2em] transition-colors"
                style={
                  added
                    ? { background: "var(--text-main)", color: "var(--bg-page)", borderColor: "var(--text-main)" }
                    : { background: "transparent", color: "var(--text-main)", borderColor: "var(--text-main)" }
                }
                onMouseEnter={(e) => {
                  if (!added) {
                    e.currentTarget.style.background = "var(--text-main)";
                    e.currentTarget.style.color = "var(--bg-page)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!added) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "var(--text-main)";
                  }
                }}
              >
                {added ? "Agregado ✓" : "Agregar al carrito"}
              </button>
            </div>

            {/* Acordeón de detalles */}
            <div className="mt-8">
              {product.features?.length > 0 && (
                <Accordion label="Características" defaultOpen>
                  <ul className="space-y-2">
                    {product.features.map((f, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--text-soft)]" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </Accordion>
              )}

              {(product.composition?.length > 0 || product.care?.length > 0) && (
                <Accordion label="Composición y cuidados">
                  {product.composition?.length > 0 && (
                    <dl className="mb-4 grid grid-cols-2 gap-x-6 gap-y-3">
                      {product.composition.map((item) => (
                        <div key={item.label}>
                          <dt className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--text-soft)]">
                            {item.label}
                          </dt>
                          <dd className="mt-0.5 text-sm text-[var(--text-muted)]">{item.value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                  {product.care?.length > 0 && (
                    <ul className="space-y-1.5 border-t border-[var(--border)] pt-4">
                      {product.care.map((tip, i) => (
                        <li key={i} className="flex gap-3">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--text-soft)]" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  )}
                </Accordion>
              )}

              <Accordion label="Envío">
                <p>Envíos a todo el país. Gratis a partir de $80.000.</p>
                <p className="mt-2">Entrega estimada de 2 a 5 días hábiles.</p>
                <p className="mt-2">Retiro en showroom coordinando previamente por mensaje.</p>
              </Accordion>

              <Accordion label="Medios de pago">
                <p>Hasta 3 cuotas sin interés con tarjetas seleccionadas.</p>
                <p className="mt-2">Transferencia bancaria · Mercado Pago · Billeteras virtuales.</p>
              </Accordion>

              <div className="border-t border-[var(--border)]" />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

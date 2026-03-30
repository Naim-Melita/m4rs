import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/footer";
import useCartStore from "../hooks/useCarritoStore";
import { getProductById } from "../data";
import { getDiscount } from "../utils/getDiscount";
import {
  Truck,
  ShieldCheck,
  CreditCard,
  Package,
  RefreshCw,
} from "lucide-react";

const formatCurrency = (value) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);

export default function ProductPage() {
  const { id } = useParams();
  const product = getProductById(id);
  const hasSizes = Boolean(product?.sizes?.length);
  const [activeImage, setActiveImage] = useState(product?.images?.[0] ?? "");
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] ?? "");
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (!product) return;
    setActiveImage(product.images?.[0] ?? "");
    setSelectedSize(product.sizes?.[0] ?? "");
    setQuantity(1);
    setFeedback(false);
  }, [product]);

  const computedPrice = useMemo(() => {
    if (!product) return 0;
    if (product.price) return product.price;
    return getDiscount(
      product.compareAtPrice ?? 0,
      product.discountPercentage ?? 0
    );
  }, [product?.compareAtPrice, product?.discountPercentage, product?.price]);

  const compareAtPrice = useMemo(() => {
    if (!product) return 0;
    if (product.compareAtPrice) return product.compareAtPrice;
    const discount = Number(product.discountPercentage ?? 0);
    if (discount <= 0) return computedPrice;
    const gross = computedPrice / (1 - discount / 100);
    return Math.round(gross);
  }, [computedPrice, product?.compareAtPrice, product?.discountPercentage]);

  useEffect(() => {
    if (!feedback) return;
    const timeout = window.setTimeout(() => setFeedback(false), 2600);
    return () => window.clearTimeout(timeout);
  }, [feedback]);

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => {
      const next = prev + delta;
      return next < 1 ? 1 : next;
    });
  };

  const handleAddToCart = () => {
    if (!product) return;
    addItem(
      {
        id: hasSizes ? `${product.id}-${selectedSize || "unico"}` : product.id,
        title: hasSizes
          ? `${product.name}${selectedSize ? ` · Talle ${selectedSize}` : ""}`
          : product.name,
        price: computedPrice,
        discountPercentage: product.discountPercentage ?? 0,
        image: activeImage,
        categories: product.categories,
      },
      quantity
    );
    setFeedback(true);
  };

  if (!product) {
    return (
      <div className="theme-page min-h-screen">
        <Header darkOnTop />
        <main className="container mx-auto px-4 pb-16 pt-28 sm:px-6 lg:px-8">
          <div className="theme-panel mx-auto max-w-xl rounded-3xl p-8 text-center">
            <p className="theme-eyebrow text-sm uppercase tracking-[0.3em]">
              M4RS
            </p>
            <h1 className="mt-3 text-3xl font-semibold">Producto no encontrado</h1>
            <p className="theme-muted mt-3 text-sm">
              La ruta no coincide con ningun producto cargado en `data.js`.
            </p>
            <Link
              to="/"
              className="theme-button-primary mt-6 inline-flex rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-wide no-underline"
            >
              Volver al inicio
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const miniCards = product
    ? [
    {
      icon: <Truck className="size-5" />,
      title: "Envío express",
      copy:
        product.shipping?.[0]?.description ?? "Entrega rápida a todo el país.",
    },
    {
      icon: <ShieldCheck className="size-5" />,
      title: "Garantía total",
      copy: "30 días para cambios gratuitos en showroom o por correo.",
    },
    {
      icon: <CreditCard className="size-5" />,
      title: "Pagá como quieras",
      copy:
        product.installmentInfo ??
        "Cuotas fijas con las principales tarjetas y billeteras virtuales.",
    },
  ]
    : [];

  return (
    <div className="theme-page min-h-screen">
      <Header darkOnTop />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <section className="grid gap-10 lg:grid-cols-[minmax(0,620px)_minmax(340px,1fr)] lg:items-start">
            {/* Galería */}
            <div className="grid items-start gap-5 lg:grid-cols-[84px_minmax(0,1fr)]">
              <div className="order-2 flex gap-3 overflow-x-auto pb-2 lg:order-1 lg:flex-col lg:overflow-visible">
                {product.images.map((img) => {
                  const isActive = img === activeImage;
                  return (
                    <button
                      key={img}
                      type="button"
                      onClick={() => setActiveImage(img)}
                      className={`h-16 w-16 flex-shrink-0 rounded-lg border transition lg:h-20 lg:w-20 ${
                        isActive
                          ? "border-black ring-2 ring-neutral-900"
                          : "border-neutral-200 hover:border-neutral-500"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} vista`}
                        className="h-full w-full rounded-md object-cover"
                      />
                    </button>
                  );
                })}
              </div>
              <div className="theme-panel-soft order-1 mx-auto aspect-[4/5] w-full max-w-[560px] overflow-hidden rounded-2xl lg:order-2">
                <img
                  src={activeImage}
                  alt={product.name}
                  className="h-full w-full object-cover transition duration-500"
                />
              </div>

            </div>

            {/* Información */}
            <div className="space-y-7 lg:sticky lg:top-28">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="theme-eyebrow text-xs font-semibold uppercase tracking-[0.4em]">
                    M4RS
                  </p>
                  <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
                    {product.name}
                  </h1>
                  <p className="theme-muted mt-3 text-sm">
                    {product.stockStatus}
                  </p>
                </div>
                {product.discountPercentage ? (
                  <span className="theme-button-primary rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-wide">
                    -{product.discountPercentage}%
                  </span>
                ) : null}
              </div>

              <div>
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="text-3xl font-semibold md:text-4xl">
                    {formatCurrency(computedPrice)}
                  </span>
                  {compareAtPrice > computedPrice ? (
                    <span className="theme-soft-text text-base line-through">
                      {formatCurrency(compareAtPrice)}
                    </span>
                  ) : null}
                </div>
                {product.installmentInfo ? (
                  <p className="theme-muted mt-1 text-sm">
                    {product.installmentInfo}
                  </p>
                ) : null}
              </div>

              {hasSizes ? (
                <div className="theme-panel rounded-2xl p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[var(--text-main)]">
                      Seleccioná tu talle
                    </span>
                    <button
                      type="button"
                      className="theme-muted text-xs font-semibold uppercase tracking-wide transition hover:text-[var(--accent)]"
                    >
                      Guía de talles
                    </button>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {product.sizes.map((size) => {
                      const isSelected = size === selectedSize;
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`min-w-[64px] rounded-full border px-5 py-2 text-sm font-medium transition ${
                            isSelected
                              ? "theme-chip-active shadow-sm"
                              : "theme-chip hover:border-[var(--accent)]"
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                  {product.fitGuide ? (
                    <p className="theme-muted mt-3 text-xs">
                      {product.fitGuide}
                    </p>
                  ) : null}
                </div>
              ) : null}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="theme-border inline-flex items-center justify-center rounded-full border">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(-1)}
                    className="h-11 w-11 text-lg font-semibold transition hover:bg-[var(--accent-soft)]"
                    aria-label="Disminuir cantidad"
                  >
                    -
                  </button>
                  <span className="h-11 w-12 text-center text-base font-semibold leading-[44px]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(1)}
                    className="h-11 w-11 text-lg font-semibold transition hover:bg-[var(--accent-soft)]"
                    aria-label="Incrementar cantidad"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="theme-button-primary flex-1 rounded-full py-3 text-sm font-semibold uppercase tracking-wide"
                >
                  Agregar al carrito
                </button>
              </div>

              {feedback ? (
                <p className="theme-accent-text text-sm font-medium">
                  Producto agregado al carrito.
                </p>
              ) : null}

              <p className="theme-muted text-sm leading-relaxed md:text-base">
                {product.description}
              </p>

              {/* <div className="grid gap-4 sm:grid-cols-3">
                {miniCards.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-neutral-200/80 bg-neutral-50 p-4"
                  >
                    <div className="flex items-center gap-3 text-sm font-semibold text-neutral-800">
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-neutral-900/90 text-white">
                        {item.icon}
                      </span>
                      {item.title}
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-neutral-500">
                      {item.copy}
                    </p>
                  </div>
                ))}
              </div> */}
            </div>
          </section>

          <section className="mt-16 grid gap-10 lg:grid-cols-2">
            <div className="theme-panel rounded-3xl p-8 md:p-10">
              <h2 className="text-xl font-semibold text-[var(--text-main)]">
                Detalles técnicos
              </h2>
              <ul className="theme-muted mt-5 space-y-3 text-sm">
                {product.features.map((feature) => (
                  <li key={feature} className="flex gap-3">
                    <span className="mt-0.5 h-2 w-2 rounded-full bg-[var(--accent)]" />
                    <span className="leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <div className="theme-panel rounded-3xl p-8">
                <h3 className="text-lg font-semibold text-[var(--text-main)]">
                  Composición y cuidados
                </h3>
                <dl className="theme-muted mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                  {product.composition.map((item) => (
                    <div key={item.label}>
                      <dt className="theme-eyebrow text-xs uppercase tracking-wide">
                        {item.label}
                      </dt>
                      <dd className="mt-1 text-sm font-medium text-[var(--text-main)]">
                        {item.value}
                      </dd>
                    </div>
                  ))}
                </dl>
                <ul className="theme-muted mt-4 list-disc space-y-2 pl-5 text-sm">
                  {product.care.map((tip) => (
                    <li key={tip}>{tip}</li>
                  ))}
                </ul>
              </div>

              <div className="theme-panel rounded-3xl p-8">
                <h3 className="text-lg font-semibold text-[var(--text-main)]">
                  Envío y devoluciones
                </h3>
                <ul className="theme-muted mt-4 space-y-4 text-sm">
                  {product.shipping.map((option) => (
                    <li
                      key={option.title}
                      className="theme-panel-soft flex gap-3 rounded-2xl p-4"
                    >
                      <span className="theme-muted mt-1">
                        <Package className="size-5" />
                      </span>
                      <div>
                        <p className="font-semibold text-[var(--text-main)]">
                          {option.title}
                        </p>
                        <p className="theme-muted mt-1 text-xs leading-relaxed">
                          {option.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="theme-button-primary mt-4 flex items-center gap-2 rounded-2xl px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                  <RefreshCw className="size-4" />
                  Cambios sin cargo en los primeros 30 días.
                </div>
              </div>
            </div>
          </section>

          <section className="mt-16 rounded-3xl px-6 py-10 md:px-12 theme-button-primary">
            <div className="max-w-3xl space-y-4">
              <h3 className="text-2xl font-semibold">Medios de pago</h3>
              <p className="text-sm opacity-80">
                Elegí la opción que mejor se ajuste a tu rutina. Todas tus
                transacciones están protegidas con encriptación 256-bit.
              </p>
              <ul className="space-y-2 text-sm opacity-80">
                {product.payments.map((payment) => (
                  <li key={payment} className="flex items-center gap-3">
                    <CreditCard className="size-4" />
                    <span>{payment}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

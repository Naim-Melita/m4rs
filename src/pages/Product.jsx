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
      <div className="min-h-screen bg-white text-neutral-900">
        <Header darkOnTop />
        <main className="container mx-auto px-4 pb-16 pt-28 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-xl rounded-3xl border border-neutral-200 bg-neutral-50 p-8 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-400">
              M4RS
            </p>
            <h1 className="mt-3 text-3xl font-semibold">Producto no encontrado</h1>
            <p className="mt-3 text-sm text-neutral-600">
              La ruta no coincide con ningun producto cargado en `data.js`.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex rounded-full bg-black px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white no-underline"
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
    <div className="bg-white min-h-screen text-neutral-900">
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
              <div className="order-1 mx-auto aspect-[4/5] w-full max-w-[560px] overflow-hidden rounded-2xl bg-neutral-50 ring-1 ring-neutral-200/70 lg:order-2">
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
                  <p className="text-xs font-semibold uppercase tracking-[0.4em] text-neutral-400">
                    M4RS
                  </p>
                  <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
                    {product.name}
                  </h1>
                  <p className="mt-3 text-sm text-neutral-500">
                    {product.stockStatus}
                  </p>
                </div>
                {product.discountPercentage ? (
                  <span className="rounded-full bg-black px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white">
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
                    <span className="text-base text-neutral-400 line-through">
                      {formatCurrency(compareAtPrice)}
                    </span>
                  ) : null}
                </div>
                {product.installmentInfo ? (
                  <p className="mt-1 text-sm text-neutral-500">
                    {product.installmentInfo}
                  </p>
                ) : null}
              </div>

              {hasSizes ? (
                <div className="rounded-2xl border border-neutral-200 bg-white/80 p-5 shadow-sm shadow-neutral-100/30">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-neutral-800">
                      Seleccioná tu talle
                    </span>
                    <button
                      type="button"
                      className="text-xs font-semibold uppercase tracking-wide text-neutral-500 hover:text-neutral-900"
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
                              ? "border-black bg-black text-white shadow-sm"
                              : "border-neutral-300 text-neutral-700 hover:border-neutral-600"
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                  {product.fitGuide ? (
                    <p className="mt-3 text-xs text-neutral-500">
                      {product.fitGuide}
                    </p>
                  ) : null}
                </div>
              ) : null}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="inline-flex items-center justify-center rounded-full border border-neutral-300">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(-1)}
                    className="h-11 w-11 text-lg font-semibold hover:bg-neutral-100"
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
                    className="h-11 w-11 text-lg font-semibold hover:bg-neutral-100"
                    aria-label="Incrementar cantidad"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 rounded-full bg-black py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-black/10 transition hover:translate-y-0 hover:bg-neutral-900"
                >
                  Agregar al carrito
                </button>
              </div>

              {feedback ? (
                <p className="text-sm font-medium text-emerald-600">
                  Producto agregado al carrito.
                </p>
              ) : null}

              <p className="text-sm leading-relaxed text-neutral-600 md:text-base">
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
            <div className="rounded-3xl bg-neutral-50 p-8 md:p-10">
              <h2 className="text-xl font-semibold text-neutral-900">
                Detalles técnicos
              </h2>
              <ul className="mt-5 space-y-3 text-sm text-neutral-600">
                {product.features.map((feature) => (
                  <li key={feature} className="flex gap-3">
                    <span className="mt-0.5 h-2 w-2 rounded-full bg-neutral-900" />
                    <span className="leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-neutral-200 p-8">
                <h3 className="text-lg font-semibold text-neutral-900">
                  Composición y cuidados
                </h3>
                <dl className="mt-4 grid grid-cols-1 gap-3 text-sm text-neutral-600 sm:grid-cols-2">
                  {product.composition.map((item) => (
                    <div key={item.label}>
                      <dt className="text-xs uppercase tracking-wide text-neutral-400">
                        {item.label}
                      </dt>
                      <dd className="mt-1 text-sm font-medium text-neutral-700">
                        {item.value}
                      </dd>
                    </div>
                  ))}
                </dl>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-neutral-500">
                  {product.care.map((tip) => (
                    <li key={tip}>{tip}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl border border-neutral-200 p-8">
                <h3 className="text-lg font-semibold text-neutral-900">
                  Envío y devoluciones
                </h3>
                <ul className="mt-4 space-y-4 text-sm text-neutral-600">
                  {product.shipping.map((option) => (
                    <li
                      key={option.title}
                      className="flex gap-3 rounded-2xl bg-neutral-50 p-4"
                    >
                      <span className="mt-1 text-neutral-500">
                        <Package className="size-5" />
                      </span>
                      <div>
                        <p className="font-semibold text-neutral-800">
                          {option.title}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-neutral-500">
                          {option.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex items-center gap-2 rounded-2xl bg-neutral-900 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white">
                  <RefreshCw className="size-4" />
                  Cambios sin cargo en los primeros 30 días.
                </div>
              </div>
            </div>
          </section>

          <section className="mt-16 rounded-3xl bg-neutral-900 px-6 py-10 text-white md:px-12">
            <div className="max-w-3xl space-y-4">
              <h3 className="text-2xl font-semibold">Medios de pago</h3>
              <p className="text-sm text-neutral-200">
                Elegí la opción que mejor se ajuste a tu rutina. Todas tus
                transacciones están protegidas con encriptación 256-bit.
              </p>
              <ul className="space-y-2 text-sm text-neutral-200">
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

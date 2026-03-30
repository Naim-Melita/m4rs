import React, {
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { productos } from "../data";
import logo from "../assets/logo3.png";
import CartButton from "./cart/CartButton";
import CartDropdown from "./cart/CartDropdown";

const formatCurrency = (value) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);

export default function Header({ darkOnTop = false }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > window.innerHeight * 0.2);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!searchOpen) return;

    const timeout = window.setTimeout(() => inputRef.current?.focus(), 120);
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setSearchOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", handleEsc);

    return () => {
      window.clearTimeout(timeout);
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      window.removeEventListener("keydown", handleEsc);
    };
  }, [searchOpen]);

  const searchResults = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();
    if (!normalizedQuery) return productos;

    return productos.filter((product) => {
      const haystack = [
        product.name,
        product.description,
        product.categories?.map((category) => category.name).join(" "),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [deferredQuery]);

  const topIconClasses = darkOnTop
    ? "text-[var(--text-main)] hover:text-[var(--accent)]"
    : "text-white hover:text-white/80";
  const iconClasses = isScrolled
    ? "text-[var(--text-main)] hover:text-[var(--accent)]"
    : topIconClasses;
  const logoClasses = isScrolled
    ? "text-[var(--text-main)]"
    : darkOnTop
      ? "text-[var(--text-main)]"
      : "hidden text-white";

  const handleCloseSearch = () => {
    setSearchOpen(false);
    setQuery("");
  };

  const searchOverlay =
    typeof document === "undefined"
      ? null
      : createPortal(
          <AnimatePresence>
            {searchOpen ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[999] overflow-y-auto bg-black/55 backdrop-blur-md"
                onClick={handleCloseSearch}
              >
                <motion.div
                  initial={{ opacity: 0, y: -28, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.98 }}
                  transition={{ duration: 0.24, ease: "easeOut" }}
                  className="theme-panel mx-auto mt-20 mb-8 w-[calc(100%-1.5rem)] max-w-4xl overflow-hidden rounded-[2rem]"
                  onClick={(event) => event.stopPropagation()}
                >
                  <div className="theme-border border-b px-5 py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <span className="theme-panel-soft grid h-11 w-11 place-items-center rounded-full theme-muted">
                        <MagnifyingGlassIcon className="h-5 w-5" />
                      </span>
                      <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Buscar productos, categorías o concepto"
                        className="h-12 flex-1 border-0 bg-transparent text-base text-[var(--text-main)] outline-none placeholder:text-[var(--text-soft)]"
                      />
                      <button
                        type="button"
                        onClick={handleCloseSearch}
                        className="theme-panel-soft grid h-11 w-11 place-items-center rounded-full transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                        aria-label="Cerrar buscador"
                      >
                        <X className="size-5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-0 lg:grid-cols-[1.25fr_0.75fr]">
                    <div className="max-h-[65vh] overflow-auto p-4 sm:p-5">
                      <div className="mb-4 flex items-center justify-between">
                        <p className="theme-eyebrow text-xs font-semibold uppercase tracking-[0.28em]">
                          Resultados
                        </p>
                        <p className="theme-muted text-sm">
                          {searchResults.length} producto{searchResults.length === 1 ? "" : "s"}
                        </p>
                      </div>

                      <div className="space-y-3">
                        {searchResults.length > 0 ? (
                          searchResults.map((product) => (
                            <Link
                              key={product.id}
                              to={`/producto/${product.id}`}
                              onClick={handleCloseSearch}
                              className="theme-panel-soft flex items-center gap-4 rounded-[1.5rem] p-3 text-inherit no-underline transition hover:border-[var(--accent)]"
                            >
                              <img
                                src={product.image}
                                alt={product.name}
                                className="h-20 w-20 rounded-[1.2rem] object-cover"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="theme-eyebrow text-xs font-semibold uppercase tracking-[0.24em]">
                                  {product.categories?.[0]?.name ?? "M4RS"}
                                </p>
                                <h3 className="mt-1 truncate text-base font-semibold text-[var(--text-main)]">
                                  {product.name}
                                </h3>
                                <p className="theme-muted mt-1 line-clamp-2 text-sm">
                                  {product.description}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold text-[var(--text-main)]">
                                  {formatCurrency(product.price)}
                                </p>
                              </div>
                            </Link>
                          ))
                        ) : (
                          <div className="theme-panel-soft rounded-[1.5rem] border border-dashed px-5 py-10 text-center">
                            <p className="text-sm font-semibold text-[var(--text-main)]">
                              No encontramos coincidencias
                            </p>
                            <p className="theme-muted mt-2 text-sm">
                              Probá con el nombre del producto o una categoría.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="theme-panel-soft theme-border border-t p-5 lg:border-l lg:border-t-0">
                      <p className="theme-eyebrow text-xs font-semibold uppercase tracking-[0.28em]">
                        Búsqueda rápida
                      </p>
                      <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--text-main)]">
                        Encontrá la pieza exacta sin salir del flujo.
                      </h3>
                      <p className="theme-muted mt-3 text-sm leading-relaxed">
                        La UI se apoya en `data.js`, así que cada resultado mantiene
                        la ficha real del producto.
                      </p>

                      <div className="mt-6 flex flex-wrap gap-2">
                        {["Fragmento", "Patch", "Shorts", "Accesorios"].map((term) => (
                          <button
                            key={term}
                            type="button"
                            onClick={() => setQuery(term)}
                            className="theme-button-secondary rounded-full px-4 py-2 text-sm font-medium"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>,
          document.body
        );

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-[120] transition-all duration-500 ${
          isScrolled ? "shadow-md backdrop-blur-sm" : "bg-transparent"
        }`}
        style={isScrolled ? { background: "var(--header-bg)" } : undefined}
      >
        <div
          className={`flex h-16 items-center justify-center px-6 transition-all duration-500 ${
            isScrolled ? "text-[var(--text-main)]" : "text-white"
          }`}
        >
          <Link
            to="/"
            className={`absolute left-1/2 -translate-x-1/2 mr-10 no-underline transition-all ${logoClasses}`}
            aria-label="Ir al inicio"
          >
            <img src={logo} alt="M4RS" className="w-24 object-contain" />
          </Link>

          <div
            className={`ml-auto flex items-center gap-3 md:gap-5 ${
              isScrolled
                ? "text-[var(--text-main)]"
                : darkOnTop
                  ? "text-[var(--text-main)]"
                  : "text-white"
            }`}
          >
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="grid place-items-center bg-transparent"
              aria-label="Abrir buscador"
            >
              <MagnifyingGlassIcon
                className={`h-5 w-5 cursor-pointer transition ${iconClasses}`}
              />
            </button>

            <div className="relative mt-2 md:mt-1">
              <CartButton
                onClick={() => setCartOpen(true)}
                className="size-5 pb-1 md:size-7"
                iconClassName={iconClasses}
              />
              <CartDropdown open={cartOpen} onClose={() => setCartOpen(false)} />
            </div>
          </div>
        </div>
      </header>

      {searchOverlay}
    </>
  );
}

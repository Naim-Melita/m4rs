import React, {
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { MagnifyingGlassIcon, UserIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { productos } from "../data";
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
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setSearchOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEsc);

    return () => {
      window.clearTimeout(timeout);
      document.body.style.overflow = "auto";
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
    ? "text-gray-700 hover:text-black"
    : "text-white hover:text-white/80";
  const iconClasses = isScrolled
    ? "text-gray-700 hover:text-black"
    : topIconClasses;
  const logoClasses = isScrolled
    ? "text-black"
    : darkOnTop
      ? "text-black"
      : "hidden text-white";

  const handleCloseSearch = () => {
    setSearchOpen(false);
    setQuery("");
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? "bg-white/95 shadow-md backdrop-blur-sm" : "bg-transparent "
      }`}
    >
      <div
        className={`flex items-center justify-center h-16 px-6 transition-all duration-500 ${
          isScrolled ? "text-gray-700" : "text-white"
        }`}
      >
        <Link
          to="/"
          className={`absolute left-1/2 -translate-x-1/2 text-2xl font-bold tracking-widest no-underline transition-colors ${logoClasses}`}
        >
          M4RS
        </Link>

        <div
          className={`ml-auto flex items-center gap-5 ${
            isScrolled
              ? "text-gray-700"
              : darkOnTop
                ? "text-gray-700"
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
              className={`w-5 h-5 cursor-pointer transition ${iconClasses}`}
            />
          </button>

          <UserIcon className={`w-5 h-5 cursor-pointer transition ${iconClasses}`} />

          <div className="relative mt-2 md:mt-1">
            <CartButton
              onClick={() => setCartOpen(true)}
              className="size-5 md:size-7 pb-1"
              iconClassName={iconClasses}
            />
            <CartDropdown open={cartOpen} onClose={() => setCartOpen(false)} />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {searchOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/55 backdrop-blur-md"
            onClick={handleCloseSearch}
          >
            <motion.div
              initial={{ opacity: 0, y: -28, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              className="mx-auto mt-20 w-[calc(100%-1.5rem)] max-w-4xl overflow-hidden rounded-[2rem] border border-white/15 bg-white/95 shadow-2xl shadow-black/20"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="border-b border-neutral-200 px-5 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-neutral-100 text-neutral-700">
                    <MagnifyingGlassIcon className="h-5 w-5" />
                  </span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Buscar productos, categorías o concepto"
                    className="h-12 flex-1 border-0 bg-transparent text-base text-neutral-900 outline-none placeholder:text-neutral-400"
                  />
                  <button
                    type="button"
                    onClick={handleCloseSearch}
                    className="grid h-11 w-11 place-items-center rounded-full bg-neutral-100 text-neutral-700 transition hover:bg-neutral-200"
                    aria-label="Cerrar buscador"
                  >
                    <X className="size-5" />
                  </button>
                </div>
              </div>

              <div className="grid gap-0 lg:grid-cols-[1.25fr_0.75fr]">
                <div className="max-h-[65vh] overflow-auto p-4 sm:p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-400">
                      Resultados
                    </p>
                    <p className="text-sm text-neutral-500">
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
                          className="flex items-center gap-4 rounded-[1.5rem] border border-neutral-200 bg-white p-3 text-inherit no-underline transition hover:border-neutral-900 hover:shadow-md hover:shadow-neutral-200/70"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-20 w-20 rounded-[1.2rem] bg-neutral-100 object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-400">
                              {product.categories?.[0]?.name ?? "M4RS"}
                            </p>
                            <h3 className="mt-1 truncate text-base font-semibold text-neutral-900">
                              {product.name}
                            </h3>
                            <p className="mt-1 line-clamp-2 text-sm text-neutral-500">
                              {product.description}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-neutral-900">
                              {formatCurrency(product.price)}
                            </p>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="rounded-[1.5rem] border border-dashed border-neutral-300 bg-neutral-50 px-5 py-10 text-center">
                        <p className="text-sm font-semibold text-neutral-800">
                          No encontramos coincidencias
                        </p>
                        <p className="mt-2 text-sm text-neutral-500">
                          Probá con el nombre del producto o una categoría.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-neutral-200 bg-neutral-50 p-5 lg:border-l lg:border-t-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-400">
                    Búsqueda rápida
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900">
                    Encontrá la pieza exacta sin salir del flujo.
                  </h3>
                 

                  <div className="mt-6 flex flex-wrap gap-2">
                    {["Fragmento", "Patch", "Shorts", "Accesorios"].map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => setQuery(term)}
                        className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-800 hover:text-neutral-900"
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
      </AnimatePresence>
    </header>
  );
}

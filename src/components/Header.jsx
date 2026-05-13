import React, { useEffect, useRef, useState } from "react";
import { MagnifyingGlassIcon, UserIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X, Sun } from "lucide-react";
import { TbAlien } from "react-icons/tb";
import logo from "../assets/logo3.png";
import CartButton from "./cart/CartButton";
import CartDropdown from "./cart/CartDropdown";
import AuthModal from "./auth/AuthModal";
import { useProducts } from "../hooks/useProducts";
import { useTheme } from "../theme/ThemeProvider";
import { useAuth } from "../context/AuthContext";

const formatCurrency = (value) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);

export default function Header({ darkOnTop = false }) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const panelRef = useRef(null);
  const userMenuRef = useRef(null);
  const { products } = useProducts();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > window.innerHeight * 0.2);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!searchOpen) return;
    const timeout = window.setTimeout(() => inputRef.current?.focus(), 80);
    const handleEsc = (e) => { if (e.key === "Escape") closeSearch(); };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("keydown", handleEsc);
    };
  }, [searchOpen]);

  // Cierra si se clickea fuera del panel
  useEffect(() => {
    if (!searchOpen) return;
    const handleClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) closeSearch();
    };
    window.setTimeout(() => document.addEventListener("mousedown", handleClick), 50);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [searchOpen]);

  // Cierra menú de usuario si se clickea fuera
  useEffect(() => {
    if (!userMenuOpen) return;
    const handleClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    window.setTimeout(() => document.addEventListener("mousedown", handleClick), 50);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [userMenuOpen]);

  const closeSearch = () => {
    setSearchOpen(false);
    setQuery("");
  };

  const results = query.trim().length < 1
    ? []
    : products.filter((p) => {
        const haystack = [p.name, p.description, ...(p.categories?.map((c) => c.name) ?? [])]
          .join(" ")
          .toLowerCase();
        return haystack.includes(query.trim().toLowerCase());
      });

  const showResults = searchOpen && query.trim().length > 0;

  const iconClasses = isScrolled || darkOnTop
    ? "text-[var(--text-main)] hover:text-[var(--accent)]"
    : "text-white hover:text-white/70";

  const logoVisible = !searchOpen;

  return (
    <div ref={panelRef}>
      <header
        className={`fixed top-0 left-0 w-full z-[120] transition-all duration-500 ${
          isScrolled ? "shadow-sm backdrop-blur-sm" : "bg-transparent"
        }`}
        style={isScrolled ? { background: "var(--header-bg)" } : undefined}
      >
        <div className="flex h-16 items-center px-6">

          {/* Logo — se oculta cuando abre el search */}
          <AnimatePresence>
            {logoVisible && (
              <motion.div
                key="logo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="absolute left-1/2 -translate-x-1/2"
              >
                <Link to="/" aria-label="Ir al inicio">
                  <img
                    src={logo}
                    alt="M4RS"
                    className={`w-24 object-contain transition-all duration-300 ${
                      isScrolled || darkOnTop ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                    style={{
                      filter: theme === "light" ? "invert(1)" : "none",
                    }}
                  />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input de búsqueda — se expande sobre el header */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                key="search-input"
                initial={{ opacity: 0, width: "60%" }}
                animate={{ opacity: 1, width: "100%" }}
                exit={{ opacity: 0, width: "60%" }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="flex flex-1 items-center gap-3"
              >
                <MagnifyingGlassIcon className="h-4 w-4 shrink-0 text-[var(--text-soft)]" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar"
                  className="flex-1 border-0 bg-transparent text-sm tracking-wide text-[var(--text-main)] outline-none placeholder:text-[var(--text-soft)]"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Acciones — derecha */}
          <div className="ml-auto flex items-center gap-4">
            {searchOpen ? (
              <button
                type="button"
                onClick={closeSearch}
                className="text-[var(--text-soft)] transition hover:text-[var(--text-main)]"
                aria-label="Cerrar búsqueda"
              >
                <X className="size-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="grid place-items-center bg-transparent"
                aria-label="Abrir buscador"
              >
                <MagnifyingGlassIcon className={`h-5 w-5 cursor-pointer transition ${iconClasses}`} />
              </button>
            )}

            {/* Theme switch */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
              className="relative flex items-center rounded-full border border-[var(--border)] p-1 transition-colors"
              style={{ background: "var(--bg-soft)" }}
            >
              {/* Pill deslizante */}
              <motion.span
                className="absolute top-1 left-1 h-6 w-6 rounded-full"
                style={{ background: "var(--text-main)" }}
                animate={{ x: theme === "light" ? 0 : 24 }}
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />

              {/* Sol — modo claro */}
              <span
                className="relative z-10 flex h-6 w-6 items-center justify-center transition-colors duration-200"
                style={{ color: theme === "light" ? "var(--bg-page)" : "var(--text-soft)" }}
              >
                <Sun className="size-3.5" />
              </span>

              {/* Alien — modo oscuro */}
              <span
                className="relative z-10 flex h-6 w-6 items-center justify-center transition-colors duration-200"
                style={{ color: theme === "dark" ? "var(--bg-page)" : "var(--text-soft)" }}
              >
                <TbAlien style={{ fontSize: "14px" }} />
              </span>
            </button>

            {/* User icon */}
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => user ? setUserMenuOpen((o) => !o) : setAuthOpen(true)}
                className={`transition ${iconClasses}`}
                aria-label={user ? "Menú de usuario" : "Iniciar sesión"}
              >
                <UserIcon className="size-5" strokeWidth={1.5} />
              </button>

              {/* Dropdown para usuario autenticado */}
              <AnimatePresence>
                {user && userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 top-8 min-w-[180px] border border-[var(--border)] p-4"
                    style={{ background: "var(--bg-page)" }}
                  >
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--text-soft)]">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="mb-4 truncate text-xs text-[var(--text-soft)]">{user.email}</p>
                    <button
                      type="button"
                      onClick={() => { logout(); setUserMenuOpen(false); }}
                      className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--text-main)] transition-opacity hover:opacity-50"
                    >
                      Cerrar sesión
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <CartButton
                onClick={() => setCartOpen(true)}
                className="size-5 pb-1 md:size-7"
                iconClassName={iconClasses}
              />
              <CartDropdown open={cartOpen} onClose={() => setCartOpen(false)} />
            </div>
          </div>
        </div>

        {/* Línea divisoria cuando el search está abierto */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              exit={{ scaleX: 0 }}
              transition={{ duration: 0.2 }}
              className="h-px w-full origin-left bg-[var(--border)]"
            />
          )}
        </AnimatePresence>
      </header>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />

      {/* Panel de resultados — cae por debajo del header */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed top-16 left-0 right-0 z-[119] max-h-[70vh] overflow-y-auto border-b border-[var(--border)]"
            style={{ background: "var(--header-bg)", backdropFilter: "blur(12px)" }}
          >
            {results.length > 0 ? (
              <ul className="mx-auto max-w-2xl divide-y divide-[var(--border)] px-6">
                {results.map((product) => (
                  <li key={product.slug}>
                    <Link
                      to={`/producto/${product.slug}`}
                      onClick={closeSearch}
                      className="flex items-center gap-5 py-4 text-inherit no-underline transition-opacity hover:opacity-60"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-14 w-14 shrink-0 rounded-sm object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--text-soft)]">
                          {product.categories?.[0]?.name ?? "M4RS"}
                        </p>
                        <p className="mt-0.5 truncate text-sm font-medium text-[var(--text-main)]">
                          {product.name}
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-medium text-[var(--text-main)]">
                        {formatCurrency(product.price)}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mx-auto max-w-2xl px-6 py-10 text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-soft)]">
                  Sin resultados para "{query}"
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

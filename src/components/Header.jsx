import React, { useState, useEffect } from "react";
import { MagnifyingGlassIcon, UserIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import CartButton from "./cart/CartButton";
import CartDropdown from "./cart/CartDropdown";

export default function Header({ darkOnTop = false }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > window.innerHeight * 0.2);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/95 shadow-md backdrop-blur-sm"
          : "bg-transparent "
      }`}
    >
      <div
        className={`flex items-center justify-center h-16 px-6 transition-all duration-500 ${
          isScrolled ? "text-gray-700" : "text-white"
        }`}
      >
        {/* Logo centrado */}
        <Link
          to="/"
          className={`absolute left-1/2 -translate-x-1/2 text-2xl font-bold tracking-widest no-underline transition-colors ${logoClasses}`}
        >
          M4RS
        </Link>

        {/* Íconos alineados a la derecha */}
        <div
          className={`ml-auto flex items-center gap-5 ${
            isScrolled
              ? "text-gray-700"
              : darkOnTop
                ? "text-gray-700"
                : "text-white"
          }`}
        >
          {/* Lupa */}
          <MagnifyingGlassIcon
            className={`w-5 h-5 cursor-pointer transition ${iconClasses}`}
          />

          {/* Usuario */}
          <UserIcon
            className={`w-5 h-5 cursor-pointer transition ${iconClasses}`}
          />

          {/* Carrito / Bolsa */}
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
    </header>
  );
}

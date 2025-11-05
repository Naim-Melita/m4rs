import React, { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  UserIcon,
  ShoppingBagIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

export default function Header() {
  const [showHeader, setShowHeader] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight - 80) {
        setShowHeader(true);
      } else {
        setShowHeader(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 
      ${showHeader ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"}`}
    >
      <div className="flex items-center justify-center h-16 px-6 bg-white shadow-md">
        {/* Logo centrado */}
        <div className="absolute left-1/2 transform text-black -translate-x-1/2 text-2xl font-bold tracking-widest">
          M4RS
        </div>

        {/* Íconos alineados a la derecha */}
        <div className="ml-auto flex items-center gap-5 text-gray-700">
          {/* Lupa */}
          <MagnifyingGlassIcon className="w-5 h-5 cursor-pointer hover:text-black transition" />

          {/* Usuario */}
          <UserIcon className="w-5 h-5 cursor-pointer hover:text-black transition" />

          {/* Idioma
          <div className="flex items-center gap-1 cursor-pointer hover:text-black transition">
            <span className="text-sm">ES</span>
            <ChevronDownIcon className="w-4 h-4" />
          </div> */}

          {/* Moneda */}
          {/* <div className="flex items-center gap-1 cursor-pointer hover:text-black transition">
            <span role="img" aria-label="Argentina">
              🇦🇷
            </span>
            <span className="text-sm">USD$</span>
            <ChevronDownIcon className="w-4 h-4" />
          </div> */}

          {/* Carrito / Bolsa */}
          <ShoppingBagIcon className="w-5 h-5 cursor-pointer hover:text-black transition" />
        </div>
      </div>
    </header>
  );
}
import React, { useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="flex justify-between items-center h-20 px-6 relative bg-white shadow-sm">
      {/* Logo / Marca */}
      <div className="w-[52px] h-[52px] rounded-[12px] bg-black text-white font-bold text-lg flex items-center justify-center">
        M
      </div>

      {/* Buscador + Iconos */}
      <div className="flex items-center gap-4">
        {/* Buscador */}
        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-1 bg-white">
          <input
            type="text"
            placeholder="Buscar propuesta, tipografía..."
            className="outline-none text-sm w-[180px]"
          />
          <div className="ml-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M21 21l-4.35-4.35"
                stroke="black"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="11" cy="11" r="6" stroke="#333" strokeWidth="1.6" />
            </svg>
          </div>
        </div>

        {/* Iconos: Hamburguesa + Engranaje */}
        <div className="flex items-center gap-3">
          {/* Menú hamburguesa */}
                  <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
            >
      
        </button>

        </div>
      </div>

      {/* Menú desplegable */}
      {menuOpen && (
        <nav className="absolute top-full right-6 bg-black shadow-md rounded-lg p-4 z-10">
          <ul className="space-y-2 text-sm font-medium text-gray-800">
            <li className="cursor-pointer hover:text-black transition">Inicio</li>
            <li className="cursor-pointer hover:text-black transition">Propuestas</li>
            <li className="cursor-pointer hover:text-black transition">Contacto</li>
          </ul>
        </nav>
      )}
    </header>
  );
}
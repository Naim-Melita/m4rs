const NAV = [
  {
    label: "Colección",
    links: ["Shorts", "Accesorios", "Novedades", "Galería"],
  },
  {
    label: "Información",
    links: ["Envíos", "Devoluciones", "Privacidad", "Términos"],
  },
];

const SOCIAL = ["Instagram", "TikTok", "YouTube"];

const Footer = () => {
  return (
    <footer style={{ background: "var(--footer-bg)", color: "var(--footer-text)" }}>

      {/* Cuerpo principal */}
      <div className="mx-auto max-w-6xl px-6 pb-16 pt-20 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-[1fr_1fr_1.6fr]">

          {/* Columnas de nav */}
          {NAV.map(({ label, links }) => (
            <div key={label}>
              <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.4em] opacity-40">
                {label}
              </p>
              <ul className="space-y-3">
                {links.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm font-light no-underline opacity-70 transition-opacity hover:opacity-100"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div>
            <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.4em] opacity-40">
              Comunidad
            </p>
            <p className="text-sm font-light leading-relaxed opacity-70">
              Lanzamientos, cápsulas y cambios de sistema antes que nadie.
            </p>
            <form
              className="mt-6"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="flex border-b border-white/20">
                <input
                  type="email"
                  placeholder="Tu email"
                  className="flex-1 bg-transparent py-3 text-sm font-light outline-none placeholder:opacity-30"
                  style={{ color: "var(--footer-text)" }}
                />
                <button
                  type="submit"
                  className="shrink-0 pb-3 pl-4 text-[10px] font-semibold uppercase tracking-[0.3em] opacity-60 transition-opacity hover:opacity-100"
                >
                  Suscribir
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Barra inferior */}
      <div
        className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16"
        style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="flex flex-col gap-5 py-6 md:flex-row md:items-center md:justify-between">

          {/* Copyright */}
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] opacity-30">
            © 2025 M4RS
          </p>

          {/* Social */}
          <div className="flex gap-6">
            {SOCIAL.map((name) => (
              <a
                key={name}
                href="#"
                className="text-[10px] font-semibold uppercase tracking-[0.3em] no-underline opacity-40 transition-opacity hover:opacity-100"
              >
                {name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

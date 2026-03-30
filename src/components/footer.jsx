const Footer = () => {
  return (
    <footer
      className="mt-16 text-sm"
      style={{ background: "var(--footer-bg)", color: "var(--footer-text)" }}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-12 md:grid-cols-4">
        <div>
          <h4 className="mb-4 uppercase tracking-[0.3em] text-[var(--accent)]">
            Explore
          </h4>
          <ul className="space-y-2">
            {["Hombres", "Mujeres", "Niños", "Estilo de vida", "Noticias", "Galería"].map((item) => (
              <li key={item}>
                <a href="#" className="no-underline transition hover:text-[var(--accent)]">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 uppercase tracking-[0.3em] text-[var(--accent)]">
            Atención
          </h4>
          <ul className="space-y-2">
            {[
              "Contáctenos",
              "Envíos",
              "Política de Devoluciones",
              "Política de Privacidad",
              "Política de Cookies",
              "Términos y Condiciones",
            ].map((item) => (
              <li key={item}>
                <a href="#" className="no-underline transition hover:text-[var(--accent)]">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <h4 className="mb-4 uppercase tracking-[0.3em] text-[var(--accent)]">
            Suscribite
          </h4>
          <p className="max-w-xl text-[var(--footer-text)]">
            Recibí lanzamientos, cápsulas y cambios de sistema antes que nadie.
          </p>
          <form className="mt-5 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Tu email"
              className="theme-input h-12 flex-1 rounded-full px-5"
            />
            <button
              type="submit"
              className="theme-button-primary h-12 rounded-full px-6 text-sm font-semibold uppercase tracking-wide"
            >
              Suscribirme
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t px-6 py-6 text-xs uppercase md:flex-row">
        <div className="flex gap-6">
          <button className="transition hover:text-[var(--accent)]">Español</button>
          <button className="transition hover:text-[var(--accent)]">ARS$</button>
        </div>
        <div className="flex gap-4">
          <a href="#" className="no-underline transition hover:text-[var(--accent)]">
            Instagram
          </a>
          <a href="#" className="no-underline transition hover:text-[var(--accent)]">
            TikTok
          </a>
          <a href="#" className="no-underline transition hover:text-[var(--accent)]">
            YouTube
          </a>
        </div>
      </div>

      <div className="border-t px-6 py-6 text-center text-xs">
        © 2025 M4RS
      </div>
    </footer>
  );
};

export default Footer;

const Footer = () => {
  return (
    <footer style={{ background: "var(--footer-bg)", color: "var(--footer-text)" }}>
      <div
        className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16"
        style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-center justify-between py-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] opacity-30">
            © 2025 M4RS
          </p>
          <a
            href="https://www.instagram.com/m4rs_ok/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-semibold uppercase tracking-[0.3em] no-underline opacity-40 transition-opacity hover:opacity-100"
          >
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

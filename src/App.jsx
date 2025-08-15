import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight - 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Header */}
      <header className={`header ${scrolled ? "show" : ""}`}>
        <div className="logo">M4RS</div>
        <div className="header-right">
          <span className="icon">🔍</span>
          <span className="icon">🛒</span>
          <span className="icon">☰</span>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="overlay"></div>
        <div className={`hero-logo ${scrolled ? "to-header" : ""}`}>M4RS</div>
        <div className={`hero-subtitle ${scrolled ? "fade-out" : ""}`}>
          LO RARO SE VOLVIÓ ESTILO
        </div>
      </section>

      {/* Contenido */}
      <main>
        <div style={{ height: "200vh", padding: "2rem" }}>
          <h2>Contenido de la página</h2>
          <p>Scroll para ver la animación...</p>
        </div>
      </main>
    </>
  );
}

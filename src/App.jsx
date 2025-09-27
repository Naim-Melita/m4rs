import { useEffect, useState } from "react";
import "./index.css";
import Novedades from "./components/novedades";
import Footer from "./components/footer";
import { productos } from "./data";
import PromoSection from "./components/galery";


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
        <div className=  {`hero-subtitle ${scrolled ? "fade-out" : ""}`}>
          LO RARO SE VOLVIÓ ESTILO
        </div>
      </section>

      {/* Contenido principal */}
      <main>
        <div style={{ background: "#f2f2f2", padding: "2rem" }}>
             <Novedades productos={productos} />
            
        </div>
        <div>
          <PromoSection />
        </div>
            

      {/* Footer */}
      <Footer />
      </main>

     
    </>
  );
}
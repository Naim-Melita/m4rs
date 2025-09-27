import { useEffect, useState } from "react";
import GridIntro from "./components/Intro/Intro";
import "./App.css";

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [introVisible, setIntroVisible] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setIntroVisible(true), 100);
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight - 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(showTimer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <GridIntro />

      <header className={`header ${scrolled ? "show" : ""}`}>
        <div className="logo">M4RS</div>
      </header>

      <section className="hero">
        <div className="overlay"></div>
        <div className={`hero-logo ${scrolled ? "to-header" : ""}`}>M4RS</div>
        <div className={`hero-subtitle ${introVisible ? "visible" : ""} ${scrolled ? "fade-out" : ""}`}>
          LO RARO SE VOLVIO ESTILO
        </div>
      </section>

      <main className={`page-content ${scrolled ? "show" : ""}`}>
        <div style={{ height: "200vh", padding: "2rem" }}>
          <h2>Contenido de la pagina</h2>
          <p>Scroll para ver la animacion...</p>
        </div>
      </main>
    </>
  );
}

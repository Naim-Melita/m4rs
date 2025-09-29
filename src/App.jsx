import { useCallback, useEffect, useState } from "react";
import GridIntro from "./components/Intro/Intro";
import GlitchIntro from "./components/Intro/IntroGlitch";
import "./index.css";
import Novedades from "./components/novedades";
import Footer from "./components/footer";
import { productos } from "./data";

const INTRO_VARIANT = "glitch";
const introComponents = {
  grid: GridIntro,
  glitch: GlitchIntro,
};
import PromoSection from "./components/galery";


export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [introVisible, setIntroVisible] = useState(false);
  const [introFinished, setIntroFinished] = useState(false);
  const ActiveIntro = introComponents[INTRO_VARIANT] ?? GridIntro;

  const handleIntroComplete = useCallback(() => {
    setIntroFinished(true);
  }, []);

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

  const headerActive = scrolled || introFinished;

  return (
    <>
      <ActiveIntro onComplete={handleIntroComplete} />

      <header className={`header ${headerActive ? "show" : ""}`}>
        <div className={`logo ${introFinished ? "logo-animated" : ""}`}>M4RS</div>
        <div className="header-right">
          <span className="icon">?</span>
          <span className="icon">?</span>
          <span className="icon">?</span>
        </div>
      </header>

      <section className="hero">
        <div className="overlay"></div>
        <div
          className={`hero-logo ${scrolled ? "to-header" : ""} ${introFinished ? "hero-logo-animated" : ""}`}
          data-text="M4RS"
        >
          M4RS
        </div>
        <div
          className={`hero-subtitle ${introVisible ? "visible" : ""} ${scrolled ? "fade-out" : ""} ${
            introFinished ? "hero-subtitle-animated" : ""
          }`}
          data-text="LO RARO SE VOLVIO ESTILO"
        >
          LO RARO SE VOLVIO ESTILO
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

import { useCallback, useEffect, useState } from "react";
import GridIntro from "./components/Intro/Intro";
import GlitchIntro from "./components/Intro/IntroGlitch";
import "./index.css";
import Novedades from "./components/novedades";
import Footer from "./components/footer";
import { productos } from "./data";
import logo from "../src/assets/logo2.png";
import PromoSection from "./components/galery";

const INTRO_VARIANT = "glitch";
const introComponents = {
  grid: GridIntro,
  glitch: GlitchIntro,
};

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [introVisible, setIntroVisible] = useState(false);
  const [introFinished, setIntroFinished] = useState(false);
  const ActiveIntro = introComponents[INTRO_VARIANT] ?? GridIntro;

  const handleIntroComplete = useCallback(() => {
    setIntroFinished(true);
    // habilitar scroll cuando termina la intro
    document.body.style.overflow = "auto";
  }, []);

  useEffect(() => {
    // bloquear scroll al inicio
    document.body.style.overflow = "hidden";

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
      // restaurar scroll por si se desmonta
      document.body.style.overflow = "auto";
    };
  }, []);

  const headerActive = scrolled;

  return (
    <>
      <ActiveIntro onComplete={handleIntroComplete} />

      <header className={`header ${headerActive ? "show" : ""}`}>
        <div className={`logo ${introFinished ? "logo-animated" : ""}`}>
          M4RS
        </div>
        <div className="header-right">
          <span className="icon">?</span>
          <span className="icon">?</span>
          <span className="icon">?</span>
        </div>
      </header>

      <section className="hero">
        <div className="overlay"></div>
        <div
          className={`hero-logo  ${scrolled ? "to-header" : ""} ${
            introFinished ? "hero-logo-animated" : ""
          }`}
          data-text="M4RS"
        >
          {introFinished && (
            <img
              className="w-1/2 mx-auto md:w-full"
              src={logo}
              alt="logo"
              data-aos="flip-up"
            />
          )}
        </div>
        <div
          className={`hero-subtitle mt-2 text-center text-sm ${
            introVisible ? "visible" : ""
          } ${scrolled ? "fade-out" : ""} ${
            introFinished ? "hero-subtitle-animated" : ""
          }`}
          data-text="LO RARO SE VOLVIO ESTILO"
          data-aos="flip-down"
        >
          LO RARO SE VOLVIO ESTILO
        </div>
      </section>

      {/* Contenido principal */}
      <main>
        <div>
          <Novedades productos={productos} />
        </div>
        <PromoSection />
        {/* Footer */}
        <Footer />
      </main>
    </>
  );
}
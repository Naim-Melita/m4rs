import { useCallback, useEffect, useState } from "react";
import GridIntro from "../components/Intro/Intro";
import GlitchIntro from "../components/Intro/IntroGlitch";
import Novedades from "../components/novedades";
import Footer from "../components/footer";
import { productos } from "../data";
import logo from "../../src/assets/logo3.png";
import PromoSection from "../components/galery";
import Header from "../components/Header"; 

const INTRO_VARIANT = "glitch";
const introComponents = {
  grid: GridIntro,
  glitch: GlitchIntro,
};

export default function Home() {
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

  return (
    <>
      <ActiveIntro onComplete={handleIntroComplete} />
      <Header />
      <section className="hero">
        <div className="overlay"></div>
        <div
          className={`hero-logo  ${scrolled ? "to-header" : ""} ${
            introFinished ? "hero-logo-animated" : ""
          }`}
          data-text="M4RS"
        >
          {introFinished && (
            <div className="hero-logo-reveal">
              <img
                className="hero-logo-image w-1/2 mx-auto md:w-2/4"
                src={logo}
                alt="logo"
              />
            </div>
          )}
        </div>
      </section>
      <main className="theme-page">
        <div>
          <Novedades productos={productos} />
        </div>
        <PromoSection />
        <Footer />
      </main>
    </>
  );
}

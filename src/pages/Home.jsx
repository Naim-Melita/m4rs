import { useCallback, useEffect, useState } from "react";
import BlackMirrorIntro from "../components/Intro/BlackMirrorIntro";
import Novedades from "../components/novedades";
import Footer from "../components/footer";
import { useProducts } from "../hooks/useProducts";
import logo from "../../src/assets/logo3.png";
import PromoSection from "../components/galery";
import Header from "../components/Header";
import Starfield from "../components/Starfield";

const INTRO_VARIANT = "blackmirror";
const introComponents = {
  blackmirror: BlackMirrorIntro,
};

export default function Home() {
  const { products, loading } = useProducts();
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
    const threshold = document.documentElement.clientHeight - 80;
    const handleScroll = () => {
      setScrolled(window.scrollY > threshold);
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
        <Starfield
          className="hero-starfield"
          count={20}
          seed={909}
          sizeMin={18}
          sizeRange={18}
          topMin={12}
          topRange={68}
          leftMin={6}
          leftRange={88}
        />
        <div
          className={`hero-logo  ${scrolled ? "to-header" : ""} ${
            introFinished ? "hero-logo-animated" : ""
          }`}
          data-text="M4RS"
        >
          {introFinished && (
            <div className="hero-logo-reveal">
              <img
                className="hero-logo-image w-1/2 mx-auto md:w-2/4 mt-25  md:mt-0"
                src={logo}
                alt="logo"
              />
            </div>
          )}
        </div>
      </section>
      <main className="theme-page">
        <div>
          <Novedades productos={products} loading={loading} />
        </div>
        <PromoSection />
        <Footer />
      </main>
    </>
  );
}

import { useCallback, useEffect, useState } from "react";
import BlackMirrorIntro from "../components/Intro/BlackMirrorIntro";
import Novedades from "../components/novedades";
import Footer from "../components/footer";
import { useProducts } from "../hooks/useProducts";
import logo from "../../src/assets/logo3.png";
import UniversoPreview from "../components/UniversoPreview";
import Header from "../components/Header";
import Starfield from "../components/Starfield";

const INTRO_VARIANT = "blackmirror";
const introComponents = {
  blackmirror: BlackMirrorIntro,
};

const INTRO_COOLDOWN_MS = 30 * 60 * 1000; // 30 minutos
const INTRO_KEY = "m4rs_intro_last_seen";

function shouldShowIntro() {
  try {
    const last = localStorage.getItem(INTRO_KEY);
    if (!last) return true;
    return Date.now() - Number(last) > INTRO_COOLDOWN_MS;
  } catch {
    return true;
  }
}

function markIntroSeen() {
  try { localStorage.setItem(INTRO_KEY, String(Date.now())); } catch {}
}

export default function Home() {
  const { products, loading } = useProducts();
  const [scrolled, setScrolled] = useState(false);

  const skipIntro   = !shouldShowIntro();
  const [introFinished, setIntroFinished] = useState(skipIntro);
  const ActiveIntro = introComponents[INTRO_VARIANT];

  const handleIntroComplete = useCallback(() => {
    markIntroSeen();
    setIntroFinished(true);
    document.body.style.overflow = "auto";
  }, []);

  useEffect(() => {
    if (skipIntro) {
      document.body.style.overflow = "auto";
    } else {
      document.body.style.overflow = "hidden";
    }

    const threshold = document.documentElement.clientHeight - 80;
    const handleScroll = () => setScrolled(window.scrollY > threshold);

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.body.style.overflow = "auto";
    };
  }, [skipIntro]);

  return (
    <>
      {!skipIntro && <ActiveIntro onComplete={handleIntroComplete} />}
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
        <UniversoPreview />
        <Footer />
      </main>
    </>
  );
}

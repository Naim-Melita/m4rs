import { useEffect, useMemo, useState } from "react";
import styles from "./IntroGlitch.module.css";
import logo2 from "../../assets/logo2.png";

const IntroGlitch = ({ duration = 3600, onComplete = () => {} }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [glitchCycle, setGlitchCycle] = useState(false);

  const tagline = useMemo(() => "Lo raro se volvio estilo", []);

  useEffect(() => {
    const fadeDelay = Math.max(duration - 600, 0);
    const fadeTimeout = setTimeout(() => setIsFading(true), fadeDelay);
    const hideTimeout = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, duration);

    return () => {
      clearTimeout(fadeTimeout);
      clearTimeout(hideTimeout);
    };
  }, [duration, onComplete]);

  useEffect(() => {
    if (!isVisible) {
      return undefined;
    }

    const interval = setInterval(() => {
      setGlitchCycle((prev) => !prev);
    }, 1450);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) {
    return null;
  }

  return (
    <section
      className={`${styles.wrapper} ${isFading ? styles.fadeOut : ""}`}
      aria-label="Intro M4RS Glitch"
    >
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id="tvNoise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            seed="3"
          >
            <animate
              attributeName="baseFrequency"
              dur="3s"
              values="0.6;0.95;0.7;0.9;0.6"
              repeatCount="indefinite"
            />
            <animate
              attributeName="seed"
              dur="2.2s"
              values="2;8;3;5;2"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" scale="18" />
        </filter>
      </svg>
      <div className={styles.noiseOverlay} aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />
      <div
        className={`${styles.inner} ${glitchCycle ? styles.innerGlitch : ""}`}
      >
        <div className={styles.scanline} aria-hidden="true" />
        <div className={styles.title} style={{ "--logo-url": `url(${logo2})` }}>
          <div className={styles.logoWrap} style={{ "--img": `url(${logo2})` }}>
            <div className={`${styles.logo} ${styles.base}`} />
            <div className={`${styles.logo} ${styles.r}`} />
            <div className={`${styles.logo} ${styles.g}`} />
            <div className={`${styles.logo} ${styles.b}`} />

           
          </div>
        </div>

        <p className={styles.tagline} data-text={tagline}>
          {tagline}
        </p>
      </div>
    </section>
  );
};

export default IntroGlitch;

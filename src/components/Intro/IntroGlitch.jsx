import { useEffect, useMemo, useState } from "react";
import styles from "./IntroGlitch.module.css";

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
      <div className={styles.noiseOverlay} aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />
      <div className={`${styles.inner} ${glitchCycle ? styles.innerGlitch : ""}`}>
        <div className={styles.scanline} aria-hidden="true" />
        <div className={styles.title} data-text="M4RS">
          <span className={styles.titleShard}>M</span>
          <span className={styles.titleShard}>4</span>
          <span className={styles.titleShard}>R</span>
          <span className={styles.titleShard}>S</span>
        </div>
        <p className={styles.tagline} data-text={tagline}>
          {tagline}
        </p>
      </div>
    </section>
  );
};

export default IntroGlitch;

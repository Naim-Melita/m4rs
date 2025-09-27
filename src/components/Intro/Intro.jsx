import { useEffect, useMemo, useState } from "react";
import styles from "./Intro.module.css";
import ghostLogo from "../../assets/marcian.png";

const Intro = ({ duration = 3600 }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [typedTagline, setTypedTagline] = useState("");

  const fullTagline = useMemo(() => "Lo raro se volvio estilo", []);

  useEffect(() => {
    const fadeDelay = Math.max(duration - 600, 0);
    const fadeTimeout = setTimeout(() => setIsFading(true), fadeDelay);
    const hideTimeout = setTimeout(() => setIsVisible(false), duration);

    return () => {
      clearTimeout(fadeTimeout);
      clearTimeout(hideTimeout);
    };
  }, [duration]);

  useEffect(() => {
    if (!isVisible) {
      return undefined;
    }

    setTypedTagline("");
    let index = 0;
    const typingSpeed = Math.max(Math.floor(duration / (fullTagline.length + 6)), 60);

    const interval = setInterval(() => {
      index += 1;
      setTypedTagline(fullTagline.slice(0, index));

      if (index >= fullTagline.length) {
        clearInterval(interval);
      }
    }, typingSpeed);

    return () => clearInterval(interval);
  }, [duration, fullTagline, isVisible]);

  if (!isVisible) {
    return null;
  }

  const isTypingComplete = typedTagline.length === fullTagline.length;

  return (
    <section
      className={`${styles.wrapper} ${isFading ? styles.fadeOut : ""}`}
      aria-label="Intro MARS"
    >
      <div className={styles.inner}>
        <div className={styles.glowRing} aria-hidden="true" />
        <img src={ghostLogo} alt="Logo marciano de MARS" className={styles.logo} />
        <div className={styles.brand}>
          <span className={styles.letter}>M</span>
          <span className={styles.letter}>A</span>
          <span className={styles.letter}>R</span>
          <span className={styles.letter}>S</span>
        </div>
        <p className={styles.tagline} aria-live="polite">
          <span>{typedTagline}</span>
          <span
            className={`${styles.cursor} ${isTypingComplete ? styles.cursorComplete : ""}`}
            aria-hidden="true"
          />
        </p>
      </div>
    </section>
  );
};

export default Intro;

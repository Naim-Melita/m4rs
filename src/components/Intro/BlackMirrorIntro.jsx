import { useEffect, useRef, useState } from "react";
import styles from "./BlackMirrorIntro.module.css";
import logo from "../../assets/logo3.png";

// ── Fases ────────────────────────────────────────────────
const PHASE = { STATIC: 0, ACQUIRE: 1, LOCK: 2, HOLD: 3, EXIT: 4 };

// Ruido de canvas — dibuja píxeles aleatorios cada frame
function useCanvasNoise(canvasRef, active, intensity = 1) {
  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const { width, height } = canvas;
      const img = ctx.createImageData(width, height);
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const on = Math.random() < 0.45 * intensity;
        const v  = on ? Math.floor(Math.random() * 80 + 10) : 0;
        d[i] = d[i + 1] = d[i + 2] = v;
        d[i + 3] = on ? Math.floor(180 * intensity) : 0;
      }
      ctx.putImageData(img, 0, 0);
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [active, intensity, canvasRef]);
}

// ── Componente ───────────────────────────────────────────
export default function BlackMirrorIntro({ onComplete = () => {} }) {
  const [phase, setPhase]     = useState(PHASE.STATIC);
  const [visible, setVisible] = useState(true);
  const canvasRef             = useRef(null);

  const noiseIntensity =
    phase === PHASE.STATIC  ? 1    :
    phase === PHASE.ACQUIRE ? 0.7  :
    phase === PHASE.LOCK    ? 0.25 : 0.08;

  useCanvasNoise(canvasRef, visible, noiseIntensity);

  // Máquina de estados
  useEffect(() => {
    const t = [
      setTimeout(() => setPhase(PHASE.ACQUIRE), 500),
      setTimeout(() => setPhase(PHASE.LOCK),    1700),
      setTimeout(() => setPhase(PHASE.HOLD),    2800),
      setTimeout(() => setPhase(PHASE.EXIT),    3400),
      setTimeout(() => { setVisible(false); onComplete(); }, 3900),
    ];
    return () => t.forEach(clearTimeout);
  }, [onComplete]);

  if (!visible) return null;

  // Estilos dinámicos por fase
  const rgbSpread =
    phase === PHASE.STATIC  ? "16px" :
    phase === PHASE.ACQUIRE ? "10px" :
    phase === PHASE.LOCK    ? "3px"  : "0px";

  const rgbAnimation =
    phase <= PHASE.ACQUIRE
      ? "rgbDriftWide 0.3s steps(3) infinite"
      : phase === PHASE.LOCK
        ? "rgbDriftNarrow 0.5s steps(2) infinite"
        : "none";

  const showSlices  = phase === PHASE.ACQUIRE;
  const showTagline = phase >= PHASE.HOLD;

  return (
    <div className={`${styles.wrapper} ${phase === PHASE.EXIT ? styles.exit : ""}`}>

      {/* Estática */}
      <canvas ref={canvasRef} className={styles.noise} />

      {/* Scanlines */}
      <div className={styles.scanlines} aria-hidden />

      {/* Viñeta */}
      <div className={styles.vignette} aria-hidden />

      {/* Contenido */}
      <div className={styles.content}>
        <div className={styles.logoContainer}>

          {/* Canal rojo */}
          <img
            src={logo}
            className={`${styles.logo} ${styles.logoR}`}
            style={{
              transform: `translateX(-${rgbSpread})`,
              animation: rgbAnimation,
              opacity: phase >= PHASE.HOLD ? 0 : 0.65,
            }}
            alt=""
            aria-hidden
          />

          {/* Canal azul */}
          <img
            src={logo}
            className={`${styles.logo} ${styles.logoB}`}
            style={{
              transform: `translateX(${rgbSpread})`,
              animation: rgbAnimation,
              opacity: phase >= PHASE.HOLD ? 0 : 0.65,
            }}
            alt=""
            aria-hidden
          />

          {/* Logo principal */}
          <img
            src={logo}
            className={`${styles.logo} ${styles.logoMain}`}
            style={{
              opacity:
                phase === PHASE.STATIC  ? 0.4  :
                phase === PHASE.ACQUIRE ? 0.75 :
                phase === PHASE.LOCK    ? 0.92 : 1,
              filter:
                phase <= PHASE.ACQUIRE
                  ? "brightness(1.4) contrast(1.3)"
                  : "brightness(1.05)",
            }}
            alt="M4RS"
          />

          {/* Slices de glitch */}
          {showSlices && (
            <div className={styles.slicesWrap} aria-hidden>
              {["sliceA","sliceB","sliceC","sliceD","sliceE","sliceF"].map((s) => (
                <img
                  key={s}
                  src={logo}
                  className={`${styles.logo} ${styles.slice} ${styles[s]}`}
                  alt=""
                />
              ))}
            </div>
          )}
        </div>

        {/* Tagline */}
        <p className={`${styles.tagline} ${showTagline ? styles.taglineVisible : ""}`}>
          Lo raro se volvió estilo
        </p>
      </div>
    </div>
  );
}

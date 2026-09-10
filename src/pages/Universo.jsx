import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import Header from "../components/Header";
import Footer from "../components/footer";
import { useGallery } from "../hooks/useGallery";

// Ciclo de 6 para que el patrón no se repita ni en 2 ni en 3 columnas.
// Las clases van literales para que el JIT de Tailwind las detecte:
// construirlas con template strings no compila.
const ASPECTS = [
  "aspect-[3/4]", "aspect-[4/5]", "aspect-[1/1]",
  "aspect-[4/5]", "aspect-[3/4]", "aspect-[2/3]",
];
const OFFSETS_MD = ["md:mt-0", "md:mt-16"];
const OFFSETS_LG = ["lg:mt-0", "lg:mt-20", "lg:mt-10"];

export default function Universo() {
  const { images, loading, error } = useGallery();
  const [lightboxOpen,  setLightboxOpen]  = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const isEmpty = !loading && (error || images.length === 0);

  return (
    <>
      <Header darkOnTop />
      <main className="theme-page min-h-screen">

        {/* Encabezado */}
        <section className="px-6 pt-24 pb-12 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.45em] text-[var(--text-soft)]">
              M4RS
            </p>
            <h1 className="mt-3 text-2xl font-light tracking-wide text-[var(--text-main)] md:text-4xl">
              Universo visual
            </h1>
            <div className="mt-8 h-px w-full bg-[var(--border)]" />
          </div>
        </section>

        {/* Mosaico */}
        <section className="px-6 pb-28 sm:px-10 lg:px-16">
          {isEmpty ? (
            <div className="mx-auto max-w-6xl py-24 text-center">
              <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--text-soft)]">
                Pronto
              </p>
            </div>
          ) : (
            <div className="mx-auto grid max-w-6xl grid-cols-2 gap-2 md:gap-3 lg:grid-cols-3">
              {loading
                ? [0, 1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className={`${OFFSETS_MD[i % 2]} ${OFFSETS_LG[i % 3]}`}>
                      <div className={`${ASPECTS[i % 6]} w-full animate-pulse bg-neutral-500/10`} />
                    </div>
                  ))
                : images.map((image, i) => (
                    <button
                      key={image.id}
                      type="button"
                      onClick={() => openLightbox(i)}
                      aria-label={`Ampliar imagen ${i + 1}`}
                      className={`group block w-full cursor-zoom-in overflow-hidden border-0 bg-transparent p-0 ${OFFSETS_MD[i % 2]} ${OFFSETS_LG[i % 3]}`}
                    >
                      <img
                        src={image.url}
                        alt="Universo visual M4RS"
                        loading={i < 6 ? "eager" : "lazy"}
                        decoding="async"
                        className={`${ASPECTS[i % 6]} w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]`}
                      />
                    </button>
                  ))}
            </div>
          )}

          {!loading && !isEmpty && (
            <p className="mt-16 text-center text-[10px] uppercase tracking-[0.4em] text-[var(--text-soft)]">
              {images.length} {images.length === 1 ? "imagen" : "imágenes"}
            </p>
          )}
        </section>

        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          index={lightboxIndex}
          slides={images.map((image) => ({ src: image.url }))}
          plugins={[Zoom]}
          zoom={{ maxZoomPixelRatio: 3, scrollToZoom: true }}
        />
      </main>
      <Footer />
    </>
  );
}

import { Link } from "react-router-dom";
import { useGallery } from "../hooks/useGallery";

function Column({ images, className = "" }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {images.map((image) => (
        <div key={image.id} className="group relative overflow-hidden">
          <img
            src={image.url}
            alt="Universo visual M4RS"
            loading="lazy"
            className="aspect-[3/4] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        </div>
      ))}
    </div>
  );
}

function Skeletons() {
  return (
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-2 md:grid-cols-2">
      <div className="flex flex-col gap-2">
        {[0, 1].map((i) => (
          <div key={i} className="aspect-[3/4] w-full animate-pulse bg-neutral-500/10" />
        ))}
      </div>
      <div className="flex flex-col gap-2 md:mt-20">
        {[0, 1].map((i) => (
          <div key={i} className="aspect-[3/4] w-full animate-pulse bg-neutral-500/10" />
        ))}
      </div>
    </div>
  );
}

export default function UniversoPreview() {
  const { images, loading } = useGallery({ limit: 4 });

  // Sin imágenes la sección no existe; el chequeo va después del loading
  // para que no parpadee mientras carga.
  if (!loading && images.length === 0) return null;

  const left  = images.filter((_, i) => i % 2 === 0);
  const right = images.filter((_, i) => i % 2 === 1);

  return (
    <section className="px-6 py-20 sm:px-10 lg:px-16">

      {/* Header editorial */}
      <div className="mb-14 flex items-center justify-between gap-6">
        <div className="h-px flex-1 bg-[var(--border)]" />
        <div className="text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.45em] text-[var(--text-soft)]">
            M4RS
          </p>
          <h2 className="mt-1 text-xs font-semibold uppercase tracking-[0.35em] text-[var(--text-main)]">
            Universo visual
          </h2>
        </div>
        <div className="h-px flex-1 bg-[var(--border)]" />
      </div>

      {loading ? (
        <Skeletons />
      ) : (
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-2 md:grid-cols-2">
          <Column images={left} />
          <Column images={right} className="md:mt-20" />
        </div>
      )}

      <div className="mt-16 text-center">
        <Link
          to="/universo"
          className="border-b border-[var(--text-main)] pb-0.5 text-[10px] font-semibold uppercase tracking-[0.35em] text-[var(--text-main)] no-underline transition-opacity hover:opacity-50"
        >
          Explorar más
        </Link>
      </div>
    </section>
  );
}

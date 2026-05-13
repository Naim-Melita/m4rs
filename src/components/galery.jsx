import { promoGalleryCards } from "../data";

const PromoSection = () => {
  const left = [promoGalleryCards[0], promoGalleryCards[2]];
  const right = [promoGalleryCards[1], promoGalleryCards[3]];

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

      {/* Grid asimétrico — columna derecha desplazada */}
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-2 md:grid-cols-2">

        {/* Columna izquierda */}
        <div className="flex flex-col gap-2">
          {left.map((card, i) => (
            <div key={i} className="group relative overflow-hidden">
              <img
                src={card.image}
                alt={card.alt}
                className="aspect-[3/4] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
              {card.overlay && (
                <div className={`pointer-events-none absolute inset-0 ${card.overlay}`} />
              )}
            </div>
          ))}
        </div>

        {/* Columna derecha — desplazada hacia abajo */}
        <div className="flex flex-col gap-2 md:mt-20">
          {right.map((card, i) => (
            <div key={i} className="group relative overflow-hidden">
              <img
                src={card.image}
                alt={card.alt}
                className="aspect-[3/4] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
              {card.overlay && (
                <div className={`pointer-events-none absolute inset-0 ${card.overlay}`} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromoSection;

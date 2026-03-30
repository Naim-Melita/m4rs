import React from "react";
import { promoGalleryCards } from "../data";

const PromoSection = () => {
  return (
    <section className="w-full py-14">
      <h2 className="mb-3 text-center text-3xl font-bold uppercase text-[var(--text-main)]">
        Coleccion de imagenes
      </h2>
      <p className="theme-muted mx-auto mb-10 max-w-2xl text-center text-sm md:text-base">
        El mismo universo visual cambia de temperatura según el tema que elijas.
      </p>

      <div className="mx-auto grid grid-cols-1 gap-6 px-4 md:grid-cols-2">
        {promoGalleryCards.map((card) => (
          <article
            key={card.id}
            className={`group relative overflow-hidden rounded-[2rem] ${card.className ?? ""}`}
          >
            <img
              src={card.image}
              alt={card.alt}
              className={`w-full object-cover ${card.imageClassName ?? "h-[720px] md:h-[1000px]"}`}
            />
            {card.overlay ? <div className={`absolute inset-0 ${card.overlay}`} /> : null}
          </article>
        ))}
      </div>
    </section>
  );
};

export default PromoSection;

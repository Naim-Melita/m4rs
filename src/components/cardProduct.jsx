import { useState } from "react";
import { Link } from "react-router-dom";
import useCarritoStore from "../hooks/useCarritoStore";

const formatCurrency = (value) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);

const CardProduct = ({ product, offset = false }) => {
  const addItem = useCarritoStore((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const { name, image, price, slug, categories } = product;
  const category = categories?.[0]?.name ?? "M4RS";

  const handleAdd = (e) => {
    e.preventDefault();
    addItem({
      id: product.id,
      title: product.name,
      price: product.price,
      image: product.image,
      categories: product.categories,
      discountPercentage: product.discountPercentage ?? 0,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <article className={`group w-full ${offset ? "md:mt-20" : ""}`}>
      <Link to={`/producto/${slug}`} className="block text-inherit no-underline">
        {/* Imagen */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-900/5">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Overlay con CTA — aparece en hover */}
          <div className="absolute inset-0 flex items-end p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <button
              type="button"
              onClick={handleAdd}
              className="w-full cursor-pointer border border-white/80 bg-black/60 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm transition-colors hover:bg-black/80"
            >
              {added ? "Agregado ✓" : "Agregar al carrito"}
            </button>
          </div>
        </div>

        {/* Info debajo de la imagen */}
        <div className="mt-4 space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--text-soft)]">
            {category}
          </p>
          <h3 className="text-sm font-medium tracking-wide text-[var(--text-main)] md:text-base">
            {name}
          </h3>
          <p className="text-sm text-[var(--text-muted)]">
            {formatCurrency(price)}
          </p>
        </div>
      </Link>
    </article>
  );
};

export default CardProduct;

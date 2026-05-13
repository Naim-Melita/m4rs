import CardProduct from "./cardProduct";

const Novedades = ({ productos, loading }) => {
  return (
    <section className="px-6 py-20 sm:px-10 lg:px-16">

      {/* Header editorial */}
      <div className="mb-14 flex items-center justify-between gap-6">
        <div className="h-px flex-1 bg-[var(--border)]" />
        <div className="text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.45em] text-[var(--text-soft)]">
            Colección
          </p>
          <h2 className="mt-1 text-xs font-semibold uppercase tracking-[0.35em] text-[var(--text-main)]">
            Novedades
          </h2>
        </div>
        <div className="h-px flex-1 bg-[var(--border)]" />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2">
          {[0, 1].map((i) => (
            <div key={i} className={`w-full ${i === 1 ? "md:mt-20" : ""}`}>
              <div className="aspect-[3/4] w-full animate-pulse bg-neutral-500/10" />
              <div className="mt-4 space-y-2">
                <div className="h-2.5 w-16 animate-pulse rounded bg-neutral-500/10" />
                <div className="h-3 w-32 animate-pulse rounded bg-neutral-500/10" />
                <div className="h-3 w-20 animate-pulse rounded bg-neutral-500/10" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2">
          {productos.map((item, index) => (
            <CardProduct key={item.slug} product={item} offset={index % 2 !== 0} />
          ))}
        </div>
      )}

      {/* Pie editorial */}
      {!loading && productos.length > 0 && (
        <div className="mt-20 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--text-soft)]">
            {productos.length} {productos.length === 1 ? "pieza" : "piezas"} disponibles
          </p>
        </div>
      )}
    </section>
  );
};

export default Novedades;

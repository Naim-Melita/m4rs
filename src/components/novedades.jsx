import CardProduct from "./cardProduct";
import Starfield from "./Starfield";

const Novedades = ({ productos }) => {
  return (
    <section className="novedades-section py-14">
      <Starfield
        className="novedades-starfield"
        count={10}
        seed={1201}
        sizeMin={14}
        sizeRange={14}
        topMin={8}
        topRange={80}
        leftMin={4}
        leftRange={92}
      />

      <div className="novedades-content">
        <h2 className="mb-3 text-center text-3xl font-bold uppercase text-[var(--text-main)]">
          Novedades
        </h2>
        <p className="theme-muted mx-auto mb-10 max-w-2xl text-center text-sm md:text-base">
          Dos paletas, una misma identidad. Elegí tu modo y seguí explorando la colección.
        </p>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 md:grid-cols-2">
            {productos.map((item) => (
              <div key={item.id} className="flex justify-center">
                <CardProduct product={item} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Novedades;

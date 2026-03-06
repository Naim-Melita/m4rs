import CardProduct from "./cardProduct";

const Novedades = ({ productos }) => {
  return (
    <section className="py-10">
      <h2 className="mb-6 text-center text-3xl font-bold uppercase text-black">
        Novedades
      </h2>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 md:grid-cols-2">
          {productos.map((item) => (
            <div key={item.id} className="flex justify-center">
              <CardProduct product={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Novedades;

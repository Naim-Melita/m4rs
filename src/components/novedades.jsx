import "swiper/css";
import CardProduct from "./cardProduct";
import useCarritoStore from "../hooks/useCarritoStore";

const Novedades = ({ productos }) => {

  return (
    <section className="py-10">
      <h2 className="text-3xl font-bold mb-6 uppercase text-black text-center">
        Novedades
      </h2>

      <div className="flex justify-center">
        <div className="grid container grid-cols-1 md:grid-cols-4 justify-center place-items-center">
          {productos.map((item) => (
           <CardProduct key={item.name} product={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Novedades;
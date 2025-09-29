import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const Novedades = ({ productos }) => {
  return (
    <section className="py-10">
      <h2 className="text-3xl font-bold mb-6 uppercase text-black text-center">
        Novedades
      </h2>

      <div className="flex justify-center">
        <div className="grid container grid-cols-1 md:grid-cols-4 justify-center place-items-center">
          {productos.map((item) => (
            <div key={item.nombre}>
              <div className="group cursor-pointer ">
                {/* Imagen */}
                <div className="relative w-full  overflow-hidden bg-[#f5f5f5] rounded-md mx-auto">
                  <img
                    src={item.imagen}
                    alt={item.nombre}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                {/* Texto */}
                <h3 className="mt-3 text-black text-sm font-normal tracking-wide text-center">
                  {item.nombre}
                </h3>
                <p className="text-black text-sm text-center">{item.precio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Novedades;
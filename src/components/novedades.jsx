import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const Novedades = ({ productos }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-500 text-center">Novedades</h2>

      <Swiper
        spaceBetween={30}
        slidesPerView={2}
        breakpoints={{
          640: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
        className="flex justify-center"
      >
        {productos.map((item, i) => (
          <SwiperSlide key={i} className="flex justify-center">
            <div className="group cursor-pointer w-[180px]">
              {/* Imagen */}
              <div className="relative w-full h-[220px] overflow-hidden bg-[#f5f5f5] rounded-md mx-auto">
                <img
                  src={item.imagen}
                  alt={item.nombre}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Overlay opcional */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button className="bg-white text-black px-3 py-1 text-xs font-medium">
                    Ver más
                  </button>
                </div>
              </div>

              {/* Texto */}
              <h3 className="mt-3 text-sm font-normal tracking-wide text-center">
                {item.nombre}
              </h3>
              <p className="text-gray-500 text-sm text-center">{item.precio}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Novedades;
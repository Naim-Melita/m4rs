import React from "react";
import galleryImage1 from "../assets/galery1.jpg";
import galleryImage2 from "../assets/galery2.jpg";

const PromoSection = () => {
  return (
    <section className="w-full bg-white py-12 ">
      {/* Titulo principal */}
      <h2 className="text-3xl font-bold mb-6 uppercase text-black text-center">
        Coleccion de imagenes
      </h2>

      {/* Contenedor de las dos imagenes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-auto px-4">
        {/* Imagen 1 */}
        <div className="relative group">
          <img
            src={galleryImage1}
            alt="Wild Leopard"
            className="w-full h-[1000px] object-cover"
          />
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white text-center">
            <h3 className="text-2xl font-bold">WILD LEOPARD</h3>
            <button className="mt-4 px-6 py-2 bg-black text-white text-sm uppercase tracking-wide hover:bg-gray-800 transition">
              Compra ahora
            </button>
          </div>
        </div>

        {/* Imagen 2 */}
        <div className="relative group">
          <img
            src={galleryImage2}
            alt="88Rising Collab"
            className="w-full h-[1000px] object-cover"
          />
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white text-center">
            <h3 className="text-2xl font-bold">88Rising</h3>
            <button className="mt-4 px-6 py-2 bg-black text-white text-sm uppercase tracking-wide hover:bg-gray-800 transition">
              Compra ahora
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoSection;
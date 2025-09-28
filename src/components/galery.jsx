import React from "react";

const PromoSection = () => {
  return (
    <section className="w-full bg-white py-12">
      {/* Título principal */}
      <h2 className="text-3xl text-black font-bold text-center mb-10 tracking-wide uppercase">
        Galería de imágenes
      </h2>

      {/* Contenedor de las dos imágenes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-auto px-4">
        
        {/* Imagen 1 */}
        <div className="relative group">
          <img
            src="/src/images/Bape_Fall25_Ad_Banner_AUG_Bape_tmall_750x750_0ea5af47-d862-49b1-a83e-9bf4101534dd (1).webp"
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
            src="/src/images/BAPE_x_88rising_BANNER_Bape_tmall_1200x1200_4499c2eb-56e8-4a0a-86ff-1178135ce17d (1).webp"
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
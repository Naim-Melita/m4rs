
import useCarritoStore from "../hooks/useCarritoStore";

const CardProduct = ({ product }) => {

  const addItem = useCarritoStore((s) => s.addItem);

  const { name, image, price } = product;
  return (
    <div key={name} className="flex flex-col items-center gap-2">
      <div className="group cursor-pointer ">
        {/* Imagen */}
        <div className="relative w-full  overflow-hidden bg-[#f5f5f5] rounded-md mx-auto">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* Texto */}
        <h3 className="mt-3 text-black text-sm font-normal tracking-wide text-center">
          {name}
        </h3>
        <p className="text-black font-bold mt-2 text-sm text-center">{price}</p>
      </div>

      <button className="mt-4 px-6 py-2 cursor-pointer bg-black text-white text-sm uppercase tracking-wide hover:bg-gray-800 transition" onClick={() => addItem(product)}>Agregar al carrito</button>
    </div>
  );
};

export default CardProduct;

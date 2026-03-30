import { Link } from "react-router-dom";
import useCarritoStore from "../hooks/useCarritoStore";

const formatCurrency = (value) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);

const CardProduct = ({ product }) => {
  const addItem = useCarritoStore((s) => s.addItem);
  const { name, image, price } = product;

  return (
    <div key={name} className="flex flex-col items-center gap-2">
      <Link
        to={`/producto/${product.id}`}
        className="group cursor-pointer text-inherit no-underline"
      >
        <div className="theme-panel relative mx-auto w-full overflow-hidden ">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <h3 className="mt-4 text-center text-sm font-normal tracking-wide text-[var(--text-main)]">
          {name}
        </h3>
        <p className="theme-accent-text mt-2 text-center text-sm font-bold">
          {formatCurrency(price)}
        </p>
      </Link>

      <button
        className="theme-button-primary mt-4 cursor-pointer rounded-full px-6 py-2 text-sm uppercase tracking-wide"
        onClick={() =>
          addItem({
            id: product.id,
            title: product.name,
            price: product.price,
            image: product.image,
            categories: product.categories,
            discountPercentage: product.discountPercentage ?? 0,
          })
        }
      >
        Agregar al carrito
      </button>
    </div>
  );
};

export default CardProduct;

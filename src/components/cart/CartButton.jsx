import useCartStore from "../../hooks/useCarritoStore"; // o "@/stores/useCartStore" si lo renombraste
import { ShoppingBagIcon } from "@heroicons/react/24/outline";

export default function CartButton({
  onClick,
  className,
  iconClassName = "",
}) {
  const total = useCartStore(
    (s) =>
      s.getTotalItems?.() ??
      s.items?.reduce((a, it) => a + (it.quantity ?? 1), 0)
  );

  const baseClass =
    "relative flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#840c4a]/70";

  return (
    <button
      type="button"
      onClick={onClick}
      className={className ? `${baseClass} ${className}` : baseClass}
      aria-label="Abrir carrito"
    >
      <ShoppingBagIcon
        className={`w-5 h-5 cursor-pointer transition ${iconClassName}`}
      />
      {total > 0 && (
        <span className="absolute bottom-5 left-4 min-w-[18px] h-[18px] px-1 rounded-full bg-[#840c4a] text-white text-[11px] leading-[18px] text-center">
          {total}
        </span>
      )}
    </button>
  );
}

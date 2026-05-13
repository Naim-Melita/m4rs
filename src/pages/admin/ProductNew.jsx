import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ProductForm from "../../components/admin/ProductForm";
import { createProduct } from "../../api/admin";

export default function ProductNew() {
  const navigate  = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const handleSubmit = async (data) => {
    setLoading(true);
    setError(null);
    try {
      await createProduct(data);
      navigate("/admin/productos");
    } catch (err) {
      setError(err.response?.data?.error ?? "Error al crear el producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-10 py-12">
      {/* Header */}
      <div className="mb-10">
        <Link
          to="/admin/productos"
          className="mb-4 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--text-soft)] no-underline transition-opacity hover:opacity-50"
        >
          <ArrowLeft className="size-3.5" />
          Volver
        </Link>
        <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[var(--text-soft)]">Admin</p>
        <h1 className="mt-1 text-2xl font-light text-[var(--text-main)]">Nuevo producto</h1>
      </div>

      {error && (
        <p className="mb-6 border border-red-400 px-4 py-3 text-xs text-red-400">{error}</p>
      )}

      <ProductForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}

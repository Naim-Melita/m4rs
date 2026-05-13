import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Trash2 } from "lucide-react";
import ProductForm from "../../components/admin/ProductForm";
import { getAdminProduct, updateProduct, deleteProduct } from "../../api/admin";

export default function ProductEdit() {
  const { slug }   = useParams();
  const navigate   = useNavigate();

  const [product,  setProduct]  = useState(null);
  const [fetching, setFetching] = useState(true);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    getAdminProduct(slug)
      .then(setProduct)
      .catch(() => setError("Producto no encontrado"))
      .finally(() => setFetching(false));
  }, [slug]);

  const handleSubmit = async (data) => {
    setLoading(true);
    setError(null);
    try {
      await updateProduct(slug, data);
      navigate("/admin/productos");
    } catch (err) {
      setError(err.response?.data?.error ?? "Error al guardar el producto");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setLoading(true);
    try {
      await deleteProduct(slug);
      navigate("/admin/productos");
    } catch (err) {
      setError(err.response?.data?.error ?? "Error al eliminar el producto");
      setLoading(false);
    }
  };

  return (
    <div className="px-10 py-12">
      {/* Header */}
      <div className="mb-10 flex items-start justify-between">
        <div>
          <Link
            to="/admin/productos"
            className="mb-4 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--text-soft)] no-underline transition-opacity hover:opacity-50"
          >
            <ArrowLeft className="size-3.5" />
            Volver
          </Link>
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[var(--text-soft)]">Admin</p>
          <h1 className="mt-1 text-2xl font-light text-[var(--text-main)]">
            {product ? product.name : "Editar producto"}
          </h1>
        </div>

        {product && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className={`flex items-center gap-2 border px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.25em] transition-colors disabled:opacity-40 ${
              confirmDelete
                ? "border-red-500 bg-red-500 text-white"
                : "border-[var(--border)] text-[var(--text-soft)] hover:border-red-400 hover:text-red-400"
            }`}
          >
            <Trash2 className="size-3.5" />
            {confirmDelete ? "¿Confirmar?" : "Eliminar"}
          </button>
        )}
      </div>

      {error && (
        <p className="mb-6 border border-red-400 px-4 py-3 text-xs text-red-400">{error}</p>
      )}

      {fetching ? (
        <p className="text-xs text-[var(--text-soft)]">Cargando...</p>
      ) : product ? (
        <ProductForm initial={product} onSubmit={handleSubmit} loading={loading} />
      ) : null}
    </div>
  );
}

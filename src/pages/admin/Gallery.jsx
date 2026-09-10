import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Loader, Trash2, Upload } from "lucide-react";
import { AdminPage, PageHeader } from "../../components/admin/AdminPage";
import { useToast } from "../../context/ToastContext";
import {
  addGalleryImage,
  deleteGalleryImage,
  getAdminGallery,
  reorderGallery,
  uploadImage,
} from "../../api/admin";

export default function AdminGallery() {
  const toast   = useToast();
  const fileRef = useRef(null);

  const [images, setImages]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dirty, setDirty]         = useState(false);
  const [saving, setSaving]       = useState(false);

  useEffect(() => {
    getAdminGallery()
      .then(setImages)
      .catch(() => toast("Error al cargar la galería", { type: "error" }))
      .finally(() => setLoading(false));
  }, []);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);
    try {
      // Secuencial: cada POST se numera contra el último existente, así que
      // en paralelo dos subidas podrían pelearse el mismo order.
      for (const file of files) {
        const { url, publicId } = await uploadImage(file, "gallery");
        const image = await addGalleryImage({ url, publicId });
        setImages((prev) => [...prev, image]);
      }
      toast(files.length === 1 ? "Imagen subida" : `${files.length} imágenes subidas`, { type: "success" });
    } catch (err) {
      toast(err.response?.data?.error ?? "Error al subir la imagen", { type: "error" });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async (image) => {
    if (!window.confirm("¿Eliminar esta imagen? No se puede deshacer.")) return;
    try {
      await deleteGalleryImage(image.id);
      setImages((prev) => prev.filter((i) => i.id !== image.id));
      toast("Imagen eliminada", { type: "success" });
    } catch (err) {
      toast(err.response?.data?.error ?? "Error al eliminar", { type: "error" });
    }
  };

  const move = (idx, dir) => {
    const next = idx + dir;
    if (next < 0 || next >= images.length) return;
    const reordered = [...images];
    [reordered[idx], reordered[next]] = [reordered[next], reordered[idx]];
    setImages(reordered);
    setDirty(true);
  };

  const handleSaveOrder = async () => {
    setSaving(true);
    try {
      await reorderGallery(images.map((i) => i.id));
      setDirty(false);
      toast("Orden guardado", { type: "success" });
    } catch (err) {
      toast(err.response?.data?.error ?? "Error al guardar el orden", { type: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminPage>
      <PageHeader
        title="Universo visual"
        meta={!loading ? `${images.length} ${images.length === 1 ? "imagen" : "imágenes"}` : undefined}
        action={
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center justify-center gap-2 border border-[var(--text-main)] bg-[var(--text-main)] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--bg-page)] transition-opacity hover:opacity-80 disabled:opacity-40 sm:py-2.5"
          >
            {uploading
              ? <><Loader className="size-3.5 animate-spin" /> Subiendo</>
              : <><Upload className="size-3.5" /> Subir</>}
          </button>
        }
      />

      <input
        ref={fileRef} type="file" accept="image/*" multiple
        className="hidden" onChange={handleUpload}
      />

      {dirty && (
        <div className="mb-8 flex flex-col gap-3 border border-[var(--border)] p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[var(--text-soft)]">
            Cambiaste el orden. Guardá para que se vea en el sitio.
          </p>
          <button
            type="button" onClick={handleSaveOrder} disabled={saving}
            className="border border-[var(--text-main)] bg-[var(--text-main)] px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--bg-page)] transition-opacity hover:opacity-80 disabled:opacity-40"
          >
            {saving ? "Guardando..." : "Guardar orden"}
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-xs text-[var(--text-soft)]">Cargando...</p>
      ) : images.length === 0 ? (
        <div className="border-t border-[var(--border)] py-16 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--text-soft)]">
            Sin imágenes
          </p>
          <p className="mt-3 text-xs text-[var(--text-soft)]">
            Subí las primeras para que aparezca la sección en el home.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3 border-t border-[var(--border)] pt-8 sm:grid-cols-4 md:grid-cols-6">
            {images.map((image, idx) => (
              <div key={image.id} className="group">
                <div className="relative">
                  <img src={image.url} alt="" className="aspect-[3/4] w-full object-cover" />
                  <button
                    type="button" onClick={() => handleDelete(image)}
                    aria-label="Eliminar imagen"
                    className="absolute right-1 top-1 rounded-full bg-black/60 p-1.5 opacity-100 transition-opacity md:p-1 md:opacity-0 md:group-hover:opacity-100"
                  >
                    <Trash2 className="size-3 text-white" />
                  </button>
                </div>

                <div className="flex border border-t-0 border-[var(--border)]">
                  <button
                    type="button" onClick={() => move(idx, -1)} disabled={idx === 0}
                    aria-label="Mover a la izquierda"
                    className="flex flex-1 items-center justify-center py-1.5 text-[var(--text-soft)] transition-opacity hover:opacity-50 disabled:opacity-20"
                  >
                    <ChevronLeft className="size-3.5" />
                  </button>
                  <button
                    type="button" onClick={() => move(idx, 1)} disabled={idx === images.length - 1}
                    aria-label="Mover a la derecha"
                    className="flex flex-1 items-center justify-center border-l border-[var(--border)] py-1.5 text-[var(--text-soft)] transition-opacity hover:opacity-50 disabled:opacity-20"
                  >
                    <ChevronRight className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-6 text-[10px] text-[var(--text-soft)]">
            Las últimas cuatro son las que aparecen en el home. Usá las flechas para reordenar.
          </p>
        </>
      )}
    </AdminPage>
  );
}

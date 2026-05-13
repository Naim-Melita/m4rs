import { useRef, useState } from "react";
import { Plus, Trash2, Upload, Loader } from "lucide-react";
import { uploadImage } from "../../api/admin";

const inputClass =
  "w-full border-b border-[var(--border)] bg-transparent py-2.5 text-sm text-[var(--text-main)] placeholder:text-[var(--text-soft)] outline-none focus:border-[var(--text-main)] transition-colors";

const Label = ({ children }) => (
  <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--text-soft)]">
    {children}
  </span>
);

const Section = ({ title, children }) => (
  <div className="border-t border-[var(--border)] pt-8">
    <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.4em] text-[var(--text-soft)]">
      {title}
    </p>
    {children}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────

export default function ProductForm({ initial = {}, onSubmit, loading }) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name:        initial.name        ?? "",
    slug:        initial.slug        ?? "",
    description: initial.description ?? "",
    fitGuide:    initial.fitGuide    ?? "",
    isActive:    initial.isActive    ?? true,
    images:      initial.images?.map((i) => i.url) ?? [],
    variants:    initial.variants?.map((v) => ({
      size: v.size ?? "", price: String(v.price ?? ""), stock: String(v.stock ?? "0"), sku: v.sku ?? "",
    })) ?? [],
    features:    initial.features?.map((f) => f.text)  ?? [],
    composition: initial.composition?.map((c) => ({ label: c.label, value: c.value })) ?? [],
    care:        initial.care?.map((c) => c.text)       ?? [],
    categoryIds: initial.categories?.map((c) => c.category?.id ?? c.categoryId) ?? [],
  });

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  // ── Imágenes ──────────────────────────────────────────────
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      const urls = await Promise.all(files.map(uploadImage));
      set("images", [...form.images, ...urls]);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (idx) =>
    set("images", form.images.filter((_, i) => i !== idx));

  // ── Variantes ─────────────────────────────────────────────
  const addVariant = () =>
    set("variants", [...form.variants, { size: "", price: "", stock: "0", sku: "" }]);

  const updateVariant = (idx, key, val) =>
    set("variants", form.variants.map((v, i) => i === idx ? { ...v, [key]: val } : v));

  const removeVariant = (idx) =>
    set("variants", form.variants.filter((_, i) => i !== idx));

  // ── Listas simples (features, care) ──────────────────────
  const addLine    = (key) => set(key, [...form[key], ""]);
  const updateLine = (key, idx, val) => set(key, form[key].map((v, i) => i === idx ? val : v));
  const removeLine = (key, idx) => set(key, form[key].filter((_, i) => i !== idx));

  // ── Composición ───────────────────────────────────────────
  const addComp    = () => set("composition", [...form.composition, { label: "", value: "" }]);
  const updateComp = (idx, key, val) =>
    set("composition", form.composition.map((c, i) => i === idx ? { ...c, [key]: val } : c));
  const removeComp = (idx) =>
    set("composition", form.composition.filter((_, i) => i !== idx));

  // ── Submit ────────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      variants: form.variants.map((v) => ({
        ...v,
        price: Number(v.price),
        stock: Number(v.stock),
      })),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">

      {/* ── Info básica ── */}
      <Section title="Información básica">
        <div className="grid gap-6 md:grid-cols-2">
          <label>
            <Label>Nombre</Label>
            <input required value={form.name} onChange={(e) => set("name", e.target.value)} className={inputClass} />
          </label>
          <label>
            <Label>Slug</Label>
            <input required value={form.slug} onChange={(e) => set("slug", e.target.value)} className={inputClass} placeholder="nombre-del-producto" />
          </label>
        </div>
        <label className="mt-6 block">
          <Label>Descripción</Label>
          <textarea
            required rows={4} value={form.description}
            onChange={(e) => set("description", e.target.value)}
            className={`${inputClass} resize-none`}
          />
        </label>
        <label className="mt-6 block">
          <Label>Guía de talle</Label>
          <input value={form.fitGuide} onChange={(e) => set("fitGuide", e.target.value)} className={inputClass} />
        </label>
        <label className="mt-6 flex items-center gap-3">
          <input
            type="checkbox" checked={form.isActive}
            onChange={(e) => set("isActive", e.target.checked)}
            className="h-4 w-4 accent-[var(--text-main)]"
          />
          <span className="text-xs text-[var(--text-main)]">Producto activo (visible en la tienda)</span>
        </label>
      </Section>

      {/* ── Imágenes ── */}
      <Section title="Imágenes">
        <div className="flex flex-wrap gap-3">
          {form.images.map((url, idx) => (
            <div key={idx} className="group relative">
              <img src={url} alt="" className="h-24 w-20 object-cover" />
              {idx === 0 && (
                <span className="absolute left-0 top-0 bg-[var(--text-main)] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[var(--bg-page)]">
                  Principal
                </span>
              )}
              <button
                type="button" onClick={() => removeImage(idx)}
                className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Trash2 className="size-3 text-white" />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex h-24 w-20 flex-col items-center justify-center border border-dashed border-[var(--border)] text-[var(--text-soft)] transition-opacity hover:opacity-60 disabled:opacity-40"
          >
            {uploading
              ? <Loader className="size-4 animate-spin" />
              : <><Upload className="size-4" /><span className="mt-1 text-[9px]">Subir</span></>
            }
          </button>
          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
        </div>
        <p className="mt-2 text-[10px] text-[var(--text-soft)]">La primera imagen es la principal. Arrastrá para reordenar.</p>
      </Section>

      {/* ── Variantes ── */}
      <Section title="Variantes (tallas y precios)">
        <div className="space-y-3">
          {form.variants.map((v, idx) => (
            <div key={idx} className="grid grid-cols-[80px_1fr_1fr_1fr_auto] gap-3 items-end">
              <label>
                {idx === 0 && <Label>Talle</Label>}
                <input value={v.size} onChange={(e) => updateVariant(idx, "size", e.target.value)} placeholder="S" className={inputClass} />
              </label>
              <label>
                {idx === 0 && <Label>Precio (ARS)</Label>}
                <input type="number" value={v.price} onChange={(e) => updateVariant(idx, "price", e.target.value)} placeholder="0" className={inputClass} />
              </label>
              <label>
                {idx === 0 && <Label>Stock</Label>}
                <input type="number" value={v.stock} onChange={(e) => updateVariant(idx, "stock", e.target.value)} placeholder="0" className={inputClass} />
              </label>
              <label>
                {idx === 0 && <Label>SKU</Label>}
                <input value={v.sku} onChange={(e) => updateVariant(idx, "sku", e.target.value)} placeholder="auto" className={inputClass} />
              </label>
              <button type="button" onClick={() => removeVariant(idx)} className="pb-2 text-[var(--text-soft)] hover:opacity-50">
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addVariant} className="mt-4 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--text-soft)] hover:opacity-50">
          <Plus className="size-3.5" /> Agregar variante
        </button>
      </Section>

      {/* ── Features ── */}
      <Section title="Características">
        <div className="space-y-2">
          {form.features.map((f, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <input value={f} onChange={(e) => updateLine("features", idx, e.target.value)} placeholder="Ej: 100% algodón orgánico" className={`${inputClass} flex-1`} />
              <button type="button" onClick={() => removeLine("features", idx)} className="text-[var(--text-soft)] hover:opacity-50"><Trash2 className="size-4" /></button>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => addLine("features")} className="mt-4 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--text-soft)] hover:opacity-50">
          <Plus className="size-3.5" /> Agregar característica
        </button>
      </Section>

      {/* ── Composición ── */}
      <Section title="Composición">
        <div className="space-y-2">
          {form.composition.map((c, idx) => (
            <div key={idx} className="grid grid-cols-[1fr_2fr_auto] gap-3 items-center">
              <input value={c.label} onChange={(e) => updateComp(idx, "label", e.target.value)} placeholder="Material" className={inputClass} />
              <input value={c.value} onChange={(e) => updateComp(idx, "value", e.target.value)} placeholder="100% algodón" className={inputClass} />
              <button type="button" onClick={() => removeComp(idx)} className="text-[var(--text-soft)] hover:opacity-50"><Trash2 className="size-4" /></button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addComp} className="mt-4 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--text-soft)] hover:opacity-50">
          <Plus className="size-3.5" /> Agregar material
        </button>
      </Section>

      {/* ── Cuidados ── */}
      <Section title="Cuidados">
        <div className="space-y-2">
          {form.care.map((c, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <input value={c} onChange={(e) => updateLine("care", idx, e.target.value)} placeholder="Ej: Lavar a mano" className={`${inputClass} flex-1`} />
              <button type="button" onClick={() => removeLine("care", idx)} className="text-[var(--text-soft)] hover:opacity-50"><Trash2 className="size-4" /></button>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => addLine("care")} className="mt-4 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--text-soft)] hover:opacity-50">
          <Plus className="size-3.5" /> Agregar cuidado
        </button>
      </Section>

      {/* ── Guardar ── */}
      <div className="border-t border-[var(--border)] pt-8">
        <button
          type="submit" disabled={loading || uploading}
          className="block w-full border border-[var(--text-main)] bg-[var(--text-main)] py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--bg-page)] transition-opacity hover:opacity-80 disabled:opacity-40"
        >
          {loading ? "Guardando..." : "Guardar producto"}
        </button>
      </div>
    </form>
  );
}

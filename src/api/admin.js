import api from "./config";
import { invalidateCache } from "../lib/productsCache";

// ── Imágenes ──────────────────────────────────────────────
// Devuelve { url, publicId }. El timeout global de 10s no alcanza para
// una foto pesada desde una conexión móvil, así que se sube solo acá.
export async function uploadImage(file, folder) {
  const form = new FormData();
  form.append("image", file);
  if (folder) form.append("folder", folder);

  const { data } = await api.post("/api/admin/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 120000,
  });
  return data;
}

// ── Productos ─────────────────────────────────────────────
export async function getAdminProducts() {
  const { data } = await api.get("/api/admin/products");
  return data.products;
}

export async function getAdminProduct(slug) {
  const { data } = await api.get(`/api/admin/products/${slug}`);
  return data.product;
}

export async function createProduct(payload) {
  const { data } = await api.post("/api/admin/products", payload);
  invalidateCache();
  return data.product;
}

export async function updateProduct(slug, payload) {
  const { data } = await api.put(`/api/admin/products/${slug}`, payload);
  invalidateCache();
  return data.product;
}

export async function deleteProduct(slug) {
  await api.delete(`/api/admin/products/${slug}`);
  invalidateCache();
}

// ── Órdenes ───────────────────────────────────────────────
export async function getAdminOrders() {
  const { data } = await api.get("/api/admin/orders");
  return data.orders;
}

export async function updateOrderStatus(id, status) {
  const { data } = await api.patch(`/api/admin/orders/${id}/status`, { status });
  return data.order;
}

// ── Usuarios ──────────────────────────────────────────────
export async function getAdminUsers() {
  const { data } = await api.get("/api/admin/users");
  return data.users;
}

export async function updateUserRole(id, role) {
  const { data } = await api.put(`/api/admin/users/${id}/role`, { role });
  return data.user;
}

// ── Galería (Universo visual) ─────────────────────────────
export async function getAdminGallery() {
  const { data } = await api.get("/api/admin/gallery");
  return data.images;
}

export async function addGalleryImage(payload) {
  const { data } = await api.post("/api/admin/gallery", payload);
  invalidateCache();
  return data.image;
}

export async function deleteGalleryImage(id) {
  await api.delete(`/api/admin/gallery/${id}`);
  invalidateCache();
}

export async function reorderGallery(ids) {
  await api.put("/api/admin/gallery/order", { ids });
  invalidateCache();
}

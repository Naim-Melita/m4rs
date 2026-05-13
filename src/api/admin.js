import api from "./config";

// ── Imágenes ──────────────────────────────────────────────
export async function uploadImage(file) {
  const form = new FormData();
  form.append("image", file);
  const { data } = await api.post("/api/admin/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.url;
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
  return data.product;
}

export async function updateProduct(slug, payload) {
  const { data } = await api.put(`/api/admin/products/${slug}`, payload);
  return data.product;
}

export async function deleteProduct(slug) {
  await api.delete(`/api/admin/products/${slug}`);
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

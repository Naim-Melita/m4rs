import api from "./config";
import { adaptProduct, adaptProducts } from "./adapters";

export async function fetchProducts(params = {}) {
  const { data } = await api.get("/api/products", { params });
  return adaptProducts(data);
}

export async function fetchProductBySlug(slug) {
  const { data } = await api.get(`/api/products/${slug}`);
  return adaptProduct(data);
}

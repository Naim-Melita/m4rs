import api from "./config";
import { optimizeUrl } from "./adapters";

export async function fetchGallery({ limit } = {}) {
  const { data } = await api.get("/api/gallery", {
    params: limit ? { limit } : {},
  });
  return (data.images ?? []).map((image) => ({
    ...image,
    url: optimizeUrl(image.url),
  }));
}

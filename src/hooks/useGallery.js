import { useEffect, useState } from "react";
import { fetchGallery } from "../api/gallery";
import { getCached, setCached } from "../lib/productsCache";

export function useGallery({ limit } = {}) {
  const key = `gallery:${limit ?? "all"}`;

  const [images, setImages]   = useState(() => getCached(key) ?? []);
  const [loading, setLoading] = useState(() => !getCached(key));
  const [error, setError]     = useState(null);

  useEffect(() => {
    const cached = getCached(key);
    if (cached) { setImages(cached); setLoading(false); return; }

    let cancelled = false;
    setLoading(true);

    fetchGallery({ limit })
      .then((data) => {
        if (cancelled) return;
        setCached(key, data);
        setImages(data);
      })
      .catch((err) => { if (!cancelled) setError(err); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [key, limit]);

  return { images, loading, error };
}

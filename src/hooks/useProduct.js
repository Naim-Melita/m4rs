import { useEffect, useState } from "react";
import { fetchProductBySlug } from "../api/products";

export function useProduct(slug) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    setLoading(true);
    fetchProductBySlug(slug)
      .then((data) => { if (!cancelled) setProduct(data); })
      .catch((err) => { if (!cancelled) setError(err); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [slug]);

  return { product, loading, error };
}

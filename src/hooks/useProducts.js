import { useEffect, useState } from "react";
import { fetchProducts } from "../api/products";
import { getCached, setCached } from "../lib/productsCache";

export function useProducts(params = {}) {
  const key = JSON.stringify(params);

  const [products, setProducts] = useState(() => getCached(key) ?? []);
  const [loading, setLoading]   = useState(() => !getCached(key));
  const [error, setError]       = useState(null);

  useEffect(() => {
    const cached = getCached(key);
    if (cached) { setProducts(cached); setLoading(false); return; }

    let cancelled = false;
    setLoading(true);

    fetchProducts(params)
      .then((data) => {
        if (cancelled) return;
        setCached(key, data);
        setProducts(data);
      })
      .catch((err) => { if (!cancelled) setError(err); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [key]);

  return { products, loading, error };
}

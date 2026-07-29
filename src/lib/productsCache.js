const TTL = 5 * 60 * 1000; // 5 minutos

const store = new Map(); // key → { data, expiresAt }

export function getCached(key) {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) { store.delete(key); return null; }
  return entry.data;
}

export function setCached(key, data) {
  store.set(key, { data, expiresAt: Date.now() + TTL });
}

export function invalidateCache() {
  store.clear();
}

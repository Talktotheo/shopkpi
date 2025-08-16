const store = new Map<string, { exp: number; data: unknown }>();
const ttl = Number(process.env.CACHE_TTL_SECONDS || 300) * 1000;

export async function getCached<T>(key: string, loader: () => Promise<T>): Promise<T> {
  const now = Date.now();
  const hit = store.get(key);
  if (hit && hit.exp > now) return hit.data as T;
  const data = await loader();
  store.set(key, { exp: now + ttl, data });
  return data;
}

export function purgeCache(key?: string) {
  if (key) store.delete(key);
  else store.clear();
}

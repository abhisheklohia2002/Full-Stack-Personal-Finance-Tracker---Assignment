
// import { redis } from "./redis.client.js";

// export async function getOrSetCache<T>(
//   key: string,
//   ttlSeconds: number,
//   fetcher: () => Promise<T>,
// ): Promise<T> {
//   const cached = await redis.get(key);
//   if (cached) return JSON.parse(cached) as T;

//   const fresh = await fetcher();
//   await redis.set(key, JSON.stringify(fresh), "EX", ttlSeconds);
//   return fresh;
// }

// export async function delKeys(keys: string[]) {
//   if (!keys.length) return;
//   await redis.del(...keys);
// }
import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

export async function getCached<T>(key: string): Promise<T | null> {
  try {
    const cached = await redis.get<T>(key)
    return cached
  } catch (error) {
    console.error("[v0] Erro ao buscar cache:", error)
    return null
  }
}

export async function setCache<T>(key: string, value: T, ttlSeconds = 300): Promise<void> {
  try {
    await redis.set(key, value, { ex: ttlSeconds })
  } catch (error) {
    console.error("[v0] Erro ao salvar cache:", error)
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { GamersClubScraper } from "@/lib/gamersclub-scraper"
import { getCached, setCache } from "@/lib/cache"

export async function GET(request: NextRequest, { params }: { params: { playerId: string } }) {
  try {
    const { playerId } = params
    const cacheKey = `stats:${playerId}`

    const cached = await getCached(cacheKey)
    if (cached) {
      console.log("[v0] Retornando estatísticas do cache")
      return NextResponse.json({
        success: true,
        data: cached,
        cached: true,
      })
    }

    const scraper = new GamersClubScraper()
    const stats = await scraper.getPlayerStats(playerId)

    await setCache(cacheKey, stats, 300)

    return NextResponse.json({
      success: true,
      data: stats,
      cached: false,
    })
  } catch (error) {
    console.error("[v0] Erro ao buscar estatísticas:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro ao buscar estatísticas",
      },
      { status: 500 },
    )
  }
}

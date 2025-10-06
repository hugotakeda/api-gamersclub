import { type NextRequest, NextResponse } from "next/server"
import { GamersClubScraper } from "@/lib/gamersclub-scraper"
import { getCached, setCache } from "@/lib/cache"

export async function GET(request: NextRequest, { params }: { params: { playerId: string } }) {
  try {
    const { playerId } = params
    const { searchParams } = new URL(request.url)
    const page = searchParams.get("page") || "1"
    const cacheKey = `matches:${playerId}:${page}`

    const cached = await getCached(cacheKey)
    if (cached) {
      console.log("[v0] Retornando partidas do cache")
      return NextResponse.json({
        success: true,
        data: cached,
        page: Number.parseInt(page),
        cached: true,
      })
    }

    const scraper = new GamersClubScraper()
    const matches = await scraper.getPlayerMatches(playerId, Number.parseInt(page))

    await setCache(cacheKey, matches, 300)

    return NextResponse.json({
      success: true,
      data: matches,
      page: Number.parseInt(page),
      cached: false,
    })
  } catch (error) {
    console.error("[v0] Erro ao buscar partidas:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro ao buscar partidas",
      },
      { status: 500 },
    )
  }
}

// Biblioteca adaptada baseada em rodrigorioo/gamersclub-api
// Usa Browserless para contornar proteção Cloudflare

import type { PlayerProfile, Match, PlayerStats } from "./types"

interface ScraperConfig {
  sessionId?: string
  browserlessApiKey?: string
}

export class GamersClubScraper {
  private config: ScraperConfig

  constructor(config: ScraperConfig = {}) {
    this.config = {
      browserlessApiKey: process.env.BROWSERLESS_API_KEY,
      ...config,
    }

    const keyStatus = this.config.browserlessApiKey
      ? `configurada (${this.config.browserlessApiKey.substring(0, 8)}...)`
      : "não configurada ou vazia"
    console.log("[v0] BROWSERLESS_API_KEY:", keyStatus)
  }

  async getPlayerProfile(playerId: string): Promise<PlayerProfile> {
    if (!this.config.browserlessApiKey || this.config.browserlessApiKey.trim() === "") {
      console.log("[v0] Usando dados mockados para testes (BROWSERLESS_API_KEY não configurada)")
      return this.getMockPlayerProfile(playerId)
    }

    const url = `https://gamersclub.com.br/player/${playerId}`

    try {
      const html = await this.fetchWithBrowserless(url)
      return this.parsePlayerProfile(html)
    } catch (error) {
      console.error("[v0] Erro ao buscar perfil:", error)
      throw error
    }
  }

  async getPlayerMatches(playerId: string, page = 1): Promise<Match[]> {
    if (!this.config.browserlessApiKey || this.config.browserlessApiKey.trim() === "") {
      console.log("[v0] Usando dados mockados para testes (BROWSERLESS_API_KEY não configurada)")
      return this.getMockMatches(playerId, page)
    }

    const url = `https://gamersclub.com.br/player/${playerId}/matches?page=${page}`

    try {
      const html = await this.fetchWithBrowserless(url)
      return this.parseMatches(html)
    } catch (error) {
      console.error("[v0] Erro ao buscar partidas:", error)
      throw error
    }
  }

  async getPlayerStats(playerId: string): Promise<PlayerStats> {
    if (!this.config.browserlessApiKey || this.config.browserlessApiKey.trim() === "") {
      console.log("[v0] Usando dados mockados para testes (BROWSERLESS_API_KEY não configurada)")
      return this.getMockStats(playerId)
    }

    const url = `https://gamersclub.com.br/player/${playerId}/stats`

    try {
      const html = await this.fetchWithBrowserless(url)
      return this.parseStats(html)
    } catch (error) {
      console.error("[v0] Erro ao buscar estatísticas:", error)
      throw error
    }
  }

  private getMockPlayerProfile(playerId: string): PlayerProfile {
    return {
      nickname: `Player_${playerId}`,
      level: 10,
      kda: 1.25,
    }
  }

  private getMockMatches(playerId: string, page: number): Match[] {
    const matches: Match[] = []
    const maps = ["Mirage", "Dust2", "Inferno", "Nuke", "Overpass"]
    const results = ["win", "loss"]

    for (let i = 0; i < 10; i++) {
      const matchId = `${playerId}_${page}_${i}`
      matches.push({
        id: matchId,
        date: new Date(Date.now() - i * 86400000).toISOString().split("T")[0],
        result: results[Math.floor(Math.random() * results.length)],
        score: `16-${Math.floor(Math.random() * 16)}`,
        map: maps[Math.floor(Math.random() * maps.length)],
      })
    }

    return matches
  }

  private getMockStats(playerId: string): PlayerStats {
    return {
      kda: 1.25,
      headshot: 52.3,
      winrate: 54.8,
      kills: 1250,
      deaths: 1000,
      assists: 320,
    }
  }

  private async fetchWithBrowserless(url: string): Promise<string> {
    if (!this.config.browserlessApiKey || this.config.browserlessApiKey.trim() === "") {
      throw new Error(
        "BROWSERLESS_API_KEY não configurada.\n\n" +
          "Para configurar:\n" +
          "1. Acesse https://browserless.io e crie uma conta gratuita\n" +
          "2. Copie sua API Key\n" +
          "3. No v0, clique no ícone de engrenagem (⚙️) no canto superior direito\n" +
          "4. Vá em 'Environment Variables'\n" +
          "5. Adicione: BROWSERLESS_API_KEY = sua_chave_aqui\n\n" +
          "Plano gratuito: 6 horas/mês de uso",
      )
    }

    const browserlessUrl = `https://chrome.browserless.io/content?token=${this.config.browserlessApiKey}`

    try {
      const response = await fetch(browserlessUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          waitFor: 2000,
          gotoOptions: {
            waitUntil: "networkidle2",
          },
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Browserless retornou erro ${response.status}: ${errorText}`)
      }

      return await response.text()
    } catch (error) {
      console.error("[v0] Erro ao usar Browserless:", error)
      throw new Error(
        `Falha ao buscar página via Browserless: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
      )
    }
  }

  private parsePlayerProfile(html: string): PlayerProfile {
    console.log("[v0] Iniciando parse do perfil...")

    const profile: PlayerProfile = {
      nickname: null,
      level: null,
      kda: null,
    }

    // Extrai nickname - tenta múltiplos padrões
    const nicknamePatterns = [
      /<h1[^>]*class="[^"]*(?:player-name|profile-name|username)[^"]*"[^>]*>([^<]+)<\/h1>/i,
      /<div[^>]*class="[^"]*nickname[^"]*"[^>]*>([^<]+)<\/div>/i,
      /<span[^>]*class="[^"]*player-nick[^"]*"[^>]*>([^<]+)<\/span>/i,
    ]

    for (const pattern of nicknamePatterns) {
      const match = html.match(pattern)
      if (match) {
        profile.nickname = match[1].trim()
        console.log("[v0] Nickname encontrado:", profile.nickname)
        break
      }
    }

    // Extrai level
    const levelMatch = html.match(/(?:level|nível|lvl)["\s:]+(\d+)/i)
    if (levelMatch) {
      profile.level = Number.parseInt(levelMatch[1])
      console.log("[v0] Level encontrado:", profile.level)
    }

    // Extrai KDA
    const kdaMatch = html.match(/kda["\s:]+(\d+\.?\d*)/i)
    if (kdaMatch) {
      profile.kda = Number.parseFloat(kdaMatch[1])
      console.log("[v0] KDA encontrado:", profile.kda)
    }

    return profile
  }

  private parseMatches(html: string): Match[] {
    const matches: Match[] = []

    // Regex para encontrar blocos de partidas
    const matchBlockRegex = /<div[^>]*class="[^"]*match[^"]*"[^>]*>([\s\S]*?)<\/div>/gi

    let matchBlock
    while ((matchBlock = matchBlockRegex.exec(html)) !== null) {
      const block = matchBlock[1]

      const match: Match = {
        id: this.extractValue(block, /match-id["\s:]+(\d+)/i),
        date: this.extractValue(block, /date["\s:]+([^"<]+)/i),
        result: this.extractValue(block, /result["\s:]+(\w+)/i),
        score: this.extractValue(block, /score["\s:]+([0-9-]+)/i),
        map: this.extractValue(block, /map["\s:]+([^"<]+)/i),
      }

      matches.push(match)
    }

    console.log("[v0] Total de partidas encontradas:", matches.length)
    return matches
  }

  private parseStats(html: string): PlayerStats {
    const stats: PlayerStats = {
      kda: null,
      headshot: null,
      winrate: null,
      kills: null,
      deaths: null,
      assists: null,
    }

    // Extrai KDA
    const kdaMatch = html.match(/kda["\s:]+(\d+\.?\d*)/i)
    if (kdaMatch) {
      stats.kda = Number.parseFloat(kdaMatch[1])
    }

    // Extrai Headshot %
    const headshotMatch = html.match(/headshot["\s:]+(\d+\.?\d*)/i)
    if (headshotMatch) {
      stats.headshot = Number.parseFloat(headshotMatch[1])
    }

    // Extrai Winrate
    const winrateMatch = html.match(/winrate["\s:]+(\d+\.?\d*)/i)
    if (winrateMatch) {
      stats.winrate = Number.parseFloat(winrateMatch[1])
    }

    // Extrai Kills
    const killsMatch = html.match(/kills["\s:]+(\d+)/i)
    if (killsMatch) {
      stats.kills = Number.parseInt(killsMatch[1])
    }

    // Extrai Deaths
    const deathsMatch = html.match(/deaths["\s:]+(\d+)/i)
    if (deathsMatch) {
      stats.deaths = Number.parseInt(deathsMatch[1])
    }

    // Extrai Assists
    const assistsMatch = html.match(/assists["\s:]+(\d+)/i)
    if (assistsMatch) {
      stats.assists = Number.parseInt(assistsMatch[1])
    }

    console.log("[v0] Stats parseadas:", stats)
    return stats
  }

  private extractValue(text: string, regex: RegExp): string | null {
    const match = text.match(regex)
    return match ? match[1].trim() : null
  }
}

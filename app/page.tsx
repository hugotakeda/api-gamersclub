"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, User, Trophy, BarChart3, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function Home() {
  const [playerId, setPlayerId] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [profileData, setProfileData] = useState<any>(null)
  const [matchesData, setMatchesData] = useState<any>(null)
  const [statsData, setStatsData] = useState<any>(null)

  const fetchProfile = async () => {
    if (!playerId) return

    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/player/${playerId}`)
      const data = await response.json()

      if (!data.success) {
        setError(data.error)
        setProfileData(null)
      } else {
        setProfileData(data)
      }
    } catch (error) {
      console.error("Erro ao buscar perfil:", error)
      setError("Erro de conexão ao buscar perfil")
    } finally {
      setLoading(false)
    }
  }

  const fetchMatches = async () => {
    if (!playerId) return

    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/matches/${playerId}`)
      const data = await response.json()

      if (!data.success) {
        setError(data.error)
        setMatchesData(null)
      } else {
        setMatchesData(data)
      }
    } catch (error) {
      console.error("Erro ao buscar partidas:", error)
      setError("Erro de conexão ao buscar partidas")
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    if (!playerId) return

    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/stats/${playerId}`)
      const data = await response.json()

      if (!data.success) {
        setError(data.error)
        setStatsData(null)
      } else {
        setStatsData(data)
      }
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error)
      setError("Erro de conexão ao buscar estatísticas")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-white">Gamers Club API</h1>
          <p className="text-slate-400">Consulte dados de perfil, partidas e estatísticas</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription className="whitespace-pre-line">{error}</AlertDescription>
          </Alert>
        )}

        <Card className="mb-8 border-slate-700 bg-slate-800/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Search className="h-5 w-5" />
              Buscar Jogador
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="ID do jogador (ex: 1969509)"
                value={playerId}
                onChange={(e) => setPlayerId(e.target.value)}
                className="border-slate-600 bg-slate-900 text-white"
              />
              <Button onClick={fetchProfile} disabled={loading || !playerId} className="bg-blue-600 hover:bg-blue-700">
                {loading ? "Carregando..." : "Buscar"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800">
            <TabsTrigger value="profile" onClick={fetchProfile} className="data-[state=active]:bg-slate-700">
              <User className="mr-2 h-4 w-4" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="matches" onClick={fetchMatches} className="data-[state=active]:bg-slate-700">
              <Trophy className="mr-2 h-4 w-4" />
              Partidas
            </TabsTrigger>
            <TabsTrigger value="stats" onClick={fetchStats} className="data-[state=active]:bg-slate-700">
              <BarChart3 className="mr-2 h-4 w-4" />
              Estatísticas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader>
                <CardTitle className="text-white">Dados do Perfil</CardTitle>
              </CardHeader>
              <CardContent>
                {profileData ? (
                  <div>
                    {profileData.cached && (
                      <p className="mb-2 text-sm text-green-400">✓ Dados do cache (atualizados recentemente)</p>
                    )}
                    <pre className="overflow-auto rounded bg-slate-900 p-4 text-sm text-slate-300">
                      {JSON.stringify(profileData, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <p className="text-slate-400">Nenhum dado carregado. Busque um jogador.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="matches">
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader>
                <CardTitle className="text-white">Partidas Finalizadas</CardTitle>
              </CardHeader>
              <CardContent>
                {matchesData ? (
                  <div>
                    {matchesData.cached && (
                      <p className="mb-2 text-sm text-green-400">✓ Dados do cache (atualizados recentemente)</p>
                    )}
                    <pre className="overflow-auto rounded bg-slate-900 p-4 text-sm text-slate-300">
                      {JSON.stringify(matchesData, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <p className="text-slate-400">Nenhum dado carregado. Busque um jogador.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats">
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader>
                <CardTitle className="text-white">Estatísticas Detalhadas</CardTitle>
              </CardHeader>
              <CardContent>
                {statsData ? (
                  <div>
                    {statsData.cached && (
                      <p className="mb-2 text-sm text-green-400">✓ Dados do cache (atualizados recentemente)</p>
                    )}
                    <pre className="overflow-auto rounded bg-slate-900 p-4 text-sm text-slate-300">
                      {JSON.stringify(statsData, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <p className="text-slate-400">Nenhum dado carregado. Busque um jogador.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="mt-8 border-slate-700 bg-slate-800/50">
          <CardHeader>
            <CardTitle className="text-white">Endpoints Disponíveis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-300">
            <div>
              <code className="rounded bg-slate-900 px-2 py-1">GET /api/player/[playerId]</code>
              <p className="mt-1 text-slate-400">Retorna dados básicos do perfil</p>
            </div>
            <div>
              <code className="rounded bg-slate-900 px-2 py-1">GET /api/matches/[playerId]?page=1</code>
              <p className="mt-1 text-slate-400">Retorna partidas finalizadas</p>
            </div>
            <div>
              <code className="rounded bg-slate-900 px-2 py-1">GET /api/stats/[playerId]</code>
              <p className="mt-1 text-slate-400">Retorna estatísticas detalhadas</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

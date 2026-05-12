"use client"

import { useEffect, useState } from "react"
import { Trophy, RefreshCw, AlertCircle } from "lucide-react"
import { MatchCard } from "./match-card"
import { FilterButtons } from "./filter-buttons"
import { LoadingSkeleton } from "./loading-skeleton"

// ============================================
// COLE A URL DA SUA API AQUI
// ============================================
const API_URL = ""

interface Match {
  id: number
  home: string
  away: string
  homeScore: number | null
  awayScore: number | null
  status: string
  date: string
}

type FilterType = "all" | "live" | "finished" | "upcoming"

// Dados de exemplo para visualização quando não há API configurada
const MOCK_DATA: Match[] = [
  {
    id: 1,
    home: "Flamengo",
    away: "Palmeiras",
    homeScore: 2,
    awayScore: 1,
    status: "IN_PLAY",
    date: "2026-05-12T20:00:00Z",
  },
  {
    id: 2,
    home: "Corinthians",
    away: "São Paulo",
    homeScore: 1,
    awayScore: 1,
    status: "FINISHED",
    date: "2026-05-12T18:00:00Z",
  },
  {
    id: 3,
    home: "Grêmio",
    away: "Internacional",
    homeScore: null,
    awayScore: null,
    status: "SCHEDULED",
    date: "2026-05-13T16:00:00Z",
  },
  {
    id: 4,
    home: "Atlético-MG",
    away: "Cruzeiro",
    homeScore: 3,
    awayScore: 0,
    status: "FINISHED",
    date: "2026-05-11T19:00:00Z",
  },
  {
    id: 5,
    home: "Botafogo",
    away: "Fluminense",
    homeScore: 0,
    awayScore: 0,
    status: "LIVE",
    date: "2026-05-12T21:30:00Z",
  },
  {
    id: 6,
    home: "Santos",
    away: "Bahia",
    homeScore: null,
    awayScore: null,
    status: "SCHEDULED",
    date: "2026-05-14T20:00:00Z",
  },
]

function isLiveStatus(status: string): boolean {
  return status === "IN_PLAY" || status === "LIVE" || status === "PAUSED"
}

function isFinishedStatus(status: string): boolean {
  return status === "FINISHED"
}

function isUpcomingStatus(status: string): boolean {
  return status === "SCHEDULED" || status === "TIMED"
}

export function BrasileiraoDashboard() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<FilterType>("all")
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const fetchMatches = async () => {
    if (!API_URL) {
      // Usa dados de exemplo se não há API configurada
      setMatches(MOCK_DATA)
      setLastUpdate(new Date())
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const response = await fetch(API_URL)

      if (!response.ok) {
        throw new Error("Falha ao carregar os dados")
      }

      const data = await response.json()
      setMatches(data)
      setLastUpdate(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMatches()

    // Atualiza a cada 60 segundos se há API configurada
    if (API_URL) {
      const interval = setInterval(fetchMatches, 60000)
      return () => clearInterval(interval)
    }
  }, [])

  const filteredMatches = matches.filter((match) => {
    switch (filter) {
      case "live":
        return isLiveStatus(match.status)
      case "finished":
        return isFinishedStatus(match.status)
      case "upcoming":
        return isUpcomingStatus(match.status)
      default:
        return true
    }
  })

  const liveCount = matches.filter((m) => isLiveStatus(m.status)).length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Trophy className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Brasileirão Série A
                </h1>
                <p className="text-xs text-muted-foreground">
                  Resultados em tempo real
                </p>
              </div>
            </div>

            {liveCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-destructive/20 rounded-full">
                <span className="w-2 h-2 bg-destructive rounded-full animate-pulse-live"></span>
                <span className="text-destructive text-sm font-semibold">
                  {liveCount} ao vivo
                </span>
              </div>
            )}
          </div>

          <FilterButtons activeFilter={filter} onFilterChange={setFilter} />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Atualização e Refresh */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-muted-foreground">
            {lastUpdate
              ? `Atualizado às ${lastUpdate.toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`
              : "Carregando..."}
          </span>
          <button
            onClick={fetchMatches}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Atualizar
          </button>
        </div>

        {/* Aviso de dados de exemplo */}
        {!API_URL && (
          <div className="mb-4 p-4 bg-primary/10 border border-primary/20 rounded-xl">
            <p className="text-sm text-primary">
              <strong>Modo de demonstração:</strong> Configure a variável{" "}
              <code className="px-1.5 py-0.5 bg-primary/20 rounded text-xs">
                API_URL
              </code>{" "}
              no código para carregar dados reais.
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && matches.length === 0 && <LoadingSkeleton />}

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Erro ao carregar dados
            </h3>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <button
              onClick={fetchMatches}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* Match List */}
        {!loading && !error && (
          <>
            {filteredMatches.length > 0 ? (
              <div className="space-y-3">
                {filteredMatches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                  <Trophy className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Nenhum jogo encontrado
                </h3>
                <p className="text-sm text-muted-foreground">
                  Não há jogos para o filtro selecionado.
                </p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-8">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <p className="text-center text-xs text-muted-foreground">
            Dados atualizados automaticamente a cada minuto
          </p>
        </div>
      </footer>
    </div>
  )
}

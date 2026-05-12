"use client"

import { useEffect, useState } from "react"
import { Trophy, RefreshCw, AlertCircle, Calendar, Clock, ChevronRight } from "lucide-react"

// ============================================
// CONFIGURAÇÃO DA API
// ============================================
const API_KEY = "5a2cb3c9f2804b12b50877a94254070a" 
const API_URL = "https://api.football-data.org/v4/competitions/BSA/matches"

// --- COMPONENTE: MatchCard (Embutido) ---
const MatchCard = ({ match }: { match: any }) => (
  <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm mb-3">
    <div className="flex items-center justify-between gap-2">
      <div className="flex-1 flex items-center justify-end gap-2 text-right">
        <span className="font-medium text-sm sm:text-base">{match.home}</span>
        <img src={match.homeCrest} alt="" className="w-6 h-6 object-contain" />
      </div>
      <div className="flex flex-col items-center min-w-[70px] bg-zinc-100 dark:bg-zinc-800 py-2 rounded-lg">
        <div className="text-lg font-bold">
          {match.homeScore !== null ? match.homeScore : "-"} : {match.awayScore !== null ? match.awayScore : "-"}
        </div>
        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${match.status === 'IN_PLAY' ? 'bg-red-500 text-white animate-pulse' : 'bg-zinc-300 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400'}`}>
          {match.status === 'IN_PLAY' ? 'AO VIVO' : match.status}
        </span>
      </div>
      <div className="flex-1 flex items-center gap-2">
        <img src={match.awayCrest} alt="" className="w-6 h-6 object-contain" />
        <span className="font-medium text-sm sm:text-base">{match.away}</span>
      </div>
    </div>
  </div>
)

// --- COMPONENTE: LoadingSkeleton (Embutido) ---
const LoadingSkeleton = () => (
  <div className="space-y-3 animate-pulse">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="h-24 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-full" />
    ))}
  </div>
)

// --- COMPONENTE PRINCIPAL ---
export default function BrasileiraoDashboard() {
  const [matches, setMatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const fetchMatches = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(API_URL, {
        headers: { "X-Auth-Token": API_KEY },
      })
      if (!response.ok) throw new Error("Erro ao conectar com a API")
      const data = await response.json()
      const mapped = data.matches.map((m: any) => ({
        id: m.id,
        home: m.homeTeam.shortName,
        away: m.awayTeam.shortName,
        homeCrest: m.homeTeam.crest,
        awayCrest: m.awayTeam.crest,
        homeScore: m.score.fullTime.home,
        awayScore: m.score.fullTime.away,
        status: m.status,
        date: m.utcDate,
      }))
      setMatches(mapped)
      setLastUpdate(new Date())
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchMatches() }, [])

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 p-4">
      <div className="max-w-2xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-600 rounded-lg">
              <Trophy className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Brasileirão Série A</h1>
              <p className="text-xs text-zinc-500">Temporada 2026</p>
            </div>
          </div>
          <button 
            onClick={fetchMatches}
            className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </header>

        {lastUpdate && (
          <p className="text-[10px] text-zinc-500 mb-4">
            Última atualização: {lastUpdate.toLocaleTimeString()}
          </p>
        )}

        {loading && <LoadingSkeleton />}
        
        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-xl flex items-center gap-3">
            <AlertCircle />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-1">
            {matches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

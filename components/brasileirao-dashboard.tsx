"use client"

import { useEffect, useState } from "react"

// ============================================
// CONFIGURAÇÃO DA API
// ============================================
const API_KEY = "5a2cb3c9f2804b12b50877a94254070a" 
const API_URL = "https://api.football-data.org/v4/competitions/BSA/matches"

// --- ÍCONES SVG SIMPLES (Para evitar erro de 'undefined' do Lucide) ---
const TrophyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
)

const RefreshIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
)

// --- COMPONENTE: MatchCard ---
const MatchCard = ({ match }: { match: any }) => (
  <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm mb-3">
    <div className="flex items-center justify-between gap-2">
      <div className="flex-1 flex items-center justify-end gap-2 text-right">
        <span className="font-medium text-xs sm:text-base">{match.home}</span>
        {match.homeCrest && <img src={match.homeCrest} alt="" className="w-6 h-6 object-contain" />}
      </div>
      <div className="flex flex-col items-center min-w-[80px] bg-zinc-100 dark:bg-zinc-800 py-2 rounded-lg">
        <div className="text-lg font-bold">
          {match.homeScore !== null ? match.homeScore : "-"} : {match.awayScore !== null ? match.awayScore : "-"}
        </div>
        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${match.status === 'IN_PLAY' ? 'bg-red-500 text-white animate-pulse' : 'bg-zinc-300 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400'}`}>
          {match.status === 'IN_PLAY' ? 'AO VIVO' : match.status}
        </span>
      </div>
      <div className="flex-1 flex items-center gap-2">
        {match.awayCrest && <img src={match.awayCrest} alt="" className="w-6 h-6 object-contain" />}
        <span className="font-medium text-xs sm:text-base">{match.away}</span>
      </div>
    </div>
  </div>
)

// --- COMPONENTE PRINCIPAL ---
export default function BrasileiraoDashboard() {
  const [matches, setMatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMatches = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(API_URL, {
        headers: { "X-Auth-Token": API_KEY },
      })
      if (!response.ok) throw new Error("Erro na API")
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
      }))
      setMatches(mapped)
    } catch (err: any) {
      setError("Falha ao carregar jogos")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchMatches() }, [])

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 p-4 font-sans">
      <div className="max-w-2xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-600 rounded-lg text-white">
              <TrophyIcon />
            </div>
            <div>
              <h1 className="text-xl font-bold">Brasileirão 2026</h1>
              <p className="text-xs text-zinc-500">Série A</p>
            </div>
          </div>
          <button 
            onClick={fetchMatches}
            className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-all"
          >
            <RefreshIcon className={loading ? 'animate-spin' : ''} />
          </button>
        </header>

        {loading ? (
          <div className="text-center py-10 text-zinc-500 text-sm">Carregando partidas...</div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg text-center text-sm">{error}</div>
        ) : (
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

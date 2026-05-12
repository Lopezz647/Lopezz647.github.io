"use client"

import { useEffect, useState } from "react"

// --- CONFIGURAÇÃO ---
const API_KEY = "5a2cb3c9f2804b12b50877a94254070a" 
const API_URL = "https://api.football-data.org/v4/competitions/BSA/matches"

// --- ÍCONES SVG (Estáticos para não dar erro de build) ---
const TrophyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
)

const RefreshIcon = ({ spinning }: { spinning: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={spinning ? "animate-spin" : ""}><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
)

// --- COMPONENTES AUXILIARES ---
const MatchCard = ({ m }: { m: any }) => (
  <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm mb-3">
    <div className="flex items-center justify-between gap-2">
      <div className="flex-1 flex items-center justify-end gap-2 text-right">
        <span className="font-medium text-xs sm:text-sm">{m.home}</span>
        <img src={m.homeCrest} alt="" className="w-6 h-6 object-contain" />
      </div>
      <div className="flex flex-col items-center min-w-[75px] bg-zinc-100 dark:bg-zinc-800 py-1.5 rounded-lg">
        <div className="text-base font-bold">
          {m.homeScore !== null ? m.homeScore : "-"} : {m.awayScore !== null ? m.awayScore : "-"}
        </div>
        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${m.status === 'IN_PLAY' ? 'bg-red-500 text-white animate-pulse' : 'bg-zinc-300 dark:bg-zinc-700 text-zinc-600'}`}>
          {m.status === 'IN_PLAY' ? 'AO VIVO' : m.status}
        </span>
      </div>
      <div className="flex-1 flex items-center gap-2">
        <img src={m.awayCrest} alt="" className="w-6 h-6 object-contain" />
        <span className="font-medium text-xs sm:text-sm">{m.away}</span>
      </div>
    </div>
  </div>
)

// --- DASHBOARD PRINCIPAL ---
export default function BrasileiraoDashboard() {
  const [matches, setMatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      setLoading(true)
      const res = await fetch(API_URL, { headers: { "X-Auth-Token": API_KEY } })
      const data = await res.json()
      setMatches(data.matches.map((m: any) => ({
        id: m.id,
        home: m.homeTeam.shortName,
        away: m.awayTeam.shortName,
        homeCrest: m.homeTeam.crest,
        awayCrest: m.awayTeam.crest,
        homeScore: m.score.fullTime.home,
        awayScore: m.score.fullTime.away,
        status: m.status
      })))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 p-4">
      <div className="max-w-xl mx-auto">
        <header className="flex items-center justify-between mb-8 pt-4">
          <div className="flex items-center gap-3">
            <TrophyIcon />
            <h1 className="text-xl font-bold tracking-tight">Brasileirão 2026</h1>
          </div>
          <button onClick={load} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <RefreshIcon spinning={loading} />
          </button>
        </header>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-20 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded-xl" />)}
          </div>
        ) : (
          <div className="grid gap-1">
            {matches.map(m => <MatchCard key={m.id} m={m} />)}
          </div>
        )}
      </div>
    </div>
  )
}

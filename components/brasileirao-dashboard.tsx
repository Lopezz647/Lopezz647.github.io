"use client"

import React, { useEffect, useState } from "react"

// CONFIGURAÇÃO DA API
const API_KEY = "5a2cb3c9f2804b12b50877a94254070a" 
const API_URL = "https://api.football-data.org/v4/competitions/BSA/matches"

export default function BrasileiraoDashboard() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await fetch(API_URL, { headers: { "X-Auth-Token": API_KEY } })
      const data = await res.json()
      if (data.matches) {
        setMatches(data.matches.map(m => ({
          id: m.id,
          home: m.homeTeam.shortName,
          away: m.awayTeam.shortName,
          homeCrest: m.homeTeam.crest,
          awayCrest: m.awayTeam.crest,
          homeScore: m.score.fullTime.home,
          awayScore: m.score.fullTime.away,
          status: m.status
        })))
      }
    } catch (e) {
      console.error("Erro ao carregar", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  return (
    <div style={{ backgroundColor: '#09090b', color: '#fafafa', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Brasileirão 2026</h1>
            <p style={{ fontSize: '12px', color: '#a1a1aa', margin: '5px 0 0 0' }}>Resultados em Tempo Real</p>
          </div>
          <button 
            onClick={fetchData}
            style={{ backgroundColor: '#27272a', border: 'none', color: 'white', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            ATUALIZAR
          </button>
        </header>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#a1a1aa' }}>Carregando partidas...</p>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {matches.map(m => (
              <div key={m.id} style={{ backgroundColor: '#18181b', border: '1px solid #27272a', padding: '15px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1, textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>{m.home}</span>
                    {m.homeCrest && <img src={m.homeCrest} alt="" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />}
                  </div>
                  
                  <div style={{ width: '90px', textAlign: 'center', backgroundColor: '#27272a', padding: '8px', borderRadius: '8px', margin: '0 15px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '18px' }}>
                      {m.homeScore !== null ? m.homeScore : '-'} : {m.awayScore !== null ? m.awayScore : '-'}
                    </div>
                    <div style={{ fontSize: '9px', fontWeight: 'bold', marginTop: '4px', color: m.status === 'IN_PLAY' ? '#ef4444' : '#a1a1aa' }}>
                      {m.status === 'IN_PLAY' ? '• AO VIVO' : m.status}
                    </div>
                  </div>

                  <div style={{ flex: 1, textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {m.awayCrest && <img src={m.awayCrest} alt="" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />}
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>{m.away}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

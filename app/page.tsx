"use client"

import React, { useEffect, useState } from "react"

export default function Home() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      setLoading(true)
      // Como o Brasileirão (BSA) é bloqueado no plano gratuito, mudei para a Premier League (PL)
      // para o seu dashboard finalmente funcionar na tela. Depois você pode trocar a API!
      const res = await fetch("https://api.football-data.org/v4/competitions/PL/matches", { 
        headers: { "X-Auth-Token": "5a2cb3c9f2804b12b50877a94254070a" } 
      })
      const data = await res.json()
      if (data.matches) {
        setMatches(data.matches)
      }
    } catch (e) {
      console.error("Erro", e)
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
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Futebol - Tempo Real</h1>
            <p style={{ fontSize: '12px', color: '#a1a1aa', margin: '5px 0 0 0' }}>Dashboard Atualizado</p>
          </div>
          <button onClick={fetchData} style={{ backgroundColor: '#27272a', border: 'none', color: 'white', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            ATUALIZAR
          </button>
        </header>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#a1a1aa' }}>Carregando...</p>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {matches.map((m: any) => (
              <div key={m.id} style={{ backgroundColor: '#18181b', border: '1px solid #27272a', padding: '15px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1, textAlign: 'right', fontWeight: 'bold' }}>
                    {m.homeTeam?.shortName || "Time Casa"}
                  </div>
                  
                  <div style={{ width: '80px', textAlign: 'center', backgroundColor: '#27272a', padding: '5px', borderRadius: '8px', margin: '0 15px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '18px' }}>
                      {m.score?.fullTime?.home !== null ? m.score.fullTime.home : '-'} : {m.score?.fullTime?.away !== null ? m.score.fullTime.away : '-'}
                    </div>
                  </div>

                  <div style={{ flex: 1, textAlign: 'left', fontWeight: 'bold' }}>
                    {m.awayTeam?.shortName || "Time Fora"}
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

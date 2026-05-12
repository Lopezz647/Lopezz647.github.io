"use client"

import React, { useEffect, useState } from "react"

export default function BrasileiraoDashboard() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("https://api.football-data.org/v4/competitions/BSA/matches", {
      headers: { "X-Auth-Token": "5a2cb3c9f2804b12b50877a94254070a" }
    })
    .then(res => res.json())
    .then(data => {
      if (data.matches) setMatches(data.matches)
      setLoading(false)
    })
    .catch(() => setLoading(false))
  }, [])

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#000', color: '#fff', minHeight: '100vh' }}>
      <h1>Brasileirão 2026 🏆</h1>
      {loading ? <p>Carregando...</p> : (
        <div style={{ display: 'grid', gap: '10px' }}>
          {matches.map((m: any) => (
            <div key={m.id} style={{ border: '1px solid #333', padding: '10px', borderRadius: '8px' }}>
              {m.homeTeam.shortName} {m.score.fullTime.home} x {m.score.fullTime.away} {m.awayTeam.shortName}
              <br />
              <small style={{ color: '#666' }}>Status: {m.status}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

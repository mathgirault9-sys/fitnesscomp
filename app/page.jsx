'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const SPORTS = ['Tous', 'CrossFit', 'Hyrox', 'Functional Fitness', 'Haltérophilie', 'Autre']

export default function Home() {
  const [competitions, setCompetitions] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sportFilter, setSportFilter] = useState('Tous')

  useEffect(() => {
    fetchCompetitions()
  }, [])

  async function fetchCompetitions() {
    const { data, error } = await supabase
      .from('competitions')
      .select('*')
      .order('date', { ascending: true })
    if (!error && data) setCompetitions(data)
    setLoading(false)
  }

  const filtered = competitions.filter(c => {
    const matchSearch = c.nom?.toLowerCase().includes(search.toLowerCase()) ||
                        c.lieu?.toLowerCase().includes(search.toLowerCase())
    const matchSport = sportFilter === 'Tous' || c.sport === sportFilter
    return matchSearch && matchSport
  })

  return (
    <main style={styles.main}>
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <h1 style={styles.logo}>⚡ FitCalendar</h1>
          <p style={styles.tagline}>Toutes les compétitions CrossFit, Hyrox & Functional en France</p>
        </div>
      </header>

      <section style={styles.filterSection}>
        <input
          style={styles.searchInput}
          type="text"
          placeholder="🔍 Rechercher une compétition ou une ville..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div style={styles.sportFilters}>
          {SPORTS.map(sport => (
            <button
              key={sport}
              style={{
                ...styles.filterBtn,
                ...(sportFilter === sport ? styles.filterBtnActive : {})
              }}
              onClick={() => setSportFilter(sport)}
            >
              {sport}
            </button>
          ))}
        </div>
      </section>

      <div style={styles.counter}>
        {loading ? 'Chargement...' : `${filtered.length} compétition${filtered.length > 1 ? 's' : ''} trouvée${filtered.length > 1 ? 's' : ''}`}
      </div>

      <section style={styles.grid}>
        {loading ? (
          <p style={styles.loadingText}>Chargement des compétitions...</p>
        ) : filtered.length === 0 ? (
          <p style={styles.loadingText}>Aucune compétition trouvée.</p>
        ) : (
          filtered.map(comp => (
            
              key={comp.id}
              href={comp.url}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.card}
            >
              <div style={styles.cardTop}>
                <span style={{
                  ...styles.sportBadge,
                  background: sportColor(comp.sport)
                }}>
                  {comp.sport}
                </span>
                {comp.prix && <span style={styles.prix}>{comp.prix}</span>}
              </div>
              <h2 style={styles.cardTitle}>{comp.nom}</h2>
              <div style={styles.cardMeta}>
                {comp.date && <span>📅 {comp.date}</span>}
                {comp.lieu && <span>📍 {comp.lieu}</span>}
              </div>
              <div style={styles.cardCta}>S inscrire →</div>
            </a>
          ))
        )}
      </section>
    </main>
  )
}

function sportColor(sport) {
  const colors = {
    'CrossFit': '#e63946',
    'Hyrox': '#f4a261',
    'Functional Fitness': '#2a9d8f',
    'Haltérophilie': '#457b9d',
    'Autre': '#6c757d',
  }
  return colors[sport] || '#6c757d'
}

const styles = {
  main: {
    minHeight: '100vh',
    background: '#0f0f0f',
    color: '#f0f0f0',
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
  },
  header: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    padding: '48px 24px 40px',
    textAlign: 'center',
    borderBottom: '1px solid #222',
  },
  headerInner: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  logo: {
    fontSize: 'clamp(28px, 5vw, 48px)',
    fontWeight: '900',
    margin: '0 0 12px',
    letterSpacing: '-1px',
    color: '#ffffff',
  },
  tagline: {
    fontSize: '16px',
    color: '#aaa',
    margin: 0,
  },
  filterSection: {
    maxWidth: '900px',
    margin: '32px auto 0',
    padding: '0 24px',
  },
  searchInput: {
    width: '100%',
    padding: '14px 20px',
    fontSize: '16px',
    borderRadius: '12px',
    border: '1px solid #333',
    background: '#1a1a1a',
    color: '#f0f0f0',
    outline: 'none',
    boxSizing: 'border-box',
    marginBottom: '16px',
  },
  sportFilters: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  filterBtn: {
    padding: '8px 16px',
    borderRadius: '999px',
    border: '1px solid #333',
    background: '#1a1a1a',
    color: '#aaa',
    fontSize: '14px',
    cursor: 'pointer',
  },
  filterBtnActive: {
    background: '#ffffff',
    color: '#000000',
    border: '1px solid #ffffff',
    fontWeight: '700',
  },
  counter: {
    maxWidth: '900px',
    margin: '24px auto 8px',
    padding: '0 24px',
    color: '#666',
    fontSize: '14px',
  },
  grid: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '16px 24px 64px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
  },
  card: {
    background: '#1a1a1a',
    border: '1px solid #222',
    borderRadius: '16px',
    padding: '20px',
    textDecoration: 'none',
    color: '#f0f0f0',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    cursor: 'pointer',
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sportBadge: {
    fontSize: '11px',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '999px',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  prix: {
    fontSize: '13px',
    color: '#aaa',
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '700',
    margin: 0,
    lineHeight: '1.3',
  },
  cardMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    fontSize: '13px',
    color: '#888',
  },
  cardCta: {
    marginTop: '8px',
    fontSize: '13px',
    fontWeight: '700',
    color: '#ffffff',
    opacity: 0.5,
  },
  loadingText: {
    color: '#666',
    gridColumn: '1 / -1',
    textAlign: 'center',
    padding: '48px 0',
  },
}

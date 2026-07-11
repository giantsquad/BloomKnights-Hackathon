import { useEffect, useState } from 'react'
import './App.css'
import {
  fetchEdgar,
  // fetchJets, // planes section disabled for now — see JetMap below
  fetchSatellite,
  fetchStores,
  fetchSupply,
  fetchTrends,
} from './api'
import EdgarTimeline from './components/EdgarTimeline'
import ImageCompare from './components/ImageCompare'
// import JetMap from './components/JetMap' // planes section disabled for now
import Narrative from './components/Narrative'
import PaywallModal from './components/PaywallModal'
import SupplyChain from './components/SupplyChain'
import TrendsChart from './components/TrendsChart'

function Panel({ title, tag, children, className = '' }) {
  return (
    <section className={`panel ${className}`}>
      <header className="panel-header">
        <h2>{title}</h2>
        {tag && <span className="panel-tag">{tag}</span>}
      </header>
      {children}
    </section>
  )
}

export default function App() {
  const [stores, setStores] = useState([])
  const [storeId, setStoreId] = useState(null)
  const [satellite, setSatellite] = useState(null)
  const [trends, setTrends] = useState(null)
  // const [jets, setJets] = useState(null) // planes section disabled for now
  const [supply, setSupply] = useState(null)
  const [edgar, setEdgar] = useState(null)
  const [paywallOpen, setPaywallOpen] = useState(false)
  const [loadError, setLoadError] = useState(null)

  useEffect(() => {
    fetchStores()
      .then((s) => {
        setStores(s)
        if (s.length) setStoreId(s[0].id)
      })
      .catch(() => setLoadError('Cannot reach the backend — is uvicorn running on :8000?'))
  }, [])

  useEffect(() => {
    if (storeId == null) return
    setSatellite(null)
    setTrends(null)
    // setJets(null) // planes section disabled for now
    setSupply(null)
    setEdgar(null)
    fetchSatellite(storeId).then(setSatellite).catch(() => {})
    fetchTrends(storeId).then(setTrends).catch(() => {})
    // fetchJets(storeId).then(setJets).catch(() => {}) // planes section disabled for now
    fetchSupply(storeId).then(setSupply).catch(() => {})
    fetchEdgar(storeId).then(setEdgar).catch(() => {})
  }, [storeId])

  const store = stores.find((s) => s.id === storeId)

  return (
    <div className="app">
      <header className="topbar">
        <div className="logo-slot">PERIGEE</div>
        <button
          type="button"
          className="upgrade-btn"
          onClick={() => setPaywallOpen(true)}
        >
          Upgrade
        </button>
      </header>

      {loadError && <div className="load-error">{loadError}</div>}

      <div className="company-row">
        <div className="company-name">
          {store ? (
            <>
              <span className="company-label">{store.company}</span>
              <span className="company-ticker">${store.ticker}</span>
            </>
          ) : (
            <span className="company-label">Loading…</span>
          )}
        </div>
        <select
          className="store-select"
          value={storeId ?? ''}
          onChange={(e) => setStoreId(Number(e.target.value))}
          disabled={!stores.length}
          aria-label="Store"
        >
          {!stores.length && <option value="">Loading…</option>}
          {stores.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} — {s.city}, {s.state}
            </option>
          ))}
        </select>
      </div>

      <main className="grid">
        <Panel title="Satellites" tag="NAIP" className="span-12">
          <ImageCompare data={satellite} />
        </Panel>

        <Panel title="EDGAR Timeline" tag="SEC" className="span-12">
          <EdgarTimeline data={edgar} />
        </Panel>

        <Panel title="Trends" tag="Google Trends" className="span-6">
          <TrendsChart data={trends} />
        </Panel>

        <Panel title="Supply Chain" tag="Port data" className="span-6">
          <SupplyChain data={supply} />
        </Panel>

        {/* Planes section disabled for now — re-enable by uncommenting this
            panel plus the JetMap import, jets state, and fetchJets call above.
        <Panel title="Corporate Jets" tag="OpenSky ADS-B" className="span-6">
          <JetMap data={jets} store={store} />
        </Panel>
        */}

        <Panel title="Signal Report" tag="Gemini" className="span-12">
          <Narrative key={storeId} storeId={storeId} />
        </Panel>
      </main>

      <footer className="footer">
        All signals from public sources: USGS NAIP · Google Trends · port
        arrival data · SEC EDGAR
      </footer>

      <PaywallModal open={paywallOpen} onClose={() => setPaywallOpen(false)} />
    </div>
  )
}

import { useState } from 'react'

// Satellites panel content: a flat globe showing the satellite's position on
// the left, before/after capture imagery on the right. Real NAIP images go in
// frontend/public/samples/; a placeholder renders until they exist.

function Globe() {
  return (
    <svg viewBox="0 0 200 200" className="globe" role="img" aria-label="Satellite position">
      <circle cx="100" cy="100" r="78" className="globe-sphere" />
      {/* graticule */}
      <ellipse cx="100" cy="100" rx="78" ry="30" className="globe-line" />
      <ellipse cx="100" cy="100" rx="78" ry="58" className="globe-line" />
      <ellipse cx="100" cy="100" rx="30" ry="78" className="globe-line" />
      <ellipse cx="100" cy="100" rx="58" ry="78" className="globe-line" />
      <line x1="22" y1="100" x2="178" y2="100" className="globe-line" />
      {/* orbit path + satellite */}
      <ellipse cx="100" cy="100" rx="95" ry="48" className="globe-orbit" />
      <circle cx="168" cy="72" r="6" className="globe-sat" />
    </svg>
  )
}

function Snapshot({ snap, label }) {
  const [imgOk, setImgOk] = useState(true)

  return (
    <figure className="snapshot">
      <div className="snapshot-frame">
        {imgOk ? (
          <img
            src={snap.image_url}
            alt={`Satellite ${label}`}
            onError={() => setImgOk(false)}
          />
        ) : (
          <div className="snapshot-placeholder">
            <span>Imagery pending</span>
            <code>{snap.image_url}</code>
          </div>
        )}
      </div>
      <figcaption>
        <span className="snapshot-label">{label}</span>
        <span className="snapshot-date">{snap.captured_at}</span>
      </figcaption>
    </figure>
  )
}

export default function ImageCompare({ data }) {
  if (!data) return <div className="panel-empty">Loading satellite…</div>

  return (
    <div className="satellites">
      <div className="globe-col">
        <Globe />
        <p className="globe-caption">Satellite position over site</p>
      </div>
      <div className="compare-grid">
        <Snapshot snap={data.before} label="Before" />
        <Snapshot snap={data.after} label="After" />
      </div>
    </div>
  )
}

import { useState } from 'react'

// Renders one satellite snapshot. Falls back to a styled placeholder until
// real NAIP images land in frontend/public/samples/.
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
            <span>NAIP imagery pending</span>
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
    <div className="image-compare">
      <div className="compare-grid">
        <Snapshot snap={data.before} label="Before" />
        <Snapshot snap={data.after} label="After" />
      </div>
    </div>
  )
}

perigee/
│
├── README.md
├── .env.example                   # Gemini key, OpenSky client_id/secret
│                                   # (no key needed for Trends or EDGAR)
├── .gitignore                     # .env, __pycache__, node_modules, *.db
│
├── backend/                       # Sameer's domain (FastAPI + SQLite)
│   ├── main.py
│   ├── database.py
│   ├── perigee.db                 # gitignored, created at runtime
│   │
│   ├── routes/
│   │   ├── satellite.py           # /api/satellite — serves Dominic's output
│   │   ├── trends.py               # /api/trends — serves Sally's Google Trends data
│   │   ├── jets.py                # /api/jets — serves Sally's OpenSky data
│   │   ├── edgar.py                # /api/edgar — filing timeline
│   │   └── narrative.py           # /api/narrative — triggers Gemini call
│   │
│   └── schemas.py                 # Shared Pydantic models — the contract
│                                   # everyone codes against, defined hour 1
│
├── ml/                             # Dominic's domain (detection, satellite only now)
│   ├── detect_satellite.py        # YOLOv8 on static NAIP images → JSON
│   ├── models/
│   │   └── yolov8n.pt
│   └── sample_images/
│       ├── site_before.jpg
│       └── site_after.jpg
│
├── signals/                        # Nelson's domain (fusion + prediction math)
│   ├── fusion.py                  # NOW: calibrates Trends interest against
│                                   # satellite ground-truth (replaces old CCTV fusion)
│   ├── jet_proximity.py           # haversine distance + time-window flagging
│   ├── activity_score.py          # combines satellite + trends + jets into one score
│   └── config.py                  # locked CIKs, site coordinates, tail numbers,
│                                   # search terms for Trends — single source of truth
│
├── ingestion/                      # Sally's domain (external API plumbing)
│   ├── opensky_client.py          # OAuth token handling + refresh logic
│   ├── fetch_jets.py
│   ├── trends_client.py           # NEW: pytrends wrapper, handles the unofficial-
│                                   # API instability (retry/backoff logic)
│   ├── fetch_trends.py            # NEW: pulls interest-over-time for locked
│                                   # company/product search terms → JSON
│   ├── edgar_client.py
│   ├── fetch_filings.py
│   └── fallback/
│       ├── cached_snapshot.json   # now includes a cached Trends pull too —
│                                   # important since pytrends can be flaky live
│       └── demo_backup.mp4
│
├── gemini/                         # Dominic + Nelson pair here (hr 7)
│   └── generate_narrative.py      # payload now: satellite counts + trends
│                                   # interest + jet events + EDGAR dates
│
└── frontend/                       # Sameer's domain (React)
    ├── package.json
    ├── src/
    │   ├── App.jsx
    │   ├── components/
    │   │   ├── ImageCompare.jsx    # satellite before/after imagery
    │   │   ├── JetMap.jsx          # jet position map
    │   │   ├── TrendsChart.jsx     # NEW: replaces LiveCount.jsx — search
    │   │   ├── EdgarTimeline.jsx   # the "Day 0 vs Day X" panel — your money shot
    │   │   ├── Narrative.jsx       # Gemini output display
    │   │   └── PaywallModal.jsx    # pricing tiers
    │   └── api.js                  # fetch calls to backend, matches schemas.py
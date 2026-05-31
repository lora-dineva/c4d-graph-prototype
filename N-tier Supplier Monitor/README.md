# N-tier Supplier Monitor

Supply chain risk intelligence prototype for automotive OEM context (Volkswagen Group). **Graph Explorer** is an interactive, full-screen map of suppliers, parts, assemblies, programs, and plants—with impact path tracing, ownership overlay, search/filter, and alert integration.

Joint offering from **C4D** and **Wiser**. Demo-only: mock data and in-browser API; no backend or live integrations.

## Run locally

Serve this folder over HTTP (recommended), then open the explorer:

```bash
# Python
python -m http.server 8080

# Node (npx, no install)
npx --yes serve -p 8080
```

Open [http://localhost:8080/graph-explorer.html](http://localhost:8080/graph-explorer.html).

Opening `graph-explorer.html` directly from disk (`file://`) may fail in some browsers because scripts are loaded as separate files.

## Contents

| File | Role |
|------|------|
| `graph-explorer.html` | Single-page UI (Cytoscape + dagre layout) |
| `graph-explorer-data.js` | Shared mock graph, alerts, and demo scenarios |
| `graph-explorer-mock-api.js` | Client-side mock API (graph traversal; replace with `fetch` for production) |
| `Graph-Explorer-PRD-FE-BE-Spec.md` | Product, frontend, and data/API specification |

## Demo scenarios

Three built-in narratives on one dataset: blast radius (one chip, two platforms), hidden Tier-3 concentration (redundancy that wasn’t), and ownership/sanctions risk (European supplier, foreign ultimate parent). A persistent healthy dual-sourced path stays green across scenarios.

Further UX and architecture research lives under `Graph Hi-Fi Research/` in the repo root.

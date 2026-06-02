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
| `graph-explorer.html` | Single-page UI (Cytoscape + layout switcher) |
| `graph-explorer-data.js` | Semiconductor mock graph, alerts, scenarios A/B/C, use-case registry |
| `knowledge-graph-case1-data.js` | Thermal management graph (Case 1) and Scenario D data |
| `knowledge-graph-case2-data.js` | Vehicle chassis graph (Case 2) and Scenarios E/F data |
| `graph-explorer-mock-api.js` | Client-side mock API (graph traversal; replace with `fetch` for production) |
| `Graph-Explorer-PRD-FE-BE-Spec.md` | Product, frontend, and data/API specification |

Source references: thermal management — [`../Suport/Knowledge_Graph_Case_1.html`](../Suport/Knowledge_Graph_Case_1.html); vehicle chassis — [`../Suport/Knowledge_Graph_Case_2.html`](../Suport/Knowledge_Graph_Case_2.html).

## Use-case picker

The toolbar **use-case picker** switches between datasets without reloading the page:

| Use case | Scenarios | Layout |
|----------|-----------|--------|
| **Semiconductor risk** (default) | A · One Chip, Two Platforms · B · Redundancy That Wasn't · C · Safe European Supplier | Hierarchy (dagre) |
| **Thermal management** | D · Magnet Material Export Control | Fixed preset (tier-band positions from Case 1) |
| **Vehicle chassis** | E · Suspension Spring Plant Closure · F · Steel Industry Pressure | Fixed preset (positions from Case 2) |

Deep links persist the active use case in the URL hash (`use: "thermal_mgmt"` or `use: "chassis_supply"`).

## Demo scenarios

**Semiconductor risk** — three guided narratives on one dataset: blast radius (one chip, two platforms), hidden Tier-3 concentration (redundancy that wasn’t), and ownership/sanctions risk (European supplier, foreign ultimate parent). A persistent healthy dual-sourced path stays green across scenarios.

**Thermal management** — Scenario D walks through the MEB thermal chain from [`Knowledge_Graph_Case_1.html`](../Suport/Knowledge_Graph_Case_1.html): a rare-earth export-control warning on magnet material propagates through magnet set → electric motor → HVAC compressor → thermal management system → MEB, with cited regulatory sources in the inspector.

**Vehicle chassis** — Scenarios E and F walk through the MEB chassis chain from [`Knowledge_Graph_Case_2.html`](../Suport/Knowledge_Graph_Case_2.html): Scenario E traces thyssenkrupp’s Hagen plant phase-out through suspension spring → rear chassis module → vehicle chassis → MEB; Scenario F traces steel industry pressure through steel tubes → rear chassis module → MEB, with cited industry sources in the inspector.

Further UX and architecture research lives under `Graph Hi-Fi Research/` in the repo root.

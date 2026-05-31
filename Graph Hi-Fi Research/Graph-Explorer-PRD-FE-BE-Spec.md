# Graph Explorer — Prototype Specification (PRD · FE · BE/Data)

**Product:** N-tier Supplier Monitor · Graph Explorer module
**Context:** Supply chain risk intelligence platform for a large automotive OEM (Volkswagen Group). High-fidelity, demo-only, single-file HTML prototype.
**Audience for the deliverable it demos:** VW Group supply chain directors, purchasing VPs, CDO/CTO.
**Status:** Prototype scope. Production-scale concerns flagged inline as `[PROD]`.
**Synthesised from:** project architecture document (C.28–C.45), 10-Questions, 3 Demo Scenarios, risk visual encoding, layout research, library comparison, impact-path-tracing UX, ownership-overlay UX, controls UI, search/filter UX, alert-integration UX, stakeholder research.

> **Audience-language rule (applies to all UI copy and demo narration):** never use *node / edge / vertex*. Use *suppliers, sites, parts, assemblies, plants, programs, paths, connections, dependencies, owners*. The graph-theoretic vocabulary in the FE/BE sections below is for the prototype builder only.

---

# SECTION 1 — PRODUCT REQUIREMENTS DOCUMENT (PRD)

## 1.1 Problem statement

Risk signals (financial distress, geopolitical exposure, ownership change) land on individual suppliers. The decision-relevant fact — *which exact part, in which assembly, in which vehicle program, at which plant, with which time-to-impact, and with which mitigation option* — does not live in any single supplier, part, or plant record. It lives in the **connections between them**, often 2–3 tiers deep and reached through different intermediate suppliers. Flat tables and dashboards (SAP, Celonis, Bloomberg, existing SCRM) cannot express convergence, reachability, or shared ownership. The Graph Explorer closes the gap between *knowing an entity's attributes* and *knowing its position in the network*.

## 1.2 Product positioning (non-negotiable)

- **Not a dashboard, not an isolated chatbot.** A decision-ready intelligence layer over an OEM-specific supply chain knowledge graph.
- **Connects, does not replace** SAP, Celonis, Bloomberg, Prewave, Catena-X. It consumes their signals and makes them actionable through the graph.
- The **Knowledge Graph** and **Impact Path Tracing** are the core differentiating capabilities and must not be fully outsourced.
- Must be **vendor-agnostic, modular, exit-capable** by design.
- Catena-X is a **feeder**, not a competitor. SAP is the operational system of record; the Graph Explorer answers *"what does this mean"* when SAP raises a flag.

## 1.3 Scope

**In scope (this prototype):** the Graph Explorer module only — full-screen interactive supply chain map with risk encoding, Impact Path Tracing, ownership overlay, search/filter, and alert integration, running on **one shared mock dataset**.

**Referenced but not built** (appear as links/handoff stubs only): Supplier 360, Alert Cockpit, Action Workspace, Global Risk Map, Impact View, Comparison/Delta View.

**Out of scope:** live data integration, authentication/RBAC, autonomous AI decisions, full global N-tier coverage, responsive/mobile layout, persistence beyond `localStorage`.

**Architecture MVP envelope this prototype represents** (from the architecture doc §3.3): 300–500 critical suppliers, 3–5 commodity clusters, 2–3 plants, 2–3 vehicle programs, Tier-1 full + Tier-2/3 selective on critical paths, core risks = financial/ownership/operational/quality/geo-compliance. The prototype renders a **30–80 entity slice** of that envelope.

## 1.4 Target users & jobs-to-be-done

| Persona | Primary job in the graph | Decision metric they anchor on |
|---|---|---|
| Purchasing VP / commodity buyer | "An alert fired — what stops, when, and who acts?" | Revenue-at-risk, days-to-line-stop |
| Supply chain director | "Where is my plant / program structurally exposed?" | Plants at risk, SPOF count |
| Quality / SQ engineer | "Which tier-2/3 sits behind this Tier-1, and is it stable?" | Financial score, alternative path |
| Compliance / legal | "Who ultimately controls this supplier; LkSG exposure?" | Ultimate owner, sanction/entity-list flag |
| CDO/CTO (demo evaluator) | "Does this show me something my current tools can't?" | The hidden-concentration & shared-owner reveals |

Users are experienced with enterprise software, skeptical of "another dashboard," unfamiliar with graph theory, and motivated by production risk, cost of disruption, and LkSG regulatory pressure.

## 1.5 The 10 questions the graph must answer (capability backlog)

Ordered; **bold = mandated for this prototype to answer compellingly (Q1, Q2, Q3, Q4)**, with the demo spotlight on Q1 → Q3 → Q4 and Q2 staged immediately behind Q1.

1. **Blast radius** — if this supplier fails, what stops (parts → assemblies → programs → plants) and how soon? *(forward BFS from source)*
2. **Dependency concentration** — which single supplier/site removal takes down the most production? *(rank by downstream programs that lose all routes; "leaderboard")*
3. **Hidden shared risk** — which "independent" programs converge on the same deep Tier-3? *(intersect each program's reachable supplier set)*
4. **Ownership risk** — who ultimately controls this supplier, and is it the same owner as another supposedly-independent supplier? *(climb owned-by to common root; project union of blast radii)*
5. Alternative path — if a site goes down, is there an independent qualified route to the same part? *(reverse reachability minus failed site; flag same-owner/same-region as correlated)*
6. Geopolitical exposure — share of a program's multi-tier chain through high-risk geographies, weighted by SPOF.
7. Program-to-supplier — full all-tier supplier roster touching a program, with risk profile, as a prioritised worklist.
8. Tier-3 exposure — dependency set **minus** contract set = uncontracted-but-critical suppliers.
9. Change impact — re-source simulation: programs to re-validate, residual exposure on old supplier, new concentration created.
10. Escalation path — single fastest-to-impact path from alert to plant, with owner + buffer at each hop; handoff to Action Workspace.

## 1.6 Demo scenarios (all on one shared dataset)

| # | Name | Capability proven | Maps to | Real-world anchor |
|---|---|---|---|---|
| A | One Chip, Two Platforms | Blast radius — one risk fans to many endpoints across EV + combustion | Q1, Q10 | 2021 chip crunch ($210B / 7.7M units); 2025–26 mature-node squeeze |
| B | The Redundancy That Wasn't | Hidden concentration — two "dual-sourced" Tier-1 paths share one Tier-3 fab | Q3, Q2, Q5 | Renesas Naka fire (~30% of auto MCUs, one building) |
| C | The Safe European Supplier | Ownership/control risk — European supplier, sanctioned foreign ultimate parent; shares owner with the Asian source | Q4, Q3 | Nexperia/Wingtech (Dutch address, Chinese control, Entity List) |

A persistent **healthy control path** (genuinely dual-sourced DC-DC converter, Infineon via Bosch — no shared fab, no shared owner) stays green in all scenarios, proving the tool isn't painting everything red.

**Naming convention:** real names for healthy recognisable players (Continental, Bosch, Infineon, VW models/plants); invented-but-plausible names for risk-carrying suppliers (SilTech Malaysia / SuntoraMicro, Veldhoven Semiconductors, Hongqiao Tech Holdings, Pan-Asia Wafer, Greatwall Capital).

## 1.7 Functional requirements

- **FR-1 Render** the shared supply network full-screen, dark canvas, hierarchical (tier-layered) by default, with risk encoded on suppliers/parts/paths.
- **FR-2 Select** any supplier → lightweight Risk Signal Card; explicit **Trace Impact** action (two-beat, not auto-explode). `data-auto-trace` hot nodes may fire trace automatically after 600 ms for demo pacing.
- **FR-3 Impact Path Tracing** — forward BFS over supply/assembly/logistics relationships; staged ~2.8 s reveal; 4-state visual taxonomy (source / affected / peripheral / unaffected); severity colouring per affected element; animated directional flow toward the OEM.
- **FR-4 Impact summary panel** — plants at risk, SPOF count, parts affected, **€ revenue-at-risk (odometer animation)**, programs, earliest SOP at risk, alternative-supplier status, qualification lead time, LkSG disclosure flag; Path Index (ranked paths) with critical-path-first default; plant/program/critical-only filters.
- **FR-5 SPOF treatment** — dramatic, distinct from risk level (diamond frame + double "target" ring + SPOF text badge + slow 3.2 s pulse); SPOF-in-view counter with "highlight all."
- **FR-6 Ownership overlay** — toggle on/off; insert ultimate-parent + intermediate-holding entities above a locked supply layout; dashed amber arcs that never drive layout; concentration grouping (compound container) when ≥2 suppliers share an ultimate parent; per-node PE / high-leverage / dual-flag (site vs owner country) / sanction badges; ownership-chain sidebar tab.
- **FR-7 Search** — typeahead (200 ms debounce, grouped by suppliers/parts/programs, fuzzy "did you mean"), select → ghost non-matches + highlight pulse + camera fit; `Cmd/Ctrl+K` or `/`.
- **FR-8 Filter** — right-side accordion panel: tier, risk level, risk type, country, program, plant, commodity, entity type, LkSG, SPOF-only; active-filter chips; "showing X of Y" info strip; zero-result guard.
- **FR-9 Visibility layers** (additive overlays, distinct from restrictive filters) — ownership chains, financial-risk-paths-only, Tier-3 connections, alternative supply paths, LkSG flags.
- **FR-10 Layout switcher** — Hierarchy (dagre, default) · Force/Risk-Spread (cola) · Geographic; animated morph; node identity stable across morph.
- **FR-11 Alerts** — alert drawer (bell + badge count), severity grammar (ring pulse + badge + border + fill), click-to-navigate (fly-to + path highlight + side panel + breadcrumb in one action), acknowledge (dashed "seen-not-resolved" ring), alert-history mini-timeline with escalating/stabilising trend chip, on-demand **broadcast demo sequence** (`Shift+D`, ~8 s all-clear → live CRITICAL).
- **FR-12 Healthy contrast path** — always rendered green even during a red trace, answering Q5/Q2 in one view.
- **FR-13 Saved views & deep links** — capture filters + layers + camera + selection; system/my/shared views; URL-hash deep link for escalation sharing.
- **FR-14 Node actions** — contextual bubble (Expand connections · Trace impact · Hide · Pin) + right-click context menu (Trace from here · Show ownership chain · Open Supplier 360 · Acknowledge · Flag).
- **FR-15 Export** — PNG / SVG / PDF report of current trace state; copy share link; present mode.
- **FR-16 Handoff stubs** — "Open in Action Workspace", "View Supplier 360" render as links showing a "module coming soon" state to prove modularity.

## 1.8 Non-functional requirements

- **NFR-1** Single self-contained HTML file; all CSS/JS inline; libraries via CDN; no build step; opens locally with no server.
- **NFR-2** Interactive queries feel instant; deep/asynchronous operations are pre-computed/cached. Architecture SLO context: P95 < 10 s for core queries `[PROD]`.
- **NFR-3** Desktop demo only; fixed canvas ≥ 1280×800; no responsive layout.
- **NFR-4** 60 fps at prototype scale (30–80 entities; library validated to ~200, comfortable to ~1,000). `[PROD]` viewport culling, server-side clustering, lazy per-viewport loading beyond ~1,000.
- **NFR-5** WCAG AA: ≥4.5:1 text, ≥3:1 UI; colourblind-safe risk palette (temperature shift, not red/green); every colour-coded signal carries a text label.
- **NFR-6** Deterministic, demo-safe rendering: default layout loads instantly and identically every time; force-layout pre-computed/cached to avoid live convergence jitter.
- **NFR-7** Brand fidelity: VW navy `#001e50` chrome, dark canvas `#0d1929`, teal accent `#00b0f0`, light surfaces `#f4f6f9`.
- **NFR-8** State persistence via `localStorage` only (filter panel, minimap collapse, saved views). No other browser storage.

## 1.9 Success criteria (demo)

- Q1 lands in < 5 s ("one supplier → two plants stop") — the hook.
- Q3 produces a genuine "we couldn't have known that" — two independent programs collapse onto one hidden Tier-3 — the credibility-maker.
- Q4 produces a "we have one owner with two addresses" — ownership overlay shoots two arcs to a single parent — the differentiation + LkSG hook.
- The green control path remains visibly healthy throughout (credibility guard).
- Every reveal traces to a specific part/plant/program/owner, never an abstract risk score.

## 1.10 Risk-type priority

Financial insolvency and geopolitical exposure at Tier-2/3 are the highest-priority risk types and the trigger/subject of the canonical scenario. Do not treat all risk types equally.

---

# SECTION 2 — FRONT-END SPECIFICATION

## 2.1 Technology stack (decided)

| Concern | Choice | Rationale |
|---|---|---|
| Graph engine | **Cytoscape.js 3.28.x** (canvas renderer) | MIT; 60 fps @ 200 nodes; viewport culling; native compound nodes; class-based batch styling; standalone `<script>`, no build. Best fit on all six evaluated criteria. |
| Hierarchical layout | **cytoscape-dagre 2.5.0** (+ dagre 0.8.5) | Sugiyama layered layout; tier depth legible; deterministic; demo-safe. |
| Force / Risk-Spread layout | **cytoscape-cola** | Incremental/animated morph from current positions. |
| Geographic layout (optional) | Leaflet/Mapbox tile background w/ lat-lng placement | Secondary view; geo-concentration only. |
| Ownership/alert overlays & pulses | Transparent **HTML/SVG overlay layer** above the Cytoscape `<canvas>`, positioned via `node.renderedPosition()` / `renderedWidth()`, driven by `requestAnimationFrame` | Cytoscape renders to canvas; CSS `box-shadow`/`animateMotion` don't apply to canvas. |

CDNs: `cytoscape@3.28.1`, `cytoscape-dagre@2.5.0`, `dagre@0.8.5`, `cytoscape-cola` — all from cdnjs/unpkg.

## 2.2 Layout & z-index

Full-screen canvas with overlay chrome. Right-side panel is the inspector/filters; a separate impact summary panel slides in during trace.

```
┌──────────────────────────────────────────────┬───────────────┐
│ TOP TOOLBAR  (48px, #001e50, full width to panel edge)        │
├──────────────────────────────────────────────┤  RIGHT PANEL  │
│  [search/chips overlay — top-left]            │  (inspector / │
│                                               │   filters /   │
│            GRAPH CANVAS (#0d1929)             │   impact      │
│                         [LEGEND — top-right]  │   summary)    │
│  [ZOOM cluster]                               │   280–380px   │
│  [MINIMAP 160×120]                            │               │
│  [INFO STRIP — bottom 32px]                   │               │
└──────────────────────────────────────────────┴───────────────┘
              [NODE ACTION BUBBLE — floats near selected node]
```

| Layer | z-index |
|---|---|
| Canvas | 0 |
| Minimap / zoom / legend / info strip | 100 |
| Top toolbar | 200 |
| Node action bubble | 300 |
| Alert drawer / modals | 400 |

`--panel-width` CSS var (default 380px) drives toolbar `right`, legend `right`, and canvas inset so chrome reflows with the panel.

## 2.3 Visual design system

### 2.3.1 Brand & surface tokens
```
--canvas:#0d1929  --brand-dark:#001e50  --brand-teal:#00b0f0
--surface-light:#f4f6f9  --panel-bg:#0f2035  --panel-border:rgba(255,255,255,.08)
--text-primary:#e8f4fd  --text-secondary:#8ca8c0  --text-muted:#4a6680
```
Chrome = glass-morphism (semi-transparent dark, `backdrop-filter: blur(12px)`); controls recede when idle so the graph is always primary. VW navy is reserved for the top toolbar to separate chrome from the canvas. Typography: `'VW Text','Inter',-apple-system`; label scale 9/11/12/13px; never below 9px (executive screen-distance legibility).

### 2.3.2 Risk palette (colourblind-safe temperature shift — authoritative)
| Level | Hex | Name | Semantic |
|---|---|---|---|
| Critical | `#FF4500` | Ember Orange-Red | production stoppage imminent |
| High | `#FF8C00` | Deep Amber | active disruption risk |
| Medium | `#F5C518` | Caution Yellow | monitoring required |
| Low | `#32ADE6` | Sky Blue | within tolerance |
| None | `#4D5566` | Slate Grey | no known risk |

Tints `-20`/`-10` (rgba) provided for fills/glows. Validated under deuteranopia/protanopia/tritanopia — remains ordered and legible. **This palette is canonical for *structural* risk only.** Live-alert *event* state uses a separate locked set (`--alert-critical:#E53935 · --alert-high:#FB8C00 · --alert-medium:#FDD835 · --alert-info:#00B0F0`); see Resolved Build Decision #1. A node may carry both at once — structural risk on its border/glow, live-alert state on its pulsing ring/badge.

### 2.3.3 Three-channel independent encoding
Shape = entity type · Size = supplier tier · Colour = risk. Any one channel readable alone. **Node never changes shape or size due to risk** (only ring/glow/badge/colour) — prevents disorienting layout shift as risk state changes.

| Entity | Shape | Default size | Glyph |
|---|---|---|---|
| Supplier T1 | Circle | 44px | building |
| Supplier T2 | Circle | 38px | building (sm) |
| Supplier T3 | Circle | 32px | building (sm) |
| Supplier site | Rounded square | 34px | location pin |
| Part | Hexagon | 32px | gear/component |
| Assembly | Hexagon (lg) | 40px | stacked layers |
| Plant | Rectangle | 52×36px | factory |
| Vehicle program | Pentagon/shield | 44×40px | car outline |

### 2.3.4 Per-node risk treatment (four simultaneous signals)
Ring/border: Critical 4px+glow · High 3px+soft glow · Medium 2px dashed · Low 1.5px @60% · None 1px @40%. Plus subtle interior fill tint, risk-coloured bold label, and (Critical only) pulsing radial glow (`critical-pulse` 2.4 s). Four corner badge slots: TL alert pip · TR primary risk-type icon (financial=$ gold, geopolitical=globe violet, quality=triangle, compliance=doc emerald, operational=gear) · BL SPOF badge · BR tier label.

### 2.3.5 SPOF treatment (stacked, highest visual priority — never hidden)
Dashed diamond frame extending ~8px beyond node (slow 1°/s rotation) + double "target" ring (inner risk colour, canvas gap, near-white outer) + red `SPOF` text badge (BL) + slow `spof-pulse` 3.2 s + warm-white 2.5px inbound edge (single bright "thin thread"). Reads even at 50% zoom because the frame/glow exceed node bounds.

### 2.3.6 Edge encoding (two independent channels)
Dash pattern = relationship type (supplies=solid · manufactured-at=long-dash · used-in=dot-dash · owned-by=short-dot). Colour+weight = risk state (max risk of endpoints, or explicit path risk): Critical 3px `#FF4500` animated flow · High 2.5px · Medium 2px · Low 1.5px @0.55 · None 1px @0.35 (recedes). Ownership edges are always overlays — `unbundled-bezier` with negative `control-point-distances` arcing **above** the supply band, `z-index` below supply edges, opacity 0.75, stake-% labels only at zoom > 1.2.

### 2.3.7 Visual state taxonomy (during trace)
| State | Treatment |
|---|---|
| `trace-source` | full opacity, red glow pulse, `#FF4500` border |
| `trace-affected` | full opacity, coloured by `impactSeverity` |
| `trace-peripheral` | 40% opacity (signals "more exists") |
| `trace-unaffected` | 12–15% opacity (never `display:none` — preserves spatial memory) |
| `trace-healthy` | 100% opacity, green `#34c759` — the control path |

## 2.4 Interaction specifications

### 2.4.1 Selection → trace (two-beat)
- **Beat 1 (0 ms):** click risk supplier → white ring + pulse + **Risk Signal Card** (~280px) slides from right: name, tier, country, risk type, `CRITICAL — Financial Insolvency` badge, one-line alert summary, **"Trace Impact →"** (teal), secondary "View Supplier 360". No graph change yet.
- **Beat 2 (on click / auto for `autoTrace` nodes after 600 ms):** activate Impact Path Tracing.

### 2.4.2 Impact trace algorithm & animation
Forward **BFS** from source following only `supply | assembly | logistics` relationship types (skip ownership/geo during trace). Staged reveal (~2.8 s total): source pulse → Tier-1 site (400 ms) → part/SPOF (750 ms) → assembly (1100 ms) → plants (1500/1600 ms) → programs (2000 ms, revenue counter animates). Continuous dashed-edge "flow" offset animation conveys direction toward OEM. Viewport auto-pans to keep the activating tier in frame, then fits the full affected subgraph. SPOF nodes pulse continuously post-reveal.

### 2.4.3 Multiple-paths management
Default = **critical-path-first** (single highest-impact SPOF path full; others → peripheral). **Path Index** in summary panel: ranked list grouped Critical/High/Medium with €-at-risk; click a path → cross-fade + 0.8 s replay + stats recalc + viewport fit. "Show all paths" bundles parallel edges with count badge ("4 part dependencies"). Severity filter chips `[CRITICAL][HIGH][MEDIUM]` sync index + graph.

### 2.4.4 Trace filters (composable predicate)
Plant scope dropdown · `Critical paths only` toggle (answers Q2) · program chips. Single `isElementVisible(ele)` predicate (`plantOk && programOk && criticalOk`) re-evaluated on every change; panel stats (€-at-risk, counts) recalculated each time.

### 2.4.5 Exit trace (3 redundant, never accidental)
`← Clear trace` button · breadcrumb `[✕]` · `Esc`. 600 ms fade-out (not instant snap = looks like a crash), remove trace classes, slide panel out, `cy.fit()`. Switching source→source does a **cross-fade**, not a return to full graph. Panel does **not** close on stray canvas clicks.

### 2.4.6 Ownership overlay toggle
On: lock all supply-chain node positions (`node.lock()`), insert ultimate-parent at `y=minY-180` and holdings at `y=minY-90`, partial-layout only ownership nodes, reveal dashed amber arcs, apply concentration compound groups, animate parents into place (400 ms). Off: hide ownership edges, remove ownership nodes + groups, `unlock()`. Clicking a supplier: supply path highlights in graph **and** ownership chain opens in sidebar — two distinct responses, never superimposed.

### 2.4.7 Concentration grouping
When ≥2 suppliers share `ultimateParentId`, wrap them in a Cytoscape **compound parent** (amber dashed roundrectangle, `background-opacity 0.08` so edges pass through). Pinned badge: `⚠ CONCENTRATION RISK · {Owner} ({country}) · {n} suppliers · Affects: {programs}` — phrased as business consequence, not "shared parent."

### 2.4.8 Search
200 ms debounce → grouped typeahead (suppliers/parts/programs), each row: type icon · bolded match · tier badge · country · risk pill; fuzzy "did you mean"; `↑/↓/Enter/Esc`. On select: 350 ms ghost of non-matches (`opacity .1` + desaturate), 600 ms teal highlight pulse (scale 1→1.08→1), 400 ms camera fit (80px pad; single match → ~60% zoom). Clear reverses fade + restores prior camera (stored pre-search).

### 2.4.9 Filter panel
Right side, 280px, collapsible to edge tab with active-count badge. Accordion sections (Supply-chain position, Risk profile, Geography, Program & Plant, Commodity, then **Visibility Layers** divider). Tier multi-toggle, risk-level pills, risk-type/entity/country checkboxes, commodity chips, searchable program/plant. Active-filter chip bar under search (`[Tier 2 ×][Taiwan ×]…  Clear all`); 300 ms re-render on chip removal; zero-result guard `⚠ No results [Adjust filters]`; info strip `Showing 47 of 312 suppliers · 12 of 89 parts · 2 of 4 plants`.

### 2.4.10 Layout switcher
Segmented `Hierarchy | Force | Geographic`; active = teal fill/navy text; switching triggers animated re-layout with brief teal spinner. Pre-compute + cache both hierarchy and force positions on load so the toggle is a sub-second transform morph (demo reliability), not a live re-layout.

### 2.4.11 Alerts
**Drawer:** bell + `⚑ n` badge → 400px right drawer (overlays, doesn't collapse canvas), rows sorted severity→recency (severity chip · supplier · description · time · → CTA). **Click-to-navigate (1 action):** drawer to 60% opacity → 600 ms fly-to (~1.2× zoom, node at ~70% width) → impact path highlights in severity colour, non-path dims to 20% → side panel auto-opens → breadcrumb `Alert: … → Impact Path → Wolfsburg/Golf MQB → 3 programs`. **Ambient on-canvas:** pulsing ring (canvas-space px so it survives zoom) + floating severity badge (bounce-in) + border/fill tint; ring loops 3 s (CRITICAL) / 4 s (HIGH) / shimmer (MEDIUM) / none (INFO); below ~0.4× zoom badge collapses to 4px dot. **Acknowledge** (right-click or `K`): animated ring → static **dashed** ring (seen ≠ resolved), badge → grey w/ red icon + ✓, tooltip `Acknowledged by {user} · {time} · Unresolved`. **Alert history** (side panel, 90-day, "load more 12 mo"): vertical dot-and-line mini-timeline, severity-coloured gradient line, `↑ Escalating` / `↓ Stabilising` trend chip. **Broadcast demo** (`Shift+D`): T+0 data-pulse along edges → T+0.5 node flash→red → T+1 ring → T+1.5 drawer badge ++ → T+2 directional path wash + dim others → T+3.5 `⚠ 3 vehicle programs at risk` float-in → T+5 drawer auto-opens → T+8 rest.

### 2.4.12 Interaction-state cheat-sheet
| State | Signal |
|---|---|
| Hover node | 2px teal halo |
| Selected | solid 2px teal ring + action bubble |
| SPOF | diamond frame + double ring + 3.2 s pulse |
| Path highlighted | non-highlighted drop to ~10% opacity |
| Layout transition | 200 ms ease, nodes slide / edges morph |
| Layer toggled off | 200 ms opacity fade |
| Search active | non-match dim 15%, match teal halo |

## 2.5 Components inventory

Top toolbar (breadcrumb nav-tree, `Cmd+K` search, layout segmented control, layer-toggle pills supply/ownership/risk, export menu, alert bell, saved-views bookmark) · search overlay + typeahead + filter-chip bar · right filter panel (accordion + visibility-layer toggles) · right inspector panel (tabs: Overview · Supply Path · Ownership Chain · Risk Signals · Alert History) · impact summary panel (header stats + Path Index + path detail + handoff buttons) · Risk Signal Card · node action bubble (Expand/Trace/Hide/Pin) · right-click context menu · legend (entity types / risk levels / path indicators, collapsible) · zoom cluster (+ / % / − / fit, `+ - F 0`) · minimap (160×120, risk-coloured dots, viewport rect, click-to-pan, collapsible, `localStorage`) · info strip · SPOF-in-view banner · alert drawer · saved-views sidebar + save modal · ownership-chain SVG sub-tree · concentration badge · handoff "coming soon" stubs.

## 2.6 Keyboard map
`Cmd/Ctrl+K` or `/` search · `↑/↓` nav results · `Enter` select top · `Esc` clear/deselect/exit trace · `F` fit · `0` reset zoom · `+/−` zoom · `Ctrl+F` toggle filter panel · `Alt+←` history back · `Ctrl+S` save view · `K` acknowledge alert · `Shift+D` broadcast demo. All icon buttons carry `aria-label`+`title`; focus ring `2px #00b0f0 offset 2px`.

## 2.7 Design decisions & rationale (carry-forward)
Right-side panel (not left) mirrors SAP Fiori / Celonis and creates navigate→inspect→filter left-to-right flow. Accordion (not flat) for 10+ filter dimensions. Intentional two-beat trace (not auto-explode) gives the presenter pacing control. Dim (not hide) unaffected elements to preserve spatial memory. Hierarchical default because the core workflow ("alert fired — which tier, which programs?") is top-down; force-spread is the secondary "see it across the whole network" reveal. Pre-compute layouts for demo reliability.

## 2.8 `[PROD]` re-evaluation flags
Saved views need a preferences API (hash-URL is demo-only); country filter needs searchable multi-select backed by the supplier-country enum; camera `fit()` needs debounce/virtual viewport >5,000 entities; CSS glow → `feGaussianBlur` in canvas renderer; badge positions must recompute on zoom; ownership overlay → separate lower-z canvas layer or server-side concentration pre-clustering + lazy per-viewport load; SPOF diamond → compound outline node at scale.

---

# SECTION 3 — BACK-END / DATA SPECIFICATION

> Prototype back end = a **static in-file dataset** (Cytoscape elements JSON) plus client-side traversal functions. The shapes below double as the contract for the production graph service (CRUD over nodes/edges, traversal/query APIs, all changes auditable — architecture C.28).

## 3.1 Domain model (entities)

The knowledge graph connects **supplier, site, part, assembly, plant, program, owner, material, and risk event** (architecture C.28). Ownership requires separating three commonly-conflated concepts: physical **Site**, incorporated **LegalEntity**, and **UltimateParent** (+ intermediate holdings, financial sponsors).

| Entity (`type`) | Represents | Key properties |
|---|---|---|
| `oem` | The OEM root | `id, name` |
| `program` | Vehicle program/platform | `id, name, risk_level, platform(MQB/MEB/SSP), volume` |
| `plant` | OEM production plant | `id, name, country, city, lat, lng, risk_level, program_ids[]` |
| `assembly` | Multi-part assembly/module | `id, name, part_count, program_ids[]` |
| `part` | Component / part number | `id, name, part_number, commodity_group, risk_level, single_point_of_failure, annual_volume, revenue_at_risk, stock_cover_weeks, stockout_date` |
| `supplier` | Legal supplier entity (T1–T3) | `id, name, country, tier(1/2/3), risk_level, risk_type, financial_score, alert_status, peOwned, leverageRatio, debtMaturityYear, creditRating, ultimateParentId, sanctionScreeningStatus, lat, lng` |
| `site` | Physical production location | `id, name, country, city, lat, lng, tier, tiersServed[], risk_level, certifications[], capacity, operatorEntityId` |
| `legal_entity` | Incorporated operating company | `id, name, incorporationCountry, operatingCountries[], entityType, ultimateParentId, sanctionScreeningStatus` |
| `intermediate_holding` | Holding between operator & parent | `id, name, incorporationCountry, sanctionScreeningStatus` |
| `ultimate_parent` | Top of beneficial-ownership chain | `id, name, country, entityType, estimatedRevenue, supplierCount, concentrationFlag` |
| `financial_sponsor` | PE fund / activist investor | `id, name, fundVintage, aum, leverageRatio, debtMaturityYear, strategy` |
| `risk_event` *(optional)* | Discrete signal feeding alerts | `id, supplierId, severity, riskType, description, ts, status` |

**Enums (lowercase canonical — Resolved Build Decision #2; matches CSS/Cytoscape selectors with no mapping).** `risk_level: critical|high|medium|low|none` · `risk_type: financial_insolvency|geopolitical|operational|quality|compliance|concentration|capacity|none` · `tier: 1|2|3` · `alert_status: critical|active|watch|monitoring|none` · `entityType: operating|holding|pe_fund|sovereign|family_controlled|unknown` · `sanctionScreeningStatus: clear|flagged|sanctioned` · `criticality: sole_source|dual_source|multi_source`. The existing 30-node seed JSON (uppercase) is down-cased on import.

## 3.2 Relationships (edges)

Architecture-mandated relationship classes (C.28): **supply, ownership, financial dependency, process/material dependency, compliance**. Concrete edge types used by the graph and traversals:

| `relationship` | Direction (source → target) | Class | Carries |
|---|---|---|---|
| `SUPPLIES` | supplier/site → part, or supplier → supplier (upstream) | supply | `tier, volume, leadTime, spof, criticality, alert, risk_propagation` |
| `MANUFACTURED_AT` | part/program → site/plant | process | — |
| `ASSEMBLED_AT` | assembly → plant | process | — |
| `PART_OF_ASSEMBLY` | part → assembly | material dependency | `position` |
| `USED_IN` / `CRITICAL_FOR` | part → program | material dependency | `risk_propagation` |
| `MATERIAL_DEPENDENCY` | part(Tier-1 A) → shared die/wafer ← part(Tier-1 B) | material dependency | the Scenario B convergence edge |
| `OPERATES` | legal_entity → site | ownership | — |
| `OWNS` / `OWNED_BY` | entity → holding/parent (upward) | ownership | `stake, direct, verified, source` |
| `HOLDS_STAKE` | financial_sponsor → legal_entity | financial dependency | `stake, acquired, board` |
| `CONTROLLED_BY` | supplier/entity → ultimate_parent | ownership | `sanctionRisk` |
| `COMPLIANCE_FLAG` | entity → risk_event/regime | compliance | `regime (EU FDI / LkSG / sanctions)` |

**Layout invariant:** ownership/compliance edges **never drive layout** (`edgeWeight 0` in dagre); supply/material edges define the tier ranks. Tier-pinning: `rank = {program/oem:0, assembly:1, part:2, T1:3, T2:4, T3:5}` so a lower tier never renders above a higher one.

## 3.3 Canonical prototype dataset (shared across A/B/C)

A worked 30-node / 46-edge instance exists (`vw_supplier_graph_cytoscape.md`) and is the reference seed:

**Critical chain (Scenario A/blast-radius):** `SilTech Malaysia (T2, financial_score 24, CRITICAL)` —`SUPPLIES`→ `Display Driver IC MX7023 (part, SPOF)` —`PART_OF_ASSEMBLY`→ `MQB Infotainment Assembly` —`ASSEMBLED_AT`→ `Wolfsburg + Emden`; the IC is `USED_IN` (`risk_propagation:true`) `Golf MQB` + `Tiguan MQB-evo`. Tier-1 `Harman` builds the head unit; Tier-3 `Siltronic` + `Shin-Etsu` feed SilTech (the deep dependency).

Counts: OEM 1 · programs 2 · plants 2 · assemblies 3 · parts 5 · T1 suppliers 3 · T1 sites 4 · T2 suppliers 5 · T3 suppliers 5 = **30 nodes / 46 edges**. For the full A/B/C demo this seed is extended with the ownership layer (Greatwall/Hongqiao ultimate parents + intermediate holdings + Suzhou/Veldhoven), the Scenario-B shared-die convergence (Pan-Asia Wafer under two Tier-1 controllers), and the green control path (Infineon-via-Bosch DC-DC converter). Target build size 30–80 entities.

### Element JSON shape (Cytoscape, paste-ready)
```jsonc
// node
{ "data": { "id":"t2_siltech", "label":"SilTech Malaysia ⚠ CRITICAL",
  "name":"SilTech Malaysia Sdn Bhd", "type":"supplier", "tier":2,
  "country":"Malaysia", "risk_level":"CRITICAL", "risk_type":"financial_insolvency",
  "financial_score":24, "alert_status":"CRITICAL",
  "ultimateParentId":"parent_greatwall", "peOwned":false,
  "spof":false, "autoTrace":true,
  // runtime-populated by traceImpact(): impactSeverity, affectedPlants[], programId
}}
// part (SPOF)
{ "data": { "id":"part_ddc", "type":"part", "single_point_of_failure":true,
  "commodity_group":"Semiconductor", "annual_volume":840000,
  "revenue_at_risk":28000000, "stock_cover_weeks":4.2, "stockout_date":"2026-08-14",
  "affectedPlants":["plant_wolfsburg"], "programId":"prog_golf" }}
// edge (critical supply, drives propagation)
{ "data": { "id":"e36", "source":"t2_siltech", "target":"part_ddc",
  "relationship":"SUPPLIES", "type":"supply", "spof":true,
  "criticality":"sole_source", "alert":"CRITICAL_FINANCIAL_RISK",
  "risk_propagation":true }}
// ownership edge (overlay, excluded from layout)
{ "data": { "id":"o12", "source":"entity_siltech", "target":"parent_greatwall",
  "relationship":"OWNED_BY", "type":"ownership", "stake":0.673,
  "verified":"2024-Q4", "source_ref":"orbis", "sanctionRisk":"flagged" }}
```

## 3.4 Mock API surface

Prototype: synchronous client functions over the in-memory dataset. Production: REST/GraphQL over the graph service with the **same response shapes** (cache-aside, async for deep jobs, P95 < 10 s `[PROD]`).

| Operation | Prototype function | `[PROD]` endpoint | Returns |
|---|---|---|---|
| Load network | `getGraph(scenario?)` | `GET /graph?scope=` | `{ nodes[], edges[], meta:{counts} }` |
| Entity detail | `getEntity(id)` | `GET /entities/:id` | full property bag + tabs payload (overview/risk/parts/ownership/alerts) |
| **Impact trace** | `traceImpact(sourceId)` | `POST /impact/trace` | see 3.5 |
| Concentration leaderboard (Q2) | `getConcentration()` | `GET /analysis/concentration` | `[{ supplierId, score, programsLostIfRemoved[], plants[] }]` |
| Shared deep dependency (Q3) | `getSharedDependencies(programIds[])` | `GET /analysis/shared` | `[{ supplierId, reachedFrom:[programIds], tier }]` |
| Ownership chain (Q4) | `getOwnershipChain(entityId)` | `GET /ownership/:id` | ordered chain operator→holdings→ultimateParent + sponsor + flags |
| Concentration-by-owner | `getOwnerConcentration()` | `GET /ownership/concentration` | `[{ ultimateParentId, suppliers[], programs[], count }]` |
| Alternative path (Q5) | `getAlternatives(partId, excludeSiteId)` | `GET /parts/:id/alternatives` | `[{ path[], independent:bool, sameOwner, sameRegion, leadTimeWeeks }]` |
| Change simulation (Q9) | `simulateResource(partId, newSupplierId)` | `POST /simulate/resource` | `{ added[], removed[], newConcentration[], residualExposure[], riskDelta }` |
| Search | `search(q)` | `GET /search?q=` | grouped `{ suppliers[], parts[], programs[] }` + fuzzy suggestion |
| Alerts | `getAlerts()` / `ackAlert(id)` | `GET /alerts` / `POST /alerts/:id/ack` | drawer rows / ack receipt |
| Saved views | `saveView(state)` / `listViews()` | `POST/GET /views` | view id / list (hash-encoded fallback in prototype) |

## 3.5 Impact-trace response (the core contract)

```jsonc
{
  "source": { "id":"t2_siltech", "name":"SilTech Malaysia", "tier":2,
              "riskType":"financial_insolvency", "riskLevel":"CRITICAL" },
  "affectedNodeIds": ["part_ddc","asm_infotainment","plant_wolfsburg",
                      "plant_emden","prog_golf","prog_tiguan"],
  "affectedEdgeIds": ["e36","e13","e07","e08","e19","e20"],
  "summary": {
    "plantsAtRisk": 2, "spofCount": 1, "partsAffected": 7,
    "revenueAtRisk": 42000000, "programs": ["Golf 8","Tiguan"],
    "earliestSOPatRisk": "2026-Q3",
    "alternativeSupplier": "NONE_QUALIFIED", "qualificationLeadWeeks": 22,
    "lksgDisclosureRequired": true,
    "productionHaltRiskDays": 68, "stockCoverWeeks": 4.2,
    "riskAdjustedStockoutDate": "2026-08-14"
  },
  "paths": [
    { "id":"p1", "severity":"critical", "spof":true, "revenueAtRisk":28000000,
      "label":"Display Driver IC → Wolfsburg → Golf 8",
      "hops":[
        {"id":"t2_siltech","role":"supplier","owner":"commodity buyer"},
        {"id":"part_ddc","role":"part","spof":true},
        {"id":"asm_infotainment","role":"assembly"},
        {"id":"plant_wolfsburg","role":"plant","owner":"plant logistics"},
        {"id":"prog_golf","role":"program","bufferDays":18}
      ]},
    { "id":"p2", "severity":"high", "revenueAtRisk":14000000,
      "label":"ADAS Sensor → Zwickau → ID.4" }
  ],
  "healthyContrast": { "path":["infineon","bosch","dcdc","prog_id4"],
                       "status":"dual_sourced_qualified" }
}
```

## 3.6 Traversal semantics (client algorithms)

- **Blast radius / trace (Q1,Q10):** BFS forward from source; follow only `supply|assembly|logistics` relationship types; collect affected nodes+edges; per-path severity = `spof ? critical : maxEndpointRisk`; rank paths by (revenue-at-risk desc, earliest SOP). Escalation path (Q10) = single shortest-time/highest-criticality path with owner + buffer per hop.
- **Concentration (Q2):** for each supplier/site, remove and count programs/plants that lose **all** forward routes; weight by program volume; rank → leaderboard + heat ring.
- **Shared dependency (Q3):** for each selected program, collect reachable upstream supplier set (downward traversal); intersect sets; overlap = hidden convergence (amber flash + overlap counter).
- **Ownership (Q4):** climb `OWNED_BY/CONTROLLED_BY` to ultimate parent; group suppliers by `ultimateParentId`; where count>1, emit concentration group; combined exposure = union of grouped suppliers' blast radii.
- **Alternative path (Q5):** reverse `SUPPLIES` from part to all producing sites; remove failed site; test remaining reachability; tag survivor as `independent` only if different owner **and** region (else "correlated").
- **Tier-3 exposure (Q8):** `dependencySet (deep traversal) − contractSet (suppliers with direct OEM contract, ≈ Tier-1)`; keep deep SPOF/high-volume remainder.
- **Change impact (Q9):** from part → forward programs (re-validate); from old supplier → other parts (residual); from new supplier → forward check for new convergence; union into impact set with add/remove/new-concentration classification + before/after risk score.

## 3.7 Runtime-populated fields
`traceImpact()` writes onto elements (reset on clear): `impactSeverity` (critical/high/medium/monitored), `affectedPlants[]`, `programId`, plus trace CSS classes. SPOF (`single_point_of_failure` / edge `spof`) is authored data, not computed in the prototype (`[PROD]` derive from alternative-path analysis).

## 3.8 Data provenance & governance (mirrors production)
Every entity/edge carries source + freshness (`verified`, `source` e.g. `orbis`), and every model change is auditable (architecture C.35 audit trail). Ownership/sanction data is asserted in the prototype; `[PROD]` resolves via Orbis/Bureau van Dijk, D&B, Refinitiv with UBO chain resolution + human review, real-time OFAC/EU/UK screening, Bloomberg/Refinitiv credit for PE-debt. Feeders (architecture §4.2): internal SAP/ERP, BOM/part-usage, plant/program master, quality/audit, logistics call-offs; external registers, financials/ratings, news, ESG, sanctions, geo-events; ecosystem Catena-X, supplier portals, SCRM. Human-in-the-loop: AI provides evidence, functional roles decide (C.36). Data-freshness indicator shown in UI: `Ownership data: Orbis/BvD · Verified Q4 2024 · ⚠ Verify before regulatory submission`.

## 3.9 LkSG / regulatory data hooks
Suppliers in high-risk geographies and entities with sanctioned/flagged ultimate owners carry `lksgDisclosureRequired:true` and a compliance regime tag (EU FDI Reg. 2019/452, LkSG). Surfaced as node badge + sidebar call-out + impact-summary flag. This is a primary differentiator for the German executive audience and a deliberate, demoable data attribute.

---

## Resolved build decisions (locked)

These five cross-document inconsistencies were reconciled with the product owner; the specification above should be read with these resolutions binding.

1. **Risk-colour system — SPLIT into two formal roles.** The colourblind-safe temperature-shift palette is canonical for **structural risk** (a node/path's standing risk level): `--risk-critical:#FF4500 · --risk-high:#FF8C00 · --risk-medium:#F5C518 · --risk-low:#32ADE6 · --risk-none:#4D5566`. The alert set is reserved exclusively for **live-event state** (a firing/acknowledged alert): `--alert-critical:#E53935 · --alert-high:#FB8C00 · --alert-medium:#FDD835 · --alert-info:#00B0F0`. A node may show both simultaneously: its border/glow encodes structural risk; the pulsing ring/badge encodes the live alert. Builder must define both token sets and never use one role's colour for the other.
2. **Risk-level casing — lowercase everywhere.** Canonical enum is `risk_level: critical|high|medium|low|none` in data **and** code, so dataset values match CSS/Cytoscape selectors directly with no mapping layer. The existing 30-node seed JSON (`CRITICAL/HIGH/…`) must be down-cased on import. Apply the same lowercase rule to `risk_type` and `alert_status` values.
3. **Scenario cast — MERGE both, with name dedup.** The worked 30-node SilTech seed is the **base** dataset (SilTech Malaysia, Harman, Continental, Bosch, Siltronic, Shin-Etsu, etc.). Scenario B/C entities are **layered in**: Veldhoven Semiconductors + Hongqiao Tech Holdings (ownership/control reveal), Pan-Asia Wafer (shared-die convergence), Greatwall/Suzhou (shared-owner concentration), Infineon-via-Bosch DC-DC (green control path). One canonical name per entity — resolve duplicates before build (e.g. pick **one** distressed Tier-2 chip maker identity rather than carrying both SilTech *and* SuntoraMicro/Nexchip; reuse it as the Scenario-A source and as the shared-owner sibling of Veldhoven). Target build size remains 30–80 entities on the single shared graph.
4. **Default hierarchical layout direction — TB (top-to-bottom).** OEM/programs anchor the top rank, Tier-3 at the bottom (`rankDir:'TB'`, tier-pinned ranks `program/oem:0 → assembly:1 → part:2 → T1:3 → T2:4 → T3:5`). The org-chart metaphor makes tier depth and upward blast-radius the primary read for the director audience. The impact-trace reveal animates **upward** (source Tier-2/3 → programs/plants at top) rather than left-to-right; choreography timings in §2.4.2 are unchanged, only the axis differs.
5. **Panel width — `--panel-width: 380px`.** The right inspector must hold the ownership-chain SVG sub-tree (260px entity boxes + padding) and the impact-summary stats + Path Index without cramping, so the wider value wins over the 280px filter-only width. The 320px Risk Signal Card / impact-summary content sits comfortably inside it. Toolbar `right`, legend `right`, and canvas inset all derive from this single var.

---

# SECTION 4 — ZERO-SETUP DEMO COMPLEXITY ASSESSMENT

**Goal of this section:** rate how hard it is to build this demo so a colleague runs it with **zero setup** — open one file in a browser, no npm/pip, no Docker, no build, no local server. Backend simulated in-browser (mock API + in-memory state) over the inlined sample data; every third-party library via CDN or inlined.

**Verdict up front:** the spec is already architected for this. The decided stack (Cytoscape.js + dagre + cola via CDN, static in-file dataset, client-side traversal — §2.1, §3.3–3.6, NFR-1) is a near-perfect match. **No requirement genuinely needs a server.** The only true server-class items (live feeds, ownership/credit/sanction data sources, team-shared saved views, map tiles) are already out of scope or trivially fakeable in-browser.

## 4.1 Requirements inventory + A/B/C classification

**Class key:** **A** = trivially client-side · **B** = client-side with a mock/fake · **C** = genuinely needs a real backend/service (must be faked or cut).

### Rendering, layout, visual system
| Requirement | Class | Note |
|---|---|---|
| Full-screen graph canvas (Cytoscape) | A | canvas renderer, no server |
| Hierarchical layout (dagre, TB) | A | CDN plugin |
| Force/Risk-Spread layout (cola) | A | CDN plugin; pre-compute + cache positions |
| Geographic layout (map tiles) | **C** | needs tile server/Mapbox token + network → fake or cut (see 4.3) |
| Risk palette, 3-channel encoding, SPOF treatment, edge encoding | A | CSS/Cytoscape styles |
| Overlay layer (pulses, badges, ownership arcs, dual-flags) | A | HTML/SVG synced to `renderedPosition()` + RAF |

### Panels, chrome, components
| Requirement | Class | Note |
|---|---|---|
| Top toolbar, legend, zoom, minimap, info strip, SPOF banner | A | static DOM + Cytoscape APIs |
| Right filter panel (accordion + visibility layers) | A | DOM + client predicate |
| Right inspector (Overview/Supply/Ownership/Risk/Alerts tabs) | B | reads in-memory entity record |
| Impact summary panel + Path Index + path detail | B | rendered from `traceImpact()` result |
| Risk Signal Card, node action bubble, context menu, modals | A | DOM |
| Ownership-chain SVG sub-tree, concentration badge | A | computed from in-memory ownership chain |
| Handoff "coming soon" stubs (Supplier 360, Action Workspace, etc.) | A | static stub |

### Data
| Requirement | Class | Note |
|---|---|---|
| 12 entity types, 11 edge types, 30–80 entity dataset | B | inlined JS object literal (NOT `fetch` — see 4.6) |
| Runtime trace fields (`impactSeverity`, `affectedPlants`…) | A | mutated in memory, reset on clear |

### Interactions & algorithms
| Requirement | Class | Note |
|---|---|---|
| Two-beat selection → trace | A | event handlers |
| Impact Path Tracing (forward BFS) + staged ~2.8 s animation | A | main-thread BFS over 30–80 nodes is instant |
| Multiple-paths Path Index, ranking, bundling | A | client sort |
| Trace filters (composable `isElementVisible` predicate) | A | client |
| Ownership overlay toggle (lock/insert/arc/group) | A | Cytoscape compound nodes + locking |
| Concentration grouping (group by `ultimateParentId`) | A | client reduce |
| Search typeahead + fuzzy "did you mean" | B | small client fuzzy matcher (e.g. inlined Fuse.js or hand-rolled) |
| Filter panel, visibility layers, active chips, zero-result guard | A | client |
| Layout switcher + animated morph | A | cached positions |
| Healthy contrast path | A | authored data |

### Analyses (the mock-API "endpoints")
| Requirement | Class | Note |
|---|---|---|
| `traceImpact`, `getConcentration` (Q2), `getSharedDependencies` (Q3), `getOwnershipChain`/`getOwnerConcentration` (Q4), `getAlternatives` (Q5), `simulateResource` (Q9), `search` | A | all pure graph computations over in-memory data |
| `getEntity`, `getGraph` | A/B | return inlined records |

### Alerts
| Requirement | Class | Note |
|---|---|---|
| Alert drawer, severity grammar, click-to-navigate, acknowledge, alert history | B | static seeded alert objects + state flags |
| **Live** alert feed / real-time push | **C** | no server → fake via timers + "Fire alert" (`Shift+D`) broadcast |
| Broadcast demo sequence (T+0→T+8) | A | `setTimeout` chain, no library |

### Persistence, export, sharing
| Requirement | Class | Note |
|---|---|---|
| Saved views (capture filters/layers/camera/selection) | B | `localStorage` best-effort |
| Deep-link sharing (URL hash) | B | hash encode/decode, no server |
| Team-shared / system saved views | **C** | needs preferences API → fake as pre-seeded in-file "system views" + local "my views" |
| Export PNG / SVG | A | Cytoscape `png()` / `svg()` (svg via CDN extension) |
| Export PDF report | B | inlined/CDN `jsPDF` wrapping a PNG snapshot |

### External integrations (all referenced in spec, none built)
| Requirement | Class | Note |
|---|---|---|
| SAP/ERP, BOM, Catena-X, Orbis/BvD, Bloomberg/Refinitiv, OFAC/EU sanctions, news/ESG feeds | **C** | already out of scope — represented purely by inlined static mock attributes; no live call anywhere |
| Proprietary `VW Text` font | B | fallback to CDN `Inter` / system stack |

## 4.2 Every C item → in-browser fake or cut

1. **Geographic map layout (C → fake or cut).** Tile servers/Mapbox need network + token. **Recommendation: cut from the must-have demo** (it's already labelled secondary; SPOF/topology can't be answered geographically anyway). If retained, fake with an **inlined simplified world SVG/GeoJSON** and place sites by `lat/lng` projected client-side — no tiles, no token, fully offline.
2. **Live alert feed (C → fake).** Replace push with (a) pre-seeded alert objects in memory and (b) the **`Shift+D` broadcast sequence** + optional `setInterval` "drip" to simulate arrivals. Identical on-screen experience; zero infrastructure.
3. **Team/system saved views (C → fake).** Ship **pre-seeded "system views"** as in-file constants (Critical Path – Golf MQB, APAC Geopolitical, SPOF – Semiconductors, LkSG Due Diligence). "My views" persist via `localStorage`; "shared" is faked with a deep-link **URL hash** anyone can paste — no preferences backend.
4. **External data sources (C → already inlined static).** Every Orbis/Bloomberg/sanction/SAP attribute is just a field on the inlined entities (`creditRating`, `leverageRatio`, `sanctionScreeningStatus`, `financial_score`, `revenue_at_risk`…). Nothing calls out. A `Verified Q4 2024` freshness label communicates provenance without a live source.
5. **PDF export (C-ish → B).** Use inlined `jsPDF` to wrap a Cytoscape PNG + summary stats; or downgrade to PNG/SVG only for the demo. No print server.

**Result: nothing remains that requires a server.** All ten core questions are answerable by pure client-side traversal over the inlined graph.

## 4.3 Overall complexity rating

**Rating: MEDIUM.** One-line justification: *zero algorithmic or infrastructure depth (tiny dataset, no server, no build), but high breadth — many bespoke panels, a rich animation/overlay layer synced to a canvas renderer, and a two-palette risk system — so effort is in surface area and polish, not difficulty.*

**Rough build-effort estimate (one experienced front-end dev):**
- **Convincing core demo (Q1 blast-radius + Q3 hidden-concentration + Q4 ownership + alerts/broadcast, single TB graph, inspector + impact summary):** ~**5–8 working days**.
- **Full-fidelity per this spec** (all panels, search/filter/saved-views, layout switcher, change-simulation Q9, alternative-path Q5, export, all polish/animation): ~**3–4 weeks**.
- Risk-spread/geographic layouts and PDF export are the lowest-ROI items — defer if time-boxed.

## 4.4 Recommended architecture (simplest that meets the constraints)

**One self-contained `index.html`.** Justified over multi-file because the hard constraint is "open a single file"; splitting CSS/JS would still work on `file://` via relative `<link>/<script>` but adds zero value and risks path issues when the file is emailed around. Single file is the most portable artifact.

**Framework: none (vanilla JS).** Cytoscape.js *is* the heavy lifting; the surrounding chrome is plain DOM. A reactive micro-framework is optional — if panel state churn becomes painful, add **Alpine.js via CDN** (`<script defer src="cdn…alpinejs">`) for declarative panel binding, but it is not required and avoiding it keeps the dependency surface minimal. **Do not** reach for React/React Flow — React Flow is React-only and needs a bundler (spec §2.1 already rejected it; it breaks the no-build constraint).

**Libraries (CDN `<script>` tags, classic — not ES modules):**
`cytoscape@3.28.1`, `dagre@0.8.5`, `cytoscape-dagre@2.5.0`, optional `cytoscape-cola`, optional `cytoscape-svg` (SVG export), optional `jsPDF` (PDF). **For an air-gapped/conference demo, inline (paste) the minified source of cytoscape + dagre + cytoscape-dagre** directly into `<script>` blocks so the file needs no network at all (≈1 MB, acceptable).

**Mock API layer:** a single `mockApi` object whose methods (`getGraph`, `getEntity`, `traceImpact`, `getConcentration`, `getSharedDependencies`, `getOwnershipChain`, `getAlternatives`, `simulateResource`, `search`, `getAlerts`, `ackAlert`, `saveView`, `listViews`) **return Promises resolved via `setTimeout(…, 0–150ms)`** to mimic async latency. They read/compute over the in-memory graph. Because they already mirror the production REST shapes (§3.4–3.5), the demo can later be repointed at a real service by swapping the method bodies for `fetch` — the UI never changes.

**State:** a single plain `appState` object — `{ selection, filters, layers, layout, trace, alerts, savedViews, camera }` — with one `render()` (or a tiny pub/sub) that re-applies Cytoscape classes/styles and redraws the HTML overlay layer. No store library needed at this scale.

**Sample data embedding:** the §3.3 dataset inlined as a **JS object literal** — `const GRAPH = { nodes:[…], edges:[…] };` — frozen and loaded with `cy.add(GRAPH)`. **Never `fetch('data.json')`** — `file://` blocks XHR/fetch for local files in Chromium. Inlining is mandatory, not stylistic.

**Overlay rendering:** transparent `position:absolute; pointer-events:none` HTML/SVG layer above the Cytoscape `<canvas>`, with element positions read from `node.renderedPosition()` / `renderedWidth()` each `cy.on('render')` / RAF tick — this carries the pulsing rings, alert badges, dual-flag/PE pills, ownership-edge stake labels, and the SPOF diamond, since CSS `box-shadow`/`animateMotion` don't apply to canvas.

## 4.5 `file://` design rules (build-time non-negotiables)
- **No `fetch`/XHR** for local resources → all data and libs inlined or CDN-absolute.
- **No ES module `import`** (`<script type="module">` is blocked from `file://` for local files) → use classic scripts and globals.
- **No Web Workers / service workers** (blocked on `file://`) → run BFS and all analyses on the main thread (instant at 30–80 entities).
- **No CORS-dependent calls.** CDN `<script>`/`<link>` are fine (they're not subject to fetch CORS), but any data XHR is not.
- **`localStorage` is best-effort on `file://`** (origin is `null`/opaque; some browsers isolate or disable it) → treat persistence as enhancement, never as required state.

## 4.6 Risks & mitigations
| Risk | Severity | Mitigation |
|---|---|---|
| **CDN dependence / offline venue** | High for a live exec demo | **Inline minified cytoscape + dagre + cytoscape-dagre** into the file for a true zero-network artifact; or pre-load once on the demo laptop and don't reload. Document which mode the file is in. |
| **`file://` blocks fetch/modules/workers** | High | Inline all data as JS literal; classic scripts only; main-thread algorithms (4.5). |
| **Data volume** | Low | Demo dataset is 30–80 entities — trivial. Don't expand to the 500-supplier MVP envelope in-browser; that's a `[PROD]` concern. |
| **State persistence across reloads** | Medium | Default demo state is always fully reconstructable from inlined data; `localStorage` for filters/minimap/saved-views is best-effort; **URL hash** encodes shareable view state without a server. |
| **Browser compatibility** | Medium | Target the actual demo machine's latest **Chrome/Edge (Chromium)**; include `-webkit-` prefixes (`backdrop-filter`); avoid Safari-only quirks; rehearse on the real laptop. |
| **Proprietary font missing** | Low | Fallback stack `'VW Text','Inter',-apple-system,sans-serif`; load Inter via CDN or accept system fallback. |
| **Animation performance on weak hardware** | Low–Med | Cap concurrent pulses; pre-compute layout positions; throttle the overlay RAF loop; degrade gracefully (static rings) if `prefers-reduced-motion`. |
| **Large inlined file emailed/blocked** | Low | ≈1 MB single HTML is within mail limits; if blocked, share via drive link — still zero-setup to open. |

**Bottom line:** build it as a single inlined `index.html`, vanilla JS + Cytoscape/dagre (CDN, or inlined for offline), a Promise-based `mockApi` over a frozen in-memory `GRAPH` literal, one `appState` object, and an HTML/SVG overlay for the live visuals. Cut geographic layout and (optionally) PDF export to stay lean. Everything else in this spec is achievable with zero setup.

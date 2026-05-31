# SPOF UX Treatment — Graph Explorer Prototype
**N-tier Supplier Monitor · Design Research**
*Audience: VW Group supply chain and purchasing leadership*

---

## 1. SPOF Definition in the Graph

### Graph-theoretic definition

A **Single Point of Failure (SPOF)** in the supply chain graph is a supplier site or part whose removal disconnects the only path between a raw material or sub-component source and an OEM assembly plant.

Formally, a node `v` is a SPOF if and only if **all** of the following are true:

1. **Articulation point** — removing `v` increases the number of connected components in the directed subgraph formed by the paths from Tier-N materials to the target OEM plant. This is detected by Tarjan's bridge-finding algorithm (DFS-based, O(V+E)).

2. **Single-source flag** — `node.data('source_count') === 1`, meaning no sibling supplier exists for the same part number or commodity family at the same tier. This flag is pre-computed from the knowledge graph and stored as a node property; it does not need to be recalculated at runtime.

3. **Reachability** — the node lies on at least one active path from a Tier-2 or Tier-3 material origin to a production-relevant OEM plant (i.e., a plant currently in ramp-up, SOP, or serial production). Nodes on paths that serve only EOP programs are excluded from SPOF scoring by default.

### Why articulation point alone is insufficient

A node can be a graph-theoretic articulation point without being a supply-chain SPOF. For example, a Tier-1 distributor may be the only "hub" node structurally, but the OEM may hold six months of safety stock or have a qualified alternate approved but not yet activated. The `single_source` flag is the business-layer check that catches this. Both conditions must hold.

### Node properties used at runtime

```
node.data = {
  id: "murata_xiamen_site_01",
  label: "Murata Xiamen",
  tier: 2,
  type: "site",                       // site | part | assembly | plant | program
  source_count: 1,                    // number of qualified alternate suppliers
  spof: true,                         // pre-computed; updated nightly from KG
  risk_level: "medium",               // none | low | medium | high | critical
  risk_score: 67,                     // 0–100
  geo_country: "CN",
  geo_risk_tier: 2,                   // 1 (low) to 4 (high)
  programs_at_risk: ["Golf MQB", "Audi A3 MQB"],
  disruption_impact_days: 34          // estimated production halt duration
}
```

### Algorithm implementation sketch (Cytoscape.js + custom)

```javascript
// Pre-run on graph load; tag articulation points via DFS
function findSPOFs(cy) {
  const visited = {};
  const disc = {};
  const low = {};
  const parent = {};
  let timer = 0;
  const articulationPoints = new Set();

  function dfs(u) {
    visited[u] = true;
    disc[u] = low[u] = timer++;
    let childCount = 0;

    cy.getElementById(u).outgoers('node').forEach(v => {
      const vid = v.id();
      if (!visited[vid]) {
        childCount++;
        parent[vid] = u;
        dfs(vid);
        low[u] = Math.min(low[u], low[vid]);

        // Articulation point conditions
        if (!parent[u] && childCount > 1) articulationPoints.add(u);
        if (parent[u] && low[vid] >= disc[u]) articulationPoints.add(u);
      } else if (vid !== parent[u]) {
        low[u] = Math.min(low[u], disc[vid]);
      }
    });
  }

  cy.nodes().forEach(n => {
    if (!visited[n.id()]) dfs(n.id());
  });

  // Combine with single_source business flag
  cy.nodes().forEach(n => {
    const isSPOF = articulationPoints.has(n.id()) && n.data('source_count') === 1;
    n.data('spof', isSPOF);
  });
}
```

---

## 2. Visual Treatment Options for SPOF Nodes

The core challenge: SPOF must be **immediately visible** without creating visual noise that drowns out risk-level signals. The graph will typically have 3–12 SPOFs among 60–150 visible nodes. Below are four options evaluated against three criteria: **pre-attentive pop**, **symbol overload risk**, and **combined encoding compatibility** (ability to layer SPOF signal with risk level).

---

### Option A — Warning ring / pulsing outline

**Description:** The node retains its standard shape and fill colour. A second concentric ring is drawn outside the node boundary, 4–6px thick, in amber `#f5a623`. The ring animates with a slow pulse (opacity 1.0 → 0.4 → 1.0, 2.5s cycle). At rest (when the graph is not animating), the ring is static and visible.

**SVG mockup:**
```svg
<!-- SPOF node: Murata Xiamen (Tier-2 site) -->
<g transform="translate(120, 80)">
  <!-- Pulsing ring (amber) — animated via CSS -->
  <circle r="26" fill="none" stroke="#f5a623" stroke-width="4"
          class="spof-ring" opacity="0.9"/>
  <!-- Node base fill -->
  <circle r="20" fill="#1a3a5c" stroke="#00b0f0" stroke-width="1.5"/>
  <!-- Tier indicator dot -->
  <circle r="5" fill="#00b0f0" cx="0" cy="-12"/>
  <!-- Label -->
  <text y="34" text-anchor="middle" fill="#e8edf3"
        font-size="10" font-family="VW Text, Inter, sans-serif">
    Murata Xiamen
  </text>
  <!-- SPOF badge (small) -->
  <text x="14" y="-14" fill="#f5a623" font-size="9" font-weight="bold">⚠</text>
</g>

<style>
.spof-ring {
  animation: spof-pulse 2.5s ease-in-out infinite;
}
@keyframes spof-pulse {
  0%, 100% { opacity: 0.9; }
  50%       { opacity: 0.35; }
}
</style>
```

**Cytoscape.js style:**
```javascript
{
  selector: 'node[?spof]',
  style: {
    'border-width': 4,
    'border-color': '#f5a623',
    'border-opacity': 0.9,
    'border-style': 'solid',
    'overlay-color': '#f5a623',
    'overlay-padding': 6,
    'overlay-opacity': 0         // activated on hover; 0 at rest
  }
}
// Pulse via JS interval (Cytoscape doesn't support CSS animation natively)
let pulseUp = true;
setInterval(() => {
  const spofNodes = cy.nodes('[?spof]');
  const opacity = pulseUp ? 0.9 : 0.3;
  spofNodes.style('border-opacity', opacity);
  pulseUp = !pulseUp;
}, 1200);
```

**Assessment:**
- Pre-attentive pop: **High** — motion is pre-attentive; ring catches peripheral vision
- Symbol overload risk: **Low** — ring does not occupy the node interior; risk colour can still fill the node body
- Combined encoding: **Excellent** — node fill remains free for risk-level colour; ring = structural SPOF signal
- Weakness: animation can feel distracting in a dense graph; should pause when a simulation is running

---

### Option B — Warning badge / icon overlay

**Description:** A small triangular warning badge (14×14px) sits at the top-right quadrant of the node, overlapping the node boundary. The badge uses amber fill `#f5a623` with a dark `!` glyph. No animation. The badge is an absolutely-positioned overlay independent of the node's own style.

**SVG mockup:**
```svg
<g transform="translate(120, 80)">
  <!-- Node base -->
  <circle r="20" fill="#1a3a5c" stroke="#00b0f0" stroke-width="1.5"/>
  <text y="34" text-anchor="middle" fill="#e8edf3" font-size="10">Murata Xiamen</text>
  <!-- Warning badge — top-right corner -->
  <g transform="translate(12, -18)">
    <polygon points="0,-8 7,6 -7,6" fill="#f5a623"/>
    <text x="0" y="5" text-anchor="middle" fill="#0d1929"
          font-size="7" font-weight="900">!</text>
  </g>
</g>
```

**Cytoscape.js style:**
```javascript
// Cytoscape doesn't support badges natively — use background-image overlay:
{
  selector: 'node[?spof]',
  style: {
    'background-image': 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60">
        <polygon points="30,4 56,52 4,52" fill="#f5a623"/>
        <text x="30" y="42" text-anchor="middle" fill="#0d1929"
              font-size="28" font-weight="900">!</text>
      </svg>`),
    'background-image-containment': 'over',
    'background-clip': 'none',
    'background-width': '18px',
    'background-height': '18px',
    'background-position-x': '80%',
    'background-position-y': '10%',
    'background-opacity': 0
  }
}
```

**Assessment:**
- Pre-attentive pop: **Medium** — badge is small; can be missed in dense graphs
- Symbol overload risk: **Medium** — if nodes already carry risk-level icons, badge competes
- Combined encoding: **Good** — badge occupies a corner, leaving body for risk colour
- Best use: **secondary SPOF indicator** alongside Option A ring; works well in list/table views

---

### Option C — Node colour completely overridden to warning colour

**Description:** The entire node fill changes to amber `#f5a623` or deep orange `#e8640a` when SPOF is true, regardless of risk level. Risk-level differences are expressed by fill shade variation (light amber = low risk SPOF, deep orange = high risk SPOF).

**Cytoscape.js style:**
```javascript
{
  selector: 'node[?spof][risk_level = "low"]',
  style: { 'background-color': '#f5c842', 'color': '#0d1929' }
},
{
  selector: 'node[?spof][risk_level = "medium"]',
  style: { 'background-color': '#f5a623', 'color': '#0d1929' }
},
{
  selector: 'node[?spof][risk_level = "high"]',
  style: { 'background-color': '#e8640a', 'color': '#ffffff' }
},
{
  selector: 'node[?spof][risk_level = "critical"]',
  style: { 'background-color': '#c0392b', 'color': '#ffffff' }
}
```

**Assessment:**
- Pre-attentive pop: **Very high** — colour fill is the strongest pre-attentive channel
- Symbol overload risk: **High** — overriding fill destroys the risk-level signal; a critical dual-sourced supplier and a low-risk SPOF could look similar
- Combined encoding: **Poor** — you must choose: node colour encodes SPOF, or risk level, not both
- Verdict: **Reject as primary treatment.** Acceptable only as a temporary override during active "simulate disruption" mode (see Section 6).

---

### Option D — Larger node size than non-SPOF peers

**Description:** SPOF nodes are rendered 30–40% larger than their tier-peers (e.g., standard Tier-2 node = 24px radius; SPOF Tier-2 node = 34px radius). Size encodes structural importance.

**Cytoscape.js style:**
```javascript
// Base size by tier
{ selector: 'node[tier = 2]',  style: { width: 48, height: 48 } },
{ selector: 'node[tier = 3]',  style: { width: 36, height: 36 } },
// SPOF size override — ~40% larger
{ selector: 'node[?spof][tier = 2]', style: { width: 66, height: 66 } },
{ selector: 'node[?spof][tier = 3]', style: { width: 50, height: 50 } }
```

**Assessment:**
- Pre-attentive pop: **Medium-high** — size is pre-attentive, but requires visual comparison to register
- Symbol overload risk: **Low** — size doesn't conflict with colour or border signals
- Combined encoding: **Good** — size (SPOF) + fill colour (risk level) is a clean dual-encoding
- Weakness: dagre/cose-bilkent layout algorithms re-space nodes based on size; a large SPOF can distort tier-lane structure. Cap size increase at 30%.

---

### Recommended combination

**Primary:** Option A (pulsing ring) — motion is pre-attentive and leaves the node body free
**Secondary:** Option D (size +25%) — reinforces structural importance, readable at a glance
**Do not use:** Option C as a permanent state (reserve for simulation mode)

```javascript
// Combined SPOF style — Recommended
cy.style()
  .selector('node[?spof]').style({
    'border-width': 4,
    'border-color': '#f5a623',
    'border-style': 'solid',
    'width':  'mapData(spof, 0, 1, 44, 56)',
    'height': 'mapData(spof, 0, 1, 44, 56)'
  })
  .update();
```

---

## 3. SPOF Edge Treatment

When a part has only one active supplier, the edge connecting them is the only path. It must visually read as "this connection cannot fail."

### Design approach

Three signals combined on the edge:

**Signal 1 — Dashed/animated stroke**
A moving dash animation (marching ants) on the edge signals fragility. Unlike a solid line (which reads as "stable"), a marching dashed line reads as "under tension" without requiring a legend.

**Signal 2 — Amber colour**
Match the SPOF ring colour `#f5a623` so the edge and node signal are visually linked.

**Signal 3 — Increased stroke weight**
SPOF edges: 3px. Standard edges: 1.5px. This makes the edge legible as more structurally significant.

**SVG mockup:**
```svg
<defs>
  <marker id="arrowhead-spof" markerWidth="8" markerHeight="6"
          refX="8" refY="3" orient="auto">
    <polygon points="0 0, 8 3, 0 6" fill="#f5a623"/>
  </marker>
  <style>
    .spof-edge {
      stroke-dasharray: 8 4;
      animation: march 1.2s linear infinite;
    }
    @keyframes march {
      to { stroke-dashoffset: -24; }
    }
  </style>
</defs>

<!-- SPOF edge: Murata Xiamen → MLCC Part #4471 -->
<line x1="120" y1="80" x2="280" y2="160"
      stroke="#f5a623" stroke-width="3"
      class="spof-edge"
      marker-end="url(#arrowhead-spof)"/>

<!-- Invisible wider hit zone for tooltip -->
<line x1="120" y1="80" x2="280" y2="160"
      stroke="transparent" stroke-width="12"
      data-tooltip="Only source · No qualified alternate"/>
```

**Cytoscape.js style:**
```javascript
// Standard edges
{
  selector: 'edge',
  style: {
    'line-color': '#2a4a6b',
    'target-arrow-color': '#2a4a6b',
    'target-arrow-shape': 'triangle',
    'width': 1.5,
    'line-style': 'solid',
    'curve-style': 'bezier'
  }
},
// SPOF edge — single-source path
{
  selector: 'edge[?spof_edge]',
  style: {
    'line-color': '#f5a623',
    'target-arrow-color': '#f5a623',
    'width': 3,
    'line-style': 'dashed',
    'line-dash-pattern': [8, 4],
    'line-dash-offset': 0        // animated via JS interval below
  }
},
// Edge label on hover — "Only source"
{
  selector: 'edge[?spof_edge]:hover',
  style: {
    'label': 'Only source',
    'font-size': 10,
    'color': '#f5a623',
    'text-background-color': '#0d1929',
    'text-background-opacity': 0.85,
    'text-background-padding': 3
  }
}

// Animate dash offset (marching ants)
let dashOffset = 0;
setInterval(() => {
  dashOffset -= 2;
  cy.edges('[?spof_edge]').style('line-dash-offset', dashOffset);
}, 50);
```

### Edge hover tooltip

On hover, a tooltip appears anchored to the midpoint of the SPOF edge:
```
SINGLE SOURCE
No qualified alternate on record
Est. disruption window: 34 days
```

---

## 4. SPOF × Risk Level: Combined Visual Encoding

### The tension

A SPOF with LOW risk is structurally dangerous (no backup) but currently stable.
A dual-sourced supplier at CRITICAL risk is operationally alarming but has structural redundancy.
Neither should be treated identically. The combined encoding must let the analyst read both dimensions simultaneously.

### Encoding matrix

|                  | Low Risk          | Medium Risk        | High Risk          | Critical Risk         |
|------------------|-------------------|--------------------|--------------------|----------------------|
| **SPOF = true**  | Static amber ring, grey fill | Pulsing amber ring, dark yellow fill | Pulsing amber ring, orange fill | Pulsing amber ring, red fill — **priority 1** |
| **SPOF = false** | No ring, grey fill | No ring, muted yellow | No ring, orange fill | No ring, red fill |

The **ring = structural risk** (SPOF). The **fill = current risk level**. These two channels are orthogonal.

### Visual hierarchy logic

A SPOF at CRITICAL risk is the most dangerous state in the graph. It receives:
- Amber pulsing ring (SPOF structural signal)
- Red fill `#c0392b` (critical risk signal)
- Size +30% (emphasis)
- Persistent tooltip badge showing impact programs

A SPOF at LOW risk is structurally fragile but not currently alarming. It receives:
- Static (non-pulsing) amber ring
- Standard blue-grey fill
- No size increase
- On hover only: tooltip noting it is a SPOF with no current risk trigger

```javascript
const riskFill = {
  none:     '#1a3a5c',
  low:      '#1e4d72',
  medium:   '#7a5c00',
  high:     '#8b3500',
  critical: '#c0392b'
};

cy.nodes('[?spof]').forEach(n => {
  const risk = n.data('risk_level');
  n.style({
    'background-color': riskFill[risk] || riskFill.none,
    'border-color': '#f5a623',
    'border-width': 4,
    'border-style': 'solid',
    'width':  risk === 'critical' ? 66 : risk === 'high' ? 60 : 52,
    'height': risk === 'critical' ? 66 : risk === 'high' ? 60 : 52
  });
});

// Pulse only for medium/high/critical SPOF; static ring for low/none
cy.nodes('[?spof][risk_level != "low"][risk_level != "none"]')
  .addClass('spof-pulse');
```

### Hover tooltip structure

```
┌─────────────────────────────────────────────┐
│  ⚠  SINGLE POINT OF FAILURE                 │
│  Murata Xiamen (Tier 2 · Electronics)        │
│  Risk level:  HIGH  ████████░░  73/100       │
│  Programs at risk:  Golf MQB · Audi A3 MQB   │
│  Qualified alternates:  0                    │
│  Est. disruption impact:  34 production days │
└─────────────────────────────────────────────┘
```

---

## 5. SPOF Summary Panel

### Design specification

A **collapsible overlay panel** anchored to the top-left of the graph canvas. Floats over the graph and collapses to a count chip. When collapsed, it shows only a badge. When expanded, it shows a ranked list sortable by risk level.

### Collapsed state

```
┌─────────────────────────────┐
│  ⚠  12 SPOFs · 4 at risk   ▾ │
└─────────────────────────────┘
```

- Background: `#001e50` (VW dark blue)
- Text: white
- Counter badge "4 at risk": red `#c0392b` pill
- Positioned: `top: 16px; left: 16px` on the canvas

### Expanded state

```
┌──────────────────────────────────────────────┐
│  ⚠  SINGLE POINTS OF FAILURE         ▴ Close │
│  12 total in scope · 4 currently at risk      │
├──────────────────────────────────────────────┤
│  AT RISK (4)                                  │
│  🔴  Murata Xiamen      CRITICAL  Golf MQB   │
│  🔴  Liqtech Dresden    HIGH      Tiguan      │
│  🟠  Taiwan Semi A6     MEDIUM    A3 MQB     │
│  🟡  Rohm Semico Kyoto  MEDIUM    Touareg    │
├──────────────────────────────────────────────┤
│  STABLE SPOF (8)                              │
│  ⚪  Infineon Kulim ·  ⚪  Hella Lippstadt   │
│  ⚪  TE Conn. Tangerang · [+5 more]          │
├──────────────────────────────────────────────┤
│  [ Highlight all on graph ]  [ Export list ] │
└──────────────────────────────────────────────┘
```

### CSS implementation

```css
.spof-panel {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 100;
  background: rgba(0, 30, 80, 0.95);
  border: 1px solid #00b0f0;
  border-radius: 6px;
  color: #e8edf3;
  font-family: 'VW Text', Inter, sans-serif;
  font-size: 12px;
  min-width: 280px;
  max-width: 340px;
  backdrop-filter: blur(4px);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.5);
  transition: all 0.2s ease;
}
.spof-panel.collapsed {
  min-width: 0;
  width: auto;
  padding: 8px 14px;
  cursor: pointer;
}
.spof-panel__header {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  border-bottom: 1px solid rgba(0, 176, 240, 0.25);
  gap: 8px;
}
.spof-panel__badge {
  background: #c0392b;
  color: white;
  border-radius: 10px;
  padding: 2px 7px;
  font-size: 11px;
  font-weight: 700;
}
.spof-panel__list { padding: 8px 0; }
.spof-panel__row {
  display: flex;
  align-items: center;
  padding: 5px 14px;
  gap: 8px;
  cursor: pointer;
  transition: background 0.15s;
}
.spof-panel__row:hover {
  background: rgba(0, 176, 240, 0.12);
}
.spof-panel__row--critical .spof-label-risk { color: #e74c3c; }
.spof-panel__row--high     .spof-label-risk { color: #e67e22; }
.spof-panel__row--medium   .spof-label-risk { color: #f5a623; }
.spof-panel__footer {
  padding: 10px 14px;
  border-top: 1px solid rgba(0, 176, 240, 0.25);
  display: flex;
  gap: 8px;
}
.spof-panel__btn {
  background: rgba(0, 176, 240, 0.15);
  border: 1px solid #00b0f0;
  color: #00b0f0;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 11px;
  cursor: pointer;
}
.spof-panel__btn:hover { background: rgba(0, 176, 240, 0.3); }
```

### Interaction behaviours

- **Row click** → graph pans and zooms to that SPOF node; node gets a temporary highlight ring
- **"Highlight all"** → all SPOF nodes flash twice; non-SPOF nodes fade to 15% opacity for 3 seconds
- **"Export list"** → downloads `SPOF_report_{timestamp}.csv` with node ID, name, tier, risk level, affected programs, disruption estimate
- **Panel updates live** as the user changes the scope filter (e.g., filters to a single vehicle program)

---

## 6. "What If" Disruption Simulation

### Trigger

User right-clicks (or long-presses) a SPOF node → context menu appears:

```
┌────────────────────────────┐
│  Murata Xiamen             │
│  ────────────────────      │
│  ▶ View supplier profile   │
│  ⚠ Simulate disruption     │  ← SPOF nodes only
│  🔗 Trace impact path      │
│  📌 Pin to comparison      │
└────────────────────────────┘
```

### Animation sequence

The simulation runs in **four distinct phases**, each with a specific visual state. Total duration: ~3.5 seconds on first run; instantly replayable.

---

**Phase 1 — Node removal signal (0ms–600ms)**

The SPOF node does not disappear. It transitions to a "failed" state:
- Fill → deep red `#7b0e0e`
- Border → bright red `#e74c3c`, width 6px
- Label gains "(DISRUPTED)" suffix
- A brief shake animation (±4px horizontal, 3 cycles, 200ms) signals the failure event
- All edges connected to the node darken to `#3a1a1a`

```javascript
function animateDisruption(cy, nodeId) {
  const node = cy.getElementById(nodeId);

  // Phase 1 — mark as disrupted
  node.animate({
    style: {
      'background-color': '#7b0e0e',
      'border-color': '#e74c3c',
      'border-width': 6
    },
    duration: 400,
    easing: 'ease-in-out'
  });
  node.data('label', node.data('label') + '\n(DISRUPTED)');
```

---

**Phase 2 — Path tracing (600ms–1400ms)**

The system traces downstream paths from the disrupted node toward OEM plants. Each affected edge lights up sequentially, one hop at a time, 150ms per hop:

- Affected edges transition from dark grey to red `#e74c3c`
- This creates a visual "wave" propagating toward the plants
- Unaffected alternative paths remain their standard colour and are slightly brightened to emphasise contrast

```javascript
  // Phase 2 — cascade downstream
  setTimeout(() => {
    const affected = getDownstreamPath(cy, nodeId); // custom BFS/DFS
    affected.edges.forEach((edgeId, i) => {
      setTimeout(() => {
        cy.getElementById(edgeId).animate({
          style: {
            'line-color': '#e74c3c',
            'target-arrow-color': '#e74c3c',
            'width': 3
          },
          duration: 200
        });
      }, i * 150);
    });
  }, 600);
```

---

**Phase 3 — Impact nodes highlight (1400ms–2200ms)**

After the cascade reaches each affected downstream node:

- **Affected assembly nodes**: fill → deep orange `#8b3500`, border amber
- **Affected plant nodes**: fill → red `#c0392b`, 2 pulses at 0.5s interval — plants are where the business pain materialises
- **Affected program nodes** (Golf MQB, Audi A3): fill → red, "HALTED" banner below the label
- **Non-affected nodes**: opacity drops to 20% — the unaffected network recedes

```javascript
  setTimeout(() => {
    const { affectedNodes, plantNodes, programNodes } = getImpactSet(cy, nodeId);

    affectedNodes.forEach(id => {
      cy.getElementById(id).animate({
        style: { 'background-color': '#8b3500', 'border-color': '#f5a623' },
        duration: 300
      });
    });

    plantNodes.forEach(id => {
      cy.getElementById(id).animate({
        style: {
          'background-color': '#c0392b',
          'border-color': '#e74c3c',
          'border-width': 5
        },
        duration: 300
      });
    });

    // Fade out unaffected nodes
    const allAffected = cy.collection(
      [...affectedNodes, ...plantNodes, ...programNodes, nodeId]
        .map(id => cy.getElementById(id))
    );
    cy.nodes().difference(allAffected).animate({
      style: { opacity: 0.2 },
      duration: 400
    });
  }, 1400);
```

---

**Phase 4 — Impact summary callout (2200ms–3500ms)**

A modal overlay appears anchored to the graph centre:

```
┌────────────────────────────────────────────────┐
│  ⚠  SIMULATED DISRUPTION IMPACT                │
│  Murata Xiamen · MLCC #4471 supply path        │
│  ────────────────────────────────────────────  │
│  Parts halted:          2                      │
│  Assemblies affected:   1  (MEB Battery Module)│
│  Plants impacted:       1  (Wolfsburg Plant 2) │
│  Programs halted:       2  (Golf MQB, Audi A3) │
│  Est. production stop:  34 days                │
│  Revenue at risk:       €18–24M (estimate)     │
│  ────────────────────────────────────────────  │
│  [ View mitigation options ]  [ Reset graph ]  │
└────────────────────────────────────────────────┘
```

```javascript
  setTimeout(() => {
    showImpactSummaryModal({
      disrupted: node.data('label'),
      partsHalted: 2,
      assembliesAffected: 1,
      plantsImpacted: 1,
      programsHalted: ['Golf MQB', 'Audi A3 MQB'],
      estimatedDays: node.data('disruption_impact_days'),
      revenueAtRisk: '€18–24M'
    });
  }, 2200);
}
```

---

**Reset behaviour**

"Reset graph" restores all nodes and edges to their pre-simulation styles in a single 500ms reverse-fade. No page reload required.

```javascript
function resetSimulation(cy) {
  cy.nodes().stop(true).animate({ style: { opacity: 1 }, duration: 500 });
  cy.nodes().forEach(n => {
    n.style({
      'background-color': getRiskFill(n.data('risk_level')),
      'border-color': n.data('spof') ? '#f5a623' : '#2a4a6b',
      'border-width': n.data('spof') ? 4 : 1.5,
      opacity: 1
    });
    if (n.data('label').includes('(DISRUPTED)')) {
      n.data('label', n.data('label').replace('\n(DISRUPTED)', ''));
    }
  });
  cy.edges().stop(true).animate({
    style: {
      'line-color': null,
      'target-arrow-color': null,
      'width': null
    },
    duration: 500
  });
}
```

---

## Summary: SPOF visual treatment at a glance

| Signal | What it encodes | Implementation |
|--------|----------------|----------------|
| Amber pulsing ring | Structural SPOF (no alternate source) | `border-color: #f5a623`, JS pulse interval |
| Node fill colour | Current risk level | `background-color` mapped to risk_level enum |
| Node size +25–30% | Structural importance (SPOF) | `width/height` override in Cytoscape style |
| Dashed amber edge | Only-source supply path | `line-style: dashed`, `line-color: #f5a623` |
| Marching ants animation | Edge fragility in motion | `line-dash-offset` animation via JS |
| SPOF summary panel | Portfolio view of all SPOFs | Floating overlay, collapsible |
| Red cascade animation | Simulation of disruption impact | Phased JS animation sequence |
| Impact summary modal | Business translation of graph event | Overlay with revenue/program data |

---

*Document produced for N-tier Supplier Monitor · Graph Hi-Fi prototype · WiserTech*

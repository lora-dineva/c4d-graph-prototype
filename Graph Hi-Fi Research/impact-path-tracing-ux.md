# Impact Path Tracing — UX Interaction Design
## N-tier Supplier Monitor · Graph Explorer Prototype

> **Scenario anchor:** A financial insolvency risk has been flagged on **Murata Electronics (MY)**, a Tier-2 chip supplier based in Penang, Malaysia. The user has navigated to the Graph Explorer and is looking at the live supply network. This document defines the complete interaction from that moment.

---

## 1. Entry Point — What Happens When the User Selects a Risky Supplier

### Design decision: Intentional trigger, not automatic explosion

Do **not** auto-expand the full impact trace on click. The graph may contain dozens of suppliers; a full re-render on every click would be disorienting and would undermine executive confidence in the tool.

**Instead, use a two-beat entry pattern:**

**Beat 1 — Immediate (0ms):** Node selection feedback  
Clicking a risk-flagged supplier node (`risk-level: critical`) immediately applies:
- A bright white ring (`border-width: 3px`, `border-color: #ffffff`) around the node
- A pulsing glow animation (CSS `box-shadow` equivalent via Cytoscape outline) on the node
- A **Risk Signal Card** slides in from the right edge of the canvas — a compact (~280px wide) panel showing:
  - Supplier name, tier, country flag, risk type
  - Risk severity badge (e.g., `CRITICAL — Financial Insolvency`)
  - One-line summary: *"Active alert: Moody's downgrade + payment default reported"*
  - A prominent **"Trace Impact →"** button (VW teal `#00b0f0`)
  - A secondary link: *"View Supplier 360 profile"*

This card is lightweight — it does not yet trigger any graph changes. The user is still looking at the full graph.

**Beat 2 — On "Trace Impact" click (user-initiated):**  
The full Impact Path Tracing mode activates. This deliberate trigger gives the demo presenter control over pacing — critical for an executive walkthrough.

**Implementation note for the prototype:**  
For demos where a presenter wants instant gratification, add a `data-auto-trace="true"` attribute to specific pre-configured "hot" nodes. On selection of those nodes, Beat 2 fires automatically after a 600ms delay. This preserves the intentional feel while removing the need to click twice.

```javascript
cy.on('tap', 'node', function(evt) {
  const node = evt.target;
  if (node.data('riskLevel') === 'critical') {
    showRiskSignalCard(node.data());
    if (node.data('autoTrace')) {
      setTimeout(() => activateImpactTrace(node), 600);
    }
  }
});
```

---

## 2. Path Visualization — Highlight, Dim, and Differentiation

### State taxonomy

When Impact Path Tracing is active, every element in the graph enters one of four visual states:

| State | Description | Visual Treatment |
|---|---|---|
| `trace-source` | The risk supplier itself | Full opacity, red glow pulse, `#ff3b30` border |
| `trace-affected` | Directly in the impact path | Full opacity, colored by severity tier |
| `trace-peripheral` | Adjacent but not in the critical path | 40% opacity, no highlight |
| `trace-unaffected` | No connection to risk supplier | 15% opacity, greyed out |

### Severity color coding on affected path elements

Risk does not travel uniformly. Each node in the path gets a severity classification:

- **Critical (SPOF — no alternative):** `#ff3b30` red, thick border
- **High (alternative exists but lead time > 16 weeks):** `#ff9500` amber  
- **Medium (alternative qualifiable within 8–16 weeks):** `#ffcc00` yellow
- **Monitored (already mitigated):** `#34c759` green — this is used for the **healthy contrast path** to show differentiation

### Edge highlighting

Affected edges between path elements:
- `line-color: #00b0f0` (VW teal) for the active trace path
- `width: 3` (up from default `1.5`)
- `line-dash-pattern: [8, 4]` with a CSS animation to create a "flow" motion (see Animation section)

Unaffected edges: `opacity: 0.08` — nearly invisible, preserving spatial structure without cluttering.

### Cytoscape.js class-based approach

Define all states as CSS classes in the stylesheet. This makes batch transitions trivial:

```javascript
const traceStyles = [
  {
    selector: '.trace-source',
    style: {
      'border-width': 4,
      'border-color': '#ff3b30',
      'background-color': '#3d0a0a',
      'opacity': 1
    }
  },
  {
    selector: '.trace-affected',
    style: {
      'border-width': 2,
      'border-color': function(ele) { return severityColor(ele.data('impactSeverity')); },
      'opacity': 1
    }
  },
  {
    selector: '.trace-peripheral',
    style: { 'opacity': 0.4 }
  },
  {
    selector: '.trace-unaffected',
    style: { 'opacity': 0.12 }
  },
  {
    selector: 'edge.trace-path',
    style: {
      'line-color': '#00b0f0',
      'width': 3,
      'line-dash-pattern': [8, 4],
      'line-dash-offset': 0  // animated via requestAnimationFrame
    }
  }
];
```

Apply via:
```javascript
cy.batch(() => {
  cy.elements().addClass('trace-unaffected');
  affectedNodes.addClass('trace-affected').removeClass('trace-unaffected');
  affectedEdges.addClass('trace-path').removeClass('trace-unaffected');
  sourceNode.addClass('trace-source').removeClass('trace-affected');
});
```

**Do not use `display: none` or `visibility: hidden` on unaffected nodes.** Hiding them collapses the graph layout, which is disorienting. Dimming preserves spatial memory — executives can see what is *not* affected, which is itself useful information.

---

## 3. Animation — Risk Propagation Through the Supply Chain

### Principle: Staged revelation, not instant flood

The animation should make the causality legible: *this chip supplier → this electronics module → this control unit part → this assembly → this plant → these vehicle programs.* Each tier activates in sequence, with the user seeing the chain build out in real time.

### Animation sequence

**Total duration: ~2.8 seconds** (fast enough to feel responsive, slow enough to be readable)

| Step | Delay | What activates | Effect |
|---|---|---|---|
| 0 — Source | 0ms | Murata Electronics (MY) | Red glow pulse, 2 cycles |
| 1 — Tier-1 site | 400ms | Continental Regensburg | Node fades in from `opacity: 0.12` to full, amber border draws in |
| 2 — Part | 750ms | ECU Module CC-7 (SPOF) | Node highlights red (SPOF), edge from Tier-1 animates |
| 3 — Assembly | 1100ms | MQB A0 Powertrain Module | Node highlights amber |
| 4 — Plant | 1500ms | Wolfsburg Assembly Plant | Node highlights red (critical), plant icon pulses |
| 5 — Plant | 1600ms | Zwickau EV Plant | Node highlights amber |
| 6 — Programs | 2000ms | Golf 8 MQB, ID.4 Gen2 | Program nodes highlight; revenue-at-risk counter animates up in side panel |
| 7 — Edge flow | Continuous after step 1 | All trace-path edges | Dashed line offset animation (moving "flow" effect) |

### Edge flow animation

The moving dashes convey directionality — risk flows *toward* the OEM. Implement via `requestAnimationFrame`:

```javascript
let dashOffset = 0;
function animatePaths() {
  dashOffset = (dashOffset - 1) % 24; // 24 = sum of dash pattern (8 + 4) * 2
  cy.edges('.trace-path').style('line-dash-offset', dashOffset);
  requestAnimationFrame(animatePaths);
}
// Start after trace is fully revealed
setTimeout(animatePaths, 2000);
```

### Node pulse for SPOF flagging

Single-point-of-failure parts require special emphasis. After the initial reveal, SPOF nodes pulse continuously at low amplitude to hold attention:

```javascript
function pulseNode(node) {
  node.animate(
    { style: { 'border-width': 5, 'background-color': '#4a0000' } },
    { duration: 700, easing: 'ease-in-out', complete: () =>
        node.animate(
          { style: { 'border-width': 2, 'background-color': '#1a0000' } },
          { duration: 700, easing: 'ease-in-out', complete: () => pulseNode(node) }
        )
    }
  );
}
// Apply to all SPOF nodes in the path
affectedNodes.filter('[spof = true]').forEach(pulseNode);
```

### Viewport management during animation

During the staged reveal, the viewport should auto-pan to keep the current activating tier in frame. Use `cy.animate({ fit: { eles: currentTierNodes, padding: 80 } })` at each stage. After all tiers are revealed, `cy.fit(allAffectedNodes, 60)` to show the full impact subgraph.

---

## 4. Multiple Paths — Managing Complexity (12 parts → 3 plants)

### The problem

If Murata supplies 12 parts flowing through 3 plants, rendering all paths simultaneously creates a dense tangle that is impossible to interpret at a glance. This is the single most common failure mode in graph-based enterprise tools.

### Solution: Tiered path management with a Path Index

**Default state — Critical Path First:**  
On initial trace activation, show only the **single highest-impact path**: the one involving a SPOF part with the highest revenue-at-risk value and the earliest SOP date at risk. All other paths enter `trace-peripheral` state (40% opacity), not `trace-unaffected`. This signals to the user that more exists, without overwhelming them.

**Path Index panel** (appears inside the impact summary panel):  
Below the summary stats, render a scrollable list of all identified impact paths, sorted by severity score:

```
── CRITICAL PATHS (SPOF) ──────────────
  ● ECU Module CC-7 → Wolfsburg → Golf 8      €28M at risk   [active]
  ● ADAS Sensor Pack → Zwickau → ID.4         €14M at risk
── HIGH IMPACT ──────────────────────────
  ● Infotainment SoC → Emden → Tiguan          €6M at risk
  ● Infotainment SoC → Emden → Touareg         €4M at risk
── MEDIUM ───────────────────────────────
  ● [8 more paths]  [Expand]
```

Clicking any path in the index:
1. Dims all currently highlighted paths to `trace-peripheral`
2. Activates the selected path with full highlighting + abbreviated replay animation (0.8s)
3. Updates the impact summary panel stats to reflect only the selected path
4. The viewport pans and zooms to fit the selected path

**"Show all paths" toggle:**  
When activated, all 12 paths highlight simultaneously. To avoid edge clutter, use Cytoscape's `edge-bundling` extension (`cytoscape-unbundled-bezier` or manual control points) to group parallel edges between the same node pairs, labelled with a count badge: *"4 part dependencies."*

```javascript
// Bundle parallel edges visually
const parallelEdges = cy.edges().filter(edge => {
  return cy.edges(`[source="${edge.data('source')}"][target="${edge.data('target')}"]`).length > 1;
});
// Render as a single thick edge with count label
parallelEdges.style({ 'width': function(e) { return 2 + parallelCount(e) * 1.5; } });
```

**Severity filter chips** (above the path index):  
`[CRITICAL]  [HIGH]  [MEDIUM]` — toggling filters the path index list and the highlighted graph elements in sync.

---

## 5. Impact Summary Panel — Content and Layout

The panel slides in from the right at 320px wide on trace activation. It has two sections: **Header Stats** and **Path Details**.

### Header Stats (always visible)

```
┌─────────────────────────────────────────┐
│  ⚠  IMPACT TRACE ACTIVE                 │
│  Murata Electronics (MY)                │
│  Financial Insolvency Risk · CRITICAL   │
├─────────────────────────────────────────┤
│  2  Plants at risk                      │
│  1  Single points of failure            │
│  7  Part numbers affected               │
│  €42M  Revenue at risk                  │
│  Golf 8, ID.4 Gen2  Programs affected   │
│  SOP: 2025-Q3  Earliest program at risk │
├─────────────────────────────────────────┤
│  Alternative supplier: NONE QUALIFIED   │
│  Est. qualification lead time: 22 weeks │
│  LkSG disclosure required: YES          │
└─────────────────────────────────────────┘
```

Key design choices:
- **Revenue at risk** is the single most attention-grabbing metric for a VW purchasing VP. Show it large, in amber/red.
- **LkSG disclosure flag** is mandatory — German Supply Chain Due Diligence Act compliance is a top executive concern and differentiates this tool.
- **"No alternative qualified"** must be visually distinct (red, not just text) — this is the SPOF signal.

### Path Detail section (below, scrollable)

For the currently active path:

```
Active path: ECU Module CC-7
────────────────────────────────────────
Murata Electronics (MY)  [Tier 2]
  ↓ supplies: NAND Flash IC-40x (12M units/yr)
Continental Regensburg   [Tier 1]
  ↓ assembles into: ECU Module CC-7 ⚠ SPOF
Wolfsburg Assembly Plant
  ↓ installed in: Golf 8 MQB (W12 line)
                  Golf 8 MQB (W14 line)

Production halt risk: 68 days est. exposure
Last inventory snapshot: 4.2 weeks cover
Risk-adjusted stockout date: 2025-08-14
────────────────────────────────────────
[Open in Action Workspace →]
[Download path report  ↓]
```

The **"Open in Action Workspace"** link is the handoff to the next module — even if that module is out of prototype scope, the link should exist and show a "module coming soon" state. It proves the product is modular.

### Panel behavior

- Panel persists while trace mode is active
- Stats update live when the user switches to a different path in the Path Index
- Panel can be collapsed to a thin 48px right-edge tab labeled "Impact Summary" — useful when the user wants to focus on the graph
- Panel does **not** close on a click elsewhere in the graph (accidental dismissal kills demos)

---

## 6. Filtering — Scoping the Trace

Three filter mechanisms, each operating on the same underlying affected-element set:

### Filter 1: Plant scope filter (dropdown in panel header)
```
Show impact for:  [All plants ▾]
  ✓ All plants
  ○ Wolfsburg Assembly Plant
  ○ Zwickau EV Plant
  ○ Emden Body Plant
```
Selecting a single plant dims all path elements that do not terminate at that plant. The header stats recalculate to show only that plant's exposure. This is the most-used filter — supply chain directors think in terms of their plant's exposure.

### Filter 2: Critical path only toggle (prominent, in panel)
A single high-contrast toggle: **`[ ] Critical paths only`**

When enabled:
- Only SPOF parts and their supply paths remain at full opacity
- All medium/low-impact paths drop to `trace-peripheral`
- Path index collapses to show only critical entries

This answers Core Question #2 (SPOF exposure) directly and unambiguously.

### Filter 3: Vehicle program filter (chips above the graph)
When programs are visible in the trace, program chips appear above the canvas:

`[Golf 8 ×]  [ID.4 Gen2 ×]  [+ Add program]`

Removing a program chip hides that program's node and upstream paths that are exclusive to it (shared paths remain). Useful when a plant manager only cares about their assigned program.

### Implementation: Filter state as a composable predicate

Rather than maintaining multiple filter flags separately, evaluate a single `isVisible(element)` predicate on every filter change:

```javascript
function isElementVisible(ele) {
  const plantOk = !activePlantFilter || ele.data('affectedPlants')?.includes(activePlantFilter);
  const programOk = activePrograms.size === 0 || activePrograms.has(ele.data('programId'));
  const criticalOk = !criticalOnly || ele.data('spof') === true || ele.data('impactSeverity') === 'critical';
  return plantOk && programOk && criticalOk;
}

function applyFilters() {
  cy.batch(() => {
    cy.elements('.trace-affected').forEach(ele => {
      ele.style('opacity', isElementVisible(ele) ? 1.0 : 0.15);
    });
  });
  updatePanelStats(); // recalculate €-at-risk, part counts, etc.
}
```

---

## 7. Back / Reset — Returning to the Full Graph View

### Exit mechanisms (three, intentionally redundant)

**a) Explicit button in the panel:**  
`← Clear trace` button at the top of the impact summary panel. Most discoverable for new users.

**b) Breadcrumb in the graph header bar:**  
```
Graph Explorer  ›  Murata Electronics impact  [✕]
```
Clicking either `Graph Explorer` or the `[✕]` exits trace mode. The breadcrumb also signals to executives what mode they're in — important for a demo where the presenter may hand over mouse control.

**c) Keyboard shortcut:**  
`Escape` key clears the trace. Announce this in a subtle tooltip on first activation: *"Press Esc to return to full graph."*

### Reset animation

Do **not** snap back to full graph instantly — that feels like a crash or error.

Use a 600ms fade-out of all trace-specific visual states:

```javascript
function clearTrace() {
  // 1. Stop the edge flow animation loop
  cancelAnimationFrame(flowAnimationId);

  // 2. Fade all elements back to full opacity
  cy.batch(() => {
    cy.elements().animate(
      { style: { opacity: 1.0 } },
      { duration: 400 }
    );
  });

  // 3. Remove all trace classes after fade
  setTimeout(() => {
    cy.batch(() => {
      cy.elements().removeClass(
        'trace-source trace-affected trace-peripheral trace-unaffected trace-path'
      );
      cy.edges().style({
        'line-color': null,  // revert to stylesheet default
        'width': null,
        'line-dash-pattern': null
      });
    });
  }, 420);

  // 4. Slide out the impact summary panel
  hidePanelWithAnimation();

  // 5. Reset viewport to full graph fit
  setTimeout(() => cy.fit(cy.elements(), 40), 300);

  // 6. Remove breadcrumb
  updateBreadcrumb(null);
}
```

### Partial reset — keeping context

If the user switches from one trace to another (e.g., clicks a second risky supplier while already in trace mode), do **not** go back to full graph first. Instead, run a **cross-fade**: fade out the current trace highlights while fading in the new ones. This preserves flow and shows that multiple risk sources can be compared.

---

## 8. Prototype Implementation Architecture (Cytoscape.js)

### Recommended library stack

| Library | Purpose | CDN |
|---|---|---|
| `cytoscape@3.28` | Core graph engine | `https://cdnjs.cloudflare.com/ajax/libs/cytoscape/3.28.1/cytoscape.min.js` |
| `cytoscape-dagre` | Hierarchical left-to-right layout | `https://cdnjs.cloudflare.com/ajax/libs/cytoscape-dagre/2.5.0/cytoscape-dagre.min.js` |
| `dagre` | Required by cytoscape-dagre | `https://cdnjs.cloudflare.com/ajax/libs/dagre/0.8.5/dagre.min.js` |

No build step. No separate CSS files. All in a single HTML file.

### Graph data model

Each node needs these data fields for the trace logic to work:

```javascript
// Supplier node
{
  id: 'murata-my',
  label: 'Murata Electronics\n(Penang, MY)',
  type: 'supplier',         // supplier | site | part | assembly | plant | program
  tier: 2,
  riskLevel: 'critical',   // critical | high | medium | low | none
  riskType: 'financial_insolvency',
  country: 'MY',
  spof: false,              // is this node a SPOF in any path?
  autoTrace: true,          // auto-trigger trace on selection (demo mode)
  impactSeverity: null,     // populated at runtime by traceImpact()
  affectedPlants: [],       // populated at runtime
  programId: null
}

// Part node
{
  id: 'ecu-cc7',
  label: 'ECU Module CC-7',
  type: 'part',
  tier: 1,                  // tier of the supplying entity
  riskLevel: 'none',        // own risk; will be set to 'critical' during trace
  spof: true,               // no alternative supplier for this part
  annualVolume: 840000,
  revenueAtRisk: 28000000,  // € at risk if supply interrupted
  stockCoverWeeks: 4.2,
  stockoutDate: '2025-08-14',
  affectedPlants: ['wolfsburg'],
  programId: 'golf-8-mqb'
}
```

### Path traversal algorithm

The trace works by BFS outward from the risk node, following edges in the `SUPPLIES → ASSEMBLED_INTO → DELIVERED_TO → ENABLES` direction (i.e., the supply direction, not reverse). Only follow edges of type `supply` or `assembly` — skip ownership and geographic edges during the initial trace.

```javascript
function traceImpact(sourceNode) {
  const affectedNodes = new Set([sourceNode.id()]);
  const affectedEdges = new Set();
  const queue = [sourceNode];

  while (queue.length > 0) {
    const current = queue.shift();
    current.outgoers('edge').forEach(edge => {
      if (!['supply', 'assembly', 'logistics'].includes(edge.data('type'))) return;
      const target = edge.target();
      if (!affectedNodes.has(target.id())) {
        affectedNodes.add(target.id());
        affectedEdges.add(edge.id());
        queue.push(target);
      }
    });
  }

  return {
    nodes: cy.collection(Array.from(affectedNodes).map(id => cy.getElementById(id))),
    edges: cy.collection(Array.from(affectedEdges).map(id => cy.getElementById(id)))
  };
}
```

### Dagre layout configuration for the supply chain view

The graph should flow left-to-right: Tier 3 → Tier 2 → Tier 1 → Parts → Plants → Programs.

```javascript
cy.layout({
  name: 'dagre',
  rankDir: 'LR',           // left to right
  ranker: 'tight-tree',
  nodeSep: 60,
  rankSep: 120,
  edgeSep: 20,
  padding: 40,
  animate: true,
  animationDuration: 500
}).run();
```

### Recommended initial canvas state

For the prototype, pre-position the graph so the Malaysian Tier-2 cluster is in the left-center of the canvas and the German plants are in the right-center. This gives the trace animation the most readable left-to-right directionality and visually maps to the geographic direction (Asia → Europe).

---

## 9. Handling the Healthy Contrast Path

One of the most powerful demo moments is showing a **healthy supply path alongside the at-risk one**. For example, Bosch's supply of the same part type through an alternative European source, with no risk flags.

When the main risk trace is active, the healthy path should:
- Remain at full opacity (not dimmed to `trace-unaffected`)
- Display in **green** (`#34c759`) on both nodes and edges
- Be labelled with a small "Healthy path" chip on the edges
- Appear in the Path Index as a green row: *"✓ Bosch Reutlingen → Wolfsburg (Alternative — qualified)"*

This directly answers Core Question #5 (alternative path) and Core Question #2 (SPOF) in a single view. The contrast between the red path and the green path is the visual punchline of the demo.

```javascript
// Healthy path nodes stay bright but get green classification
healthyPathNodes.addClass('trace-healthy');
// CSS:
// .trace-healthy { border-color: #34c759; opacity: 1.0; }
// edge.trace-healthy { line-color: #34c759; line-style: solid; width: 2; }
```

---

## 10. Prototype Polish Notes

These details separate a compelling demo from a generic graph visualization:

- **Tooltips on hover:** hovering any affected node during trace mode shows a 200ms-delayed tooltip with the node's contribution to total revenue at risk, stock cover, and lead time to alternative. Do not show raw IDs or internal codes.

- **Revenue counter animation:** when the trace completes, the `€42M at risk` figure in the panel should animate upward from €0 like an odometer. This creates a visceral moment — the risk is quantified in real time.

- **LkSG badge:** any supplier in a trace that operates in a high-risk geography (Malaysia, parts of China) should display a small `LkSG` badge. Clicking it opens a modal: *"This supplier is subject to German Supply Chain Due Diligence Act reporting requirements."* This is a differentiating detail that immediately resonates with German executives.

- **Right-click context menu** on any affected node: `[Trace from here] [Show ownership chain] [Open Supplier 360] [Flag for review]`. This shows the graph is an action surface, not a read-only display.

- **Print/export of trace:** a "Download impact report" button in the panel generates a minimal HTML or PDF snapshot of the current trace state — which nodes are affected, the summary stats, and the timestamp. Executives frequently want to forward this to procurement teams immediately.

- **Mobile/tablet consideration:** the prototype is for desktop demo only — do not attempt responsive layout. Fix canvas at minimum 1280×800px.

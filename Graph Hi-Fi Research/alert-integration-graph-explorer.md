# Alert Integration — Graph Explorer Canvas
## N-tier Supplier Monitor · UX Design Specification

> **Scope:** Graph Explorer module only. Audience: VW Group supply chain directors and purchasing VPs. All design decisions serve decision-making speed under time pressure — an alert is not a notification, it is an actionable production risk signal.

---

## 1. Alert Entry Point — Panel to Canvas Navigation

### The Alert Drawer

The Alert Drawer lives in the right edge of the toolbar as a bell icon with a live badge count (`⚑ 4`). It opens as a **400px right-side drawer** that overlays the canvas without collapsing it, so the graph remains visible and spatially oriented.

Inside the drawer, alerts are sorted by severity then recency:

```
⛔ CRITICAL  Nexchip (Malaysia) — Insolvency filing detected        2 min ago  →
🔶 HIGH      Murata Kyoto — Port of Kobe closure (72h)             14 min ago →
🔶 HIGH      Sensata Tech Poland — Fire at Bielsko-Biała site       1h ago    →
🔵 INFO      Continental Frankfurt — ESG audit scheduled            3h ago    →
```

Each row shows: severity chip · supplier name · short description · time · arrow CTA.

### Click-to-Navigate Behaviour

When the user clicks an alert row, the following sequence fires **in order**:

1. **Drawer stays open** at reduced opacity (60%) — the user needs it as context while inspecting the graph.
2. **Camera flies to the affected supplier node** — a smooth 600ms ease-in-out pan and zoom animation centres the node at roughly 70% of the canvas width (leaving 30% for the drawer). The zoom level targets ~1.2× (enough to see first-degree connections).
3. **Impact path highlights**: all edges on the propagation path to OEM plants are highlighted in the alert's severity colour. Non-path elements dim to 20% opacity. This is the key UX moment — the supply chain manager sees *what stops* in the same motion as navigating to *where the problem is*.
4. **Node side panel auto-opens** on the left — showing supplier card, risk signals, and the alert detail at the top. No extra click needed.
5. A **breadcrumb trail** appears at the top of the canvas: `Alert: Nexchip Insolvency → Impact Path → Wolfsburg Plant / Golf MQB → 3 programs affected`.

### Design rationale

Fly-to without path highlight is insufficient — the executive asking "what stops?" needs the answer in the same action. The simultaneous path highlight + side panel open reduces the number of clicks from ≥4 to 1, which is the correct interaction density for a demo to C-suite.

---

## 2. Live Alert Indicators on Canvas

When a new alert fires, the affected node must communicate urgency **without the user looking at the alert drawer**. This is the ambient awareness layer.

### Visual treatment: Pulsing ring + floating severity badge

**Primary indicator:** A concentric pulsing ring emanates from the node border at the alert's severity colour. The ring pulses outward and fades — not a solid glow, which reads as "selected", but a radiating wave, which reads as "live event".

**Secondary indicator:** A floating badge anchored at the top-right of the node (offset 8px / -8px) shows the severity icon and, if multiple alerts, a count (`⛔ 2`). The badge uses a brief bounce-in animation on first appearance (200ms ease-out spring).

**Tertiary indicator (for CRITICAL only):** The node border itself shifts to the severity colour and adds a very subtle fill tint (severity colour at 8% opacity) so that even peripheral vision catches it.

### Why not a notification dot alone?

A small dot in the corner is too subtle for a live demo and too easy to miss on a dense graph. The pulsing ring acts as a spatial call-to-action that survives at any zoom level (the ring animation is defined in canvas-space pixels, not graph-space, so it remains visible even when zoomed out).

### Behaviour rules

- The pulse plays on **a 3-second loop** indefinitely until the alert is acknowledged.
- On hover, the pulse pauses and a tooltip appears: `⛔ CRITICAL — Nexchip insolvency — Click to view`.
- The badge count increments in real time if additional alerts fire on the same node.
- On zoom-out below threshold (~0.4× zoom), the floating badge converts to a coloured dot (4px) to avoid visual clutter.

---

## 3. Alert Severity Levels — Visual Treatment Per Node

All four severity levels follow a consistent visual grammar: **ring pulse + badge + border + fill tint**. The intensity of each element scales with severity.

### CRITICAL — Red pulsing

```
Border:        2px solid #E53935 (always visible)
Fill tint:     rgba(229, 57, 53, 0.08)
Ring pulse:    #E53935, 3s loop, expands from node edge to +32px, fades 0→100%→0
Badge:         Red pill, ⛔ icon, white text, bounce-in on appearance
Label:         Node name text turns white (up from default #c8d0e0) — max contrast
```

The ring animation is continuous and cannot be suppressed until acknowledged. This is intentional — a CRITICAL event in a live production scenario cannot be passively ignored.

### HIGH — Orange

```
Border:        2px solid #FB8C00
Fill tint:     rgba(251, 140, 0, 0.06)
Ring pulse:    #FB8C00, 4s loop (slower = less urgent than CRITICAL), expands to +24px
Badge:         Orange pill, 🔶 icon
Label:         No change (default colour sufficient)
```

### MEDIUM — Amber/Yellow

```
Border:        1.5px dashed #FDD835 (dashed to distinguish from selection which uses solid)
Fill tint:     rgba(253, 216, 53, 0.05)
Ring pulse:    None — replaced by a slow border shimmer (border opacity oscillates 100%→50%, 5s)
Badge:         Yellow pill, ⚠ icon
```

The absence of a radiating ring for MEDIUM is deliberate — it reduces visual noise on a graph that may have many MEDIUM alerts, while preserving the ring as a meaningful signal for HIGH and CRITICAL.

### INFORMATIONAL — Blue

```
Border:        1px solid #00B0F0 (teal brand accent)
Fill tint:     None
Ring pulse:    None
Badge:         Blue dot only, no icon — very unobtrusive
```

INFORMATIONAL alerts (audit scheduled, ESG data updated) should be present but not distracting. They are the graph's equivalent of a read receipt, not an alarm.

### Comparison table

| Severity     | Border       | Fill tint | Ring pulse | Badge     | Loop    |
|--------------|--------------|-----------|------------|-----------|---------|
| CRITICAL     | 2px solid red | ✓ 8%   | ✓ strong  | Pill + icon | 3s   |
| HIGH         | 2px solid orange | ✓ 6% | ✓ medium | Pill + icon | 4s  |
| MEDIUM       | 1.5px dashed amber | ✓ 5% | ✗ shimmer | Pill + icon | 5s |
| INFORMATIONAL | 1px solid teal | ✗    | ✗         | Dot only  | —      |

---

## 4. Alert Acknowledgement from Graph

### Interaction: Right-click context menu on node

Right-clicking any node with an active alert shows a context menu with:

```
  ──────────────────────────────────
  📍 Focus on Nexchip
  🔗 Trace impact path
  ──────────────────────────────────
  ✓  Acknowledge alert (Nexchip insolvency)     ← only if alert present
  👁  Mark as monitoring
  ──────────────────────────────────
  ℹ  View supplier card
  ↗  Open in Supplier 360
  ──────────────────────────────────
```

### State change: Acknowledged but unresolved

On acknowledgement, the visual transitions over 400ms:

**Before (CRITICAL active):**
- Red pulsing ring, continuous
- Red solid border
- Red fill tint
- Red badge `⛔ 1`

**After (Acknowledged / unresolved):**
- Ring pulse **stops** — replaced by a **static dashed ring** (2px dashed, same red, but frozen at +8px from node edge). The dashed ring signals "this was seen" without implying it is resolved.
- Border changes from **solid red → dashed red** (same colour, dashed pattern)
- Fill tint **halves** to 4% opacity
- Badge changes: red background → **grey background with red icon** (`⛔` still present but muted context). A small checkmark overlay appears on the badge: `⛔✓`
- A **tooltip on hover** reads: `Acknowledged by [User] · 10:42 · Unresolved`

### Why the dashed ring stays

The most common demo failure for alert systems is making acknowledgement look like resolution. The dashed ring (vs. the animated ring) maintains visibility of the risk in the graph — the supply chain manager who walks past the screen 10 minutes later can still see "something happened here" without confusing it for "something is happening right now."

### Keyboard shortcut

`K` (while a node is selected) triggers acknowledgement inline, without the right-click menu. This is useful for live demos where clicking precision is imperfect.

---

## 5. Alert History on Node Side Panel

### Placement and trigger

The node side panel opens when a node is clicked (or auto-opened via alert navigation). The alert history section lives at the bottom of the panel, below: Overview · Risk Signals · Parts & Assemblies · Ownership Chain.

### Section header

```
ALERT HISTORY                              ○ 3 in last 90 days   ∨
```

The `○ 3` count uses a coloured dot (colour = highest severity in history). The chevron `∨` collapses/expands the section.

### Mini-timeline layout

The timeline is a **vertical dot-and-line** layout, newest at top:

```
  ●──────────────────────────────────────────────
  ⛔  CRITICAL   Insolvency filing detected       Today, 09:38
      Status: ACTIVE · Acknowledged by M. Schmidt 10:42
      [ View full alert ]

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ●
  🔶  HIGH        Q4 2025 financial stress flag    12 Mar 2026
      Status: RESOLVED · Closed 18 Mar 2026
      [ View full alert ]

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ●
  🔵  INFO        New ownership filing (Foxconn)   02 Jan 2026
      Status: RESOLVED · Auto-closed
      [ View full alert ]
```

**Dot colours** map to severity. The connecting vertical line shades from the oldest alert colour at the bottom to the newest at the top — providing a colour gradient that instantly communicates "things have been getting worse" (grey→yellow→orange→red) or "getting better" (red→yellow→grey).

**Trend chip** appears in the section header if the most recent alert is higher severity than the prior one: `↑ Escalating`. If the most recent is lower severity or resolved: `↓ Stabilising`. This is a single calculated signal with outsized demo value — an executive scanning multiple nodes can read the trend without opening each panel.

### 90-day scope + "Load more"

Default scope is 90 days with a `Load more (past 12 months)` link below the timeline. This prevents information overload for suppliers with long histories while preserving the ability to investigate.

---

## 6. Broadcast Alert Demo Sequence

This is the highest-impact demo moment: the graph transitioning from an "all clear" state to a live CRITICAL alert in real time. The sequence is designed to run in approximately 8 seconds and feel like watching a production event unfold.

### Pre-state: "All clear" graph

The canvas shows the full supply chain graph. Nexchip (Tier-2, Malaysia) has:
- Standard node styling: grey border, no ring, no badge
- Alert drawer badge shows `⚑ 0` or `⚑ 1 INFO`
- All edges are rendered at full opacity in neutral colours (grey for standard paths, teal for critical paths)

### Sequence (annotated by timestamp)

**T+0.0s — Signal received**
A small "data pulse" travels along the edges from Nexchip outward — a moving dot animation on the connected edges (1px white dot, 300ms travel time per edge segment). This is the alert ingestion signal, representing the platform receiving the data feed. Pure theatre, but effective.

**T+0.5s — Node state change**
The Nexchip node instantly shifts:
- Node border flashes white for 100ms, then transitions to red
- Fill tint fades in over 300ms
- Badge bounce-in from scale(0) to scale(1) over 200ms

**T+1.0s — Ring pulse begins**
The first ring pulse emanates from the node. One full pulse takes 1.5s — so the first ring is still expanding at T+2.5s, which feels urgent without being overwhelming.

**T+1.5s — Alert drawer badge increments**
The toolbar bell icon badge animates from `0` to `1` — a brief scale pulse on the badge itself (scale 1.0 → 1.4 → 1.0, 250ms).

**T+2.0s — Path propagation highlight**
The supply chain path from Nexchip → [Tier-1 electronics supplier: Sumitomo Electric] → [Part: ADAS Control Unit DCU-7] → [Assembly: MEB Battery Management System] → [Wolfsburg Plant] dims all non-path elements to 20% opacity. The path edges turn orange then red, in a sequential wash that travels directionally from source to plant. This is the "blast radius" reveal — the most important moment in the demo.

**T+3.5s — Impact counter appears**
A floating label appears above the path near the plant end: `⚠ 3 vehicle programs at risk`. This label fades in over 500ms and uses a subtle drop shadow to sit above the graph layer.

**T+5.0s — Alert drawer auto-opens (optional)**
For maximum demo impact, the drawer can auto-open at this point, showing the new CRITICAL alert at the top. The drawer slides in from the right (300ms ease-out) while the graph re-centres to accommodate it.

**T+8.0s — Rest state**
The graph settles into its alert state. All animations transition to their steady-state equivalents (pulsing ring loops, dimmed non-path elements, open drawer). The demo facilitator can now narrate: "One alert, and we can already see exactly which programs are at risk."

---

## CSS Animation Code

### CRITICAL alert — pulsing ring

```css
/* Applied to a pseudo-element or SVG circle overlay on the node */

@keyframes alertRingPulse {
  0% {
    transform: scale(1);
    opacity: 0.9;
    box-shadow: 0 0 0 0px rgba(229, 57, 53, 0.6);
  }
  70% {
    transform: scale(1);
    opacity: 0;
    box-shadow: 0 0 0 32px rgba(229, 57, 53, 0);
  }
  100% {
    transform: scale(1);
    opacity: 0;
    box-shadow: 0 0 0 0px rgba(229, 57, 53, 0);
  }
}

/* Node wrapper — position: relative required */
.graph-node {
  position: relative;
  border-radius: 8px;
  transition: border-color 300ms ease, background-color 300ms ease;
}

/* CRITICAL state */
.graph-node.alert-critical {
  border: 2px solid #E53935;
  background-color: rgba(229, 57, 53, 0.08);
}

.graph-node.alert-critical::after {
  content: '';
  position: absolute;
  inset: -4px;                     /* slightly outside node bounds */
  border-radius: 10px;             /* matches node border-radius + offset */
  border: 2px solid rgba(229, 57, 53, 0.7);
  animation: alertRingPulse 3s ease-out infinite;
  pointer-events: none;
}

/* Second ring — offset timing for double-pulse effect */
.graph-node.alert-critical::before {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 10px;
  border: 2px solid rgba(229, 57, 53, 0.4);
  animation: alertRingPulse 3s ease-out infinite;
  animation-delay: 1.5s;           /* second pulse at half-period */
  pointer-events: none;
}
```

### HIGH alert — slower pulse

```css
.graph-node.alert-high {
  border: 2px solid #FB8C00;
  background-color: rgba(251, 140, 0, 0.06);
}

.graph-node.alert-high::after {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 10px;
  border: 2px solid rgba(251, 140, 0, 0.6);
  animation: alertRingPulseHigh 4s ease-out infinite;
  pointer-events: none;
}

@keyframes alertRingPulseHigh {
  0%   { box-shadow: 0 0 0 0px rgba(251, 140, 0, 0.5); opacity: 0.8; }
  70%  { box-shadow: 0 0 0 24px rgba(251, 140, 0, 0); opacity: 0;   }
  100% { box-shadow: 0 0 0 0px rgba(251, 140, 0, 0); opacity: 0;   }
}
```

### MEDIUM alert — border shimmer (no ring)

```css
@keyframes alertBorderShimmer {
  0%, 100% { border-color: rgba(253, 216, 53, 1.0); }
  50%       { border-color: rgba(253, 216, 53, 0.4); }
}

.graph-node.alert-medium {
  border: 1.5px dashed #FDD835;
  background-color: rgba(253, 216, 53, 0.05);
  animation: alertBorderShimmer 5s ease-in-out infinite;
}
```

### Severity badge — bounce in

```css
@keyframes badgeBounceIn {
  0%   { transform: scale(0) translateY(-4px); opacity: 0; }
  60%  { transform: scale(1.2) translateY(-8px); opacity: 1; }
  80%  { transform: scale(0.95) translateY(-8px); }
  100% { transform: scale(1) translateY(-8px); opacity: 1; }
}

.alert-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  border-radius: 999px;
  padding: 2px 6px;
  font-size: 10px;
  font-weight: 700;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 3px;
  animation: badgeBounceIn 300ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  pointer-events: none;
  z-index: 10;
}

.alert-badge.critical  { background: #E53935; }
.alert-badge.high      { background: #FB8C00; }
.alert-badge.medium    { background: #FDD835; color: #1a1a1a; }
.alert-badge.info      { background: #00B0F0; }
```

### Acknowledged state transition

```css
/* Transition from active to acknowledged */
.graph-node.alert-acknowledged {
  border: 2px dashed #E53935;           /* dashed = seen, not resolved */
  background-color: rgba(229, 57, 53, 0.04); /* halved tint */
  transition: all 400ms ease;
}

/* Static dashed ring — not animated */
.graph-node.alert-acknowledged::after {
  content: '';
  position: absolute;
  inset: -8px;
  border-radius: 12px;
  border: 2px dashed rgba(229, 57, 53, 0.5);
  animation: none;                      /* ring stops pulsing */
  pointer-events: none;
}

.alert-badge.acknowledged {
  background: #4a4f5c;                  /* grey background */
  opacity: 0.85;
}

/* Checkmark overlay on badge */
.alert-badge.acknowledged::after {
  content: '✓';
  position: absolute;
  bottom: -4px;
  right: -4px;
  font-size: 8px;
  background: #4a4f5c;
  border-radius: 50%;
  width: 10px;
  height: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #E53935;
}
```

### Broadcast demo — path propagation wash

```css
/* Edge highlight propagation — applied via JS with sequential delays */
@keyframes edgeAlertWash {
  0%   { stroke: #6b7280; stroke-width: 1.5; opacity: 0.6; }
  40%  { stroke: #FB8C00; stroke-width: 2.5; opacity: 1;   }
  100% { stroke: #E53935; stroke-width: 2.5; opacity: 1;   }
}

.graph-edge.propagating {
  animation: edgeAlertWash 800ms ease-in-out forwards;
}

/* Non-path elements dim */
@keyframes graphDimOther {
  to { opacity: 0.2; }
}

.graph-node.non-path,
.graph-edge.non-path {
  animation: graphDimOther 600ms ease forwards;
}

/* Impact label float-in */
@keyframes impactLabelFadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0); }
}

.impact-label {
  animation: impactLabelFadeIn 500ms ease forwards;
  animation-delay: 3.5s;
  opacity: 0;
  background: rgba(229, 57, 53, 0.15);
  border: 1px solid rgba(229, 57, 53, 0.4);
  border-radius: 4px;
  padding: 4px 8px;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
}
```

---

## UX Flow Summary

```
Alert fires (data feed / manual trigger)
    │
    ▼
Node visual changes instantly:
  border → severity colour
  fill tint → fades in
  ring pulse → begins (CRITICAL/HIGH only)
  badge → bounce-in at top-right
    │
    ▼
Toolbar bell badge increments (+1, scale pulse)
    │
    ▼                                   ← user can intervene at any point
    ├── User opens Alert Drawer
    │       → sees prioritised alert list
    │       → clicks alert row
    │       → graph flies to node (600ms)
    │       → impact path highlights
    │       → side panel auto-opens
    │
    ├── User right-clicks node
    │       → context menu: "Acknowledge alert"
    │       → ring stops, dashed ring + grey badge appears
    │       → acknowledged state persists until resolved
    │
    └── User opens side panel (click node)
            → Alert History section shows mini-timeline
            → Trend chip: ↑ Escalating
            → [ View full alert ] links to Alert Cockpit
```

---

## Implementation notes for the prototype

- The pulsing ring is best implemented as an **SVG `<circle>` overlay** on the Cytoscape canvas node rather than a CSS `::after` pseudo-element, since Cytoscape renders to a `<canvas>` tag. Use Cytoscape's `scratch` namespace to store alert state on each element, and drive the ring via a **requestAnimationFrame loop** that redraws the overlay SVG layer.
- Alternatively, for a faster prototype build, overlay a **transparent HTML layer** (`position: absolute, pointer-events: none`) on top of the Cytoscape canvas and use positioned `<div>` rings mapped to node positions. Cytoscape exposes `node.renderedPosition()` and `node.renderedWidth()` for this.
- The path propagation delay sequence (T+0s → T+8s) is driven by `setTimeout` chains or a simple `requestAnimationFrame` scheduler; no animation library required.
- For the demo, consider a **"Fire alert" button** hidden in the toolbar (or triggered by keyboard shortcut `Shift+D`) that runs the full broadcast sequence from T+0 on demand. This removes the dependency on a live data feed for the executive demo.

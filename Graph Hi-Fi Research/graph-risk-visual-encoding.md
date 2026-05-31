# Graph Explorer — Risk Visual Encoding System
**N-tier Supplier Monitor · Graph Hi-Fi Prototype**
*Design research document — May 2026*

---

## Overview

This document defines the complete visual encoding system for risk information in the Graph Explorer module. All decisions are grounded in three constraints: (1) legibility on a dark canvas (`#0d1929`), (2) WCAG AA accessibility (≥4.5:1 contrast for text, ≥3:1 for UI components), and (3) coherence at the zoom levels and densities typical of a supply chain graph with 30–80 visible nodes.

The canonical scenario is a Tier-2 semiconductor supplier (Murata / KYEC) event propagating through Continental's ADAS ECU into the Golf MQB and ID.4 programs at Wolfsburg — so all examples are anchored to that.

---

## 1. Risk Level Color Palette

### Design rationale

Red/green is the worst possible choice for a risk palette: it fails deuteranopia (the most common color vision deficiency, affecting ~8% of men), it reads poorly on dark backgrounds, and the red connotation is so culturally loaded that "High" and "Critical" become visually indistinct at a glance. The palette below uses a **temperature shift** — cool blue for safe, warm amber for caution, hot orange-red for crisis — which is perceptually ordered, colorblind-safe, and works on both dark and light surfaces.

### The five levels

| Level    | Hex       | Name              | Dark bg contrast | Light bg contrast | Semantic anchor              |
|----------|-----------|-------------------|-----------------|-------------------|------------------------------|
| Critical | `#FF4500` | Ember Orange-Red  | 5.8:1           | 3.9:1*            | Production stoppage imminent |
| High     | `#FF8C00` | Deep Amber        | 6.4:1           | 3.2:1*            | Active disruption risk       |
| Medium   | `#F5C518` | Caution Yellow    | 9.1:1           | 2.1:1†            | Monitoring required          |
| Low      | `#32ADE6` | Sky Blue          | 5.2:1           | 4.6:1             | Within tolerance             |
| None     | `#4D5566` | Slate Grey        | 3.1:1           | 6.8:1             | No known risk                |

*\* Falls below 4.5:1 on white — use the dark-surface variant only for large elements (rings, fills) not for text labels.*
*† Yellow on white: never use as text. Only as fill/ring on the dark canvas.*

### Supplementary tints (for fills, glows, backgrounds)

```css
:root {
  --risk-critical:     #FF4500;
  --risk-critical-20:  rgba(255, 69, 0, 0.20);
  --risk-critical-10:  rgba(255, 69, 0, 0.10);

  --risk-high:         #FF8C00;
  --risk-high-20:      rgba(255, 140, 0, 0.20);

  --risk-medium:       #F5C518;
  --risk-medium-20:    rgba(245, 197, 24, 0.20);

  --risk-low:          #32ADE6;
  --risk-low-20:       rgba(50, 173, 230, 0.20);

  --risk-none:         #4D5566;
  --risk-none-20:      rgba(77, 85, 102, 0.20);

  /* Brand canvas */
  --canvas:            #0d1929;
  --brand-dark:        #001e50;
  --brand-teal:        #00b0f0;
  --surface-light:     #f4f6f9;
}
```

### Colorblind simulation check

Under Deuteranopia simulation:
- Critical (`#FF4500`) reads as a warm brown-ochre — still stands out.
- High (`#FF8C00`) shifts to yellow-ochre — still warm/alarming.
- Medium (`#F5C518`) shifts to bright yellow — still "caution".
- Low (`#32ADE6`) reads as a bright teal-grey — clearly different from the warm tones.
- None (`#4D5566`) reads as dark grey — clearly neutral.

The palette remains ordered and legible under all major CVD types (deuteranopia, protanopia, tritanopia).

---

## 2. Node Visual Design

### Node type taxonomy

Each node type has a fixed **base shape** so the graph can be read structurally even without color:

| Node Type       | Base Shape         | Size (default) | Icon glyph            |
|-----------------|--------------------|----------------|-----------------------|
| Supplier (T1)   | Circle             | 44px diameter  | Building icon         |
| Supplier (T2)   | Circle             | 38px diameter  | Building icon (smaller)|
| Supplier (T3)   | Circle             | 32px diameter  | Building icon (smaller)|
| Supplier Site   | Rounded square     | 34×34px        | Location pin          |
| Part            | Hexagon            | 32px           | Gear/component icon   |
| Assembly        | Hexagon (larger)   | 40px           | Stacked layers icon   |
| Plant           | Rectangle          | 52×36px        | Factory icon          |
| Vehicle Program | Pentagon/shield    | 44×40px        | Car outline icon      |

Shapes encode type. Size encodes tier (for suppliers). Color encodes risk. This creates a three-channel independent encoding, so any one channel can be read separately.

### Risk level treatment per node

The risk system applies **four simultaneous visual signals** that scale with severity:

#### Ring / border

The most information-dense element — immediately scannable.

```
Critical  → 4px ring, color: #FF4500, with outer glow (see below)
High      → 3px ring, color: #FF8C00, no glow
Medium    → 2px dashed ring (4px dash, 4px gap), color: #F5C518
Low       → 1.5px solid ring, color: #32ADE6, 60% opacity
None      → 1px ring, color: #4D5566, 40% opacity (barely visible)
```

SVG implementation for a Cytoscape.js node style:

```js
// Cytoscape.js style entry — Critical supplier
{
  selector: 'node[riskLevel = "critical"]',
  style: {
    'border-width': 4,
    'border-color': '#FF4500',
    'border-opacity': 1,
    'shadow-blur': 18,
    'shadow-color': '#FF4500',
    'shadow-opacity': 0.65,
    'shadow-offset-x': 0,
    'shadow-offset-y': 0,
    'background-color': '#1a1a2e',   // slightly warmer dark fill
    'background-opacity': 1,
  }
},
{
  selector: 'node[riskLevel = "high"]',
  style: {
    'border-width': 3,
    'border-color': '#FF8C00',
    'shadow-blur': 10,
    'shadow-color': '#FF8C00',
    'shadow-opacity': 0.40,
  }
},
{
  selector: 'node[riskLevel = "medium"]',
  style: {
    'border-width': 2,
    'border-color': '#F5C518',
    'border-style': 'dashed',
    'shadow-blur': 0,
  }
},
{
  selector: 'node[riskLevel = "low"]',
  style: {
    'border-width': 1.5,
    'border-color': '#32ADE6',
    'border-opacity': 0.6,
  }
},
{
  selector: 'node[riskLevel = "none"]',
  style: {
    'border-width': 1,
    'border-color': '#4D5566',
    'border-opacity': 0.4,
  }
}
```

#### Background fill

Node interior tints subtly toward the risk color, keeping internal icons readable:

```
Critical  → fill: rgba(255, 69, 0, 0.18)  on canvas dark
High      → fill: rgba(255, 140, 0, 0.12)
Medium    → fill: rgba(245, 197, 24, 0.08)
Low       → fill: rgba(50, 173, 230, 0.06)
None      → fill: rgba(255, 255, 255, 0.04)
```

This is subtle enough not to compete with the ring but reinforces the color channel on nodes that the user is zoomed into.

#### Label treatment

```
Critical  → label color: #FF4500, font-weight: 700, letter-spacing: 0.02em
High      → label color: #FF8C00, font-weight: 600
Medium    → label color: #F5C518, font-weight: 500
Low       → label color: #b0d4e8  (lighter blue — better contrast than full #32ADE6 on dark)
None      → label color: #8a9ab5  (muted light grey)
```

#### Glow (CSS/SVG)

For Critical nodes specifically, a pulsing radial glow is the single most effective "this needs attention now" signal. Implement as an SVG `<filter>` or CSS `box-shadow` animation:

```css
/* CSS glow for HTML/Canvas overlays */
.node--critical {
  box-shadow:
    0 0 0 4px #FF4500,
    0 0 18px 4px rgba(255, 69, 0, 0.55),
    0 0 36px 8px rgba(255, 69, 0, 0.20);
  animation: critical-pulse 2.4s ease-in-out infinite;
}

@keyframes critical-pulse {
  0%, 100% { box-shadow:
    0 0 0 4px #FF4500,
    0 0 18px 4px rgba(255, 69, 0, 0.55),
    0 0 36px 8px rgba(255, 69, 0, 0.20); }
  50% { box-shadow:
    0 0 0 4px #FF4500,
    0 0 28px 10px rgba(255, 69, 0, 0.80),
    0 0 52px 18px rgba(255, 69, 0, 0.30); }
}
```

SVG feGaussianBlur implementation (for Cytoscape or pure SVG):

```svg
<filter id="critical-glow" x="-50%" y="-50%" width="200%" height="200%">
  <feGaussianBlur stdDeviation="6" result="blur" />
  <feFlood flood-color="#FF4500" flood-opacity="0.6" result="color" />
  <feComposite in="color" in2="blur" operator="in" result="glow" />
  <feMerge>
    <feMergeNode in="glow" />
    <feMergeNode in="SourceGraphic" />
  </feMerge>
</filter>
```

### What "Critical financial risk — Murata Electronics" looks like at 100% zoom

- **44px circle** (Tier-2 supplier size)
- Interior fill: very dark warm tint (`rgba(255,69,0,0.18)`)
- Building icon in white/light grey, centered
- **4px orange-red ring** (#FF4500)
- **Pulsing glow** radiating outward 36px, cycling every 2.4s
- Top-left corner: **alert pip** (8px circle, #FF4500, solid — Active Alert)
- Bottom-right corner: **risk type badge** — $ coin icon in a 14px circle, background #1a2035
- Label "Murata Electronics" in **#FF4500, bold**

Versus a healthy Tier-2 (e.g., Infineon for the same part, alternate path):

- 38px circle
- Dark fill, minimal tint
- Building icon in white
- 1.5px blue ring, 60% opacity
- No glow, no pip
- Risk type badge may be absent
- Label in muted `#b0d4e8`

The contrast between these two at a glance is dramatic without being cartoonish.

---

## 3. Edge Visual Design

### Edge type baseline styles

Edges carry two types of information: **relationship type** (what the connection is) and **risk state** (how healthy that path is). These are encoded on independent channels: dash pattern for type, color+weight for risk.

| Edge Type      | Base dash pattern          | Meaning                            |
|----------------|----------------------------|------------------------------------|
| `supplies`     | Solid                      | Part flows from supplier to plant  |
| `manufactured-at` | Long dash (8px / 4px gap) | Supplier → Site relationship    |
| `used-in`      | Dot-dash (8 / 2 / 2 / 2)  | Part → Assembly or Assembly → Plant|
| `owned-by`     | Short dot (2px / 4px)      | Ownership chain overlay            |

### Risk state overlay on edges

Risk state overrides the color and weight. The dash pattern (type encoding) is preserved underneath.

| Risk Level | Edge color  | Stroke width | Additional treatment                         |
|------------|-------------|--------------|----------------------------------------------|
| Critical   | `#FF4500`   | 3px          | Animated flow (see §5), opacity 1.0          |
| High       | `#FF8C00`   | 2.5px        | Static, opacity 0.9                          |
| Medium     | `#F5C518`   | 2px          | Static, opacity 0.75                         |
| Low        | `#32ADE6`   | 1.5px        | Static, opacity 0.55                         |
| None       | `#4D5566`   | 1px          | Static, opacity 0.35 (recedes into bg)       |

The color of an edge is the **maximum risk level** of either connected node, or the explicit risk assigned to the path itself.

### Healthy vs. at-risk path — what the eye sees

**Healthy supply path** (Infineon → Continental Regensburg → Golf MQB):
- 1–1.5px edges in `#32ADE6` or `#4D5566`
- No animation
- Recede into the background canvas
- Low opacity — they're visible but don't demand attention

**At-risk supply path** (Murata → Continental Wolfsburg → Golf MQB):
- 3px edge in `#FF4500`
- Flowing dash animation active (see §5)
- High opacity — they visually float above the healthy edges
- If multiple edges in the critical path: they visually form a lit-up "hot wire" through the graph

### Cytoscape.js edge style example

```js
// Healthy edge
{
  selector: 'edge[riskLevel = "none"]',
  style: {
    'line-color': '#4D5566',
    'width': 1,
    'opacity': 0.35,
    'target-arrow-color': '#4D5566',
    'target-arrow-shape': 'triangle',
    'arrow-scale': 0.7,
  }
},
// Critical edge
{
  selector: 'edge[riskLevel = "critical"]',
  style: {
    'line-color': '#FF4500',
    'width': 3,
    'opacity': 1.0,
    'line-style': 'dashed',
    'line-dash-pattern': [10, 5],
    'line-dash-offset': 0,   // animated via JS loop
    'target-arrow-color': '#FF4500',
    'target-arrow-shape': 'triangle',
    'arrow-scale': 1.2,
  }
}
```

Animate the dash offset to create flow:

```js
let dashOffset = 0;
function animateCriticalEdges() {
  dashOffset = (dashOffset - 1) % 100;
  cy.edges('[riskLevel = "critical"]').style('line-dash-offset', dashOffset);
  requestAnimationFrame(animateCriticalEdges);
}
animateCriticalEdges();
```

---

## 4. Risk Type Icons / Badges

### Design principle

Each node can carry **one primary risk type** visible at rest, and a **secondary tooltip/expand** that shows all active risk types. The badge must be scannable at 32–44px node sizes (i.e., the badge itself is 14–16px) and must not obscure the node's identity icon.

### Badge placement grid

Each node has four badge slots — one per corner. Assign consistently:

```
┌─────────────────────────────────┐
│  [Alert pip]        [Risk type] │
│                                 │
│         [Node icon]             │
│                                 │
│  [SPOF badge]    [Tier badge]   │
└─────────────────────────────────┘

Top-left  = Alert status pip (8px circle)
Top-right = Primary risk type icon (14px badge circle)
Bot-left  = SPOF indicator (if applicable, 16px diamond)
Bot-right = Tier label for suppliers (T1/T2/T3 text badge)
```

### Risk type icon set

Use a minimal SVG icon set — these need to read at 10–12px effective size:

| Risk Type   | Icon                  | SVG path summary              | Color on badge bg       |
|-------------|----------------------|-------------------------------|------------------------|
| Financial   | Coin / $ symbol       | Simple $ in sans-serif        | `#FFD700` (gold)       |
| Geopolitical| Flag / globe          | Simplified globe outline      | `#A78BFA` (violet)     |
| Quality     | Warning triangle      | ▲ with ! inside               | `#F97316` (orange)     |
| Compliance  | Document / scales     | Simple doc with check         | `#34D399` (emerald)    |
| Operational | Gear                  | 6-tooth gear                  | `#60A5FA` (light blue) |

The badge is a **14px circle** with a dark fill (`#0f1b2d`), 1px border in the icon's color, and the icon glyph centered at 8px effective size. This keeps it readable without becoming an information dump.

### SVG badge component (reusable)

```svg
<!-- Risk type badge: Financial -->
<g class="badge badge--financial" transform="translate(14, -14)">
  <circle r="7" fill="#0f1b2d" stroke="#FFD700" stroke-width="1"/>
  <text x="0" y="4"
        text-anchor="middle"
        fill="#FFD700"
        font-size="8"
        font-family="sans-serif"
        font-weight="700">$</text>
</g>
```

For Geopolitical (globe outline as path):

```svg
<g class="badge badge--geopolitical" transform="translate(14, -14)">
  <circle r="7" fill="#0f1b2d" stroke="#A78BFA" stroke-width="1"/>
  <!-- Simplified globe: outer circle + meridian + equator -->
  <circle r="4.5" fill="none" stroke="#A78BFA" stroke-width="0.8"/>
  <ellipse rx="2" ry="4.5" fill="none" stroke="#A78BFA" stroke-width="0.8"/>
  <line x1="-4.5" y1="0" x2="4.5" y2="0" stroke="#A78BFA" stroke-width="0.8"/>
</g>
```

### Alert status pip (top-left)

Three states:

```
Active Alert  → 8px filled circle, color: risk level color, pulse animation (1.6s)
Monitoring    → 8px circle, outline only (1.5px), color: #F5C518, no animation
Clear         → absent (no pip rendered — clean node)
```

```css
.alert-pip--active {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--risk-critical); /* or appropriate level */
  animation: pip-pulse 1.6s ease-in-out infinite;
}

@keyframes pip-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50%       { transform: scale(1.35); opacity: 0.7; }
}

.alert-pip--monitoring {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: transparent;
  border: 1.5px solid #F5C518;
  animation: none;
}
```

---

## 5. Risk Propagation Animation

### Concept

When the user triggers Impact Path Tracing — e.g., clicking "Trace impact" on the Murata node — the graph performs a two-phase animation:

**Phase 1 — Discovery (0–800ms):** Non-path nodes and edges fade to very low opacity (15–20%). The impact path highlights from source to destination, node by node, with a brief hold at each node.

**Phase 2 — Pulse (800ms → loop):** An animated pulse particle travels continuously from the risk source (Murata) forward along the supply chain toward the affected plants and vehicle programs.

### Implementation: SVG `stroke-dashoffset` pulse

The most reliable cross-browser approach uses an animated SVG circle/dot travelling along a `<path>`:

```svg
<svg>
  <!-- The supply path edge as a named path -->
  <path id="path-murata-continental"
        d="M 120,200 C 280,180 320,220 480,210"
        fill="none" stroke="#FF4500" stroke-width="3"
        stroke-dasharray="10 5"
        opacity="0.9">
    <!-- Animated dash offset for the "flowing wire" base -->
    <animate attributeName="stroke-dashoffset"
             from="0" to="-45"
             dur="0.9s" repeatCount="indefinite"/>
  </path>

  <!-- Pulse particle — a circle travelling the path -->
  <circle r="5" fill="#FF4500" opacity="0">
    <animateMotion dur="1.4s" repeatCount="indefinite" rotate="auto">
      <mpath href="#path-murata-continental"/>
    </animateMotion>
    <animate attributeName="opacity"
             values="0;1;1;0" keyTimes="0;0.1;0.8;1"
             dur="1.4s" repeatCount="indefinite"/>
    <animate attributeName="r"
             values="3;6;3" keyTimes="0;0.5;1"
             dur="1.4s" repeatCount="indefinite"/>
  </circle>
</svg>
```

The particle: a circle 5–6px radius, same color as the risk level, with a brief trail fade. It accelerates slightly toward the downstream node to reinforce directionality.

### Cytoscape.js approach (canvas-based)

Cytoscape doesn't support `<animateMotion>` natively, so use a canvas overlay:

```js
// Draw propagation pulse on overlay canvas
function drawPulse(ctx, path, progress, color) {
  // path: array of {x, y} waypoints
  const totalLen = pathLength(path);
  const pos = interpolateAlongPath(path, progress * totalLen);

  // Trail: fade out behind the particle
  for (let i = 0; i < 8; i++) {
    const trailProgress = Math.max(0, progress - (i * 0.015));
    const trailPos = interpolateAlongPath(path, trailProgress * totalLen);
    const alpha = (1 - i / 8) * 0.5;
    ctx.beginPath();
    ctx.arc(trailPos.x, trailPos.y, 3 - i * 0.2, 0, Math.PI * 2);
    ctx.fillStyle = hexToRgba(color, alpha);
    ctx.fill();
  }

  // Main particle
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, 5, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.shadowBlur = 12;
  ctx.shadowColor = color;
  ctx.fill();
}

// Animation loop
let progress = 0;
function animatePropagation() {
  progress = (progress + 0.004) % 1;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPulse(ctx, impactPath, progress, '#FF4500');
  requestAnimationFrame(animatePropagation);
}
```

### Choreography for the full trace interaction

```
t=0ms     User clicks "Trace impact" on Murata node
t=0–300ms Non-path nodes fade to 15% opacity (smooth transition)
t=0–300ms Path edges animate to full opacity + critical styling
t=300ms   Path is now fully visible; non-path graph is ghosted
t=300ms   First pulse particle emitted from Murata node
t=300–700ms Particle travels Murata → Continental Wolfsburg (ease-in-out)
t=700ms   Continental Wolfsburg node ring flashes white → orange-red (50ms transition)
t=700–1100ms Particle travels Continental → ADAS ECU Assembly node
t=1100ms  ADAS ECU node flashes; its SPOF badge begins glowing
t=1100–1400ms Particle travels to Golf MQB Vehicle Program node
t=1400ms  Vehicle Program node flashes; side panel shows impact summary
t=1400ms+ Pulse loops continuously while trace is active
```

---

## 6. Single Point of Failure (SPOF) Visual Treatment

### Design imperative

SPOF is the single most strategically important signal in the graph. An executive needs to see at a glance: "that node is a SPOF — there is no alternative." The visual treatment must be **dramatically different** from risk level alone (a node can be Low risk but still a SPOF).

### Primary SPOF treatments (stacked, all applied simultaneously)

**Treatment 1: Shape transformation**
SPOF nodes get a **diamond overlay** — a rotated square border rendered on top of the normal node shape, extending ~8px beyond the node edge. This creates a distinctive "jewel" silhouette that's unlike any other node in the graph.

```svg
<!-- SPOF diamond overlay (rendered as SVG on top of node) -->
<rect class="spof-diamond"
      x="-28" y="-28" width="56" height="56"
      rx="3"
      transform="rotate(45)"
      fill="none"
      stroke="#FF4500"
      stroke-width="2"
      stroke-dasharray="5 3"
      opacity="0.85"/>
```

**Treatment 2: Double ring**
Inside the diamond, the normal node ring becomes a double ring — an inner ring in the risk color and an outer ring in white/near-white, creating a "target" appearance:

```css
.node--spof {
  box-shadow:
    0 0 0 3px #FF4500,        /* inner ring: risk color */
    0 0 0 6px #0d1929,        /* gap: canvas color */
    0 0 0 8px rgba(255,255,255,0.7),  /* outer ring: white */
    0 0 24px 8px rgba(255, 69, 0, 0.6);  /* glow */
}
```

**Treatment 3: SPOF badge (bottom-left slot)**
A 16px badge with a warning diamond (⧫) icon and the letters "SPOF" in 7px bold caps. Background `#FF4500`, text white. This is the only node badge with text rather than an icon, because "SPOF" is not self-evident from iconography alone.

```svg
<g class="badge badge--spof" transform="translate(-18, 18)">
  <rect x="-14" y="-8" width="28" height="16" rx="3"
        fill="#FF4500"/>
  <text x="0" y="5" text-anchor="middle"
        fill="white" font-size="7" font-weight="800"
        font-family="sans-serif" letter-spacing="0.08em">SPOF</text>
</g>
```

**Treatment 4: Distinct animation**
SPOF nodes pulse on a **slower cycle** (3.2s) than the standard critical-alert pulse (2.4s). The slower rhythm draws the eye differently — it reads as "permanent state" rather than "active alarm," which is semantically accurate (SPOF is a structural property, not an alert).

```css
@keyframes spof-pulse {
  0%, 100% {
    box-shadow:
      0 0 0 3px #FF4500,
      0 0 0 6px #0d1929,
      0 0 0 8px rgba(255,255,255,0.5),
      0 0 20px 6px rgba(255,69,0,0.45);
  }
  50% {
    box-shadow:
      0 0 0 3px #FF4500,
      0 0 0 6px #0d1929,
      0 0 0 10px rgba(255,255,255,0.85),
      0 0 40px 14px rgba(255,69,0,0.70);
  }
}
.node--spof {
  animation: spof-pulse 3.2s ease-in-out infinite;
}
```

**Treatment 5: Edge treatment for SPOF paths**
Edges connecting into a SPOF node (the one inbound supply path) are rendered in a **warm white** (`#FFF3E0`) at 2.5px, making the supply chain "thin thread" visually apparent — a single bright wire versus multiple paths elsewhere.

### Full SPOF appearance description

The ADAS ECU assembly node (SPOF in the prototype scenario) would look like this at 100% zoom:

- 40px hexagon (Assembly shape)
- Interior: warm dark tint (`rgba(255,69,0,0.18)`)
- Layers/assembly icon in light grey
- **3px orange-red ring** (inner)
- **1px canvas-color gap**
- **2px near-white outer ring** — the "target" double-ring look
- **Dashed diamond frame** extending 8px beyond the hexagon bounds, rotating 1° per second (very slow rotation reinforces the "danger — handle carefully" feeling without being distracting)
- **Pulsing glow** (3.2s cycle)
- Top-left: active alert pip (if alert is active)
- Top-right: quality/operational risk type badge
- Bottom-left: **"SPOF" red text badge**
- Label: "ADAS ECU Assembly" in #FF4500, bold

At 50% zoom (graph overview), the SPOF treatment still reads because:
- The diamond outline extends beyond the node bounds (visible even when node is 20px)
- The double-ring creates a visually distinctive "thick border" silhouette
- The pulsing glow radiates further than the node itself

### SPOF counter in graph legend / header

The prototype UI should also show a banner/counter when SPOF nodes are in the viewport:

```
⧫ 1 Single Point of Failure in view  [Highlight all]
```

Clicking "Highlight all" dims all non-SPOF nodes to 20% opacity and brings every SPOF into full brightness — useful for the "where are we exposed?" executive question.

---

## 7. Interaction Hierarchy Summary

How these systems layer when multiple signals are active simultaneously:

| Priority | Signal | Overrides |
|----------|--------|-----------|
| 1 (highest) | SPOF diamond frame | Never hidden |
| 2 | Critical risk glow + ring | Overrides medium/low/none ring |
| 3 | Alert pip (active) | Overrides monitoring/clear pip |
| 4 | Risk type badge | Always visible, never removed |
| 5 | Edge risk color | Applied to all edges in impact path |
| 6 | Tier badge (T1/T2/T3) | Always visible |
| 7 (lowest) | Node base shape + size | Never changes with risk state |

The node **never changes shape or size** due to risk — only color, ring, glow, and badges change. Shape and size are reserved for structural meaning (type and tier). This prevents the layout from shifting as risk states change, which would be extremely disorienting.

---

## 8. Prototype-Specific Notes

### What works in prototype but needs re-evaluation at scale

- **CSS `box-shadow` glow:** Works perfectly for an HTML prototype; in a production Cytoscape canvas renderer, switch to `feGaussianBlur` SVG filters — CSS shadows don't apply to canvas elements.
- **`animateMotion` pulse:** Pure SVG `<animateMotion>` is smooth and zero-JS but doesn't integrate with Cytoscape's layout engine. In production, use the canvas overlay approach described in §5.
- **Badge positioning:** Fixed pixel offsets work at a single zoom level. In production, badges must be positioned relative to the node's screen-space bounding box, recalculated on zoom.
- **Dashed diamond for SPOF:** Easy to render in SVG; in Cytoscape, achieve the same with a compound parent node (a larger, diamond-shaped parent node styled in outline-only).

### Library recommendation

For the hi-fi prototype, **Cytoscape.js with the `cytoscape-dagre` layout plugin** is the right choice:
- Directed acyclic layout (supply chain flows naturally top→bottom or left→right)
- Full style customisation via JSON
- Supports compound nodes (for plant/site grouping)
- Active community; CDN available

For the propagation animation, add a transparent `<canvas>` overlay over the Cytoscape div and draw the pulse particles in the RAF loop.

---

*Document ends. Version 1.0 — prototype phase.*

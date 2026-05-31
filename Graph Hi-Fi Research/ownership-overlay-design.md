# Ownership Overlay — UX & Data Design
## Graph Explorer · N-tier Supplier Monitor · VW Group Prototype

---

## Context and Design Principle

Ownership structure is a secondary lens on the supply graph, not a replacement for it. The supply chain view (who supplies what to where) answers the blast-radius question. The ownership overlay answers the control question: *who ultimately controls this supplier, are multiple suppliers controlled by the same entity, and does that control introduce risk?*

The design must keep both readable simultaneously. The primary failure mode is visual chaos when two independent graph structures (supply vs. ownership) are rendered with equal visual weight. Every decision below is optimised to prevent that.

---

## 1. Data Model

### Entity Types

The model must cleanly separate three concepts that are often conflated:

| Entity | What it represents | Example |
|---|---|---|
| `Site` | A physical production location | Murata Fukui Plant, Naka-ku |
| `LegalEntity` | The incorporated company that operates the site | Murata Manufacturing Co., Ltd. |
| `IntermediateHolding` | A holding company between operating entity and ultimate parent | Murata Electronics Holdings GmbH |
| `UltimateParent` | The entity at the top of the beneficial ownership chain | [Chinese State Fund] |
| `FinancialSponsor` | PE fund or activist investor owning a stake | Advent International |

A `Site` belongs to a `LegalEntity`. A `LegalEntity` may be owned by one or more `IntermediateHolding` entities. An `IntermediateHolding` traces to an `UltimateParent`. The supply chain graph connects `Sites` (as suppliers) to `Parts` to `Assemblies` to `Plants`. The ownership graph connects `LegalEntities` upward through holding layers to an `UltimateParent`.

### Schema (Property Graph — Neo4j compatible)

```
(:Site {
  id:              "site_murata_fukui",
  name:            "Murata Fukui Plant",
  country:         "JP",
  city:            "Fukui",
  lat:             36.065,
  lng:             136.221,
  tiersServed:     [2, 3],
  certifications:  ["IATF 16949", "ISO 14001"],
  capacity:        "3.2M units/month",
  operatorEntityId:"entity_murata_mfg"
})

(:LegalEntity {
  id:                   "entity_murata_mfg",
  name:                 "Murata Manufacturing Co., Ltd.",
  incorporationCountry: "JP",
  operatingCountries:   ["JP","DE","CN","SG"],
  entityType:           "operating",      // operating | holding | PE_fund | sovereign | unknown
  peOwned:              false,
  leverageRatio:        null,
  debtMaturityYear:     null,
  creditRating:         "A-",
  ultimateParentId:     "parent_murata_hd",
  sanctionScreeningStatus: "clear"        // clear | flagged | sanctioned
})

(:IntermediateHolding {
  id:                   "holding_murata_eu",
  name:                 "Murata Electronics Europe B.V.",
  incorporationCountry: "NL",
  entityType:           "holding",
  sanctionScreeningStatus: "clear"
})

(:UltimateParent {
  id:                   "parent_murata_hd",
  name:                 "Murata Holdings Co., Ltd.",
  country:              "JP",
  entityType:           "family_controlled",
  estimatedRevenue:     "¥1.8T",
  supplierCount:        3,               // how many suppliers in this graph trace here
  concentrationFlag:    false
})

(:FinancialSponsor {
  id:           "pe_advent_intl",
  name:         "Advent International",
  fundVintage:  2019,
  aum:          "€18B",
  leverageRatio: 4.2,
  debtMaturityYear: 2027,
  strategy:     "buyout"
})
```

### Edge Types

```
// Ownership chain (upward)
(:LegalEntity)-[:OWNS {
  stake:          0.673,       // % beneficial ownership
  direct:         true,        // direct or indirect
  verified:       "2024-Q4",   // when last verified
  source:         "orbis"      // data source
}]->(:LegalEntity | :IntermediateHolding | :UltimateParent)

// Financial sponsor stake
(:FinancialSponsor)-[:HOLDS_STAKE {
  stake:    0.51,
  acquired: "2021-03",
  board:    true
}]->(:LegalEntity)

// Site to operating entity
(:LegalEntity)-[:OPERATES]->(:Site)

// Supply chain (lateral — these are the primary graph edges)
(:Site)-[:SUPPLIES {
  partId:  "part_ecu_main",
  tier:    2,
  volume:  "40K units/month",
  spof:    true,             // single point of failure
  leadTime: "14 weeks"
}]->(:Part)

(:Part)-[:ASSEMBLED_INTO { position: "A23" }]->(:Assembly)
(:Assembly)-[:DELIVERED_TO { plant: "plant_wolfsburg" }]->(:Plant)
(:Part | :Assembly)-[:CRITICAL_FOR]->(:VehicleProgram)
```

### Key Query: Shared Ultimate Parent Detection

To surface concentration risk, the graph query groups supplier sites by `ultimateParentId`:

```cypher
MATCH (s:Site)-[:OPERATED_BY]->(:LegalEntity)-[:ULTIMATELY_OWNED_BY]->(p:UltimateParent)
WITH p, collect(s) AS sites
WHERE size(sites) > 1
RETURN p.name, sites, size(sites) AS concentrationCount
ORDER BY concentrationCount DESC
```

This query result drives the visual concentration grouping in the frontend.

---

## 2. Visual Toggle — "Show Ownership Layer"

### Toggle Control

Location: top-right of the graph panel, grouped with existing controls (zoom, fit, filter).

```
┌─────────────────────────────────────────────────────────────────┐
│  [Supply Chain]  [Risk Overlay ▾]  [ ⬡ Ownership Layer  OFF ]  │
└─────────────────────────────────────────────────────────────────┘
```

The button is a pill toggle: dark background when OFF (`#1e2d45`), teal accent when ON (`#00b0f0` border + teal icon). Icon is a corporate hierarchy symbol (org-chart tree). A tooltip on hover: "Show who owns each supplier — reveals shared parents and control risks."

### What Changes When Toggled ON

**New elements that appear:**

| Element | Description |
|---|---|
| `UltimateParent` node | Hexagonal node, larger than supplier nodes, positioned above the supply chain in the layout. Colour by risk: neutral grey for clean parents, amber for PE-owned, red for sanction-flagged. |
| `IntermediateHolding` nodes | Small diamond nodes, muted opacity (0.6). Appear only between operating entity and ultimate parent. Collapsible — clicking them expands/collapses the chain. |
| Ownership edges | Dashed amber lines connecting operating entity → holding → ultimate parent. Arcs upward over the supply chain layer. |
| Ownership percentage labels | Small text on ownership edges: "67.3%" |
| Concentration group outline | Compound node container (see §3) if ≥2 suppliers share a parent. |

**What changes on existing nodes:**

- Supplier site nodes gain an **ownership badge**: a small flag icon (country of ultimate parent) in the bottom-right corner of the node. If the parent country differs from the site country, the badge is more prominent.
- If the supplier is PE-owned: a red "PE" pill appears in the top-right corner of the node.
- If geographic ownership risk exists (site in low-risk country, parent in high-risk country): a warning icon (⚠) appears on the node.

**What does NOT change:**

- Supply chain edges remain exactly as before — solid, coloured by tier/risk, left-to-right flow.
- The dagre layout of the supply chain is preserved. Ownership nodes are inserted above the existing layout without reflowing it.
- Node positions of supplier sites, parts, assemblies, and plants are locked during the ownership toggle.

### Layout Strategy for Dual Layers

Use Cytoscape.js with `dagre` for the base supply chain layout. When ownership is toggled:

1. Lock all supply-chain node positions (`node.lock()` on all non-ownership nodes).
2. Insert `UltimateParent` nodes at `y = minY - 180` (above the top of the supply chain).
3. Insert `IntermediateHolding` nodes at `y = minY - 90` (between parent and supplier tier).
4. Run a partial layout only on ownership nodes, using their connected supplier positions to anchor horizontal placement.
5. Ownership edges use `unbundled-bezier` curve style with upward control points so they arc over the supply chain rather than crossing through it.

---

## 3. Concentration Risk — Visual Grouping

### When It Triggers

Condition: ≥2 supplier sites in the current graph view trace to the same `UltimateParent`.

### Visual Treatment

**Cytoscape.js Compound Nodes:**

The shared parent creates a compound parent node that contains all supplier site nodes tracing to it. In Cytoscape.js this is implemented by setting `parent` on each supplier node:

```javascript
// When ownership layer loads and concentration is detected:
cy.add({
  data: {
    id: 'concentration_group_sinopec',
    label: '',
    type: 'concentration_group',
    parentId: 'parent_sinopec_holdings',
    supplierCount: 3,
    affectedPrograms: ['Golf MQB', 'Audi MLB Evo']
  }
});

// Set each affected supplier's parent to the compound group
cy.nodes('[ultimateParentId = "parent_sinopec_holdings"]').forEach(node => {
  node.move({ parent: 'concentration_group_sinopec' });
});
```

**Compound Node Styling:**

```javascript
{
  selector: 'node[type = "concentration_group"]',
  style: {
    'background-color':   '#f59e0b',   // amber
    'background-opacity': 0.08,
    'border-color':       '#f59e0b',
    'border-width':       2,
    'border-style':       'dashed',
    'padding':            '24px',
    'shape':              'roundrectangle',
    'label':              'data(label)',
    'text-valign':        'top',
    'text-halign':        'center',
    'font-size':          '11px',
    'color':              '#f59e0b',
    'text-margin-y':      -8
  }
}
```

**Concentration Badge:**

A fixed-position badge rendered as an absolutely-positioned HTML overlay (using Cytoscape.js's `panningEnabled` offset tracking or a qtip2 tooltip pinned to the compound node):

```
┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
  ⚠ CONCENTRATION RISK                          
  Sinopec Group (CN)  ·  3 suppliers            
  Affects: Golf MQB, Audi MLB Evo               
│  Continental ADAS  ·  HL Mando  ·  Yanfeng   │
└─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
```

The badge is amber text on a dark card (`#1a1f2e` background with `#f59e0b` border), 10px from the top-left corner of the compound node bounding box.

**What the badge communicates to the VW executive:**

Not "these nodes share a parent" (graph theory), but: "If Sinopec Group faces sanctions or financial distress, three of your Tier-1 and Tier-2 suppliers are simultaneously affected, covering two vehicle platforms."

---

## 4. Ownership Chain Sidebar

### Trigger

Any click on a supplier site node opens the right-side panel. The panel has tabs: **Overview | Supply Path | Ownership Chain | Risk Signals**. The Ownership Chain tab is the focus here.

### Layout of the Ownership Chain Tab

The ownership chain is rendered as a small vertical tree SVG — not a text list, not a full graph view.

```
OWNERSHIP CHAIN — Continental AG (Frankfurt Site)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ┌────────────────────────────────┐
  │  🏭 Frankfurt Plant            │
  │  Operated by Continental AG   │
  └──────────────┬─────────────────┘
                 │ 100% owned by
  ┌──────────────▼─────────────────┐
  │  Continental AG                │  [DE] 
  │  Operating entity              │
  │  Credit: BBB+  Debt: Low       │
  └──────────────┬─────────────────┘
                 │ 45.6% owned by
  ┌──────────────▼─────────────────┐
  │  Continental Holding GmbH      │  [DE]
  │  Intermediate holding          │
  └──────────────┬─────────────────┘
                 │ 67.3% controlled by
  ┌──────────────▼─────────────────┐  ← red border
  │  ⚠ Schaeffler Group           │  [DE → CN interests]
  │  Ultimate Parent               │
  │  PE stake: Advent Intl 34%     │
  │  Leverage: 4.2x  Mat: 2027     │
  └────────────────────────────────┘
```

**Sidebar SVG spec:**

- Node boxes: `rx=4` rounded rectangles, `fill="#1e2d45"`, `stroke="#2d3f5a"`, width 260px
- Arrows between nodes: `stroke="#4a6080"`, `stroke-width=1.5`, `marker-end` open triangle arrowhead
- Stake label on arrow: `font-size=10px`, `fill="#8fa8c8"`, centered on line
- Country flag: 16×11px flag image or emoji, right-aligned in each node box
- Risk signals inline: coloured pill badges (`PE`, `HIGH DEBT`, `SANCTION RISK`)
- Warning node border: `stroke="#ef4444"` (red) for flagged ultimate parents
- Clean node border: `stroke="#2d3f5a"` for clear entities

**Collapsible intermediate layers:**

If there are more than 2 intermediate holdings, collapse them with a "2 intermediate entities — expand ▾" link. This keeps the sidebar from becoming a scrollable wall for complex ownership structures.

**Data freshness indicator:**

Bottom of the tab: `Ownership data: Orbis/Bureau van Dijk · Verified Q4 2024 · ⚠ Verify before regulatory submission`

---

## 5. PE / High-Debt Ownership — Visual Cues

### On-Node Signals (always visible, even without ownership layer)

These appear on supplier nodes regardless of whether the ownership layer is toggled, because PE and debt risk is relevant to supply continuity even without the full ownership tree.

| Signal | Visual | Condition |
|---|---|---|
| PE-owned | Red pill badge `PE` top-right of node | `peOwned: true` |
| High leverage | Amber `4.2×` pill top-right | `leverageRatio > 3.5` |
| Debt maturity near | Amber clock icon | `debtMaturityYear ≤ currentYear + 1` |
| Distress risk | Red glow (`box-shadow: 0 0 12px rgba(239,68,68,0.4)`) | Risk score > 70 |

**Node CSS (applied via Cytoscape.js HTML label or overlay div):**

```css
.node-badge-pe {
  background: #7f1d1d;
  color: #fca5a5;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.5px;
  padding: 2px 5px;
  border-radius: 3px;
  border: 1px solid #ef4444;
}

.node-badge-leverage {
  background: #451a03;
  color: #fbbf24;
  font-size: 9px;
  padding: 2px 5px;
  border-radius: 3px;
}

/* Applied to Cytoscape node when PE + high leverage */
node[peOwned][leverageRatio > 3.5] {
  border-color: #ef4444;
  border-width: 2;
  border-style: solid;
}
```

### Tooltip on Hover (PE-owned supplier)

```
┌──────────────────────────────────────────────────┐
│  HL Mando GmbH  (Tier 1 · Frankfurt)             │
│  ─────────────────────────────────────────────   │
│  PE Owner:   Advent International (51% stake)    │
│  Leverage:   4.2× net debt/EBITDA               │
│  Debt due:   Q3 2027 (€380M refinancing)        │
│  ─────────────────────────────────────────────   │
│  Risk: Distress could force asset sale or        │
│  supply disruption before MEB ramp               │
└──────────────────────────────────────────────────┘
```

### In the Sidebar

The Risk Signals tab (not the Ownership Chain tab) carries the full debt profile:

```
FINANCIAL SPONSOR RISK
━━━━━━━━━━━━━━━━━━━━
Owner:          Advent International
Stake:          51.0% (board control)
Fund vintage:   2019
AUM:            €18B
Entry leverage: 3.8×
Current:        4.2× net debt/EBITDA   ← RED indicator
Debt maturity:  Q3 2027                ← AMBER (18 months)
Covenant:       Headroom <15%          ← RED indicator

⚠ REFINANCING WINDOW COINCIDES WITH MEB PLATFORM RAMP
   Potential for supply disruption or cost renegotiation
   at critical production scale-up. Flag for purchasing VP.
```

---

## 6. Geographic Ownership Risk

### Scenario

`Continental ADAS Frankfurt Site` → operated by `Continental AG (DE)` → ultimately controlled by `[Holding Entity] (CN)`.

The site is in Germany (low geopolitical risk). The ultimate owner is in a country subject to EU/US sanctions or strategic screening requirements. The surface-level supply chain view shows only Germany — the risk is invisible without ownership data.

### On-Node Signal

A **dual-flag badge** in the bottom-right corner of the supplier node:

```
┌─────────────────────────┐
│   Continental ADAS      │
│   Frankfurt Site        │       ← node body
│   ▓▓▓▓▓▓▓▓▓▓▓▓         │
└─────────────────────────┘
                        🇩🇪⚠🇨🇳   ← dual flag badge
```

The `DE` flag represents the site country. The `⚠` icon (amber) separates them. The `CN` flag represents the ultimate owner country. If the owner country is sanctioned or under active screening, the second flag has a red background.

**Cytoscape.js implementation:** Render node labels as HTML using a custom renderer (or use `ele.style({'background-image': ...})` with a composite SVG data URI). The dual-flag badge is an absolutely-positioned `<div>` overlay tracked to the node's screen coordinates on each render tick.

### Ownership Edge Colour for Sanctioned Parent

When the ownership layer is ON:

```javascript
{
  selector: 'edge[type = "owns"][sanctionRisk = "sanctioned"]',
  style: {
    'line-color':          '#ef4444',  // red
    'target-arrow-color':  '#ef4444',
    'line-style':          'dashed',
    'dash-pattern':        [4, 2]
  }
}

{
  selector: 'edge[type = "owns"][sanctionRisk = "flagged"]',
  style: {
    'line-color':          '#f59e0b',  // amber
    'target-arrow-color':  '#f59e0b'
  }
}
```

### In the Sidebar — Ownership Chain Tab

The `UltimateParent` node for a geographic-risk case is styled with a red border and an explicit call-out block:

```
┌──────────────────────────────────────────────────┐
│  🚨 BENEFICIAL OWNERSHIP RISK                    │
│                                                  │
│  Ultimate Owner:  Yangtze Capital Holdings Ltd   │
│  Jurisdiction:    People's Republic of China     │
│  Screening:       Subject to EU FDI screening    │
│                   (Regulation 2019/452)          │
│  LkSG Status:     Disclosure required            │
│                                                  │
│  Note: Operational entity (Continental AG) is    │
│  incorporated in Germany. Ultimate beneficial    │
│  ownership diverges from operational domicile.  │
│  Verify before regulatory submission.            │
└──────────────────────────────────────────────────┘
```

The LkSG (Lieferkettensorgfaltspflichtengesetz) reference is deliberate — this is directly relevant to VW's regulatory exposure and will land with supply chain directors.

### Global Risk Map Integration

The geographic ownership risk is also surfaced on the Global Risk Map module (out of scope for this prototype, but a hand-off point): the map shows site country by default, with a toggle to "show ownership country" that re-colours supply chain heat by ultimate beneficial owner country instead of operating country.

---

## 7. Cytoscape.js — Rendering Two Parallel Edge Types Without Visual Chaos

### Core Principle

**Ownership edges never drive layout. They are overlays on a supply-chain-optimised layout.**

If ownership edges are treated equally to supply edges in the force-directed or dagre layout, the graph becomes unreadable — ownership hierarchies and supply paths have orthogonal directionality and will fight each other. The solution: layout is computed on supply edges only, then ownership edges are drawn as styled overlays.

### Implementation

**Step 1: Register two edge classes**

```javascript
const cy = cytoscape({
  container: document.getElementById('graph'),
  elements: {
    nodes: [...supplyChainNodes],
    edges: [...supplyEdges.map(e => ({...e, classes: 'supply'})),
            ...ownershipEdges.map(e => ({...e, classes: 'ownership hidden'}))]
  },
  layout: {
    name: 'dagre',
    rankDir: 'LR',          // supply chain flows left to right
    edgeSep: 20,
    nodeSep: 40,
    rankSep: 80,
    // CRITICAL: exclude ownership edges from layout calculation
    edgeWeight: edge => edge.hasClass('ownership') ? 0 : 1
  }
});
```

**Step 2: Lock positions after initial layout**

```javascript
cy.on('layoutstop', () => {
  cy.nodes().not('[type = "ultimate_parent"],[type = "holding"]').lock();
});
```

**Step 3: Toggle handler**

```javascript
document.getElementById('ownership-toggle').addEventListener('change', (e) => {
  if (e.target.checked) {
    // Insert ownership nodes above supply chain
    insertOwnershipNodes(cy);
    // Show ownership edges
    cy.edges('.ownership').removeClass('hidden');
    // Apply concentration grouping
    applyConcentrationGroups(cy);
    // Animate ownership nodes into position
    cy.nodes('.ownership-node').animate({ position: computedPositions }, { duration: 400 });
  } else {
    cy.edges('.ownership').addClass('hidden');
    cy.nodes('.ownership-node').remove();
    removeConcentrationGroups(cy);
    cy.nodes().unlock();
  }
});
```

**Step 4: Edge styling**

```javascript
const edgeStyles = [
  {
    selector: 'edge.supply',
    style: {
      'curve-style':          'bezier',
      'line-color':           '#4a9eff',
      'target-arrow-color':   '#4a9eff',
      'target-arrow-shape':   'triangle',
      'arrow-scale':          1.2,
      'line-style':           'solid',
      'width':                2,
      'opacity':              1.0,
      'z-index':              10
    }
  },
  {
    selector: 'edge.ownership',
    style: {
      'curve-style':            'unbundled-bezier',
      // Control point pushes arc ABOVE the supply chain layer
      'control-point-distances': [-100],
      'control-point-weights':   [0.5],
      'line-color':             '#f59e0b',
      'target-arrow-color':     '#f59e0b',
      'target-arrow-shape':     'circle-triangle',
      'arrow-scale':            0.9,
      'line-style':             'dashed',
      'dash-pattern':           [6, 3],
      'width':                  1.5,
      'opacity':                0.75,
      'z-index':                5,   // below supply edges
      'label':                  'data(stake_pct)',
      'font-size':              '9px',
      'color':                  '#f59e0b',
      'text-rotation':          'autorotate',
      'text-margin-y':          -8
    }
  },
  {
    selector: 'edge.ownership[sanctionRisk = "sanctioned"]',
    style: {
      'line-color':           '#ef4444',
      'target-arrow-color':   '#ef4444',
      'dash-pattern':         [4, 2]
    }
  },
  {
    selector: 'edge.hidden',
    style: { 'display': 'none' }
  }
];
```

### Preventing Visual Chaos — Checklist

| Problem | Solution |
|---|---|
| Ownership and supply edges cross constantly | Ownership edges use negative `control-point-distances` to arc above the supply chain band |
| Too many dashed lines when ownership is on | Default `opacity: 0.75` for ownership edges, dimmed further on non-selected paths |
| UltimateParent nodes push supply nodes around | All supply nodes are `locked()` before ownership nodes are inserted |
| Labels on edges collide | Ownership edge labels only show stake % at zoom > 1.2; hidden at lower zoom |
| Compound nodes change the supply path visual | Compound node background has `opacity: 0.08` — it tints without obscuring edges passing through it |
| Selecting a node is ambiguous (supply path? ownership chain?) | Clicking a supplier node: supply path highlights in the main graph; ownership chain opens in sidebar. Two different responses, never superimposed. |

### Performance Note (Prototype vs Production)

For the prototype (≤80 nodes), all of the above works in a single Cytoscape.js instance. At production scale (thousands of suppliers), the ownership overlay would be:
1. A separate lightweight Cytoscape layer rendered on a canvas at lower z-index
2. Or server-side pre-clustered into concentration groups with only the group boundaries rendered client-side
3. And lazy-loaded per viewport, not all at once

Flag this during the executive demo if asked about scalability.

---

## 8. SVG Mockup — Node Anatomy

### Supplier Node — Clean State

```svg
<g class="supplier-node">
  <!-- Main body -->
  <rect x="0" y="0" width="160" height="56"
        rx="6" fill="#1e2d45" stroke="#2d4a6e" stroke-width="1.5"/>
  
  <!-- Tier indicator bar (left edge) -->
  <rect x="0" y="0" width="4" height="56"
        rx="3" fill="#4a9eff"/>  <!-- Tier 1: blue; Tier 2: teal; Tier 3: grey -->

  <!-- Supplier name -->
  <text x="14" y="20" font-size="11" font-weight="600"
        fill="#e2e8f0" font-family="Inter, sans-serif">
    Continental AG
  </text>

  <!-- Site name -->
  <text x="14" y="34" font-size="9" fill="#8fa8c8">
    Frankfurt Plant
  </text>

  <!-- Country + tier -->
  <text x="14" y="48" font-size="9" fill="#4a6080">
    DE  ·  Tier 1
  </text>

  <!-- Risk score pill -->
  <rect x="118" y="8" width="34" height="16"
        rx="3" fill="#451a03" stroke="#f59e0b" stroke-width="1"/>
  <text x="135" y="20" font-size="9" font-weight="600"
        fill="#fbbf24" text-anchor="middle">
    62
  </text>
</g>
```

### Supplier Node — PE-Owned + Geographic Risk (Ownership Layer ON)

```svg
<g class="supplier-node pe-owned geo-risk">
  <!-- Main body — red border glow when PE-owned -->
  <rect x="0" y="0" width="160" height="56"
        rx="6" fill="#1e2d45" stroke="#ef4444" stroke-width="1.5"
        filter="url(#redGlow)"/>

  <!-- Tier bar -->
  <rect x="0" y="0" width="4" height="56" rx="3" fill="#4a9eff"/>

  <!-- Labels (same as above) -->
  <text x="14" y="20" font-size="11" font-weight="600" fill="#e2e8f0">
    HL Mando GmbH
  </text>
  <text x="14" y="34" font-size="9" fill="#8fa8c8">Frankfurt Site</text>
  <text x="14" y="48" font-size="9" fill="#4a6080">DE  ·  Tier 1</text>

  <!-- PE badge (top-right) -->
  <rect x="120" y="4" width="32" height="14"
        rx="3" fill="#7f1d1d" stroke="#ef4444" stroke-width="1"/>
  <text x="136" y="15" font-size="8" font-weight="700"
        fill="#fca5a5" text-anchor="middle">PE</text>

  <!-- Dual-flag badge (bottom-right) — geographic risk -->
  <text x="100" y="52" font-size="10">🇩🇪</text>
  <text x="115" y="52" font-size="8" fill="#f59e0b">⚠</text>
  <text x="126" y="52" font-size="10">🇨🇳</text>
</g>

<!-- Red glow filter definition (in <defs>) -->
<filter id="redGlow">
  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
  <feMerge>
    <feMergeNode in="coloredBlur"/>
    <feMergeNode in="SourceGraphic"/>
  </feMerge>
</filter>
```

### UltimateParent Node (Ownership Layer)

```svg
<g class="ultimate-parent-node">
  <!-- Hexagonal shape via polygon -->
  <polygon points="40,0 80,0 100,20 80,40 40,40 20,20"
           fill="#1a1f2e" stroke="#f59e0b" stroke-width="1.5"
           stroke-dasharray="4 2"/>
  <text x="60" y="16" font-size="9" font-weight="600"
        fill="#f59e0b" text-anchor="middle">
    ULTIMATE PARENT
  </text>
  <text x="60" y="28" font-size="10" font-weight="500"
        fill="#e2e8f0" text-anchor="middle">
    Sinopec Group
  </text>
  <text x="60" y="38" font-size="9"
        fill="#8fa8c8" text-anchor="middle">
    🇨🇳  State-owned
  </text>
</g>
```

---

## 9. Interaction Flows Summary

### Investigative Flow: "Who controls our brake module suppliers?"

1. User opens Graph Explorer → Brake Module subgraph view
2. Clicks `⬡ Ownership Layer  OFF` → toggles ON
3. Two supplier nodes immediately gain the dual-flag badge `🇩🇪⚠🇨🇳`
4. Amber compound group outline appears around three supplier nodes
5. Badge reads: "⚠ CONCENTRATION RISK · Yangtze Capital (CN) · 3 suppliers · Affects: Tiguan, Q5"
6. User clicks one of the flagged suppliers → sidebar opens to Ownership Chain tab
7. Sidebar shows the chain: Frankfurt Site → HL Mando GmbH (DE) → Yangtze Capital Holdings (CN)
8. Red call-out box: "Subject to EU FDI screening · LkSG disclosure required"
9. User screenshots sidebar for purchasing VP briefing

### Investigative Flow: "Is our Tier-2 sensor supplier financially stable?"

1. User selects `Murata` node in the graph
2. Sees `4.2×` amber leverage badge on the node
3. Opens Risk Signals tab in sidebar
4. Reads: PE owner, €380M refinancing due Q3 2027, coincides with MEB ramp
5. Activates ownership layer → sees Advent International as a FinancialSponsor node with a dashed ownership edge to Murata's operating entity
6. Flags for procurement action in Action Workspace (linked module, out of scope for this prototype)

---

## 10. Prototype vs Production Gaps to Flag

| Area | Prototype approach | Production requirement |
|---|---|---|
| Ownership data source | Hardcoded in graph JSON | Live integration with Orbis (Bureau van Dijk), Refinitiv, or Dun & Bradstreet |
| Beneficial ownership verification | Asserted as data attribute | Requires automated UBO chain resolution with human review for complex structures |
| Sanction screening | Static flag on entity | Real-time OFAC/EU/UK sanctions list matching with fuzzy name resolution |
| PE debt data | Hardcoded leverage ratios | Bloomberg/Refinitiv credit data, updated quarterly |
| Compound node performance | Fine at ≤80 nodes | Needs server-side clustering at scale |
| LkSG compliance tagging | Display only | Would need audit trail and legal review workflow |

---

*Design authored for N-tier Supplier Monitor · Graph Explorer Prototype · VW Group executive demonstration*
*Reference: Architecture Document (attached to project) · Prototype scenario: Tier-2 semiconductor / electronics risk path*

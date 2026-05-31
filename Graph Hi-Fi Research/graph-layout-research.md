# Graph Layout Algorithm Research
## N-tier Supplier Monitor — Graph Explorer Prototype

**Context:** Volkswagen Group supply chain risk intelligence platform. Graph node types: OEM Plant, Vehicle Program, Assembly, Part, Tier-1 Supplier, Tier-1 Site, Tier-2 Supplier, Tier-2 Site, Tier-3 Supplier. Edge types: `supplies`, `manufactured-at`, `used-in`, `owned-by`, `at-risk`.

**Primary demo scenario:** Tier-2 semiconductor supplier (financial/geopolitical risk in Asia) → Tier-1 electronics supplier → critical part (SPOF) → Golf MQB assembly → Wolfsburg Plant + 2 vehicle programs.

---

## 1. Hierarchical / Dagre (Top-Down)

### What the user sees

A layered, left-to-right or top-to-bottom tree structure. At the top: OEM Plant and Vehicle Program. Below that: Assembly and Part nodes. Then Tier-1 Suppliers and their sites. Then Tier-2, then Tier-3 at the bottom. Edges flow consistently downward, almost never crossing layers without a reason. The graph looks like an org chart for the supply chain.

Dagre (the layout engine used by Cytoscape.js's `cytoscape-dagre` extension) computes a Sugiyama-style layered layout. It assigns each node a rank based on its longest path from the root, then minimises edge crossings within each rank.

### Insights revealed

- **Tier depth is immediately legible.** A user can instantly tell whether a disrupted supplier is Tier 1, 2, or 3 without reading labels.
- **Blast radius reads top-to-bottom.** Highlighting a Tier-2 node in red makes the upward impact path (toward OEM) visually salient: the user's eye travels up the layers to see which programs are at risk.
- **SPOF concentration is visible.** If a single Tier-2 site has edges going to multiple Tier-1 nodes across the same layer, the fan-out is obvious.
- **Missing tiers stand out.** A supplier that "jumps" a tier (a Tier-3 node with a direct edge to a Vehicle Program) draws immediate attention as an anomaly.
- **Ownership overlays are clean.** `owned-by` edges can be rendered as curved, coloured arcs that cross layers without disrupting the structural grid.

### Blind spots

- **Geographic concentration is invisible.** Two Tier-2 sites in Shenzhen and one in Taiwan look identical to two in Germany and one in Mexico. The layout gives no signal about geopolitical clustering.
- **Circular or shared-ownership relationships break the DAG assumption.** If Supplier A and Supplier B are both partially owned by Holding X, which also owns a Tier-1 entity, dagre will struggle to rank these nodes cleanly or will introduce backwards edges.
- **Dense graphs become wall-of-nodes.** At full N-tier scale (hundreds of Tier-3 suppliers), the bottom layers collapse into illegibility. Dagre does not automatically hide or cluster nodes below a threshold.
- **Risk *propagation* paths are not differentiated from structural paths.** The layout shows the topology; it cannot distinguish a high-criticality from a low-criticality supply path without additional visual encoding (colour, edge weight).
- **Wide Tier-3 layers** create very wide canvases that require horizontal scrolling.

---

## 2. Force-Directed (e.g., CoSE or Euler in Cytoscape.js)

### What the user sees

Nodes float freely on the canvas. Tightly connected clusters pull together; loosely connected nodes drift apart. After the simulation stabilises, the graph has no fixed top or bottom — instead, you see organic islands: a cluster of Tier-2 Asian semiconductor suppliers that all feed the same Tier-1 node; a cluster of European sites that supply body parts to multiple programs; isolated Tier-3 nodes dangling at the edge because they have only one connection.

The `at-risk` edges, if given a higher weight or attraction force, pull risky nodes into visible proximity regardless of their tier.

### Insights revealed

- **Hidden concentration reveals itself structurally.** Two vehicle programs that share a Tier-3 dependency will end up physically close on the canvas, even if the user didn't know they were connected. This directly addresses Core Question 3 (hidden concentration).
- **Risk proximity is spatial.** A risk cluster — multiple at-risk edges converging on one region of the graph — creates a visible "hot zone" that commands attention without any filtering.
- **Ownership structures cluster naturally.** Suppliers under the same holding entity gravitate together, making cross-Tier ownership visible without a separate overlay mode.
- **Alternative paths are legible.** Two supply paths to the same part will appear as two separate branches terminating at the same node, making the "is there another route?" question (Core Question 5) answerable at a glance.

### Blind spots

- **Tier depth is completely lost.** A Tier-3 supplier could end up above a Vehicle Program on the canvas. Users unfamiliar with the data have no structural anchor.
- **Non-deterministic layout.** Every time the simulation runs, the graph looks slightly different. Users trying to recall "where was that supplier last time?" will be disoriented.
- **High node counts create hairball graphs.** Without aggressive clustering (e.g., compound nodes per tier), a force-directed layout with 200+ nodes produces an unreadable mass of overlapping edges.
- **Starting state matters.** If initial node positions are poorly seeded, the simulation can converge on a local minimum that obscures the structure you want to show.
- **Difficult to demo predictably.** In a live executive demo, force-directed graphs can take several seconds to stabilise and occasionally produce ugly states. This is a real demo risk.

---

## 3. Concentric (OEM at Centre, Tiers as Rings)

### What the user sees

A set of concentric circles. The OEM Plant and Vehicle Programs occupy the innermost ring. Assemblies and Parts form the next ring. Tier-1 Suppliers and their sites form the next. Tier-2 forms the outer-next ring, Tier-3 occupies the outermost ring. Edges radiate outward from the centre. The graph resembles a target or ripple diagram.

Cytoscape.js has a native `concentric` layout that assigns nodes to rings based on a metric (degree, tier rank, risk score). Nodes within each ring are distributed evenly around the circumference.

### Insights revealed

- **Tier distance from the OEM is immediately readable.** Proximity to the centre means proximity to production. This is a highly intuitive metaphor for supply chain directors.
- **Tier-3 exposure is visceral.** The outermost ring (Tier-3) is visually the most "distant" and often the most crowded — this correctly communicates the difficulty of visibility at that tier.
- **Ring density signals concentration risk.** If the Tier-2 ring has only 3 nodes but each has 5+ edges going inward, that bottleneck is immediately visible.
- **Good for ownership overlays.** `owned-by` edges that cross rings draw the eye to suppliers that have cross-tier ownership relationships.

### Blind spots

- **Spatial relationships within each ring are meaningless.** Two Tier-2 suppliers placed adjacent on the ring have no implied relationship — their proximity is an artefact of the layout algorithm, not the supply chain. Users may infer false connections.
- **Does not scale beyond ~50 nodes.** The outermost ring with 30+ Tier-3 suppliers becomes a dense circle of labels. There is no natural way to expand or cluster.
- **Edge crossings become severe at scale.** Edges from Tier-3 to Tier-1 (skip-tier relationships or ownership) must cross the Tier-2 ring, creating visual noise that is worse than in a hierarchical layout.
- **The demo scenario (impact path tracing) doesn't read well.** The critical path from a Tier-2 failure to a Vehicle Program is a series of edges that zig-zag inward through rings — harder to follow than a top-down hierarchy.
- **Feels like a marketing slide, not an investigation tool.** For sceptical enterprise buyers, a concentric "target" diagram may read as oversimplified. It signals "overview" more than "depth of analysis."

---

## 4. Geographic (Nodes Positioned on a World Map by Site Location)

### What the user sees

A world map as the background canvas (typically a Leaflet.js or Mapbox tile layer). Each Supplier Site, OEM Plant, and Tier-N site is placed at its actual GPS coordinates. Edges are drawn as straight lines or great-circle arcs between geographic positions. Risk overlays (geopolitical zones, natural disaster regions) can be rendered as choropleth layers beneath the nodes.

Node types without a physical location (Vehicle Program, Assembly, Part) are either omitted, grouped in a legend panel, or shown in a sidebar.

### Insights revealed

- **Geopolitical concentration is the killer insight here.** A cluster of 12 Tier-2 and Tier-3 nodes around the Pearl River Delta becomes starkly visible. One seismic event or export restriction affecting that region highlights immediately. This directly addresses Core Question 6.
- **Single-country dependency is unmistakable.** If the Golf MQB program's supply chain has 70% of its nodes in Taiwan and mainland China, the map shows this without any calculation.
- **Regulatory exposure (LkSG).** Suppliers in high-risk jurisdictions (conflict minerals, forced labour) can be flagged on the map, directly supporting due diligence workflows.
- **Logistics risk.** Port chokepoints (Strait of Malacca, Suez) can be overlaid, showing which supply paths pass through disruption-prone corridors.
- **Shock scenarios.** "What happens to our supply chain if Taiwan is blockaded?" is answerable visually in seconds.

### Blind spots

- **The supply chain topology is completely lost.** A geographic layout shows *where* suppliers are, not *what they supply* or *how they connect* to production. The Part → Assembly → Vehicle Program dependency chain is invisible.
- **Non-physical node types have no home.** Parts, Assemblies, and Vehicle Programs are conceptual entities, not geographically located. They either clutter the map or disappear into a sidebar, breaking the graph's coherence.
- **SPOF analysis is impossible.** Whether a part has one or three supply paths is not a geographic question — the map can't answer it.
- **Requires high-quality location data.** Many Tier-2 and Tier-3 suppliers have imprecise or missing location data. The layout degrades badly when even 10% of nodes lack coordinates.
- **Edges become spaghetti at scale.** Hundreds of arcs across a world map become unreadable. Bundling helps but introduces interpretation complexity.
- **Not a standalone view for risk investigation.** Best as a secondary/drill-down view, not a starting point.

---

## 5. Hybrid: Hierarchy Default + Force-Directed "Risk Spread" Mode

### What the user sees

**Default state (Hierarchical):** The graph loads in dagre layout. OEM plants and programs at the top, Tier-3 at the bottom. The structural supply chain is clear. Users navigate by clicking suppliers or parts to expand paths.

**Risk Spread mode (toggle):** When the user clicks "Show Risk Spread" or when an `at-risk` alert fires, the layout transitions (animated, ~800ms morphing between positions using Cytoscape's `animate: true`) to a force-directed view. At-risk nodes are given strong mutual attraction. The result: the risk cluster physically coalesces in the centre of the canvas while healthy nodes drift to the periphery. The user sees the blast radius as a spatial cluster, not just highlighted edges.

**Switching:** A toggle button (or automatic trigger on alert selection) switches between the two modes. The node IDs remain stable, so selections and filters carry across the transition.

### Insights revealed (cumulative)

- Everything the hierarchical layout reveals about structure, tier depth, and SPOF.
- Everything force-directed reveals about risk clustering, hidden concentration, and ownership proximity.
- The *contrast* between the two views is itself an insight: a supplier that is peripheral in the hierarchy (Tier-3, small) but central in the risk-spread view (multiple at-risk edges converging) is immediately flagged as a disproportionate risk. This is the prototype's strongest analytical moment.
- Directly answers Core Questions 1 (blast radius), 2 (SPOF), 3 (hidden concentration), and 4 (ownership risk) — the four the prototype must nail.

### Blind spots

- **Implementation complexity** is higher. Two layout engines must be loaded and the transition logic must be robust (no orphaned nodes, no layout race conditions).
- **Risk spread mode can confuse non-technical users** if they don't understand why nodes moved. The mode must be clearly labelled with a plain-language explanation ("Showing suppliers by risk proximity").
- **Force-directed convergence time** in risk spread mode (~1–3 seconds) must be handled gracefully (loading indicator, or pre-compute and cache).
- **The transition can look like a bug** to an audience unfamiliar with animated graph layouts if not choreographed carefully (dim + reposition + fade-in is better than an instantaneous jump).

---

## Recommendation

### Default layout: **Hierarchical (dagre)**

For a supply chain risk investigation tool used by VW supply chain directors, the hierarchical layout is the correct default. The primary investigative workflow is: *"An alert has fired — which supplier, at which tier, affecting which programs?"* This is a top-down question that maps exactly onto a top-down visual structure. Tier depth is the single most important structural dimension; dagre makes it effortless to read.

The hierarchical default also performs best in live demos: it is deterministic, loads instantly, and scales predictably to the 30–50 node prototype scenario.

### Secondary views

| View | When to use | Trigger |
|---|---|---|
| **Force-directed (Risk Spread)** | Investigating blast radius, hidden concentration, ownership clustering | Toggle on alert selection or "Show Risk Spread" button |
| **Geographic** | Geopolitical exposure analysis, LkSG jurisdiction screening | "View on Map" button, or Global Risk Map module integration |
| **Concentric** | Executive overview / presentation mode | Optional "Overview" button; not recommended as investigation view |

---

## Cytoscape.js Configuration — Hierarchical (dagre) Primary Layout

```javascript
// Install: npm install cytoscape-dagre  OR  CDN:
// <script src="https://unpkg.com/cytoscape-dagre@2.5.0/cytoscape-dagre.js"></script>

cytoscape.use(cytoscapeDagre);

const cy = cytoscape({
  container: document.getElementById('cy'),
  style: [
    {
      selector: 'node',
      style: {
        'background-color': '#1a3a5c',
        'label': 'data(label)',
        'color': '#ffffff',
        'font-size': '11px',
        'text-valign': 'center',
        'text-halign': 'center',
        'width': 'label',
        'height': 'label',
        'padding': '8px',
        'shape': 'round-rectangle',
        'border-width': 1,
        'border-color': '#2a5a8c'
      }
    },
    {
      // OEM nodes — top tier anchor
      selector: 'node[type = "oem_plant"], node[type = "vehicle_program"]',
      style: {
        'background-color': '#001e50',   // VW dark blue
        'border-color': '#00b0f0',        // VW teal accent
        'border-width': 2,
        'font-weight': 'bold'
      }
    },
    {
      // At-risk nodes
      selector: 'node[risk_level = "high"]',
      style: {
        'background-color': '#8b0000',
        'border-color': '#ff4444',
        'border-width': 2
      }
    },
    {
      selector: 'node[risk_level = "medium"]',
      style: {
        'background-color': '#7a4000',
        'border-color': '#ff8c00',
        'border-width': 2
      }
    },
    {
      selector: 'edge',
      style: {
        'width': 1.5,
        'line-color': '#2a4a6c',
        'target-arrow-color': '#2a4a6c',
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier',
        'label': 'data(relation)',
        'font-size': '9px',
        'color': '#8a9ab0',
        'text-rotation': 'autorotate'
      }
    },
    {
      // At-risk edges — high visibility
      selector: 'edge[type = "at_risk"]',
      style: {
        'line-color': '#ff4444',
        'target-arrow-color': '#ff4444',
        'width': 2.5,
        'line-style': 'dashed'
      }
    },
    {
      // Ownership edges — distinct visual channel
      selector: 'edge[type = "owned_by"]',
      style: {
        'line-color': '#00b0f0',
        'target-arrow-color': '#00b0f0',
        'line-style': 'dotted',
        'curve-style': 'unbundled-bezier',
        'control-point-distances': [60],
        'control-point-weights': [0.5]
      }
    }
  ],
  layout: {
    name: 'dagre',

    // Direction: top-down (OEM → Tier 3)
    rankDir: 'TB',            // 'TB' = top-to-bottom | 'LR' = left-to-right

    // Rank assignment: supply chain tier takes priority
    // Assign nodes a 'tier_rank' data property (0=OEM, 1=T1, 2=T2, 3=T3)
    // and use it to pin layer positions
    ranker: 'tight-tree',     // 'network-simplex' | 'tight-tree' | 'longest-path'

    // Spacing
    rankSep: 120,             // vertical distance between tiers (px)
    nodeSep: 60,              // horizontal distance between nodes in the same tier
    edgeSep: 20,              // minimum distance between edges in same rank

    // Padding
    padding: 40,

    // Animate into position on load
    animate: true,
    animationDuration: 600,
    animationEasing: 'ease-in-out-cubic',

    // Layout quality vs. speed trade-off
    // 'UB' (undefined behaviour) is faster; remove for cleaner output
    acyclicer: 'greedy',      // handles any cycles in ownership subgraph
  }
});
```

### Tier-pinning helper (enforce strict tier layers)

Dagre's rank assignment can be overridden by seeding node `rank` via the graph data. This ensures, e.g., that a Tier-2 supplier never renders above a Tier-1 even if the edge graph would place it there:

```javascript
// Set before layout runs
const tierRank = {
  vehicle_program: 0,
  oem_plant:       0,
  assembly:        1,
  part:            2,
  tier1_supplier:  3,
  tier1_site:      3,
  tier2_supplier:  4,
  tier2_site:      4,
  tier3_supplier:  5
};

cy.nodes().forEach(node => {
  node.data('rank', tierRank[node.data('type')] ?? 99);
});

// dagre respects 'rank' data property when present in node definitions
```

---

## Cytoscape.js Configuration — Force-Directed "Risk Spread" Mode (Secondary)

Uses the `cytoscape-cola` or `cytoscape-euler` extension. Cola is preferred for animated transitions because it supports incremental layout.

```javascript
// <script src="https://unpkg.com/cytoscape-cola/cytoscape-cola.js"></script>
cytoscape.use(cytoscapeCola);

function activateRiskSpreadLayout(cy) {
  // Boost attraction between at-risk nodes before running layout
  cy.edges('[type = "at_risk"]').forEach(edge => {
    edge.data('weight', 8);   // strong attraction
  });
  cy.edges('[type != "at_risk"]').forEach(edge => {
    edge.data('weight', 1);
  });

  cy.layout({
    name: 'cola',

    // Use edge weight data for spring strength
    edgeLength: edge => {
      const w = edge.data('weight') || 1;
      return 200 / w;           // high-risk edges are shorter → nodes cluster
    },

    nodeSpacing: 20,
    flow: null,                 // no directional bias — pure force
    animate: true,
    animationDuration: 900,
    animationEasing: 'ease-in-out-quad',
    maxSimulationTime: 3000,    // cap at 3s for demo reliability
    convergenceThreshold: 0.01,
    randomize: false,           // start from current positions for smooth morph
    padding: 40,
    fit: true
  }).run();
}

// Toggle handler
document.getElementById('btn-risk-spread').addEventListener('click', () => {
  const isActive = btn.classList.toggle('active');
  if (isActive) {
    activateRiskSpreadLayout(cy);
  } else {
    // Revert to dagre
    cy.layout({ name: 'dagre', rankDir: 'TB', rankSep: 120, nodeSep: 60,
                 animate: true, animationDuration: 600 }).run();
  }
});
```

---

## Implementation Notes for the Prototype

**Node data schema (minimum required for both layouts):**

```javascript
// Each node should carry:
{
  data: {
    id: 'murata_manufacturing_wuxi',
    label: 'Murata Mfg. (Wuxi)',
    type: 'tier2_site',          // matches tierRank map above
    risk_level: 'high',          // 'high' | 'medium' | 'low' | 'none'
    risk_type: 'geopolitical',   // 'financial' | 'geopolitical' | 'operational'
    country: 'CN',
    lat: 31.49,
    lng: 120.31
  }
}
```

**Edge data schema:**

```javascript
{
  data: {
    id: 'e_murata_continental',
    source: 'murata_manufacturing_wuxi',
    target: 'continental_regensburg',
    type: 'supplies',            // 'supplies' | 'manufactured_at' | 'used_in' | 'owned_by' | 'at_risk'
    weight: 1,                   // adjusted by risk spread mode
    criticality: 'sole_source'   // 'sole_source' | 'dual_source' | 'multi_source'
  }
}
```

**Demo tip:** Pre-compute both layouts on page load and cache node positions. The toggle then becomes a sub-second CSS `transform` morph rather than a full re-layout, which is significantly more reliable in a live demo context.

---

*Research prepared for VW Group N-tier Supplier Monitor — Graph Explorer prototype. May 2026.*

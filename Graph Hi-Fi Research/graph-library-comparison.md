# JS Graph Library Comparison — Supply Chain Knowledge Graph Explorer
**Context:** High-fidelity HTML/JS prototype for an automotive OEM supply chain graph (Volkswagen context). Visible nodes: 50–200 in prototype, up to 5,000 in production. Use case: supplier/site/part/plant/program graph with Tier 1–3 hierarchy, risk layering, and impact path tracing.

---

## Evaluation Matrix

### 1. Cytoscape.js

**Site:** [cytoscape.js.org](https://js.cytoscape.org/) | **License:** MIT | **Renderer:** Canvas (default) / SVG optional

| Criterion | Assessment |
|---|---|
| **Performance at 200+ nodes** | Excellent. Canvas renderer with built-in viewport culling. 200 nodes renders at 60fps. Handles ~1,000 nodes comfortably; beyond that, `cy.batch()` and display:none culling extend it further. |
| **Expand/collapse** | First-class support via `cytoscape-expand-collapse` extension — the only library here with a purpose-built, maintained extension for this exact interaction. Collapse by compound parent or by neighborhood. |
| **Custom node shapes** | Comprehensive: ellipse, rectangle, round-rectangle, cut-rectangle, hexagon, polygon, star, triangle. Background images (SVG icons) via `background-image`. Concentric ring for risk level via `border-color` + `border-width` styling per data attribute. |
| **Edge styling** | Full control: `line-style: solid/dashed/dotted`, `width`, `line-dash-pattern`, `line-dash-offset` (animatable for "marching ants" on alert edges). Arrow shapes: triangle, vee, circle, none. |
| **React / standalone HTML** | Both. Works as a plain `<script>` tag in standalone HTML (no build step). `react-cytoscapejs` wrapper for React. Prototype can embed directly. |
| **Focus / fade** | Trivial: `cy.elements().addClass('faded')` then `node.neighborhood().add(node).removeClass('faded')`. CSS transitions handle animation. One-liner in practice. |

**Verdict:** Checks all six boxes natively or via official extensions. Best overall fit.

---

### 2. D3-force Layout

**Site:** [d3js.org](https://d3js.org/) | **License:** ISC | **Renderer:** SVG or Canvas (custom)

| Criterion | Assessment |
|---|---|
| **Performance at 200+ nodes** | SVG renderer degrades noticeably at 300+ nodes (DOM pressure). Canvas renderer is faster but requires writing your own render loop — no abstraction. For 200 nodes: fine in SVG. For 500+: must switch to canvas manually. |
| **Expand/collapse** | No built-in support. Must manually filter the data array, rebind, and re-simulate. Each project reimplements this — significant effort and error-prone. |
| **Custom node shapes** | Unlimited — it's raw SVG. But you write every shape, icon, and label yourself. High flexibility, high implementation cost. |
| **Edge styling** | Full SVG control: `stroke-dasharray` for dashed, `stroke-width` for thickness, CSS `animation` or `requestAnimationFrame` for dash animation. Again: all possible, all manual. |
| **React / standalone HTML** | Works in both. With React, use `useEffect` + `useRef` to manage the DOM node. Substantial boilerplate. |
| **Focus / fade** | Manual `attr('opacity', ...)` per selection. Requires maintaining selection state yourself. |

**Verdict:** Maximum flexibility, maximum implementation cost. Not appropriate when the prototype delivery window is short. Best reserved as a rendering back-end if Cytoscape's defaults become a constraint.

---

### 3. React Flow

**Site:** [reactflow.dev](https://reactflow.dev/) | **License:** MIT | **Renderer:** SVG/DOM via React

| Criterion | Assessment |
|---|---|
| **Performance at 200+ nodes** | Acceptable at 200 nodes. React Flow is optimised for workflow editors and DAG builders — not arbitrary network graphs with cyclic paths. Virtualisation support added in v12, but it's still DOM-heavy per node. |
| **Expand/collapse** | No built-in graph neighborhood expand/collapse. You manage node/edge visibility via React state — straightforward for trees, awkward for arbitrary subgraphs. |
| **Custom node shapes** | Excellent — each node is a React component. Full control over markup, icons, badges. The strongest point of this library. |
| **Edge styling** | Good: `animated` prop (dashed dash-animation), `strokeWidth`, `strokeDasharray`. `EdgeLabelRenderer` for inline labels. |
| **React / standalone HTML** | **React only.** Embedding in a standalone HTML file requires bundling (Vite/webpack). Dealbreaker for a no-build-step prototype. |
| **Focus / fade** | Via React state: set `hidden` or custom `data.opacity` per node, update state. Functional but verbose. |

**Verdict:** Excellent for React applications with DAG-shaped data (pipelines, workflows). Wrong tool for a standalone HTML prototype of a cyclic supply chain graph. Set aside unless the production product is React-based and the prototype constraint is lifted.

---

### 4. vis.js Network

**Site:** [visjs.org](https://visjs.org/docs/network/) | **License:** Apache 2.0 / MIT | **Renderer:** Canvas

| Criterion | Assessment |
|---|---|
| **Performance at 200+ nodes** | Good at 200 nodes. Starts lagging at 500+ due to physics simulation overhead (stabilisation). `stabilization: false` and `physics: false` improve this for static layouts. |
| **Expand/collapse** | No built-in extension, but achievable by toggling `node.hidden = true/false` and calling `network.setData()` or `network.body.data.nodes.update()`. Works, but requires managing visibility state manually. |
| **Custom node shapes** | Limited preset shapes: box, circle, ellipse, database, diamond, hexagon, star, triangle, image, circularImage. No arbitrary SVG. Risk rings require `image` mode with pre-rendered SVG icons — workaround, not native. |
| **Edge styling** | Dashed lines: `dashes: true` or `dashes: [5, 5]`. Width: `width`. Smooth curves. Animated edges: **not natively supported** — requires manual canvas overlay hack. |
| **React / standalone HTML** | Standalone HTML is its strength — simplest of all libraries to drop in. `react-vis-graph` wrapper exists but is community-maintained. |
| **Focus / fade** | Per-node `color.opacity` or `hidden`. `network.selectNodes()` + manual opacity update loop. Not elegant. |

**Verdict:** Easiest to get started, but the ceiling is low. Edge animation is a workaround, custom shapes are constrained, and maintenance momentum has slowed. Suitable for very quick internal demos; not for a high-fidelity VW executive prototype.

---

### 5. Sigma.js + Graphology

**Sites:** [sigmajs.org](https://www.sigmajs.org/), [graphology.github.io](https://graphology.github.io/) | **License:** MIT | **Renderer:** WebGL

| Criterion | Assessment |
|---|---|
| **Performance at 200+ nodes** | Best-in-class at scale — WebGL renderer designed for 10,000+ nodes at interactive frame rates. Overkill at 200 nodes, but future-proof for the 5,000-node production target. |
| **Expand/collapse** | No built-in UI interaction. Graphology provides graph algorithms (BFS, DFS, neighbourhood) to compute which nodes to show/hide, but the show/hide logic and animation are fully custom. |
| **Custom node shapes** | `@sigma/node-image` for icon overlays. Custom node programs (WebGL shaders) are possible but require WebGL knowledge. Risk rings via custom renderer or SVG overlay — non-trivial. |
| **Edge styling** | **Significant limitation:** WebGL edges are basic — straight or curved, width and color only. Dashed lines require a custom edge program (shader). Animated edges similarly require shader code. Edge labels require `@sigma/edge-labels`. |
| **React / standalone HTML** | Works standalone. `react-sigma` package available. |
| **Focus / fade** | Camera zoom + `node.hidden` attribute or `reducers` (pre-render node/edge transform functions). Elegant in concept, but requires understanding Sigma's rendering pipeline. |

**Verdict:** The right choice for the **production 5,000-node explorer**. Not the right choice for the prototype: edge styling is architecturally constrained by WebGL, and the expand/collapse UX requires significant custom code that offers no gain at 200 nodes. Consider a migration path: Cytoscape.js for the prototype → Sigma.js for the production renderer once scale demands it.

---

### 6. elkjs

**Site:** [eclipse.dev/elk](https://eclipse.dev/elk/) | **License:** EPL 2.0 | **Type:** Layout engine only (no renderer)

> **Important:** elkjs is not a graph rendering library. It is a **layout algorithm engine** — it computes X/Y positions for nodes and routes edges, then hands those coordinates to a rendering library. It must be paired with Cytoscape.js, D3, React Flow, or similar.

| Criterion | Assessment |
|---|---|
| **Performance at 200+ nodes** | Layout computation is async (Web Worker). For 200 nodes, ELK hierarchical layout completes in <500ms. At 2,000 nodes, still usable but takes 2–5 seconds. |
| **Layout algorithms** | ELK's layered (Sugiyama), mrtree, orthogonal, box, force. **Layered is the standout for supply chain graphs** — it respects Tier 1/2/3 hierarchy and produces clean left-to-right or top-to-bottom supply path layouts that are far more readable than force simulation for hierarchical data. |
| **Integration** | `cytoscape-elk` plugin integrates directly: `cy.layout({ name: 'elk', elk: { algorithm: 'layered' } })`. This is the best of both worlds: Cytoscape's rendering + ELK's layout. |

**Recommendation:** Use elkjs **alongside Cytoscape.js** as the layout engine for the hierarchical supply path views. The combination gives you Cytoscape's styling and interaction model with ELK's superior layered layout, which makes the Tier 1→2→3 dependency chains immediately legible to a non-technical audience.

---

## Recommendation

### Use Cytoscape.js, with cytoscape-elk for layout

**Cytoscape.js** is the only library that satisfies all six criteria natively or via first-party extensions, works as a zero-build-step standalone HTML file, and has a mature ecosystem of graph-specific extensions.

**Key reasons over alternatives:**

- `cytoscape-expand-collapse` is a maintained, production-quality extension for exactly the click-to-expand neighborhood interaction required. No other library offers this without custom implementation.
- Edge animation (`line-dash-offset`) is a CSS property Cytoscape can animate natively — the "marching ants" alert path requires no canvas hacks or WebGL shaders.
- The selector-based style system (`node[risk = "high"]`) makes risk-level colour coding declarative and trivially extensible, exactly what's needed when adding new risk signal types.
- Standalone HTML embedding means the prototype can be opened directly in a browser without a build step — essential for executive demos on locked-down machines.
- The elkjs layout plugin, added in one line, gives properly layered Tier 1→2→3 hierarchy that force simulation cannot replicate cleanly.

**Migration path:** When the product moves to 5,000+ nodes, the Graphology data model (from Sigma.js's ecosystem) can replace Cytoscape's internal graph store, and Sigma's WebGL renderer can take over from Cytoscape's canvas — while keeping the same data schema and interaction logic.

---

## Minimal Working HTML Demo

The snippet below demonstrates:
- 3 supplier nodes (Murata Manufacturing, Continental AG, TDK Electronics) with HIGH / MEDIUM / LOW risk colour rings
- 1 part node (BCM Control Unit)
- 1 plant node (Wolfsburg Assembly Plant)
- Critical path edge (thick red), weak-link edge (dashed), animated alert edge (animated dashes)
- Click supplier to **expand** its production sites and **focus/fade** the graph
- Click background to **reset**
- Hover tooltips with risk detail

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Supply Chain Graph – Cytoscape.js Demo</title>
<script src="https://cdnjs.cloudflare.com/ajax/libs/cytoscape/3.29.2/cytoscape.min.js"></script>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #0d1929; font-family: 'Segoe UI', sans-serif; color: #e0e8f0; }

  #header {
    background: #001e50;
    padding: 12px 20px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  #header h1 { font-size: 14px; font-weight: 600; letter-spacing: 0.5px; }
  #header .badge {
    font-size: 11px;
    background: rgba(0,176,240,0.2);
    color: #00b0f0;
    padding: 2px 8px;
    border-radius: 3px;
  }
  #cy {
    width: 100%;
    height: calc(100vh - 48px);
    background: #0d1929;
  }
  #tooltip {
    position: fixed;
    background: #132033;
    border: 1px solid #1e3a5a;
    border-left: 3px solid #00b0f0;
    padding: 10px 14px;
    border-radius: 4px;
    font-size: 12px;
    pointer-events: none;
    display: none;
    max-width: 220px;
    z-index: 100;
  }
  #tooltip .label { font-weight: 600; color: #ffffff; margin-bottom: 4px; }
  #tooltip .meta { color: #8faac4; font-size: 11px; line-height: 1.6; }
  .risk-high { color: #e84040; }
  .risk-medium { color: #f59e0b; }
  .risk-low { color: #22c55e; }

  #legend {
    position: fixed;
    bottom: 20px;
    left: 20px;
    background: rgba(19,32,51,0.92);
    border: 1px solid #1e3a5a;
    padding: 12px 16px;
    border-radius: 6px;
    font-size: 11px;
  }
  #legend .title {
    color: #8faac4;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    font-size: 10px;
  }
  .legend-item { display: flex; align-items: center; gap: 8px; margin-bottom: 5px; }
  .dot { width: 12px; height: 12px; border-radius: 50%; border: 2.5px solid; flex-shrink: 0; }
  .dot-high   { background: rgba(232,64,64,0.2);   border-color: #e84040; }
  .dot-medium { background: rgba(245,158,11,0.2);  border-color: #f59e0b; }
  .dot-low    { background: rgba(34,197,94,0.2);   border-color: #22c55e; }
  .dot-part   { background: rgba(0,176,240,0.15);  border-color: #00b0f0; border-radius: 3px; }
  .dot-plant  { background: rgba(139,92,246,0.18); border-color: #8b5cf6; }

  #hint {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: rgba(19,32,51,0.8);
    border: 1px solid #1e3a5a;
    padding: 10px 14px;
    border-radius: 6px;
    font-size: 11px;
    color: #8faac4;
  }
</style>
</head>
<body>

<div id="header">
  <h1>N-TIER SUPPLIER MONITOR — Graph Explorer</h1>
  <span class="badge">PROTOTYPE</span>
</div>
<div id="cy"></div>
<div id="tooltip"></div>

<div id="legend">
  <div class="title">Node Type / Risk</div>
  <div class="legend-item"><div class="dot dot-high"></div> HIGH Risk Supplier</div>
  <div class="legend-item"><div class="dot dot-medium"></div> MEDIUM Risk Supplier</div>
  <div class="legend-item"><div class="dot dot-low"></div> LOW Risk Supplier</div>
  <div class="legend-item"><div class="dot dot-part"></div> Part / Assembly</div>
  <div class="legend-item"><div class="dot dot-plant"></div> OEM Plant</div>
</div>
<div id="hint">Click supplier to expand sites · Click background to reset</div>

<script>
const elements = [
  // ── Supplier nodes ────────────────────────────────────────────────────────
  {
    data: {
      id: 'murata', label: 'Murata\nManufacturing', type: 'supplier',
      tier: 'T2', risk: 'high', country: 'Japan',
      detail: 'Financial distress — covenant breach Q1 2026. SPOF for MLCC supply.',
      expanded: false
    }
  },
  {
    data: {
      id: 'continental', label: 'Continental AG', type: 'supplier',
      tier: 'T1', risk: 'medium', country: 'Germany',
      detail: 'Single-source integrator for BCM Module. No alternative qualified.',
      expanded: false
    }
  },
  {
    data: {
      id: 'tdk', label: 'TDK\nElectronics', type: 'supplier',
      tier: 'T2', risk: 'low', country: 'Japan',
      detail: 'Healthy. Dual-sourced, 8-week buffer stock. Alternative path confirmed.',
      expanded: false
    }
  },

  // ── Part node ─────────────────────────────────────────────────────────────
  {
    data: {
      id: 'bcm', label: 'BCM Control Unit\n#VW-4472', type: 'part',
      risk: 'high',
      detail: 'Body Control Module. SPOF for Golf MQB and Passat B9 platforms.'
    }
  },

  // ── Plant node ────────────────────────────────────────────────────────────
  {
    data: {
      id: 'wolfsburg', label: 'Wolfsburg\nAssembly Plant', type: 'plant',
      detail: '420,000 units/yr. Golf MQB + Passat B9 lines at risk if BCM supply interrupted.'
    }
  },

  // ── Edges ─────────────────────────────────────────────────────────────────
  // Critical SPOF path: Murata → Continental → BCM
  { data: { source: 'murata',      target: 'continental', type: 'critical', label: 'MLCC supply — SPOF' } },
  { data: { source: 'continental', target: 'bcm',         type: 'critical', label: 'sole source' } },
  // Alternative supply: TDK → BCM (dashed = weak / partial)
  { data: { source: 'tdk',         target: 'bcm',         type: 'weak',     label: 'alt. supply' } },
  // Alert edge: BCM → Plant (animated — live risk signal)
  { data: { source: 'bcm',         target: 'wolfsburg',   type: 'alert',    label: '⚠ at risk' } },

  // ── Hidden sub-nodes: revealed on Murata expand ───────────────────────────
  {
    data: {
      id: 'murata-cn', label: 'Chengdu\nSite', type: 'site',
      risk: 'high', country: 'China', parent_supplier: 'murata',
      detail: 'Primary MLCC fab. Geopolitical risk: export control exposure.'
    },
    classes: 'hidden'
  },
  {
    data: {
      id: 'murata-jp', label: 'Kyoto\nSite', type: 'site',
      risk: 'medium', country: 'Japan', parent_supplier: 'murata',
      detail: 'Secondary fab. 30% capacity vs. Chengdu. Could partially absorb.'
    },
    classes: 'hidden'
  },
  { data: { source: 'murata', target: 'murata-cn', type: 'internal' }, classes: 'hidden' },
  { data: { source: 'murata', target: 'murata-jp', type: 'internal' }, classes: 'hidden' }
];

// ── Risk colour maps ───────────────────────────────────────────────────────
const riskBorder = { high: '#e84040', medium: '#f59e0b', low: '#22c55e' };
const riskFill   = {
  high:   'rgba(232,64,64,0.15)',
  medium: 'rgba(245,158,11,0.12)',
  low:    'rgba(34,197,94,0.12)'
};

// ── Cytoscape init ─────────────────────────────────────────────────────────
const cy = cytoscape({
  container: document.getElementById('cy'),
  elements,
  layout: {
    name: 'breadthfirst',
    directed: true,
    padding: 80,
    spacingFactor: 1.8,
    avoidOverlap: true,
    fit: true
  },
  style: [
    // Default node
    {
      selector: 'node',
      style: {
        'label': 'data(label)',
        'text-valign': 'center',
        'text-halign': 'center',
        'text-wrap': 'wrap',
        'text-max-width': '90px',
        'font-size': '10px',
        'font-family': '"Segoe UI", sans-serif',
        'color': '#e0e8f0',
        'text-outline-color': '#0d1929',
        'text-outline-width': '2px',
        'width': '72px',
        'height': '72px',
        'border-width': '3px',
        'transition-property': 'opacity, border-width, width, height',
        'transition-duration': '220ms'
      }
    },
    // Supplier: circle with risk ring
    {
      selector: 'node[type = "supplier"]',
      style: {
        'shape': 'ellipse',
        'background-color': ele => riskFill[ele.data('risk')] || '#132033',
        'border-color':     ele => riskBorder[ele.data('risk')] || '#4a6fa5',
        'width': '80px',
        'height': '80px'
      }
    },
    // Part: rounded rectangle, teal accent
    {
      selector: 'node[type = "part"]',
      style: {
        'shape': 'round-rectangle',
        'background-color': 'rgba(0,176,240,0.15)',
        'border-color': '#00b0f0',
        'border-width': '2.5px',
        'width': '96px',
        'height': '58px',
        'font-size': '9.5px'
      }
    },
    // Plant: hexagon, purple accent
    {
      selector: 'node[type = "plant"]',
      style: {
        'shape': 'hexagon',
        'background-color': 'rgba(139,92,246,0.18)',
        'border-color': '#8b5cf6',
        'border-width': '2.5px',
        'width': '88px',
        'height': '88px'
      }
    },
    // Site sub-nodes
    {
      selector: 'node[type = "site"]',
      style: {
        'shape': 'round-rectangle',
        'background-color': ele => riskFill[ele.data('risk')] || '#132033',
        'border-color':     ele => riskBorder[ele.data('risk')] || '#4a6fa5',
        'border-width': '2px',
        'width': '68px',
        'height': '52px',
        'font-size': '9px'
      }
    },
    { selector: '.hidden',      style: { 'display': 'none' } },
    { selector: '.faded',       style: { 'opacity': 0.12 } },
    { selector: '.highlighted', style: { 'opacity': 1 } },
    {
      selector: 'node.selected',
      style: { 'border-width': '5px', 'width': '90px', 'height': '90px' }
    },

    // ── Edges ──────────────────────────────────────────────────────────────
    {
      selector: 'edge',
      style: {
        'width': 1.5,
        'line-color': '#2a4060',
        'target-arrow-color': '#2a4060',
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier',
        'arrow-scale': 0.9,
        'label': 'data(label)',
        'font-size': '9px',
        'color': '#4a6080',
        'text-background-color': '#0d1929',
        'text-background-opacity': 0.85,
        'text-background-padding': '2px',
        'transition-property': 'opacity',
        'transition-duration': '220ms'
      }
    },
    // Critical path — thick red
    {
      selector: 'edge[type = "critical"]',
      style: {
        'width': 3.5,
        'line-color': '#e84040',
        'target-arrow-color': '#e84040',
        'color': '#e84040',
        'line-style': 'solid'
      }
    },
    // Weak / alternative — dashed blue
    {
      selector: 'edge[type = "weak"]',
      style: {
        'width': 1.5,
        'line-color': '#4a6fa5',
        'target-arrow-color': '#4a6fa5',
        'color': '#4a6fa5',
        'line-style': 'dashed',
        'line-dash-pattern': [8, 5]
      }
    },
    // Alert — animated amber dashes
    {
      selector: 'edge[type = "alert"]',
      style: {
        'width': 3,
        'line-color': '#f59e0b',
        'target-arrow-color': '#f59e0b',
        'color': '#f59e0b',
        'line-style': 'dashed',
        'line-dash-pattern': [10, 4],
        'line-dash-offset': 0
      }
    },
    // Internal (site) edges
    {
      selector: 'edge[type = "internal"]',
      style: {
        'width': 1,
        'line-color': '#2a4060',
        'target-arrow-color': '#2a4060',
        'line-style': 'dotted'
      }
    }
  ]
});

// ── Animate alert edge ─────────────────────────────────────────────────────
let dashOffset = 0;
setInterval(() => {
  dashOffset = (dashOffset - 1) % 28;
  cy.$('edge[type = "alert"]').style('line-dash-offset', dashOffset);
}, 40);

// ── Tooltip ────────────────────────────────────────────────────────────────
const tooltip = document.getElementById('tooltip');

cy.on('mouseover', 'node', evt => {
  const d = evt.target.data();
  const riskLabel = d.risk ? d.risk.toUpperCase() : null;
  tooltip.innerHTML = `
    <div class="label">${d.label.replace(/\n/g, ' ')}</div>
    <div class="meta">
      ${d.tier    ? `Tier: <strong>${d.tier}</strong><br>` : ''}
      ${d.country ? `Country: <strong>${d.country}</strong><br>` : ''}
      ${riskLabel ? `Risk: <strong class="risk-${d.risk}">${riskLabel}</strong><br>` : ''}
      ${d.detail  ? `<span style="color:#c0cfe0">${d.detail}</span>` : ''}
    </div>`;
  tooltip.style.display = 'block';
});
cy.on('mousemove', evt => {
  tooltip.style.left = (evt.originalEvent.clientX + 14) + 'px';
  tooltip.style.top  = (evt.originalEvent.clientY - 10) + 'px';
});
cy.on('mouseout', 'node', () => { tooltip.style.display = 'none'; });

// ── Focus + expand interaction ─────────────────────────────────────────────
let focusedNode = null;

cy.on('tap', 'node', evt => {
  const node = evt.target;

  // Second tap on same node → collapse + reset
  if (focusedNode && focusedNode.id() === node.id()) {
    if (node.data('type') === 'supplier' && node.data('expanded')) {
      collapseSupplier(node);
    }
    resetFocus();
    return;
  }

  focusedNode = node;

  // Fade everything, then highlight neighborhood
  cy.elements().addClass('faded').removeClass('highlighted selected');
  node.neighborhood().add(node).removeClass('faded').addClass('highlighted');
  node.addClass('selected');

  // Expand sites for supplier nodes on first click
  if (node.data('type') === 'supplier' && !node.data('expanded')) {
    expandSupplier(node);
  }
});

cy.on('tap', evt => {
  if (evt.target === cy) resetFocus();
});

function expandSupplier(node) {
  const id = node.id();
  cy.$(`node[parent_supplier = "${id}"]`).removeClass('hidden');
  cy.$(`node[parent_supplier = "${id}"]`).connectedEdges().removeClass('hidden');
  node.data('expanded', true);
  reLayout();
}

function collapseSupplier(node) {
  const id = node.id();
  cy.$(`node[parent_supplier = "${id}"]`).addClass('hidden');
  cy.$(`node[parent_supplier = "${id}"]`).connectedEdges().addClass('hidden');
  node.data('expanded', false);
  reLayout();
}

function reLayout() {
  cy.layout({
    name: 'breadthfirst', directed: true,
    padding: 80, spacingFactor: 1.8,
    fit: false, animate: true, animationDuration: 400
  }).run();
}

function resetFocus() {
  focusedNode = null;
  cy.elements().removeClass('faded highlighted selected');
}
</script>
</body>
</html>
```

---

## Quick Decision Reference

| Library | Standalone HTML | Expand/Collapse | Edge Animation | Custom Shapes | 200-node perf | Verdict |
|---|---|---|---|---|---|---|
| **Cytoscape.js** | ✅ | ✅ (extension) | ✅ native | ✅ | ✅ | **Use this** |
| D3-force | ✅ | ❌ manual | ✅ manual | ✅ (SVG) | ⚠ SVG lags | Too much custom code |
| React Flow | ❌ build req. | ❌ manual | ✅ | ✅ (React) | ✅ | React prod only |
| vis.js Network | ✅ | ⚠ manual | ❌ workaround | ⚠ limited | ✅ | Low ceiling |
| Sigma.js | ✅ | ❌ manual | ❌ WebGL shader | ⚠ complex | ✅ (overkill) | Production renderer |
| elkjs | n/a (layout only) | n/a | n/a | n/a | n/a | Use with Cytoscape |

**Prototype:** Cytoscape.js + cytoscape-elk for layout.
**Production (5,000+ nodes):** Consider migrating to Sigma.js + Graphology as the renderer, keeping the same data model.

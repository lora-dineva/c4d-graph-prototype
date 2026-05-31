# Graph Explorer — Toolbar & Controls UI Design
## N-tier Supplier Monitor · Graph Explorer Module

**Scope:** Floating/overlay controls for a full-screen graph canvas with a right-side panel.  
**Palette:** Dark canvas `#0d1929` · VW Navy `#001e50` · Teal accent `#00b0f0` · Surface `#f4f6f9` · Text on dark `#e8ecf0`  
**Design principle:** Every control is a glass-morphism overlay — semi-transparent, dark-tinted — so the graph is always the primary element. Controls recede when idle; they do not compete.

---

## Layout Overview

```
┌─────────────────────────────────────────────────────────────┬──────────────┐
│  [TOP TOOLBAR — full-width, 48px, pinned top]               │              │
├─────────────────────────────────────────────────────────────┤  Right       │
│                                                             │  Panel       │
│                                                             │  (existing)  │
│                   GRAPH CANVAS                              │              │
│                                                             │              │
│                          [LEGEND — top-right corner]        │              │
│                                                             │              │
│  [ZOOM CONTROLS]                                            │              │
│  [MINIMAP]                                                  │              │
└─────────────────────────────────────────────────────────────┴──────────────┘
                      [NODE ACTIONS — float near selected node]
```

**Z-index stack:**
- Canvas: `z-index: 0`
- Minimap + Zoom: `z-index: 100`
- Legend: `z-index: 100`
- Top toolbar: `z-index: 200`
- Node action bubble: `z-index: 300` (must clear everything)

---

## 1. Top Toolbar

### Placement
Fixed strip at `top: 0`, `left: 0`, spanning full canvas width (stopping at the right panel edge). Height: **48px**. Does not scroll with the graph. Uses the VW navy `#001e50` as its background — this distinguishes the chrome from the dark canvas below without adding a second "floating" surface.

### Visual treatment
```css
.graph-toolbar {
  position: fixed;
  top: 0;
  left: 0;
  right: var(--panel-width, 380px);  /* respects side panel */
  height: 48px;
  background: #001e50;
  border-bottom: 1px solid rgba(0, 176, 240, 0.25);
  display: flex;
  align-items: center;
  gap: 0;
  padding: 0 16px;
  z-index: 200;
  font-family: 'VW Text', 'Inter', sans-serif;
}
```

### Sections (left → right)

#### 1a. Breadcrumb / Graph Title
Left-anchored. Shows the current view context. Clicking any crumb segment navigates up.

```
Supplier Network  ›  Golf MQB Program  ›  Impact View
```

```css
.toolbar-breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: rgba(232, 236, 240, 0.55);
  white-space: nowrap;
  flex-shrink: 0;
}

.toolbar-breadcrumb .crumb-current {
  color: #e8ecf0;
  font-weight: 600;
  font-size: 13px;
}

.toolbar-breadcrumb .crumb-sep {
  color: rgba(0, 176, 240, 0.45);
  font-size: 10px;
}

.toolbar-breadcrumb .crumb-link {
  cursor: pointer;
  transition: color 0.15s;
}

.toolbar-breadcrumb .crumb-link:hover {
  color: #00b0f0;
}
```

**Interaction:** On hover over an ancestor crumb, show a small popover with the sub-items at that level (breadcrumb as nav tree). The current segment is always white + bold; ancestors are dimmed.

---

#### 1b. Search Box
Centered (use `flex: 1; max-width: 320px; margin: 0 auto`). Triggered by clicking or `Cmd+K`.

```css
.toolbar-search {
  flex: 1;
  max-width: 320px;
  margin: 0 24px;
  position: relative;
}

.toolbar-search input {
  width: 100%;
  height: 32px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(0, 176, 240, 0.3);
  border-radius: 6px;
  color: #e8ecf0;
  font-size: 13px;
  padding: 0 12px 0 34px;
  outline: none;
  transition: border-color 0.2s, background 0.2s;
}

.toolbar-search input::placeholder {
  color: rgba(232, 236, 240, 0.35);
}

.toolbar-search input:focus {
  border-color: #00b0f0;
  background: rgba(0, 176, 240, 0.08);
}

.toolbar-search .search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(232, 236, 240, 0.45);
  width: 14px;
  height: 14px;
}

.search-kbd-hint {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 10px;
  color: rgba(232, 236, 240, 0.3);
  background: rgba(255,255,255,0.06);
  padding: 1px 5px;
  border-radius: 3px;
  border: 1px solid rgba(255,255,255,0.1);
}
```

**Typeahead dropdown** appears below (glass surface, `#0d1929` + border `#00b0f0`). Results are grouped:

```
┌─────────────────────────────────────────────┐
│ SUPPLIERS                                   │
│  ● Murata Manufacturing Co.   [Tier 2]  🔴  │
│  ● Murata Electronics Europe  [Tier 1]  🟡  │
│ PARTS                                       │
│  ● MUR-MLCC-001  Capacitor Array    [C3456]  │
│ PROGRAMS                                    │
│  ● Golf MQB    VW Wolfsburg                  │
└─────────────────────────────────────────────┘
```

Keyboard: `↑/↓` to navigate, `Enter` to focus in graph, `Esc` to dismiss.

---

#### 1c. Layout Switcher
A segmented control, right of center. Three mutually exclusive options.

```css
.layout-switcher {
  display: flex;
  height: 30px;
  border: 1px solid rgba(0, 176, 240, 0.3);
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
}

.layout-btn {
  padding: 0 12px;
  font-size: 11px;
  font-weight: 500;
  color: rgba(232, 236, 240, 0.55);
  background: transparent;
  border: none;
  border-right: 1px solid rgba(0, 176, 240, 0.2);
  cursor: pointer;
  letter-spacing: 0.3px;
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;
}

.layout-btn:last-child {
  border-right: none;
}

.layout-btn:hover {
  color: #e8ecf0;
  background: rgba(0, 176, 240, 0.1);
}

.layout-btn.active {
  background: #00b0f0;
  color: #001e50;
  font-weight: 700;
}
```

Labels: **Hierarchy** (top-down tier structure) · **Force** (physics-based clusters) · **Geographic** (supplier sites on a lat/long-approximated canvas)

**Interaction:** Switching layout triggers an animated re-layout of the graph. During transition, show a brief teal spinner overlay on the canvas. The active button snaps to teal fill with navy text — clear state at a glance.

---

#### 1d. Layer Toggles ("Show layer")
To the right of the layout switcher. Three pill toggles — not checkboxes, not a dropdown. Each is independently on/off and has a colour indicator matching the layer's visual treatment.

```css
.layer-toggles {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.layer-toggle {
  display: flex;
  align-items: center;
  gap: 5px;
  height: 28px;
  padding: 0 10px;
  border-radius: 14px;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.15s;
  white-space: nowrap;
}

/* OFF state */
.layer-toggle {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.12);
  color: rgba(232, 236, 240, 0.45);
}

/* ON state — each has a distinct accent */
.layer-toggle.active[data-layer="supply"] {
  background: rgba(0, 176, 240, 0.15);
  border-color: #00b0f0;
  color: #00b0f0;
}

.layer-toggle.active[data-layer="ownership"] {
  background: rgba(255, 183, 0, 0.15);
  border-color: #ffb700;
  color: #ffb700;
}

.layer-toggle.active[data-layer="risk"] {
  background: rgba(220, 53, 69, 0.15);
  border-color: #e84057;
  color: #e84057;
}

.layer-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}
```

Layers:
- **Supply Chain** — teal `#00b0f0`, shows all supplier → part → assembly → plant connections
- **Ownership** — amber `#ffb700`, overlays corporate parent/subsidiary relationships
- **Risk Paths** — red `#e84057`, highlights only the affected dependency chains

**Interaction:** Toggling a layer fades affected elements in/out with a 200ms opacity transition. Multiple layers can be on simultaneously — risk paths layer always renders on top of supply chain layer regardless of toggle order.

---

#### 1e. Export / Share Button
Right-anchored. Icon-only by default, expands to labeled on hover.

```css
.toolbar-actions {
  display: flex;
  gap: 8px;
  margin-left: auto;
  flex-shrink: 0;
}

.toolbar-btn-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: transparent;
  border: 1px solid rgba(0, 176, 240, 0.25);
  color: rgba(232, 236, 240, 0.65);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.toolbar-btn-icon:hover {
  background: rgba(0, 176, 240, 0.12);
  border-color: #00b0f0;
  color: #e8ecf0;
}

.toolbar-btn-primary {
  height: 32px;
  padding: 0 14px;
  border-radius: 6px;
  background: rgba(0, 176, 240, 0.15);
  border: 1px solid #00b0f0;
  color: #00b0f0;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.15s;
  letter-spacing: 0.2px;
}

.toolbar-btn-primary:hover {
  background: #00b0f0;
  color: #001e50;
}
```

Export dropdown (on click):
```
┌──────────────────────┐
│  Export as PNG        │
│  Export as SVG        │
│  Export as PDF report │
│  ─────────────────── │
│  Copy share link      │
│  Present mode         │
└──────────────────────┘
```

---

## 2. Bottom-Left Graph Controls

### Placement
Fixed at `bottom: 24px; left: 24px`. Stacked vertically: zoom cluster on top, minimap below. Both use the same glass surface treatment so they read as a unified control panel. They sit entirely within the canvas area (never overlap the right panel).

### 2a. Zoom Controls

```css
.zoom-controls {
  position: fixed;
  bottom: 200px;  /* sits above minimap */
  left: 24px;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(0, 176, 240, 0.2);
  background: rgba(13, 25, 41, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  z-index: 100;
}

.zoom-btn {
  width: 36px;
  height: 36px;
  background: transparent;
  border: none;
  color: rgba(232, 236, 240, 0.7);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 300;
  transition: background 0.15s, color 0.15s;
  border-bottom: 1px solid rgba(0, 176, 240, 0.1);
}

.zoom-btn:last-child {
  border-bottom: none;
}

.zoom-btn:hover {
  background: rgba(0, 176, 240, 0.15);
  color: #00b0f0;
}

.zoom-level {
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: rgba(232, 236, 240, 0.35);
  text-align: center;
  padding: 4px 0;
  border-bottom: 1px solid rgba(0, 176, 240, 0.1);
  cursor: default;
  user-select: none;
}
```

Buttons (top to bottom):
1. **+** — zoom in (step: ×1.2)
2. **100%** — current zoom level label (click to reset to 100%)
3. **−** — zoom out
4. **⊡** — fit all to screen (best-fit the full graph)

The fit-to-screen button uses a custom SVG icon: a rounded rectangle with outward-pointing corner arrows. Tooltip on hover: "Fit all to screen (F)".

**Keyboard shortcuts:** `+/-` zoom, `F` fit, `0` reset to 100%. Show as tooltip hints.

---

### 2b. Minimap

```css
.minimap {
  position: fixed;
  bottom: 24px;
  left: 24px;
  width: 160px;
  height: 120px;
  border-radius: 8px;
  background: rgba(13, 25, 41, 0.88);
  border: 1px solid rgba(0, 176, 240, 0.22);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  overflow: hidden;
  z-index: 100;
  cursor: crosshair;
}

/* Viewport indicator — the box showing what's visible in the main canvas */
.minimap-viewport {
  position: absolute;
  border: 1.5px solid #00b0f0;
  background: rgba(0, 176, 240, 0.08);
  border-radius: 2px;
  pointer-events: none;
  /* dimensions and position driven by JS */
}

.minimap-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 18px;
  background: rgba(0, 30, 80, 0.6);
  display: flex;
  align-items: center;
  padding: 0 6px;
  gap: 4px;
}

.minimap-title {
  font-size: 9px;
  font-weight: 600;
  color: rgba(232, 236, 240, 0.4);
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.minimap-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #00b0f0;
  opacity: 0.6;
}
```

**Graph representation inside minimap:**
- Supplier nodes: tiny dots, colour-coded by risk level (green/amber/red)
- Critical path (impact trace): thin teal line connecting dots
- SPOF nodes: pulsing red dot
- The viewport rectangle (`minimap-viewport`) shows exactly what's visible in the main canvas
- Clicking anywhere on the minimap pans the main canvas to centre on that point
- Dragging the viewport rectangle pans smoothly

**Collapse behaviour:** A small `«` chevron at the top-right of the minimap collapses it to just the header strip (18px) when screen space is tight. State persists across sessions via localStorage.

---

## 3. Top-Right Legend

### Placement
Fixed at `top: 64px; right: calc(var(--panel-width, 380px) + 16px)`. This positions it floating above the canvas, just below the top toolbar, pinned to the left edge of the right panel. It does not interfere with the minimap or zoom controls.

### Visual treatment
Glass panel, collapsible. Default state: **expanded**. When collapsed, shows a single icon button with a coloured dot count badge (number of active risk levels in view).

```css
.legend-panel {
  position: fixed;
  top: 64px;
  right: calc(var(--panel-width, 380px) + 16px);
  width: 200px;
  border-radius: 8px;
  background: rgba(13, 25, 41, 0.88);
  border: 1px solid rgba(0, 176, 240, 0.2);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  z-index: 100;
  overflow: hidden;
  transition: height 0.2s ease;
}

.legend-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-bottom: 1px solid rgba(0, 176, 240, 0.12);
  cursor: pointer;
}

.legend-title {
  font-size: 10px;
  font-weight: 700;
  color: rgba(232, 236, 240, 0.5);
  letter-spacing: 0.8px;
  text-transform: uppercase;
}

.legend-toggle-btn {
  background: none;
  border: none;
  color: rgba(232, 236, 240, 0.4);
  cursor: pointer;
  font-size: 12px;
  padding: 0;
  line-height: 1;
  transition: color 0.15s;
}

.legend-toggle-btn:hover {
  color: #00b0f0;
}

.legend-section {
  padding: 8px 12px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}

.legend-section-label {
  font-size: 9px;
  font-weight: 700;
  color: rgba(232, 236, 240, 0.3);
  letter-spacing: 0.8px;
  text-transform: uppercase;
  margin-bottom: 6px;
}

.legend-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 5px;
  font-size: 11px;
  color: rgba(232, 236, 240, 0.75);
}

.legend-row:last-child {
  margin-bottom: 0;
}
```

### Content

**Section 1: Entity Types**

| Shape/Colour | Icon | Label |
|---|---|---|
| Circle, teal `#00b0f0` | ○ | Tier-1 Supplier |
| Circle, mid-blue `#0066cc` | ○ | Tier-2 Supplier |
| Circle, slate `#4a6180` | ○ | Tier-3 Supplier |
| Diamond, white | ◇ | OEM Plant |
| Rounded rect, grey | ▭ | Assembly / Part |
| Hexagon, amber | ⬡ | Holding / Owner entity |

Node shapes are rendered inline as small SVGs (14×14px) inside the legend row — not emoji, not Unicode approximations.

**Section 2: Risk Level**

Each row includes a coloured pill + label:

```css
.risk-pill {
  width: 24px;
  height: 8px;
  border-radius: 4px;
  flex-shrink: 0;
}
```

| Pill colour | Label |
|---|---|
| `#e84057` — Critical | Supplier under stress / insolvency risk |
| `#f77f00` — High | Geopolitical exposure / single source |
| `#f7c325` — Medium | Financial watch / limited alternatives |
| `#3ecf8e` — Low | Healthy, dual-sourced |
| `#4a6180` — No data | Not assessed |

**Section 3: Path indicators**

| Line style | Meaning |
|---|---|
| Solid teal `#00b0f0` | Active supply path |
| Dashed red `#e84057` | Disrupted / at-risk path |
| Dotted amber `#ffb700` | Ownership link |
| Solid white `rgba(255,255,255,0.2)` | Inactive / background path |

Lines are rendered as small SVG stripes (40×6px) in the legend.

---

## 4. Contextual Node Action Bubble

### Placement
This overlay **appears near the selected node**, not in a fixed corner. It floats above the node with a 16px offset, centred horizontally on the node. It follows the node if the graph is panned while a node is selected.

```css
.node-actions {
  position: absolute;         /* positioned by JS relative to canvas */
  transform: translateX(-50%);
  display: flex;
  gap: 4px;
  padding: 5px 6px;
  background: rgba(0, 30, 80, 0.92);
  border: 1px solid rgba(0, 176, 240, 0.4);
  border-radius: 10px;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  z-index: 300;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(0, 176, 240, 0.1);

  /* Animate in */
  animation: nodeActionsIn 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes nodeActionsIn {
  from { opacity: 0; transform: translateX(-50%) translateY(6px) scale(0.92); }
  to   { opacity: 1; transform: translateX(-50%) translateY(0)    scale(1);    }
}

/* Small caret pointing down toward the node */
.node-actions::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 8px;
  background: rgba(0, 30, 80, 0.92);
  border-right: 1px solid rgba(0, 176, 240, 0.4);
  border-bottom: 1px solid rgba(0, 176, 240, 0.4);
  transform: translateX(-50%) rotate(45deg);
}

.node-action-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  height: 30px;
  padding: 0 10px;
  border-radius: 6px;
  background: transparent;
  border: none;
  color: rgba(232, 236, 240, 0.8);
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.12s, color 0.12s;
}

.node-action-btn:hover {
  background: rgba(0, 176, 240, 0.15);
  color: #e8ecf0;
}

/* Primary action gets teal highlight */
.node-action-btn.primary {
  color: #00b0f0;
  font-weight: 600;
}

.node-action-btn.primary:hover {
  background: rgba(0, 176, 240, 0.2);
}

/* Danger action (hide) */
.node-action-btn.danger:hover {
  background: rgba(232, 64, 87, 0.15);
  color: #e84057;
}

/* Separator */
.node-action-sep {
  width: 1px;
  height: 18px;
  background: rgba(0, 176, 240, 0.2);
  margin: 0 2px;
  align-self: center;
}
```

### Actions

```
┌──────────────────────────────────────────────────────────────┐
│  ⟳ Expand connections  │  ↗ Trace impact  │  👁 Hide  │  📌 Pin  │
└──────────────────────────────────────────────────────────────┘
                                ↓  (caret pointing at node)
                        [selected node]
```

| Button | Icon | Class | Behaviour |
|---|---|---|---|
| **Expand connections** | `⊕` / network icon | `primary` | Loads and reveals all direct connections of this supplier that are currently collapsed. If a Tier-2 node is selected and its Tier-3 dependencies are hidden, this surfaces them. |
| **Trace impact path** | `↗` / path icon | `primary` | Runs the Impact Path Tracing algorithm from this node outward. Highlights the full downstream chain to plants/programs. Activates the Risk Paths layer automatically. Opens the Impact Summary panel on the right. |
| **Hide** | `👁` strikethrough | `danger` | Removes this node from the current view (temporary, not a deletion). A "restore hidden" count appears in the bottom-right corner (`3 hidden`). |
| **Pin here** | `📌` | default | Locks the node to its current canvas position so it doesn't move during force-layout re-renders. The node gains a small pin indicator in its top-right corner. |

### Positioning logic (JavaScript note)
```javascript
function positionNodeActions(nodeScreenPos, nodeRadius) {
  const bubble = document.querySelector('.node-actions');
  const OFFSET = 12; // px above the node top
  bubble.style.left = `${nodeScreenPos.x}px`;
  bubble.style.top  = `${nodeScreenPos.y - nodeRadius - bubble.offsetHeight - OFFSET}px`;
}
```

Clamp: if the bubble would render above the toolbar (y < 64px), flip it below the node instead and invert the caret direction.

### Dismissal
- Click elsewhere on canvas: dismiss with `opacity: 0` fade (100ms)
- Press `Esc`: dismiss
- Select a different node: replace with new bubble for new node

---

## Interaction States Summary

| State | Visual signal |
|---|---|
| Node hovered | 1px teal halo `box-shadow: 0 0 0 2px #00b0f0` |
| Node selected | Solid 2px teal ring + node action bubble appears |
| Node is SPOF | Pulsing red outer ring `animation: spof-pulse 2s infinite` |
| Path highlighted | All non-highlighted connections drop to 10% opacity |
| Layout transition | 200ms ease — nodes slide to new positions, edges morph |
| Layer toggled off | Elements fade to `opacity: 0` over 200ms |
| Search active | Non-matching nodes dim to 15% opacity, matching nodes get teal halo |

---

## Typography

All overlay controls use:
- `font-family: 'VW Text', 'Inter', -apple-system, sans-serif`
- Label sizes: 9px (section headers, uppercase+tracked) · 11px (button labels) · 12px (primary actions) · 13px (toolbar breadcrumb current)
- Never go below 9px — at 48" screen distances in an executive demo, legibility matters

---

## Accessibility notes for the prototype

- All icon-only buttons carry `aria-label` and `title` for tooltip fallback
- Focus ring: `outline: 2px solid #00b0f0; outline-offset: 2px`
- Keyboard shortcuts listed in tooltip: `Cmd+K` (search), `F` (fit), `Esc` (deselect)
- Minimap can be hidden via keyboard for users who find it distracting

---

*Document scope: Graph Explorer module only. Other modules (Alert Cockpit, Supplier 360, Action Workspace) reference these control patterns but are not built in this prototype.*

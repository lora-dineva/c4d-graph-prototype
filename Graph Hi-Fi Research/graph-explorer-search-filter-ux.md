# Graph Explorer — Search & Filter UX Design
## N-tier Supplier Monitor · Volkswagen Group Prototype

> **Audience:** Supply chain managers, purchasing managers, quality engineers at VW Group  
> **Scale:** 500–5,000 entities  
> **Context:** Dark canvas graph explorer (#0d1929), VW brand palette

---

## 1. Search Bar Behaviour

### Placement & Layout

The search bar sits in the **top-left corner of the graph canvas**, always visible — not tucked inside a collapsible panel. Width: `320px`, expanding to `480px` on focus. It overlays the graph as a floating element with a subtle drop shadow, keeping the canvas unobstructed.

```
┌─────────────────────────────────────────────────────────────────┐
│  [🔍 Search suppliers, parts, plants...           ] [×] [≡ 4▾] │
│   ↑ search bar (floating, top-left)                  ↑ filters  │
└─────────────────────────────────────────────────────────────────┘
```

### Interaction Flow

1. **Keystroke → 200ms debounce** → dropdown populates with live matches.
2. **Dropdown anatomy** (max 8 results, scrollable):

```
┌──────────────────────────────────────────────────────┐
│ 🔍 Bosch                                         [×] │
├──────────────────────────────────────────────────────┤
│ 🏭  Bosch GmbH                    T1  DE  ● HIGH     │
│ 🔩  Bosch Sensortec GmbH          T2  DE  ● MED      │
│ ⚙️  Robert Bosch Automotive Elec. T2  DE  ● CRIT     │
│ 📦  ESP Module (Bosch)            Part    ─           │
│                         +2 more results…             │
└──────────────────────────────────────────────────────┘
```

Each result shows: entity-type icon · name (match text **bolded**) · tier badge · country · risk pill.

3. **On selection or Enter (selects top result):**

   - **Fade animation (350ms ease-out):** All non-matching entities drop to `opacity: 0.1` and `filter: saturate(0)`. This "ghosting" effect preserves spatial context while focusing attention.
   - **Highlight pulse (600ms):** Matching entities receive a teal glow — a two-stage keyframe animation: scale from 1× to 1.08× then back to 1×, with `box-shadow` (Cytoscape: `border-color: #00b0f0`, `border-width: 3px`). Repeats once.
   - **Camera transition (400ms cubic-bezier ease-in-out):** Graph pans and zooms to fit all matching entities within a 80px padding boundary. If only one match, zooms to ~60% of full scale centred on it. Animation uses Cytoscape's `animate()` with `easing: 'ease-in-out-cubic'`.
   - **Result count pill** appears below the search bar: `"3 matches found"` in teal.

4. **Multi-match behaviour:** If "Bosch" matches 3 entities across different tiers, all 3 are highlighted simultaneously and the camera fits the bounding box of all three.

5. **Fuzzy matching:** "Murtaa" → suggests "Murata Manufacturing Co." with a `Did you mean?` inline hint.

6. **Escape / Clear (×):** Reverses the fade in 350ms ease-in, camera returns to the previous view state (stored in memory before the search was applied).

### Keyboard shortcuts

| Key | Action |
|-----|--------|
| `/` (from graph) | Focus search bar |
| `↑` / `↓` | Navigate dropdown |
| `Enter` | Select top result |
| `Esc` | Clear search / close dropdown |
| `Alt+←` | Navigate history back |

---

## 2. Filter Panel Design

### Layout Decision: Collapsible Side Panel (Right)

**Why a side panel, not a toolbar:**

- Automotive supply chain requires 8–12 filter dimensions simultaneously — a toolbar collapses to nested dropdowns that obscure the graph during configuration.
- Users at a purchasing VP demo will want to _set up a scenario_ (e.g., "show me everything Taiwan-based, Tier-2, critical risk, touching Golf MQB") and then _inspect the result_ — these are two distinct modes that benefit from a persistent panel.
- A right-side panel is the established pattern in enterprise tools (SAP Fiori, Celonis) this audience already knows.

**Panel dimensions:** `280px` wide, full canvas height, collapsible to `0` via a `▶` toggle tab. When collapsed, a tab on the right edge shows the active filter count badge.

### Panel Structure

```
┌─────────────────────────────────────────────┐
│  FILTERS                          [✕ Clear] │
│  ─────────────────────────────────────────  │
│  ▾ Supply Chain Position                    │
│    Tier Level:  [T1] [T2] [T3]              │
│    Entity Type: [Supplier▾] multi-select    │
│                                             │
│  ▾ Risk Profile                             │
│    Type:   ☐ Financial  ☐ Geopolitical      │
│            ☐ Operational  ☐ Quality         │
│            ☐ Regulatory (LkSG)              │
│    Level:  ●CRITICAL  ○HIGH  ○MED  ○LOW     │
│                                             │
│  ▾ Geography                                │
│    Region: [APAC▾]  [EMEA▾]  [AMER▾]       │
│    Country: [🔍 Search countries…]          │
│             ☑ Taiwan  ☑ China  ☐ Japan      │
│             ☐ Germany  ☐ USA  ☐ India       │
│                                             │
│  ▾ Program & Plant                          │
│    Vehicle Program: [🔍 Golf, Tiguan…]      │
│    OEM Plant:       [🔍 Wolfsburg…]         │
│                                             │
│  ▾ Commodity Group                          │
│    [Semiconductors ×]  [Sensors ×]          │
│    [Displays]  [Battery Cells]              │
│    [Wiring Harness]  [Structural]           │
│                                             │
│  ─────────────────────────────────────────  │
│  VISIBILITY LAYERS                          │
│    Ownership chains         [●───]  ON      │
│    Financial risk paths only [──○]  OFF     │
│    Tier-3 connections       [●───]  ON      │
│    Alternative supply paths  [──○]  OFF     │
│    LkSG regulatory flags    [●───]  ON      │
└─────────────────────────────────────────────┘
```

### Filter Dimensions in Priority Order

| # | Filter | Type | Notes |
|---|--------|------|-------|
| 1 | **Tier level** | Multi-toggle (T1/T2/T3) | Most-used; always visible |
| 2 | **Risk level** | Radio pills (Critical/High/Med/Low) | Drives alert scenarios |
| 3 | **Risk type** | Multi-checkbox | Financial + Geopolitical are priority types |
| 4 | **Country** | Searchable multi-select | Critical for geopolitical scenarios |
| 5 | **Vehicle program** | Searchable multi-select | Core OEM use case |
| 6 | **OEM Plant connection** | Searchable multi-select | "What touches Wolfsburg?" |
| 7 | **Commodity group** | Chip multi-select | Semiconductors scenario |
| 8 | **Certification / LkSG status** | Toggle | Regulatory compliance view |
| 9 | **Entity type** | Multi-checkbox | Supplier / Site / Part / Assembly |
| 10 | **SPOF flag** | Toggle | Single-point-of-failure only |

### Visibility Layers (separate from filters)

Visibility layers are **additive overlays**, not restrictive filters — they _reveal_ additional relationship types drawn on the graph without hiding existing entities. Implemented as toggles, visually separated from filters with a divider.

- **Ownership chains** — draws corporate parent/subsidiary lines (different edge style, dashed)
- **Financial risk paths only** — de-emphasises everything except financially stressed connections
- **Tier-3 connections** — expands Tier-2 nodes to show their Tier-3 upstream dependencies
- **Alternative supply paths** — highlights green redundant paths alongside red single-paths
- **LkSG regulatory flags** — adds compliance status badges to supplier entities

---

## 3. Active Filters State

### Filter Chips Bar

A horizontal strip pinned **below the search bar**, always visible when any filter is active:

```
┌─────────────────────────────────────────────────────────────────┐
│  [Tier 2 ×]  [Taiwan ×]  [Critical Risk ×]  [Golf MQB ×]   Clear all │
│  ──────────────────────────────────────────────────────────────  │
│  Showing 47 suppliers · 12 parts · 2 plants  (of 312 / 89 / 4) │
└─────────────────────────────────────────────────────────────────┘
```

**Chip design:** `background: rgba(0,176,240,0.15)`, `border: 1px solid #00b0f0`, `color: #e8f4fd`, `border-radius: 4px`, `padding: 3px 8px`. Active filter chips use teal; layer toggles use a softer blue-grey.

**Behaviours:**
- Clicking `×` on a chip removes that one filter; the graph re-renders in 300ms with a smooth fade transition.
- "Clear all" appears when 2+ filters are active; clicking it resets all filters and layers to default simultaneously.
- The **filter panel toggle button** shows a badge with count: `≡ 4` — teal background, white number — so the user can see at a glance that filters are active even when the panel is collapsed.

### Zero-result guard

If the active filter combination would produce 0 entities, the chip bar shows an inline warning:

```
⚠  No results for this combination.  [Adjust filters]
```

"Adjust filters" opens the filter panel to the conflicting section.

### Graph info strip

Pinned to the bottom of the canvas — a thin `32px` bar:
```
Showing 47 of 312 suppliers · 12 of 89 parts · 2 of 4 plants   [Export view]
```

This answers the implicit question: "How much of the network am I seeing?" — critical for a demo audience who needs to understand filter scope.

---

## 4. Breadcrumb / Navigation History

### Two types of navigation

**Type A — Filter navigation** is tracked via chips (above). No explicit breadcrumb needed; the chips _are_ the navigation state. Removing a chip is the undo action.

**Type B — Drill-down navigation** happens when a user double-clicks a supplier to expand or focus its immediate dependency network. This creates a nested view state that needs explicit breadcrumb tracking.

### Drill-down breadcrumb bar

Appears _above_ the search bar when the user is inside a drill-down, as a `40px` bar spanning the full canvas top:

```
⟵  Full Network  >  Continental AG  >  Continental Teves (ADAS)
```

- Each crumb is a clickable link that restores that view's zoom, pan, and selection state.
- The leftmost `⟵` button is the primary "go back one level" action (also mapped to `Alt+←`).
- Max 4 crumbs shown; deeper paths collapse to: `Full Network > … > ALPS Electronic > ALPS Sensors`.
- The bar fades in with a `translateY(-8px → 0)` animation when drill-down is entered.
- Returning to Full Network removes the breadcrumb bar entirely.

### Session history (advanced)

A history stack (max 20 states) is maintained in session memory. Accessible via the `⟵` button's dropdown:

```
⟵ ▾
    Full Network (filtered: T2, Taiwan)
    Continental AG subgraph
    ● Continental Teves — current
```

This lets users retrace non-linear exploration paths.

---

## 5. Saved Views

### Save interaction

A **bookmark icon** `⊞` in the top toolbar (right of the filter toggle) opens a save modal:

```
┌─────────────────────────────────────────┐
│  Save Current View                 [×]  │
│  ─────────────────────────────────────  │
│  Name:  [APAC Critical Risk – Golf MQB] │
│  Desc:  [Optional description…]         │
│                                         │
│  Saves: 4 active filters + layer state  │
│         + zoom/pan position             │
│                                         │
│  Visibility: ○ Private  ● Team          │
│                                         │
│  [Cancel]           [Save View  →]      │
└─────────────────────────────────────────┘
```

### What a saved view captures

- All active filters (tier, country, risk level, risk type, program, plant, commodity)
- Visibility layer toggle states
- Camera position (zoom level + pan coordinates)
- Any highlighted/selected entities
- Current search query (if any)
- Named: timestamp + user-edited name

### View access

**Left sidebar "Views" panel** (collapsed by default, icon-tab on left edge):

```
VIEWS
─────────────────────────────────
SYSTEM VIEWS (read-only)
  📋 Critical Path – Golf MQB
  📋 APAC Geopolitical Exposure
  📋 SPOF Analysis – Semiconductors
  📋 LkSG Due Diligence View

MY VIEWS
  📌 APAC Critical Risk – Golf MQB   [⋯]
  📌 Taiwan Semiconductor Risk        [⋯]

SHARED WITH ME
  👥 Wolfsburg Plant Risk – Q4      [⋯]
─────────────────────────────────
```

Clicking any view instantly applies its state — graph transitions over 400ms.

### Deep-link sharing

Each saved view generates a URL hash encoding the filter state:
```
/graph-explorer#view=eyJ0aWVyIjpbMl0sImNvdW50cnkiOlsiVFciXSwicmlzayI6ImNyaXRpY2FsIn0=
```
Sharing this URL with a colleague opens exactly the same view. This is a high-value feature for escalation scenarios ("the alert just fired — here's the exact view, share it with procurement").

---

## 6. HTML/CSS Filter Panel Snippet

A self-contained implementation of the filter panel in VW dark canvas style.

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Graph Explorer – Filter Panel</title>
<style>
  /* ── Design tokens ── */
  :root {
    --canvas:     #0d1929;
    --panel-bg:   #0f2035;
    --panel-border: rgba(255,255,255,0.08);
    --vw-blue:    #001e50;
    --teal:       #00b0f0;
    --teal-dim:   rgba(0,176,240,0.15);
    --teal-dim2:  rgba(0,176,240,0.08);
    --text-primary:   #e8f4fd;
    --text-secondary: #8ca8c0;
    --text-muted:     #4a6680;
    --risk-critical:  #e53e3e;
    --risk-high:      #ed8936;
    --risk-medium:    #ecc94b;
    --risk-low:       #48bb78;
    --chip-border:    rgba(0,176,240,0.5);
    --radius-sm: 4px;
    --radius-md: 6px;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: -apple-system, 'Segoe UI', sans-serif;
    background: var(--canvas);
    color: var(--text-primary);
    display: flex;
    height: 100vh;
    font-size: 13px;
  }

  /* ── Graph canvas placeholder ── */
  .graph-canvas {
    flex: 1;
    position: relative;
    background:
      radial-gradient(ellipse at 30% 40%, rgba(0,176,240,0.04) 0%, transparent 60%),
      var(--canvas);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
    font-size: 14px;
  }

  .graph-canvas::after {
    content: 'Graph canvas — Cytoscape.js renders here';
    opacity: 0.35;
  }

  /* ── Search + chips overlay ── */
  .search-overlay {
    position: absolute;
    top: 16px;
    left: 16px;
    z-index: 10;
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 320px;
  }

  .search-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(15,32,53,0.95);
    border: 1px solid var(--panel-border);
    border-radius: var(--radius-md);
    padding: 8px 12px;
    backdrop-filter: blur(8px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.4);
    transition: border-color 0.2s;
  }

  .search-bar:focus-within {
    border-color: var(--teal);
    box-shadow: 0 0 0 2px rgba(0,176,240,0.2), 0 4px 16px rgba(0,0,0,0.4);
  }

  .search-bar svg { color: var(--text-muted); flex-shrink: 0; }

  .search-bar input {
    flex: 1;
    background: none;
    border: none;
    outline: none;
    color: var(--text-primary);
    font-size: 13px;
    font-family: inherit;
  }

  .search-bar input::placeholder { color: var(--text-muted); }

  .search-count {
    background: var(--teal-dim);
    color: var(--teal);
    border: 1px solid var(--chip-border);
    border-radius: 10px;
    padding: 1px 7px;
    font-size: 11px;
    font-weight: 600;
    white-space: nowrap;
  }

  /* ── Active filter chips ── */
  .filter-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  .chip {
    display: flex;
    align-items: center;
    gap: 5px;
    background: var(--teal-dim);
    border: 1px solid var(--chip-border);
    border-radius: var(--radius-sm);
    padding: 3px 8px;
    color: var(--text-primary);
    font-size: 11px;
    cursor: default;
    transition: background 0.15s;
  }

  .chip:hover { background: rgba(0,176,240,0.25); }

  .chip-x {
    color: var(--teal);
    cursor: pointer;
    font-size: 13px;
    line-height: 1;
    opacity: 0.7;
    transition: opacity 0.15s;
  }

  .chip-x:hover { opacity: 1; }

  .chip-clear-all {
    background: none;
    border: none;
    color: var(--text-muted);
    font-size: 11px;
    cursor: pointer;
    padding: 3px 4px;
    text-decoration: underline;
    transition: color 0.15s;
  }

  .chip-clear-all:hover { color: var(--teal); }

  /* ── Filter panel ── */
  .filter-panel {
    width: 268px;
    flex-shrink: 0;
    background: var(--panel-bg);
    border-left: 1px solid var(--panel-border);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    background: var(--vw-blue);
    border-bottom: 1px solid rgba(255,255,255,0.1);
    flex-shrink: 0;
  }

  .panel-header-title {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.7);
  }

  .panel-header-badge {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .active-count {
    background: var(--teal);
    color: #000;
    font-size: 10px;
    font-weight: 700;
    padding: 1px 6px;
    border-radius: 8px;
  }

  .clear-btn {
    background: none;
    border: none;
    color: var(--text-muted);
    font-size: 11px;
    cursor: pointer;
    padding: 2px 4px;
    transition: color 0.15s;
  }

  .clear-btn:hover { color: var(--teal); }

  /* ── Panel body scroll ── */
  .panel-body {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: thin;
    scrollbar-color: rgba(255,255,255,0.1) transparent;
  }

  .panel-body::-webkit-scrollbar { width: 4px; }
  .panel-body::-webkit-scrollbar-track { background: transparent; }
  .panel-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }

  /* ── Accordion section ── */
  .section {
    border-bottom: 1px solid var(--panel-border);
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 16px;
    cursor: pointer;
    user-select: none;
    transition: background 0.15s;
  }

  .section-header:hover { background: rgba(255,255,255,0.03); }

  .section-title {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--text-secondary);
  }

  .section-arrow {
    color: var(--text-muted);
    font-size: 10px;
    transition: transform 0.2s;
  }

  .section.open .section-arrow { transform: rotate(90deg); }

  .section-body {
    padding: 4px 16px 14px;
    display: none;
  }

  .section.open .section-body { display: block; }

  /* ── Tier toggles ── */
  .tier-row {
    display: flex;
    gap: 6px;
    margin-top: 8px;
  }

  .tier-btn {
    flex: 1;
    padding: 5px 0;
    border: 1px solid var(--panel-border);
    background: rgba(255,255,255,0.04);
    color: var(--text-secondary);
    border-radius: var(--radius-sm);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
    font-family: inherit;
    text-align: center;
  }

  .tier-btn.active {
    background: var(--teal-dim);
    border-color: var(--teal);
    color: var(--teal);
  }

  .tier-btn:hover:not(.active) { border-color: rgba(0,176,240,0.3); }

  /* ── Checkboxes ── */
  .checkbox-group { display: flex; flex-direction: column; gap: 8px; margin-top: 10px; }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 9px;
    cursor: pointer;
    color: var(--text-secondary);
    font-size: 12px;
    transition: color 0.15s;
  }

  .checkbox-label:hover { color: var(--text-primary); }

  .checkbox-label input[type="checkbox"] {
    width: 14px;
    height: 14px;
    accent-color: var(--teal);
    cursor: pointer;
    flex-shrink: 0;
  }

  /* ── Risk level pills ── */
  .risk-pills {
    display: flex;
    gap: 4px;
    margin-top: 10px;
    flex-wrap: wrap;
  }

  .risk-pill {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 4px 9px;
    border-radius: 12px;
    border: 1px solid;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
    font-family: inherit;
    background: transparent;
    white-space: nowrap;
  }

  .risk-pill.critical { border-color: rgba(229,62,62,0.5); color: #fc8181; }
  .risk-pill.high     { border-color: rgba(237,137,54,0.5); color: #f6ad55; }
  .risk-pill.medium   { border-color: rgba(236,201,75,0.5); color: #f6e05e; }
  .risk-pill.low      { border-color: rgba(72,187,120,0.5); color: #68d391; }

  .risk-pill.critical.active { background: rgba(229,62,62,0.2); border-color: #e53e3e; }
  .risk-pill.high.active     { background: rgba(237,137,54,0.2); border-color: #ed8936; }
  .risk-pill.medium.active   { background: rgba(236,201,75,0.2); border-color: #ecc94b; }
  .risk-pill.low.active      { background: rgba(72,187,120,0.2); border-color: #48bb78; }

  .risk-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: currentColor;
    flex-shrink: 0;
  }

  /* ── Search-within-filter ── */
  .filter-search {
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--panel-border);
    border-radius: var(--radius-sm);
    padding: 5px 8px;
    margin-top: 10px;
    transition: border-color 0.15s;
  }

  .filter-search:focus-within { border-color: rgba(0,176,240,0.4); }

  .filter-search input {
    background: none;
    border: none;
    outline: none;
    color: var(--text-primary);
    font-size: 12px;
    font-family: inherit;
    flex: 1;
  }

  .filter-search input::placeholder { color: var(--text-muted); }

  /* ── Commodity chips ── */
  .commodity-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin-top: 10px;
  }

  .commodity-chip {
    padding: 3px 9px;
    border-radius: 3px;
    border: 1px solid var(--panel-border);
    background: rgba(255,255,255,0.04);
    color: var(--text-secondary);
    font-size: 11px;
    cursor: pointer;
    transition: all 0.15s;
    font-family: inherit;
  }

  .commodity-chip.active {
    background: var(--teal-dim);
    border-color: var(--chip-border);
    color: var(--teal);
  }

  .commodity-chip:hover:not(.active) { border-color: rgba(0,176,240,0.3); color: var(--text-primary); }

  /* ── Visibility layer divider ── */
  .layer-divider {
    padding: 10px 16px 4px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-muted);
    border-top: 1px solid var(--panel-border);
    margin-top: 4px;
  }

  /* ── Toggle switches ── */
  .toggle-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 16px;
    transition: background 0.15s;
  }

  .toggle-row:hover { background: rgba(255,255,255,0.02); }

  .toggle-label {
    color: var(--text-secondary);
    font-size: 12px;
  }

  .toggle {
    position: relative;
    width: 36px;
    height: 20px;
    flex-shrink: 0;
  }

  .toggle input { opacity: 0; width: 0; height: 0; }

  .toggle-track {
    position: absolute;
    inset: 0;
    background: rgba(255,255,255,0.1);
    border-radius: 10px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .toggle input:checked + .toggle-track { background: var(--teal); }

  .toggle-track::before {
    content: '';
    position: absolute;
    width: 14px;
    height: 14px;
    background: #fff;
    border-radius: 50%;
    top: 3px;
    left: 3px;
    transition: transform 0.2s;
    box-shadow: 0 1px 3px rgba(0,0,0,0.4);
  }

  .toggle input:checked + .toggle-track::before { transform: translateX(16px); }

  /* ── Graph info strip ── */
  .info-strip {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 32px;
    background: rgba(15,32,53,0.9);
    border-top: 1px solid var(--panel-border);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    padding: 0 16px;
    gap: 16px;
    font-size: 11px;
    color: var(--text-muted);
  }

  .info-strip span { color: var(--text-secondary); }
  .info-strip strong { color: var(--teal); font-weight: 600; }
</style>
</head>
<body>

<!-- Graph canvas (left) -->
<div class="graph-canvas" style="position:relative;">

  <!-- Search bar + active chips -->
  <div class="search-overlay">
    <div class="search-bar">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input type="text" placeholder="Search suppliers, parts, plants…" value="Bosch">
      <span class="search-count">3 matches</span>
    </div>

    <div class="filter-chips">
      <div class="chip">Tier 2<span class="chip-x" onclick="this.closest('.chip').remove()">×</span></div>
      <div class="chip">Taiwan<span class="chip-x" onclick="this.closest('.chip').remove()">×</span></div>
      <div class="chip">Critical Risk<span class="chip-x" onclick="this.closest('.chip').remove()">×</span></div>
      <div class="chip">Golf MQB<span class="chip-x" onclick="this.closest('.chip').remove()">×</span></div>
      <button class="chip-clear-all">Clear all</button>
    </div>
  </div>

  <!-- Graph info strip -->
  <div class="info-strip">
    <span>Showing <strong>47</strong> of 312 suppliers</span>
    <span>·</span>
    <span><strong>12</strong> of 89 parts</span>
    <span>·</span>
    <span><strong>2</strong> of 4 plants</span>
    <span style="flex:1"></span>
    <span style="color: #4a6680; cursor:pointer;">Export view ↗</span>
  </div>
</div>

<!-- Filter panel (right) -->
<aside class="filter-panel">

  <div class="panel-header">
    <span class="panel-header-title">Filters</span>
    <div class="panel-header-badge">
      <span class="active-count">4 active</span>
      <button class="clear-btn">Clear all</button>
    </div>
  </div>

  <div class="panel-body">

    <!-- Supply chain position -->
    <div class="section open">
      <div class="section-header" onclick="this.closest('.section').classList.toggle('open')">
        <span class="section-title">Supply Chain Position</span>
        <span class="section-arrow">▶</span>
      </div>
      <div class="section-body">
        <div style="font-size:11px;color:var(--text-muted);margin-bottom:2px;">Tier level</div>
        <div class="tier-row">
          <button class="tier-btn">T1</button>
          <button class="tier-btn active">T2</button>
          <button class="tier-btn">T3</button>
        </div>
        <div style="font-size:11px;color:var(--text-muted);margin-top:12px;margin-bottom:0;">Entity type</div>
        <div class="checkbox-group">
          <label class="checkbox-label"><input type="checkbox" checked> Supplier</label>
          <label class="checkbox-label"><input type="checkbox" checked> Manufacturing Site</label>
          <label class="checkbox-label"><input type="checkbox"> Part / Component</label>
          <label class="checkbox-label"><input type="checkbox"> Assembly</label>
        </div>
      </div>
    </div>

    <!-- Risk profile -->
    <div class="section open">
      <div class="section-header" onclick="this.closest('.section').classList.toggle('open')">
        <span class="section-title">Risk Profile</span>
        <span class="section-arrow">▶</span>
      </div>
      <div class="section-body">
        <div style="font-size:11px;color:var(--text-muted);margin-bottom:0;">Risk level</div>
        <div class="risk-pills">
          <button class="risk-pill critical active"><span class="risk-dot"></span>Critical</button>
          <button class="risk-pill high"><span class="risk-dot"></span>High</button>
          <button class="risk-pill medium"><span class="risk-dot"></span>Medium</button>
          <button class="risk-pill low"><span class="risk-dot"></span>Low</button>
        </div>
        <div style="font-size:11px;color:var(--text-muted);margin-top:12px;">Risk type</div>
        <div class="checkbox-group">
          <label class="checkbox-label"><input type="checkbox" checked> Financial insolvency</label>
          <label class="checkbox-label"><input type="checkbox" checked> Geopolitical exposure</label>
          <label class="checkbox-label"><input type="checkbox"> Operational disruption</label>
          <label class="checkbox-label"><input type="checkbox"> Quality / compliance</label>
          <label class="checkbox-label"><input type="checkbox"> LkSG regulatory</label>
        </div>
      </div>
    </div>

    <!-- Geography -->
    <div class="section open">
      <div class="section-header" onclick="this.closest('.section').classList.toggle('open')">
        <span class="section-title">Geography</span>
        <span class="section-arrow">▶</span>
      </div>
      <div class="section-body">
        <div class="filter-search">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--text-muted)">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input type="text" placeholder="Search countries…">
        </div>
        <div class="checkbox-group" style="margin-top:8px;">
          <label class="checkbox-label"><input type="checkbox" checked> Taiwan</label>
          <label class="checkbox-label"><input type="checkbox"> China (mainland)</label>
          <label class="checkbox-label"><input type="checkbox"> Japan</label>
          <label class="checkbox-label"><input type="checkbox"> Germany</label>
          <label class="checkbox-label"><input type="checkbox"> South Korea</label>
        </div>
      </div>
    </div>

    <!-- Program & Plant -->
    <div class="section open">
      <div class="section-header" onclick="this.closest('.section').classList.toggle('open')">
        <span class="section-title">Program &amp; Plant</span>
        <span class="section-arrow">▶</span>
      </div>
      <div class="section-body">
        <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px;">Vehicle program</div>
        <div class="checkbox-group">
          <label class="checkbox-label"><input type="checkbox" checked> Golf MQB (A8)</label>
          <label class="checkbox-label"><input type="checkbox"> Tiguan (NF)</label>
          <label class="checkbox-label"><input type="checkbox"> Audi Q4 e-tron (BEV)</label>
          <label class="checkbox-label"><input type="checkbox"> Porsche Cayenne</label>
        </div>
        <div style="font-size:11px;color:var(--text-muted);margin-top:12px;margin-bottom:4px;">OEM Plant</div>
        <div class="checkbox-group">
          <label class="checkbox-label"><input type="checkbox"> Wolfsburg</label>
          <label class="checkbox-label"><input type="checkbox"> Zwickau</label>
          <label class="checkbox-label"><input type="checkbox"> Emden</label>
          <label class="checkbox-label"><input type="checkbox"> Bratislava</label>
        </div>
      </div>
    </div>

    <!-- Commodity group -->
    <div class="section open">
      <div class="section-header" onclick="this.closest('.section').classList.toggle('open')">
        <span class="section-title">Commodity Group</span>
        <span class="section-arrow">▶</span>
      </div>
      <div class="section-body">
        <div class="commodity-chips">
          <button class="commodity-chip active">Semiconductors</button>
          <button class="commodity-chip">Displays</button>
          <button class="commodity-chip">Battery Cells</button>
          <button class="commodity-chip">Sensors</button>
          <button class="commodity-chip">Wiring Harness</button>
          <button class="commodity-chip">Chassis</button>
          <button class="commodity-chip">Raw Materials</button>
          <button class="commodity-chip">Software / ECU</button>
        </div>
      </div>
    </div>

    <!-- Visibility layers -->
    <div class="layer-divider">Visibility Layers</div>

    <div class="toggle-row">
      <span class="toggle-label">Ownership chains</span>
      <label class="toggle">
        <input type="checkbox" checked>
        <span class="toggle-track"></span>
      </label>
    </div>
    <div class="toggle-row">
      <span class="toggle-label">Financial risk paths only</span>
      <label class="toggle">
        <input type="checkbox">
        <span class="toggle-track"></span>
      </label>
    </div>
    <div class="toggle-row">
      <span class="toggle-label">Tier-3 connections</span>
      <label class="toggle">
        <input type="checkbox" checked>
        <span class="toggle-track"></span>
      </label>
    </div>
    <div class="toggle-row">
      <span class="toggle-label">Alternative supply paths</span>
      <label class="toggle">
        <input type="checkbox">
        <span class="toggle-track"></span>
      </label>
    </div>
    <div class="toggle-row" style="margin-bottom:12px;">
      <span class="toggle-label">LkSG regulatory flags</span>
      <label class="toggle">
        <input type="checkbox" checked>
        <span class="toggle-track"></span>
      </label>
    </div>

  </div><!-- /panel-body -->
</aside>

</body>
</html>
```

---

## 7. Key Design Decisions & Rationale

### Why right-side panel, not left?

The graph's most important entry points (search, breadcrumb, drill-down selection) are on the left. Keeping the filter panel on the right creates a natural left-to-right workflow: _navigate → inspect → filter_. It also mirrors the SAP Fiori and Celonis pattern this audience already uses.

### Why accordion sections, not flat list?

With 10+ filter dimensions, a flat list forces excessive scrolling and makes it hard to scan what's configured. Accordions let users collapse sections they're not using (e.g., a quality engineer may collapse "Commodity Group" entirely) while keeping the most-used sections (Risk Profile, Geography) expanded by default.

### Why commodity chips instead of checkboxes?

Commodity groups are typically applied as quick toggles for a scenario view ("show me the semiconductor exposure") rather than fine-grained multi-select combinations. Chips are faster to click and visually communicate the "scenario" metaphor better than a checkbox list.

### Prototype simplifications (production re-evaluation needed)

- **Saved views** should integrate with a backend preferences API — the hash-encoded URL approach works for a demo but doesn't support team sharing at scale.
- **Country list** is currently a static checkbox list; production needs a searchable multi-select with `react-select` or equivalent, backed by the supplier country enum from the knowledge graph.
- **Camera animation** timing (400ms) feels right on the demo dataset; with 5,000+ entities Cytoscape's `fit()` may need to be debounced or replaced with a virtual viewport approach.
- **Filter panel state** should be persisted in `localStorage` per user session so the panel state survives page refresh during a demo walkthrough.

---

## 8. Accessibility & Keyboard Navigation

| Interaction | Keyboard |
|-------------|----------|
| Focus search | `/` |
| Navigate results | `↑` / `↓` |
| Confirm selection | `Enter` |
| Close/clear | `Esc` |
| Toggle filter panel | `Ctrl+F` |
| Navigate history back | `Alt+←` |
| Save current view | `Ctrl+S` |

All interactive elements maintain `:focus-visible` states using the teal `#00b0f0` outline. Colour-alone indicators (risk pills) include text labels to meet WCAG AA contrast requirements against the dark canvas.

---

*Document produced for the N-tier Supplier Monitor · Graph Explorer prototype · VW Group executive demo context*

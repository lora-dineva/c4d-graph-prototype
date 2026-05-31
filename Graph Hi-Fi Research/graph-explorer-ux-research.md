# Graph Explorer UX: Interaction Design Patterns in Mature Tools
## Research for N-tier Supplier Monitor — Graph Explorer Prototype (VW Context)

**Prepared by:** Research pass, May 2026  
**Scope:** Neo4j Bloom · Linkurious Enterprise · Maltego · Palantir Gotham/Vertex  
**Purpose:** Ground the Graph Explorer interaction model in proven patterns before prototyping

---

## Part 1: Tool-by-Tool Analysis

---

### 1. Neo4j Bloom

Neo4j Bloom is a browser-based graph exploration tool for Neo4j databases, positioned at the analyst/business-user end of the spectrum. It operates on a "search-to-scene" paradigm: users begin with a near-natural language search, and results populate a force-directed canvas called the Scene.

**Sources:** [Scene Interactions](https://neo4j.com/docs/bloom-user-guide/current/bloom-visual-tour/bloom-scene-interactions/) · [Overview](https://neo4j.com/docs/bloom-user-guide/current/bloom-visual-tour/bloom-overview/)

#### 1.1 Node Expansion

- **Double-click** is the primary expansion trigger — it expands all immediate neighbors of the node. Double-clicking again on an already-expanded node collapses the expansion.
- **Right-click** opens a context-sensitive menu offering more control. From the right-click menu, users can:
  - Expand along a specific relationship type and direction only.
  - Open the **Advanced Expansion dialog** to combine multiple path types, target specific neighbor categories, and set a node count limit. This limit overrides the global "Node query limit" setting.
- **Inspector panel**: When a node is opened in the Inspector (via double-click to inspect, not expand), relationships and neighbors are listed; expansion can also be triggered from that panel's relationship list.
- **Super-node safeguard**: The expansion is bounded by a global `Node query limit`. If a node's neighbor count exceeds thresholds, the Advanced Expansion dialog is automatically surfaced, forcing the user to filter before adding results.

#### 1.2 Neighborhood Highlighting and Dimming

- Bloom does not implement a "fog of graph" dimming model on node selection. The primary focus mechanism is **filtering**: when a filter is applied from the Filter drawer, all filtered-out elements are **greyed out** in the Scene — they remain visible but are non-interactive and cannot be clicked.
- **"Dismiss filtered elements"** removes the greyed-out items from the canvas entirely, focusing the scene on the relevant subgraph.
- **"Select related nodes"** is available via right-click on a node: it selects the node and its immediate neighbors. The user can then dismiss everything else, effectively creating a focused sub-scene. This is the closest pattern to "spotlight" highlighting.
- **"Dismiss single nodes"** removes all isolated nodes (those with no visible connections), cleaning up the canvas after expansion.

#### 1.3 Side Panel / Detail Panel

- **Inspector**: Opened by double-clicking any node or relationship. Displays the element's label, all properties, and a navigable list of its relationships and neighboring nodes. Browsing to a connected record from the Inspector moves the scene focus.
- **Card list overlay**: A lightweight secondary view that shows a compact list of all nodes and relationships currently in the Scene, useful for scanning without full Inspector depth.
- **Legend panel**: Accessible from the sidebar; shows all entity types and relationship types in the current Perspective, with color/icon/size styling controls.
- The sidebar contains three drawers: **Perspective** (business context config), **Help & learn**, and **Settings**.

#### 1.4 Filter and Search

- **Search bar** (primary entry point): Accepts near-natural language phrases. Offers pattern suggestions as the user types. Bloom translates the input into a Cypher-based query against the connected database and populates the Scene with results.
- **Filter drawer**: Creates per-scene filters based on categories, relationship types, and properties. Supported types: string, integer, float, boolean, Date, Time, LocalTime, DateTime, LocalDateTime.
- **Numeric filter**: A histogram slider shows the distribution of values in the current Scene for numeric properties, letting users range-filter visually.
- **Temporal filter**: Supports timezone normalization — users can choose to normalize to a single timezone or use local time.
- Multiple filters stack; each remains in the Filter drawer until deleted. Filtered elements are greyed out rather than removed (unless the user explicitly dismisses them).

#### 1.5 Path Visualization Between Two Nodes

- **Shortest Path** is a first-class, built-in command. Select two nodes → right-click one → choose **"Shortest Path"**. Bloom searches up to **20 relationship hops** and visualizes the first shortest path returned by the database.
- Only one shortest path is shown (the first found). There is no "all paths" mode in Bloom.
- The path is drawn as a highlighted chain in the Scene using the default force-directed layout. A **Hierarchical layout** option in the layout menu can then be applied to re-orient the scene around relationship direction, which makes directional paths more readable.

#### 1.6 Node Pinning

- Bloom does not have an explicit "Pin" button. Nodes can be **manually repositioned** by left-clicking and dragging them, and their positions persist across layout re-runs in some modes.
- The **Coordinate layout** explicitly "arranges and fixes" nodes by their numeric or geographic property values (latitude/longitude, integer x/y), effectively hard-pinning them to canvas coordinates. This is the most explicit pinning mechanism.
- In force-directed layout, manually moved nodes do not always stay fixed when the layout physics re-run (e.g., when new nodes are added). This is a known limitation for demos.

---

### 2. Linkurious Enterprise

Linkurious Enterprise is a commercial graph visualization and analytics platform, widely used in financial crime, fraud investigation, and enterprise intelligence. It sits on top of graph databases (Neo4j, Amazon Neptune, Azure Cosmos DB, etc.) and emphasizes no-code investigation workflows. As of v4.3.x (current), it includes a No Code Query Builder, AI-assisted querying, and robust case management.

**Sources:** [Expand Nodes](https://doc.linkurious.com/user-manual/latest/expand/) · [Inspect Data](https://doc.linkurious.com/user-manual/latest/visualization-inspect/) · [Pinning Nodes](https://doc.linkurious.com/user-manual/latest/pinning/) · [Release 4.2](https://linkurious.com/blog/linkurious-enterprise-4-2/)

#### 2.1 Node Expansion

Linkurious offers the most complete and polished expansion model of the four tools:

**Three expansion entry points:**

1. **Double-click** on a node — expands all immediate neighbors (fastest, no filtering).
2. **Right-click** → context menu → **Expand button** — shows the same options as the property panel expand.
3. **Select node(s)** → click the **Expand button** in the **property panel** (left side) — works on single or multi-node selection.

**Expansion options in the dropdown:**

- *All neighbors* — fetches everything connected.
- *Category list* — if neighbor count is below the threshold (`advanced.expandThreshold`), a category list is shown directly; clicking one category expands only that type.
- *More options* — opens the **Selective Expand modal**.

**Selective Expand modal:**

- Choose specific category + edge type combination.
- Degree mode: *Neighbors* (default), *Most connected*, or *Least connected* — the latter two are particularly useful for prioritizing high-risk hubs or finding isolated suppliers.
- Set a maximum neighbor count.

**Super-node handling:** When a node has more connections than `advanced.superNodeThreshold`, it displays a **plus badge with the connection count**. The Selective Expand modal is mandatory for super-nodes (cannot expand without filtering). Multiple super-nodes cannot be expanded simultaneously.

#### 2.2 Neighborhood Highlighting and Dimming

- **Single click** on a node selects it and can open the property panel.
- **Clicking a node in the multi-selection table** highlights it with a **pulsing halo** on the canvas — a clear, animated visual callout.
- **Double-click in multi-selection table** focuses on the node without deselecting the rest of the selection.
- **Lasso tool**: Accessible from the top menu or right-clicking on the background canvas. Users draw a freeform selection area to select multiple nodes.
- **Hide functionality**: Nodes can be hidden from view without being deleted, reducing visual clutter without losing data.
- **Node grouping + collapse (v4.2+)**: Groups of nodes can be collapsed into a single representative node — toggling between high-level summary and detailed expanded views. This is the most powerful "zoom out" interaction for executive presentations.
- There is no explicit per-click dimming (fog effect) in the current documented interaction model; the emphasis is on explicit hide/filter operations.

#### 2.3 Side Panel / Detail Panel

- **Property panel** (left side): Closed by default on node selection (preserves canvas space for exploration). Activated by clicking the "Open selection panel" icon at the top left.
- For a **single node**: Shows node ID, category (with color indicator), and all properties. Users can scroll or search within the panel for a specific property value.
- For a **multiple selection**: Properties are shown in a **tabular format**, one table per category/edge type. The table supports search (filter + highlight), sorting (ascending/descending by any property), and pagination.
- The panel is **resizable** by dragging its edge — size preference persists across node selections within the same visualization.
- **Edge properties**: Clicking a connection shows its properties in the same panel.
- An undisplayed-relationships badge (circular count indicator) on nodes signals how many connections are not yet in the visualization, prompting further exploration.

#### 2.4 Filter and Search

- **Global search bar**: Full-text search across all node properties. Supports boolean operators, property-specific filters, and advanced syntax. As of v4.2.7, date/time condition filters are available in the No Code Query Builder.
- **Advanced search**: Filter by multiple properties simultaneously using boolean operators. Results are added to the visualization as a new query layer.
- **Filter panel**: Property-based filters applied to the current canvas — elements failing the filter are hidden. Includes a **Timeline** filter for temporal data.
- **Bulk selection via "Select By"**: Select all nodes of a given category, or matching a property value, in one action.
- **No Code Query Builder (v4.2 GA)**: Visual step-by-step query builder — choose node type, add property conditions, traverse links, preview results and generated Cypher in real time. Reusable saved queries. Supports bulk value paste (e.g., paste a list of supplier IDs). Intelligent suggestions.
- **QueryAI (v4.2.7 beta)**: Natural language to Cypher, backed by user's choice of LLM.

#### 2.5 Path Visualization Between Two Nodes

- **Shortest Path** is implemented as a **built-in query template**. The template accepts two node variables (source and target) and returns the shortest path between them. It runs as a standard query and visualizes the result path as a connected chain on the canvas.
- For Google Cloud Spanner Graph connector (v4.2.4+), Shortest Path is surfaced explicitly as a built-in query in the UI.
- There is no documented "all paths" mode — the focus is on the shortest path as a decision-support shortcut.

#### 2.6 Node Pinning

Linkurious has the most explicit and well-documented pinning model:

- **Right-click → "Pin"** on the tooltip, OR via the `...` actions menu on the selected node.
- A **pin symbol** renders on the pinned node as a persistent visual indicator.
- Pinned nodes remain at their exact canvas position when any layout algorithm is re-run (force-directed, hierarchical, etc.). Unpinned nodes re-arrange around them.
- **Auto-pin on drag**: An option in the Layout settings automatically pins a node when the user manually drags it. This means any manual repositioning is automatically preserved on the next layout re-run.
- Unpinning restores the node to the layout algorithm's control.

---

### 3. Maltego

Maltego is an OSINT (Open Source Intelligence) and link analysis platform, primarily used in cybersecurity, law enforcement, and intelligence investigations. Its interaction model is fundamentally different from the other three tools: it is organized around **Transforms** — server-side data enrichment operations that take an entity as input and return new connected entities as output. Exploration in Maltego is therefore not a matter of revealing pre-existing graph data, but of iteratively querying external data sources.

**Sources:** [Navigate the Interface](https://docs.maltego.com/en/support/solutions/articles/15000059532-navigate-the-interface) · [Starting an Investigation](https://docs.maltego.com/en/support/solutions/articles/15000059534-starting-an-investigation) · [Graph Sidebar](https://docs.maltego.com/en/support/solutions/articles/15000009615-maltego-graph-sidebar)

#### 3.1 Node Expansion

- **Right-click on an entity → "Run Transform"** is the primary expansion mechanism. The context menu surfaces available transforms for that entity type (e.g., "Find email addresses for this domain," "Enrich with threat intelligence").
- **Transform Hub** (right side panel): Browse and execute transforms by data source or category. Transforms are essentially parameterized API calls to external intelligence feeds.
- **Bulk transform**: Select multiple entities by dragging → click the "Run Transforms" icon in the top-left toolbar. This runs the same transform across all selected entities simultaneously, useful for enriching a batch of, e.g., company entities at once.
- A **Transform Result Limit slider** controls output volume (small / balanced / large), preventing runaway graph expansion. Default is "balanced" for paid plans.
- Unlike Bloom or Linkurious, there is no concept of expanding "already-existing" graph connections — every expansion is a live external data query.

#### 3.2 Neighborhood Highlighting and Dimming

- Maltego does not have a fog/dim effect for neighborhoods in the documented interaction model.
- **Bookmarks**: Key findings can be bookmarked and colored (user-defined palette). Bookmarked entities can be exported as PDF reports. This is the primary "mark and track" mechanism.
- **Quick Find**: Highlights entities on the canvas matching a text search — matching entities are visually called out while non-matching ones recede.
- **Filters**: Can narrow the visible entity set on the canvas by type or property, reducing visual noise.
- **"Select By"** enables bulk operations on entities matching criteria.
- The interaction emphasis is on iterative investigation rather than neighborhood focus — analysts are expected to manage graph complexity through layout changes and manual deletion of irrelevant entities.

#### 3.3 Side Panel / Detail Panel

- **Right-side panel on entity selection**: When an entity is clicked, its label (name) is editable and a properties panel appears showing its data fields. Users can add notes to entities directly from this panel.
- **Transform Hub** (same right-side area): When no entity is selected, this panel shows available transforms organized by data source. A toggle switches between entity properties and the Transform Hub.
- **Graph view + Map view + Table view**: All three views can be displayed simultaneously, with resizable dividers. The Table view is useful for inspecting entity properties in spreadsheet format.
- **Histogram view**: Visualizes trends and distributions across entity properties — useful for identifying clustering or outliers in the graph data.
- **Version history**: Graphs can be reverted to earlier states, providing a safe "undo" for investigation branches that led nowhere.

#### 3.4 Filter and Search

- **Quick Find** (top bar): Text search across all entity labels in the current graph. Results are highlighted on the canvas in real time.
- **Filters panel** (top bar): Filter the visible graph by entity type, relationship type, or property values. Entities not matching the filter are hidden or faded.
- **Maltego Search** (sidebar icon): A separate search interface for initiating new entity lookups against connected data sources — results can be pushed directly into the graph view.
- **"Select By"** tool: Bulk-select entities by type for batch transform runs or deletion.
- The platform does not include a graph-database-style query language. All exploration is through UI tools or transforms.

#### 3.5 Path Visualization Between Two Nodes

- Maltego does not have a dedicated "shortest path" or "find path" command in the documented UI. Path tracing is achieved **implicitly** by iteratively running transforms from a source entity, with each transform step adding entities and connections until the target is reached.
- **Composition entities**: Available in Graph (Browser), these group related entities into a single collapsed unit, which can then be expanded — this provides some degree of hierarchical path navigation.
- For explicit link analysis between two known points, analysts typically arrange entities manually on canvas and trace the visual connection chain. The **hierarchical layout** option can help orient a discovered path vertically.
- Maltego's design philosophy is adversarial/investigative: paths are discovered, not predefined. This makes it less suitable for demonstrating a known supply chain path compared to Linkurious or Bloom.

#### 3.6 Node Pinning

- Maltego does not have an explicit "pin" feature documented. Entities can be moved manually on the canvas. Various **layout options** (hierarchical, organic, block, etc.) can be applied from the sidebar, and manual positions may or may not be preserved.
- The investigation paradigm assumes analysts are actively rearranging entities to tell a visual story — position management is manual and iterative rather than system-managed with explicit pin states.

---

### 4. Palantir Gotham / Vertex

Palantir Gotham is Palantir's flagship intelligence and operational analytics platform, used primarily by defense agencies, law enforcement, and large enterprises. It is built on a dynamic **ontology** model: all data is represented as typed objects with defined link types. The graph explorer in Gotham (and its successor application **Vertex** in Palantir Foundry) is an operational whiteboard for exploring these object relationships. The interaction model is the most structured and least open-ended of the four tools — exploration follows defined ontology paths.

**Sources:** [Vertex: Explore Existing Graphs](https://www.palantir.com/docs/foundry/vertex/graphs-explore) · [Vertex: Explore Object Relationships](https://www.palantir.com/docs/foundry/vertex/explore-object-relationships)

#### 4.1 Node Expansion

Palantir uses the term **"Search Around"** rather than "expand" — reflecting the ontology-aware nature of the operation:

- **Right-click on an object → "Search Around"**: Opens an action menu listing all related object types that can be added to the graph. The total count of each related object type is shown inline. A filter icon next to the count opens the **Search Around panel** for more complex traversal.
- **Search Around panel**: A point-and-click interface for multi-step, filtered graph traversal. Users choose a link type, optionally filter the result set by properties, then optionally add a second link step. The panel shows how many objects would be returned at each step before committing.
- **Parameters**: Search Arounds can be parameterized for reuse across different starting objects.
- **Expand button with chevron** (in the exploration toolbar): Clicking the chevron reveals a level-count selector — users can expand N levels at once. A double-chevron expands all the way to the raw data layer.
- Search Arounds can be saved as reusable resources and loaded into new graph explorations.

#### 4.2 Neighborhood Highlighting and Dimming

- **Selection panel**: Clicking an object automatically opens the selection panel (sidebar) showing its properties and associated events. The selected object is visually distinguished on the canvas.
- **Dynamic styling by events**: Objects can be configured to show event badges — for example, a "supply disruption event" badge renders on the affected object node when the event is active. Time-scrubbing the timeline dynamically updates which badges are visible, showing how risk states evolve over time.
- **Histogram sidebar**: Filter the graph by object type and property values using histogram sliders. Selections made in the histogram reflect immediately in the canvas. "Filter to" and "Filter out" operations apply the histogram selection.
- **Active filters display**: Applied filters appear at the top of the graph canvas as chips; individual filters can be removed via the × icon, or all filters cleared.
- There is no explicit per-selection dimming (fog effect) documented. Palantir's model emphasizes structured filtering over ambient dimming.

#### 4.3 Side Panel / Detail Panel

- **Selection panel** (sidebar): Auto-opens when any object is clicked. Contains:
  - **Selection tab**: Full properties of the selected object. Includes derived properties calculated by Functions (e.g., a custom risk score aggregation).
  - **Events tab**: If the selected object has associated events, they are listed here with their temporal context.
  - **Layers tab**: Styling options for the selected object or edge — color, icon, size. Styling changes made in an embedded Workshop graph are not persisted; persisted styles require updating the underlying graph template.
- The sidebar also provides a **Histogram tab** for property-based graph filtering.
- Object properties can include derived metrics computed at runtime — Palantir's Function layer means the detail panel can surface calculated values (e.g., "total downstream programs affected by this supplier") rather than just raw data fields.

#### 4.4 Filter and Search

- **Histogram filters**: Primary canvas-level filter. Selects objects by type + property value ranges. Applied as "Filter to" (keep matching) or "Filter out" (hide matching).
- **Object search pop-up**: When starting a new exploration, a dedicated object search modal allows searching across all ontology object types by name, ID, or property.
- **Multi-step Search Around**: The Search Around panel itself is the primary "find related nodes" mechanism — structured traversal with typed link filters at each step.
- **Object Explorer**: A separate platform application for broader search and comparison across object types, with pivot-to-related-objects functionality. Results from Object Explorer can seed new graph explorations in Vertex.
- Palantir does not expose a raw graph query language to end users — all search and filtering flows through the ontology model, which is both a strength (structured, governed) and a limitation (less ad-hoc exploration).

#### 4.5 Path Visualization Between Two Nodes

- Palantir Vertex/Gotham does not document a one-click "shortest path" command in the same manner as Bloom or Linkurious. Path tracing is achieved through **iterative Search Arounds** — each step adds one link type's worth of connected objects.
- For enterprise operational contexts, Palantir's model assumes that significant paths are **pre-defined in the ontology** (e.g., "supplier → part → assembly → vehicle program → plant") and explored through the structured Search Around panel rather than algorithmically discovered.
- The multi-step Search Around panel provides a guided path-building interface where each step can be reviewed before commitment — more deliberate than Bloom's single-click shortest path, but more transparent about what the path contains.
- Time series and event overlays allow the path to be examined across time: "what was the state of this supply path at this date?"

#### 4.6 Node Pinning

- Palantir Vertex does not document an explicit "Pin" feature. The graph is described as a "whiteboard-like interface" with manual positioning.
- Object positions on the graph appear to be manually managed — users drag objects into narrative arrangements. Layout options (hierarchical, organic) can reorganize the canvas, but there is no documented mechanism to mark specific objects as position-locked before re-running a layout.
- This reflects the Palantir design philosophy: the graph is curated and presented, not algorithmically auto-arranged for continuous exploration.

---

## Part 2: Cross-Tool Comparison Matrix

| Dimension | Neo4j Bloom | Linkurious Enterprise | Maltego | Palantir Vertex/Gotham |
|---|---|---|---|---|
| **Primary expansion trigger** | Double-click | Double-click / Right-click / Panel button | Right-click → Transform | Right-click → Search Around |
| **Expansion granularity** | All / by rel. type / Advanced dialog | All / by category / Selective Expand modal | By transform type | By link type / multi-step panel |
| **Super-node safeguard** | Node query limit → Advanced dialog | Badge + mandatory Selective Expand | Result limit slider | Count shown; filter required for large sets |
| **Selection highlight** | Dismiss to isolate sub-scene | Pulsing halo; group collapse | Bookmarks + Quick Find | Selection panel; dynamic event badges |
| **Dimming / fog effect** | Filter → grey out | Hide; filter panel | Filter → fade | Histogram filter |
| **Side panel depth** | Inspector: properties + neighbors | Resizable panel; tabular multi-select; edge properties | Properties + Transform Hub | Selection + Events + Layers tabs; derived properties |
| **Search paradigm** | Near-NL search bar | Full-text + No Code Query Builder + AI | Quick Find + external transforms | Typed ontology search + Object Explorer |
| **Shortest path** | Built-in (20 hop limit, first result) | Built-in query template | Not available (iterative transforms) | Not one-click (iterative Search Around) |
| **Pinning** | Manual drag (not explicit pin) | Explicit pin with symbol; auto-pin on drag | Not documented | Not documented; manual positioning |
| **Best for** | Explorative discovery by analysts | Investigation workflows; executive presentations | OSINT; adversarial tracing | Operational decision support; curated analytics |

---

## Part 3: Synthesis — Recommended Interaction Model for the Supply Chain Graph Prototype

### Guiding constraints

The prototype must:
- Answer blast radius, SPOF, hidden concentration, and ownership risk questions compellingly for VW executives.
- Demonstrate "risk flows through the supply chain" as a narrative, not a data dump.
- Run in a single HTML file without a server; graph rendered with Cytoscape.js.
- Remain operable by someone who has never seen a graph tool before — the demo driver may need to narrate while clicking.

These constraints point decisively toward the **Linkurious model** as the primary reference, with specific borrowings from Palantir for the detail panel and from Bloom for shortest path.

---

### Recommended Interaction Decisions

#### Q1: How should expansion work?

**Recommendation: Double-click expands all, right-click gives filtered options.**

This is the consensus pattern across Bloom and Linkurious, and it is the most trainable for a demo context. The double-click should be visually animated — new neighbor nodes should fan out with a brief ease-in animation, not pop in instantly. This animation communicates "these are the suppliers connected to this one" rather than "the graph was redrawn."

For the supply chain prototype specifically, expansion should be **semantically filtered by supply chain role**:
- Right-click on a Tier-1 supplier → options: "Show Tier-2 suppliers," "Show supplied parts," "Show affected plants," "Show ownership chain."
- This mirrors the Palantir Search Around model (typed link expansion) while using right-click familiarity from Bloom/Linkurious.

Super-node protection is not needed at prototype scale, but at production scale the Linkurious Selective Expand pattern (badge + mandatory filter dialog) is the right approach for supplier hubs like Bosch or Continental.

#### Q2: How should selection highlighting work?

**Recommendation: Immediate dimming of non-neighbors (fog effect) on single click.**

Neither Bloom nor Linkurious implements true per-click fog dimming — they use filter-and-hide instead. But for an executive demo, the fog effect is far more powerful: clicking a supplier should instantly reduce all unrelated items to 20% opacity, with the selected supplier and its direct supply chain at full brightness.

This is the pattern used by network visualization libraries (Cytoscape.js supports it natively) and aligns with what executives expect from a "focus this" interaction. It communicates impact immediately — the VW supply chain manager clicks "Liqtech International" and the rest of the graph dims, leaving only the risk path visible.

The pulsing halo (Linkurious model) should be added for the primary "at-risk" supplier during an alert scenario — the halo signals urgency without requiring a click.

#### Q3: How should the detail panel work?

**Recommendation: A right-side slide-in panel with three tabs — Details, Risk Score, Affected Programs.**

Borrow the **Palantir model** of multiple tabs in the selection panel:

- **Details tab**: Properties of the selected entity — name, location, tier, financial health indicators, ownership. Mirror Linkurious's clean property list with a search bar for long property lists.
- **Risk Score tab**: Calculated risk dimensions (financial, geopolitical, operational). This is analogous to Palantir's "derived properties" — computed values surfaced in the panel at selection time.
- **Affected Programs tab**: A compact list of which vehicle programs and plants are exposed through this supplier, with severity color-coding (red = single point of failure, orange = limited alternatives, green = redundant supply). This answers the blast radius question without requiring further exploration.

The panel should be **collapsible** (not closed by default, unlike Linkurious's default behavior) — for an executive demo, having information appear immediately on click is more impressive than requiring a secondary click to open it.

Edge selection should show: relationship type, contracted volume, single-source flag, last audit date.

#### Q4: How should search and node location work?

**Recommendation: A persistent search bar with entity-type filters; results pulse on the canvas.**

Bloom's near-natural language approach is elegant but requires database connectivity. For the prototype, implement a **filtered search bar** at the top of the canvas:
- Type a supplier name (e.g., "Murata") → matching nodes pulse/highlight on canvas, everything else dims temporarily.
- Filter chips below the search bar: `[Supplier] [Part] [Plant] [Program]` — clicking a chip limits search results to that entity type.
- This mirrors Maltego's Quick Find for the canvas, paired with Linkurious's category filter.

For production, the Linkurious No Code Query Builder approach — "find all Tier-2 semiconductor suppliers in Taiwan with financial risk score > 7" — is the right target interaction. This should be a stated roadmap item even if not in the prototype.

#### Q5: How should paths between two suppliers/plants be visualized?

**Recommendation: A "Trace Impact Path" mode — select source and target, path animates.**

This is the most important interaction for demonstrating "risk flows through the supply chain." The recommended model:

1. User selects the at-risk supplier (e.g., Liqtech International) — the system identifies it as a risk source.
2. User selects the affected plant (e.g., Wolfsburg Assembly) — the system identifies it as the risk destination.
3. A **"Trace Path"** button appears in the toolbar (or automatically fires for the pre-defined demo scenario).
4. The shortest path animates as a flowing highlight — a color pulse travels along the connections from Liqtech → Tier-1 electronics supplier → critical part → assembly → plant → affected vehicle programs. The animation direction matters: it should flow *from* risk source *toward* production impact to represent risk propagation direction.
5. The path remains highlighted (bright color, thicker connections) while non-path elements dim.

This combines Bloom's one-click shortest path with an animated, directional flow that makes the "risk traveling through the supply chain" metaphor viscerally clear to an executive audience.

For the prototype, one or two pre-computed paths should be hardcoded so the demo is reliable. Production would run this as a true shortest path query.

#### Q6: How should pinning work?

**Recommendation: Auto-pin on drag (Linkurious behavior), with a visual pin indicator.**

For the prototype, implement the Linkurious auto-pin model: any node the demo driver drags into a deliberate position gets a small pin icon and stays put when the layout re-runs.

This is critical for the demo: when setting up the "impact path" view, the demo driver will position the Wolfsburg plant at the bottom-right and the risky Tier-2 semiconductor at the top-left to create a visually clear top-down risk flow. These positions must survive any "re-layout" or "reset zoom" operations during the live demo.

**All pre-defined scenario starting nodes should be pinned by default** in the prototype's initialization code — the supply chain "spine" (critical Tier-2 → Tier-1 → Part → Assembly → Plant) should always render in a fixed, readable left-to-right or top-to-bottom arrangement.

---

### Interaction Priority Order for the VW Executive Demo

The following interactions must work flawlessly. Everything else is secondary.

**Tier 1 — Must demonstrate compellingly:**

1. **Trace Impact Path** (Q5): The animated risk-flow path from the failing Tier-2 supplier to the affected VW plant and vehicle programs. This is the single interaction that makes the product differentiated.
2. **Click-to-focus with fog dimming** (Q2): Clicking a supplier should instantly dim everything except its supply chain context. This viscerally demonstrates "blast radius."
3. **Detail panel on selection** (Q3): Clicking a node must immediately show the Affected Programs tab with severity coding. This answers "so what?" without requiring further navigation.

**Tier 2 — Strong supporting interactions:**

4. **Right-click expand with supply chain roles** (Q1): Used to demonstrate that the graph is live and navigable, not a static screenshot. Walk from the Tier-2 risk upstream and downstream.
5. **Search to locate** (Q4): Find "Wolfsburg" or "Golf MQB" quickly to demonstrate that the graph handles a real-world OEM's complexity.

**Tier 3 — Nice to have for the prototype:**

6. **Pinning** (Q6): Mostly a presenter comfort feature. Ensures the demo scenario renders consistently.
7. **Ownership overlay** (secondary scenario): Toggle between supply chain view and ownership structure. Demonstrates hidden concentration and Q4 of the 10 core questions (who actually controls this supplier).

---

### Anti-Patterns to Avoid

- **Double right-click menus**: Mature tools agree that right-click opens a context menu with clearly labeled actions. Do not implement hover-buttons on nodes — they are unreliable in live demos and feel toy-like to enterprise users.
- **Auto-expanding on load**: The canvas should start with the pre-defined scenario already laid out (pinned spine visible), not animate an expansion sequence. Executives should see the structured supply chain immediately, not watch the graph build itself.
- **Generic "Node A → Node B" labels**: All demo data must use real-sounding names. "Liqtech International → Continental AG → MLX90363 Hall Sensor → Golf MQB Front Module → Wolfsburg Plant → MQB Platform (Golf 8 / Audi A3)" is the kind of specificity that earns credibility with VW supply chain directors.
- **Unlabeled dimming**: When the fog effect applies on selection, a small tooltip or breadcrumb should state why the graph dimmed ("Showing suppliers connected to Liqtech International"). This prevents the executive from thinking the tool is broken.
- **Shortest path that shows nothing**: Bloom's 20-hop limit and "first result only" behavior means the prototype should use a pre-computed path for reliability. Do not run a live shortest-path query against a simulated dataset during a demo.

---

## Sources

- [Neo4j Bloom Scene Interactions](https://neo4j.com/docs/bloom-user-guide/current/bloom-visual-tour/bloom-scene-interactions/)
- [Neo4j Bloom Overview](https://neo4j.com/docs/bloom-user-guide/current/bloom-visual-tour/bloom-overview/)
- [Linkurious Enterprise: Expand Nodes (v4.3)](https://doc.linkurious.com/user-manual/latest/expand/)
- [Linkurious Enterprise: Inspect Data (v4.3)](https://doc.linkurious.com/user-manual/latest/visualization-inspect/)
- [Linkurious Enterprise: Pinning Nodes (v4.3)](https://doc.linkurious.com/user-manual/latest/pinning/)
- [Linkurious Enterprise 4.2 Release Notes](https://linkurious.com/blog/linkurious-enterprise-4-2/)
- [Maltego: Navigate the Interface](https://docs.maltego.com/en/support/solutions/articles/15000059532-navigate-the-interface)
- [Maltego: Starting an Investigation](https://docs.maltego.com/en/support/solutions/articles/15000059534-starting-an-investigation)
- [Palantir Vertex: Explore Existing Graphs](https://www.palantir.com/docs/foundry/vertex/graphs-explore)
- [Palantir Vertex: Explore Object Relationships](https://www.palantir.com/docs/foundry/vertex/explore-object-relationships)

# SCRM Graph UX — Competitive Landscape
## N-tier Supplier Monitor · Graph Explorer Prototype Research

*Research date: May 2026 | Audience: Internal — VW Graph Explorer prototype team*

---

## Context

This document surveys the graph and network visualization UIs of the leading supply chain risk management (SCRM) platforms. The goal is to establish the current state of the art, identify interaction patterns worth adopting, and define the white space that the N-tier Supplier Monitor's Graph Explorer must fill — particularly around OEM-specific impact path tracing from Tier-2/3 supplier risk to vehicle program and plant.

---

## 1. Prewave

### Graph visualization
Prewave's network view, called the **Tier-N Explorer**, uses a **Sankey graph format**. Suppliers appear in columns left to right, one column per tier. The leftmost column shows direct (Tier-1) suppliers, sorted by spend; sub-tier suppliers fill subsequent columns sorted by shipment count. Lines connect suppliers across tiers; line width scales with the number of recorded shipments between the pair. The visualization is accessed via a tab in the top application ribbon and requires selecting a pre-built "collection" of suppliers.

The Sankey is primarily derived from **customs and trade data** rather than OEM-validated BOM data — it maps what has been shipped between companies, not what parts belong to which assembly or program.

### Node types and visual encoding
Nodes represent legal entities (supplier companies). There is no visual distinction between Tier-1, Tier-2, Tier-3 *as shape or color* — tier is conveyed purely by column position. Hover tooltips show shipment counts. Clicking a supplier highlights all connected paths up and down the chain. No representation of physical sites, parts, assemblies, or vehicle programs.

### Risk severity encoding
Risk signals from Prewave's AI monitoring (financial instability, ESG events, geopolitical alerts) appear as alert flags associated with supplier entities in other modules, not visually encoded *within* the Sankey graph itself. Risk overlay in the network view is minimal.

### Impact tracing: Tier-2 to part/assembly/plant/program
**Not supported.** The Sankey shows supplier-to-supplier flow by shipment volume; it cannot trace which specific part, assembly, plant, or VW vehicle program is affected by a Tier-2 disruption. Impact tracing is effectively: "Supplier X ships something to Supplier Y" — the "something" is HS code categories, not OEM part numbers or assemblies.

### Notable graph UX strengths
- Line width as a flow volume indicator is intuitive and immediately communicates dependency weight
- Tier-specific filtering (e.g., filter one tier by country, see what persists at other tiers) is powerful for geographic exposure analysis
- Saveable filter sets for recurring queries
- Scalable — handles large collections without collapsing into an unreadable hairball

### What is notably missing
- No OEM-side linkage (no parts, no assemblies, no plants, no vehicle programs)
- No risk severity encoded in the graph itself
- Ownership / corporate parentage not visible
- Single-source-of-supply paths not flagged
- Direction of flow is ambiguous (shipments vs. supply dependencies)

---

## 2. Resilinc

### Graph visualization
Resilinc's primary visualization paradigm is **map-based**, not graph-native. The platform shows supplier sites as pins on an interactive world map, coloured by risk level. A separate multi-tier mapping module provides network views of supplier-to-supplier relationships down to part-site level, but the dominant UX is geospatial. EventWatch notifications identify which supplier sites are in a disruption zone and immediately cross-reference which parts originate there, along with recovery time estimates and revenue-at-risk figures.

Resilinc differentiates itself by requiring **supplier-validated data** — suppliers self-report their site locations and parts produced — which means impact assessments are based on actual supplier-confirmed relationships rather than inferred trade flows.

### Node types and visual encoding
Nodes include supplier legal entities, physical manufacturing sites, and parts (at the SKU/part-number level). Sites are the primary visual unit on the map. Part-level impact is surfaced in alert context panels rather than in the graph itself.

### Risk severity encoding
Color-coded map pins (red/amber/green). Alert panels rank parts by recovery time and revenue impact. AI models continuously update scores based on external events cross-referenced against the supplier-site-part mapping.

### Impact tracing: Tier-2 to part/assembly/plant/program
**Partial.** Resilinc can identify which parts are sourced from an impacted site, and can estimate revenue at risk. However, the tracing terminates at the part number level — there is no native linkage to OEM assemblies, production programs, or specific vehicle models. The tool does not know that Part X feeds Assembly Y which goes into Golf MQB which is built at Wolfsburg.

### Notable graph UX strengths
- Supplier-validated data is a gold standard for accuracy — not inferred
- Part-site level granularity is the most detailed of any tool surveyed
- EventWatch alert format: disruption → impacted sites → impacted parts → revenue at risk is a crisp, actionable cascade
- What-if scenario planning for evaluating alternative sourcing

### What is notably missing
- No vehicle program / plant linkage
- Map metaphor limits the ability to show multi-tier cascades as a connected path
- Network graph is secondary, not primary — the main UX is geospatial
- Onboarding is supplier-dependent: if suppliers don't complete data intake, coverage is thin

---

## 3. Exiger (Supply Chain Explorer / 1ExigerAI)

### Graph visualization
Exiger launched **Supply Chain Explorer** in 2022 as a "single-click supply chain risk detection" platform. The product discovers supplier networks by mining digital footprints, global shipping records, and contract data — not requiring prior supplier onboarding. The **1ExigerAI** platform (2025–2026) reframes this as an "AI-native operating system" with a unified graph-based view across all tiers.

Exiger describes its visualization as "hyper-visual configurable risk assessments" surfacing "tangible threats" across the discovered supply graph. The platform fuses bills of material (when provided by the customer) with its world-scale corporate relationship database (10 billion+ shipment and corporate records) and assigns live risk scores to each supplier site.

### Node types and visual encoding
Nodes include supplier legal entities, corporate parents/subsidiaries (ownership chain), and physical sites. When BOM data is loaded, item-level and assembly-level nodes are present. The platform is particularly strong on **entity resolution** — identifying that two apparently distinct supplier entities are in fact the same corporate parent, or flagging state-owned flags and sanctions relationships within the ownership structure.

### Risk severity encoding
Configurable risk scoring across 50+ risk categories (sanctions, cyber, ESG, financial). "Especially risky nodes" are highlighted visually. Dashboards surface recommendations for action.

### Impact tracing: Tier-2 to part/assembly/plant/program
**Conditional.** If a customer uploads their BOM, Exiger can trace from a specific part or component to the full supplier network, and in the other direction, from a disrupted supplier site to the parts/assemblies it sources. However, the OEM-side context (plant, vehicle program, SOP/EOP) is not built into the platform — that knowledge would have to come from the customer's own data integration. The value-add is primarily on the supplier/risk side.

### Notable graph UX strengths
- Strongest ownership chain visualization of any platform surveyed — the "who actually controls this supplier" question (Core Question #4 in the prototype brief) is Exiger's clearest strength
- No pre-onboarding required — discovers supplier networks from public data
- Government and defense-hardened for sanctions/compliance scenarios
- BOM integration enables item-level tracing when provided

### What is notably missing
- Vehicle program and plant linkage absent by default
- UX optimized for compliance/regulatory risk, not operational production risk
- Less suited to answering "which VW program stops if Murata Fukuoka fails"
- Defense/government orientation may read as irrelevant to VW executives

---

## 4. Sphera (formerly Riskmethods, acquired 2022)

### Graph visualization
Sphera's SCRM suite (originally Riskmethods) includes several visualization modules:

**Risk Radar** — an interactive world map showing the "health" of the supply network, with supplier sites visible from facility level to sub-tier. Dependencies are overlaid on the geographic view.

**Impact Analyzer** — an interactive heat map displaying supplier criticality scores. Each supplier and category receives a score on a 0–10 scale, rendered in a red-orange-green color scheme. The matrix view plots suppliers against category dimensions (spend, risk, criticality).

**N-Tier Transparency / Sub-Tier Visibility** — maps upstream and downstream supplier relationships across tiers. Network connections are shown on a digital world map rather than as an abstract graph.

### Node types and visual encoding
Nodes include supplier companies, physical sites, and spend categories. Risk is encoded by the RAG 0–10 scale. Criticality (impact score) is a separate dimension from likelihood (risk score), which is a meaningful design choice.

### Risk severity encoding
Red-orange-green, 0–10 numeric scale. Heat maps for category-level analysis. The Impact Analyzer separates **probability** (risk score) from **impact** (criticality), surfacing the combination for triage.

### Impact tracing: Tier-2 to part/assembly/plant/program
**Not supported.** The Impact Analyzer operates at the spend-category and supplier level — impact is expressed as revenue/spend at risk, not as a specific part, assembly, plant, or vehicle program. The platform does not have OEM-side production data.

*Automotive customer testimonials (Joyson, AGCO) speak to early warning of supplier-site disruptions, not to program-level or plant-level impact tracing.*

### Notable graph UX strengths
- Separating risk probability from impact criticality is a mature UX decision that avoids risk-score conflation
- Category-level heat map is easy for procurement to use without graph literacy
- LkSG (German Supply Chain Due Diligence Act) compliance module — directly relevant to VW Group regulatory context
- Action Planner workflow module bridges risk identification to mitigation tasks

### What is notably missing
- No vehicle program or plant linkage
- Map view reduces multi-tier cascades to geography, not dependency topology
- Single-point-of-failure identification not native
- Impact Analyzer works at category/supplier level, not at part or assembly level

---

## 5. Interos

### Graph visualization
Interos holds a U.S. design patent for its **Galaxy visualization** — a radically different layout compared to competitors. The Galaxy arranges the supply network into **three concentric rings** representing supplier tiers (Tier-1 innermost, Tier-3 outermost), using a **circle-packing** approach. Each circle's **color encodes risk level**; its **size encodes connectivity** (number of relationships). The interface is designed to handle 30,000+ supplier relationships without collapsing, and is intended to help analysts detect patterns, outliers, and hidden relationships at scale.

The iTracing feature extends this to product/material level: risk is traced to specific products, materials, and revenue-critical inputs across tiers.

### Node types and visual encoding
Primarily supplier legal entities. Multiple risk dimensions are tracked simultaneously: cyber, financial, operational, geographic, governance. Ownership chains and beneficial ownership are visible. Circle size = degree centrality (connectivity); color = aggregated risk score.

### Risk severity encoding
Color per node (circle). The patented design is the most visually distinctive approach to risk encoding among the tools surveyed.

### Impact tracing: Tier-2 to part/assembly/plant/program
**Partial, through iTracing.** Interos has the deepest multi-tier tracing of any platform in terms of supplier network depth. iTracing links risk to "specific products, materials, and revenue-critical inputs." However, the OEM-side (plant, vehicle program, SOP) is not represented — the tracing terminates at the product/material level from the supplier side.

### Notable graph UX strengths
- Galaxy is the most visually distinctive and patent-protected layout — forces a top-down pattern view
- Handles very large graphs (30K+ entities) without performance degradation
- Multiple simultaneous risk dimensions encoded in a single view
- Ownership concentration detection is strong — identifying shared parents across apparently separate supply paths directly addresses Core Question #3 and #4

### What is notably missing
- Three-ring Galaxy excels at pattern detection but is poor for tracing a specific causal path — "which path does this risk travel?" is hard to answer in a radial layout
- No vehicle program, plant, or SOP/EOP encoding
- The patented design is visually novel but may confuse VW executives unfamiliar with graph literacy

---

## 6. Everstream Analytics

### Graph visualization
Everstream's platform is built on **Mapbox** and is fundamentally map-first. It creates what the company describes as a "digital twin" of the supply network, connecting companies, locations, shipments, lanes, and materials across the value chain. Risk is surfaced as a geographic heat map over this network — natural disasters, geopolitical events, and weather disruptions are visualized as event regions on the map, with affected supplier pins highlighted.

Sub-tier discovery is derived from 100M+ trading relationships in a proprietary graph database, but the user-facing interface is the map view rather than an abstract graph.

### Node types and visual encoding
Nodes include companies (legal entities), sites (facilities), shipment lanes, and materials (via HS codes). Risk is shown as composite weighted scores per entity. Clicking a node opens its risk scorecard.

### Risk severity encoding
Heat maps by geography and risk type. Weighted composite scores for at-a-glance network risk. Event overlays (e.g., typhoon track, port congestion zone) applied to the map.

### Impact tracing: Tier-2 to part/assembly/plant/program
**Not supported.** Everstream's strength is geographic and logistics-level disruption prediction — weather events, port disruptions, geopolitical trade route risks. Part-level or program-level OEM impact tracing is not part of the product.

### Notable graph UX strengths
- Map-first design is highly accessible to non-technical users
- Predictive risk (weather, logistics, insolvency forecast) rather than reactive is genuinely differentiated
- Lane-level (shipping route) visualization shows the logistics dependency, not just the supplier dependency — valuable for Tier-3 single-source scenarios

### What is notably missing
- No OEM-side data, no part/assembly/plant/program tracing
- Map metaphor cannot show non-geographic dependencies (ownership concentration, BOM structure)
- Not differentiated for automotive OEM use cases

---

## 7. Z2Data (Honorable Mention — Electronics/Semiconductor SCRM)

### Summary
Z2Data is purpose-built for **electronic component and semiconductor supply chains**, making it directly relevant to the prototype scenario (Tier-2 semiconductor risk). Its database covers 1 billion+ electronic components, 1 million+ suppliers, and 200,000 manufacturing sites, with explicit representation of fabs, EMS sites, and assembly facilities — not just supplier legal entities.

The platform visualizes component-level risk with supply chain maps showing every event impacting the supply chain by location, size, and spread. Risk scoring covers component, geographic, and supplier risk dimensions simultaneously. Scenario planning dashboards model alternative sourcing.

**Relevance to prototype:** Z2Data demonstrates that **component-level granularity is achievable** — the question for the prototype is whether that granularity can be linked upward to the OEM vehicle program and plant side. Z2Data does not do this; it terminates at the component/supplier level from the electronics buyer's perspective.

---

## Synthesis

### State of the Art in Supply Chain Graph UX (2026)

The market has converged on a set of standard capabilities:

1. **Multi-tier discovery is table stakes.** Every serious SCRM platform now claims Tier-N mapping. The differentiator is whether that mapping is supplier-validated (Resilinc), inferred from trade data (Prewave, Everstream), or AI-generated from public corporate data (Exiger, Interos).

2. **Map-first is the dominant visualization paradigm.** Sphera, Everstream, and partially Resilinc use geography as the primary organizing metaphor. This is accessible but fundamentally limits the ability to show non-geographic dependencies — ownership concentration, BOM structure, program-level impact.

3. **Risk scoring without impact context.** Every platform scores supplier risk (financial, operational, ESG, cyber). None connects that score to a specific OEM production consequence: "this red supplier means this vehicle program stops in 11 days."

4. **No platform has bridged the supplier → part → assembly → program → plant chain.** This is the single most consistent gap across every tool surveyed. The supply-side is mapped; the demand-side (OEM's internal production structure) is absent.

5. **Ownership chain analysis is emerging.** Interos and Exiger are the furthest advanced in surfacing corporate ownership concentration. This directly serves the "hidden concentration" use case (Core Question #3 and #4 in the brief) but no competitor pairs it with vehicle program impact.

6. **AI is table stakes; agentic workflows are the next wave.** Resilinc is repositioning as "agentic AI supply chain resiliency." Exiger launched 1ExigerAI. The differentiation is moving from "we alert you to risk" to "we tell you what to do about it."

---

### Interaction Patterns to Adopt

**From Resilinc:** The EventWatch cascade format — `disruption event → affected sites → affected parts → recovery time + revenue at risk` — is the right mental model for an impact path summary card. The N-tier Supplier Monitor should replicate this structure but extend it one layer further: `→ affected assemblies → affected programs → plants at risk → days to production stop`.

**From Sphera/Riskmethods Impact Analyzer:** Separating risk **probability** (likelihood score) from risk **impact/criticality** is a mature and correct design decision. The VW prototype should encode both axes independently — a low-probability but catastrophic single-source dependency looks different from a high-probability but easily substituted risk.

**From Interos:** Color = risk severity; size = connectivity/centrality. These two visual variables work well together and are pre-attentive (perceived instantly without focused attention). The prototype should use node size to communicate dependency centrality (how many programs flow through this supplier) and color to communicate current risk level.

**From Prewave:** Line width as flow volume/dependency weight is intuitive in the Sankey layout. In a force-directed graph, edge weight (thickness) should encode dependency strength — a sole-source relationship should have a visually heavier connection than one of five alternative sources.

**From Exiger:** "Single-click discovery" of the full supplier network — do not gate the visualization behind lengthy data onboarding. The prototype's graph should feel immediate. Ownership chain overlay as a toggleable mode (separate from the operational supply chain view) mirrors Exiger's entity-resolution layer.

**Cross-tool:** RAG color encoding (red/amber/green) plus numeric score is universal because it works. The prototype can use the VW brand palette (`#e63946` for critical, `#f4a261` for elevated, `#2ec4b6` for healthy) mapped onto the standard three-state risk model.

---

### The Clear Gap the N-tier Supplier Monitor Must Fill

**No existing SCRM tool connects the supplier risk network to the OEM's internal production graph.**

Every tool surveyed terminates at the boundary between the external supply chain and the OEM's internal world. They can identify that Murata's Fukuoka site is at risk. They cannot tell VW which part numbers Fukuoka supplies, which Golf MEB sub-assembly those parts feed, which Zwickau plant line depends on that assembly, how many vehicles per day that line produces, or when SOP/EOP dates create a timing sensitivity.

This is not a data problem — VW has SAP BOM data, plant capacity data, and program timing data. It is an integration and linking problem, and it is the exact value proposition of the N-tier Supplier Monitor.

The prototype must visually demonstrate this linkage. The moment a viewer sees a Tier-2 supplier node connected through a visible path to a Golf MEB assembly node to a Zwickau plant node — something none of the tools above can show — the differentiation is self-evident.

---

### How the Prototype Should Look Demonstrably Different

**1. Dark canvas, graph-native.** All competitors default to either map views or light-background enterprise dashboards. The dark canvas (`#0d1929`) immediately signals a different design philosophy — this is an intelligence layer, not a procurement portal.

**2. Both ends of the chain are first-class objects.** The graph should contain OEM-side entities: `Golf MEB Platform`, `Zwickau Plant`, `MQB-A0 Body Assembly`, alongside supplier entities. No competitor shows this. This is the visual proof of OEM-specific linkage.

**3. Bidirectional, click-to-trace paths.** Click a Tier-2 supplier → the graph animates to highlight the exact path downstream to programs and plants. Click a vehicle program → the graph highlights all upstream supply paths and flags the highest-risk links. This interaction is not present in any surveyed tool.

**4. Single-source-of-failure visual signature.** Sole-source dependencies should have a visually distinct treatment — a red ring, a warning badge, a heavier edge — so they are immediately identifiable even before the user clicks anything. This directly addresses Core Question #2 (SPOF exposure).

**5. Ownership concentration toggle.** A toggle overlays corporate parent relationships on the graph, revealing cases where two apparently independent Tier-1 suppliers share a common Tier-2 or Tier-3 parent. This is the "hidden concentration" disclosure (Core Question #3). Interos does this for supplier networks; no one does it in the context of VW program impact.

**6. Impact path summary card.** When a risk event is selected, a side panel summarizes the blast radius in plain language: "This event affects 3 parts, 1 sub-assembly, and production of the ID.4 and Tiguan at Zwickau. Estimated production risk: 340 vehicles/day. No alternative supplier qualified for Part 8K0-955-409-A." This language would be entirely foreign to any current SCRM tool UI.

**7. Comparative healthy vs. at-risk paths.** The prototype scenario should show one at-risk path (Murata → Continental → Park Sensor Assembly → Zwickau) alongside one healthy alternative path to the same part category — demonstrating not just blast radius but alternative path availability (Core Question #5). No competitor surfaces this dual-path comparison in a graph view.

---

## Appendix: Tools Surveyed

| Tool | Primary Viz Type | Part-Level? | Program-Level? | Ownership Chain? | Best For |
|---|---|---|---|---|---|
| Prewave | Sankey (tier columns) | No | No | No | Multi-tier supply mapping via trade data |
| Resilinc | Map + tabular | Yes (validated) | No | No | Part-site impact alerts with supplier onboarding |
| Exiger / 1ExigerAI | Knowledge graph + dashboards | Conditional (BOM upload) | No | Yes (strong) | Ownership risk, sanctions, compliance |
| Sphera (Riskmethods) | World map + heat map | No | No | No | Category-level risk + LkSG compliance |
| Interos | Galaxy (concentric rings) | Partial (iTracing) | No | Yes | Pattern detection in large networks |
| Everstream | Map (Mapbox) | No | No | No | Predictive logistics/weather disruption |
| Z2Data | Map + component tree | Yes (component) | No | No | Electronic component supply risk |
| **N-tier Supplier Monitor** | **Dark-canvas graph** | **Yes** | **Yes (VW-specific)** | **Yes** | **OEM impact path tracing** |

---

*Compiled for the Graph Explorer Hi-Fi prototype · Volkswagen Group context · May 2026*

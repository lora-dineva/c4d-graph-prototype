# VW Group Stakeholder Research
## Graph Explorer Prototype — Audience Context & Design Calibration

*Compiled: May 2026 | For: N-tier Supplier Monitor prototype demo preparation*

---

## 1. Supply Chain Risk & Visibility Tools VW Currently Uses

### SAP S/4HANA — Core ERP Backbone
VW's "One Log" transformation project is migrating its entire inbound logistics stack from fragmented legacy systems into cloud-based SAP S/4HANA. This covers transport order management, warehouse management, yard and plant logistics, scheduling, and inventory — across more than 200 cross-functional employees. The migration is being phased across plants, brands, and regions.

**Implication for the prototype:** SAP is the operational record system. Executives will assume a new tool must integrate with, not duplicate, SAP. Position the Graph Explorer as the intelligence layer on top of SAP data — it answers *what does this mean* when SAP raises a flag.

### Catena-X / Cofinity-X — Industry Data Sharing Network
VW is a founding member of the Catena-X Automotive Network. They were the first company within Cofinity-X (the Catena-X operating company) to deploy live Catena-X services, starting with business partner data management and extending to quality management and demand capacity management. A 2025 initiative adds data infrastructure for factory equipment suppliers. The stated benefit is identifying supply risks earlier and jointly developing responses faster.

**Implication for the prototype:** Catena-X is the data pipe VW has bet on for supplier transparency. The prototype should reference Catena-X as a data source — it's the vocabulary VW's supply chain teams use. Do not treat it as a competitor; treat it as a feeder.

### Early Warning Systems & Internal Risk Infrastructure
VW has had an internal responsible supply chain system since 2022, built to meet LkSG duty-of-care requirements. This system identifies, tracks, and counteracts human rights, social, and environmental risks. It operates with early warning signals for supply disruptions and runs continuous monitoring of global and local risks.

**Implication for the prototype:** VW already has a risk detection layer. What they lack is the *connected graph* that shows impact paths from a risk signal to a specific plant and program. The prototype's value is post-detection: once the alert fires, what stops?

### Tools Not Publicly Confirmed (but likely in use)
- **Bloomberg Terminal:** Used by Group Treasury and procurement for commodity and credit risk monitoring — not confirmed as integrated with supply chain risk tools, but standard equipment for purchasing VPs at this level.
- **Prewave / Riskmethods / similar SCRM tools:** Not publicly confirmed for VW Group specifically, though common at German OEMs of this scale.
- **Celonis:** No public confirmation of Celonis use at VW Group for supply chain specifically. Celonis features prominently in their SAP ecosystem but specific process mining deployments are not documented publicly.

---

## 2. VW's Catena-X Approach — What They Actually Believe

VW is not just a participant in Catena-X — they are **founding member and early deployer**, which signals genuine strategic commitment, not passive compliance. Simon Motter (Head of Group Logistics) has explicitly cited Catena-X integration as a core element of their supply chain digitalization.

The stated strategic goals are:
- Identify supply risks at an earlier stage
- Enable faster joint development of alternatives
- Create a shared database for real-time collaboration with partners
- Achieve sovereign, secure data sharing without exposing commercially sensitive cost information

The data sovereignty point is critical: VW's stated position is that they want transparency *without* exposing cost data to competitors or suppliers. This is exactly the tension that a knowledge graph with role-based visibility can resolve.

**Current deployment status (as of early 2026):**
1. Business partner data management — live
2. Quality management — being rolled out
3. Demand capacity management — being rolled out
4. Factory equipment data infrastructure — announced for 2025/2026

**Important caveat:** Obtaining transparency across multiple supplier tiers remains *genuinely difficult* — particularly where commercially sensitive information is involved. VW's own Simon Motter acknowledged this. The prototype should acknowledge this tension, not pretend it doesn't exist.

---

## 3. VW's Digital Design Language

### GroupUI — The Multi-Brand Design System
VW Group operates **GroupUI**, a holistic, multi-brand design system covering all 15+ brands (VW, Porsche, Skoda, Audi, etc.) for internal and customer-facing digital applications. It won the Red Dot Design Award. Key technical stack: Figma → StencilJS web components, documented in Frontify. The underlying design principles are shared; icons, colors, and typography are brand-specific.

### New Corporate Design (2025)
VW Group introduced a completely new corporate design in 2025, replacing the 2007 identity. Key elements:
- **Primary colors:** Deep Space Blue, Vivid Green, Pure White
- **Accent:** Electric Neon
- **New feature:** Color gradients — positioned as representing "mobility, motion and humanity"
- **Custom typeface:** "The Group" — optimized for digital and analog, all platforms and media

The word mark was changed from "Volkswagen Aktiengesellschaft" to "Volkswagen Group" to emphasize global orientation. The overall direction is more progressive and international — away from the conservative German engineering corporate aesthetic.

### Practical Signals for Enterprise Tool Design
- GroupUI is explicitly built for **internal applications** — it is not a consumer-facing design language
- The system is described as "user-centred" and designed to support "agile collaboration of interdisciplinary product teams"
- High information density with clear component hierarchy — not minimal, not decorative
- The Red Dot Award signals that aesthetics matter to VW's digital leadership; they will notice if a prototype looks dated or cheap

---

## 4. Supply Chain Pain Points VW Executives Have Publicly Discussed

### The Nexperia Crisis (October 2025) — The Most Recent Live Example
In October 2025, the Dutch government intervened to take control of Nexperia — a Netherlands-registered but Chinese-owned (Wingtech) chipmaker, citing national security concerns. The US had placed Wingtech on its entity list in December 2024; by September 2025, export controls extended to all entities 50%+ owned by listed companies, catching Nexperia regardless of its Dutch registration.

Nexperia supplies ~40% of global market for key transistors, diodes, and MOSFETs — components found in every vehicle lighting system, ECU, and battery management system. On October 22, 2025, VW told workers that a production stoppage was imminent. Short-time work discussions began.

**This is the prototype scenario made real.** A Tier-2 semiconductor supplier, Chinese ownership chain, Dutch registration (obfuscated), geopolitical intervention, near-production stoppage at a German OEM — executives in the room lived through this eight months ago.

### The 2021–2023 Chip Shortage — The Defining Lesson
The semiconductor shortage exposed that VW had essentially zero visibility beyond Tier-1. They did not know which of their sub-suppliers depended on TSMC or on specific fabs in Taiwan. The response — moving to direct procurement agreements with Intel, NXP, and Renesas, bypassing Tier-1 electronics suppliers for semiconductor contracts — was an admission that indirect supply chain visibility had failed.

**Implication:** Tier-3 exposure (Question 8 in the core framework) is not theoretical for VW. It cost them billions and triggered a strategic overhaul.

### LkSG / CSRD Compliance — Regulatory Pressure with Teeth
Germany's Supply Chain Due Diligence Act (LkSG) has been in force since 2023 (for companies with 1,000+ employees). VW published their LkSG compliance report as recently as May 28, 2025. While the *reporting obligation* is being folded into the EU CSRD framework (a September 2025 Federal Cabinet decision), the underlying due diligence *obligations* remain: risk management systems, annual risk assessments across direct and indirect suppliers, documented evidence of remediation.

**Implication:** A graph explorer that can show which supply paths have and haven't been ESG-assessed — with gap identification — is directly relevant to the legal team and CSO in the room, not just supply chain directors. Compliance documentation is a purchasing VP's liability.

### "One Source of Truth" — The Organizational Pain
Simon Motter explicitly named "one source of truth" as the overarching goal for VW's supply chain digitalization. Today, data is fragmented across legacy systems, brands, and regions. The SAP One Log migration is the infrastructure response, but the analytical layer — connecting supplier, part, plant, and program data into a coherent picture — does not yet exist at the group level.

This is the exact gap the Graph Explorer fills.

### Geopolitical Supply Chain Localization
VW has publicly committed to localizing supply chains — building production closer to key markets, reducing dependency on single geographies. This is a board-level strategic directive, not just a procurement preference. Tools that quantify geographic concentration risk (how much of this program's supply passes through high-risk geographies) are directly relevant to strategy decisions being made now.

---

## 5. What Makes a Prototype Feel Enterprise-Grade to a German Automotive Executive

### Signals That Read as "Enterprise-Grade"

**Data provenance and sourcing.** Always show *where the data comes from*. SAP icon next to financial exposure data. Catena-X badge next to supplier tier data. Bloomberg icon next to credit risk scores. German automotive executives are sceptical of black-box outputs — they want to know what system generated a figure.

**Density and specificity.** The Bloomberg Terminal is the reference aesthetic for enterprise analytical tools: high density, no wasted space, precise values. A prototype that shows "Supplier Risk: HIGH" in a large font with a red icon reads as consumer. A prototype that shows "Murata Manufacturing Co. — Credit: CCC+ (Fitch, Nov 2025) — Single-source coverage: 4 vehicle programs — Alternate qualification lead time: 18 months" reads as enterprise.

**System integration callouts.** Explicitly reference integration points: "Escalation sent to SAP Action Workspace," "Alert synced to Catena-X partner portal," "LkSG audit export ready." Even if these are prototype UI labels, they signal that the tool understands the ecosystem.

**Realistic, named data.** Use plausible names: Continental AG, Murata Manufacturing, Liqtech International, Wolfsburg Plant, Golf MQB platform, Nexperia (now a name executives literally fear). "Supplier A" and "Part 1" destroy credibility instantly.

**Unambiguous action pathways.** After the blast radius is shown, what does the executive actually *do*? The prototype must show the decision support layer: who is the contact at the affected supplier, what is the escalation path, what is the estimated impact if no action is taken vs. if mitigation is triggered. Executives do not want a visualization — they want a decision.

**Export and audit trails.** A visible "Export to PDF / LkSG audit pack" button signals that the tool produces durable records, not ephemeral views.

### Signals That Read as "Startup Demo"

- Large circle nodes with supplier names and nothing else
- Animations that serve aesthetics rather than cognition (nodes flying into position)
- Generic risk colors with no underlying metric definition
- Missing system integration context
- Slider controls or playful interactive features without clear enterprise purpose
- Clean whitespace — whitespace reads as design, not as enterprise analytical power
- "Type anything" AI chat interfaces without grounded, citable outputs

---

## 6. Visual Design Calibration — Recommendations for the Prototype

### Should You Use VW Brand Colors or a Neutral Dark Palette?

**Use a disciplined hybrid, leaning dark-analytical.** Here is the reasoning:

VW's new corporate design (Deep Space Blue + Vivid Green + Pure White + Electric Neon gradient) is a *communications and consumer-facing* identity — it is not how their internal enterprise applications are styled. GroupUI operates with brand-specific tokens, and enterprise application contexts favor neutral, high-contrast surfaces. Bloomberg, Palantir, and most enterprise data platforms use dark canvases precisely because they signal "analytical instrument, not marketing material."

**Recommended approach:**
- **Canvas:** Dark navy (#0d1929) — professional, analytical, not consumer
- **Header/brand strip:** VW Deep Space Blue / #001e50 or the new Deep Space Blue equivalent — anchors brand recognition without making the whole interface feel like a VW brochure
- **Primary accent:** Teal (#00b0f0) for interactive elements, active paths, and highlights — this is distinct enough from VW's consumer blue to feel like a tool, not a website
- **Risk signals:** Use a purposeful, non-cliché risk palette. Avoid raw red/amber/green. Consider: #e84057 (critical), #f0a500 (elevated), #00c48c (nominal) — the muted, precise variants read as calibrated rather than traffic-light consumer
- **Data surfaces:** Light grey (#f4f6f9) for information panels on dark canvas, or dark cards (#151f2e) — not pure black and not pure white
- **Typography:** Inter or Source Sans Pro (both have proper numeric tabular variants, essential for data-dense views). Avoid decorative fonts. Size hierarchy: 11–12px data labels, 14px UI labels, 16–18px section headers. High density is a signal of seriousness.

### Typography and Density

For a German automotive audience, density is a feature, not a bug. These executives read Bloomberg terminals and SAP interfaces. An interface that looks "clean" in the consumer design sense — generous white space, large typography, minimal information — will be read as lacking depth.

Target density: enough data that a director can spend 2 minutes looking at a single screen and answer a question without clicking. Reserve whitespace for visual separation of functional zones (graph area / detail panel / action strip), not for aesthetic breathing room.

**Avoid:** Rounded pill-shaped elements, gradient backgrounds on content areas, card shadows with high blur radius, emoji or icon-heavy labels, micro-animations on hover. These all age the prototype and signal consumer product thinking.

---

## 7. The Three Demo Scenarios with Maximum VW Impact

### Scenario 1: The Nexperia Replay — Geopolitical SPOF Exposure

**The premise:** An alert fires. A Tier-2 semiconductor supplier (call it "Nexperia-equivalent": "NX Semiconductors BV, Netherlands — majority owned by Wingtech Technology, China") has had its export licenses suspended under BIS entity list expansion rules.

**What the graph shows:**
1. The blast radius: NX Semiconductors → Continental AG (Tier-1 electronics) → Gateway ECU module → Golf MQB, Audi A6 e-tron, Porsche Macan Electric → Wolfsburg Assembly Plant, Zwickau Plant
2. SPOF exposure: the ECU module has no qualified alternative supplier — lead time to qualify: 14 months
3. Hidden concentration: the same NX Semiconductors supplies MOSFETs directly to three other Tier-1 suppliers in the graph (Bosch, Valeo, Aptiv) — none of which VW has a direct contract with
4. Ownership overlay: the parent entity Wingtech appears on both the NX path and a Tier-3 passive components supplier in a separate part of the graph — two affected paths through one controlling entity VW had not mapped

**Why it lands:** This is almost exactly what happened in October 2025. Executives in the room were part of the response. The prototype shows a system that would have surfaced this 6 weeks earlier.

**Core questions answered:** 1 (blast radius), 2 (SPOF), 3 (hidden concentration), 4 (ownership risk), 10 (escalation path)

---

### Scenario 2: The Hidden Concentration Discovery — Taiwan Substrate Risk

**The premise:** A purchasing VP asks: "Which of our vehicle programs are exposed to Taiwan geopolitical risk beyond what we know about?"

**What the graph shows:**
1. Filter the graph by geography: Taiwan supply path involvement
2. Five Tier-1 suppliers (Continental, Bosch, Murata, TDK, Sumitomo Electric) all source a critical MLCC substrate from two Tier-3 suppliers in Hsinchu Science Park, Taiwan — neither of which VW has any direct commercial relationship with
3. These five Tier-1 suppliers collectively provide parts for the MEB electric platform — VW's core EV architecture
4. One of the two Tier-3 substrate suppliers also supplies to CATL (the battery supplier for VW's ID range) through a separate pathway — the same entity appears twice, as a Tier-3 electronic component supplier and a Tier-3 battery materials supplier
5. Ownership overlay: one of the two Taiwan substrate companies has 23% ownership by a state-adjacent investment vehicle — flagged as geopolitical concentration risk

**Why it lands:** This answers a question executives genuinely cannot answer with current tools. The "we don't know what we don't know" problem made visible. It directly activates the procurement localization strategy they have already announced.

**Core questions answered:** 3 (hidden concentration), 6 (geopolitical exposure), 4 (ownership risk), 8 (Tier-3 exposure)

---

### Scenario 3: The LkSG Compliance Gap Map — Audit Readiness in 90 Seconds

**The premise:** A supply chain compliance officer needs to produce the annual LkSG/CSRD supply chain due diligence report. They have 72 hours.

**What the graph shows:**
1. Filter the Golf MQB program's full supply network by ESG assessment status
2. The graph highlights in amber: supply paths where Tier-2 or Tier-3 suppliers have not been assessed within the 12-month window
3. Three paths are flagged: a Tier-2 chemical supplier in India (conflict mineral exposure — cobalt), a Tier-3 tooling supplier in Vietnam (labour rights risk — unaudited), and a Tier-2 electronics assembly subcontractor in Malaysia (environmental discharge, last audit 18 months ago)
4. Each flagged path shows: responsible purchasing manager, last assessment date, estimated remediation lead time, and whether the supplier has a Catena-X business partner record
5. One-click export: LkSG audit pack with all flagged paths, risk assessments, gap analysis, and responsible owner assignments — structured for submission

**Why it lands:** The LkSG reporting obligation is evolving but the underlying due diligence duty remains. Compliance directors are a significant stakeholder in the room. A tool that generates an audit pack directly from the graph turns a 2-week compliance exercise into a same-day capability. This is the lowest-risk ROI argument in the deck.

**Core questions answered:** 6 (geopolitical), 8 (Tier-3 exposure), implicitly regulatory risk; plus demonstrates the action/export workflow critical for enterprise credibility

---

## Key Sources

- [VW Group Annual Report 2024 — Operational Risks](https://annualreport2024.volkswagen-group.com/group-management-report/report-on-risks-and-opportunities/risks-and-opportunities/operational-risks-and-opportunities.html)
- [VW Group Annual Report 2025 — Procurement](https://annualreport2025.volkswagen-group.com/group-management-report/sustainable-value-enhancement/procurement.html)
- [Volkswagen builds supply chain efficiency through Catena-X](https://www.volkswagen-group.com/en/press-releases/volkswagen-builds-supply-chain-efficiency-through-industry-wide-data-exchange-16755)
- [VW Group enhances supply chain with Catena-X — Automotive Logistics](https://www.automotivelogistics.media/supply-chain-management/vw-group-accelerates-digital-supply-chain-transformation-as-part-of-cofinity-x-partnership/44838.article)
- [The quest for one source of truth in VW Group's digital supply chain](https://www.automotivelogistics.media/digital-technology/the-quest-for-one-source-of-truth-in-volkswagen-groups-digital-supply-chain/45266.article)
- [Simon Motter on shaping Volkswagen Group's supply chain](https://www.automotivelogistics.media/volkswagen/volkswagen-group-logistics-series-simon-motter-on-securing-the-supply-chain/45263.article)
- [Nexperia crisis: Semiconductor supply shock threatens global auto production](https://www.automotivemanufacturingsolutions.com/editors-pick/nexperia-standoff-imperils-global-auto-production-within-weeks/1590908)
- [VW halts production — chip shortage from trade war measures](https://www.wsws.org/en/articles/2025/10/27/tdfh-o27.html)
- [Volkswagen reshapes semiconductor sourcing — Supply Chain Dive](https://www.supplychaindive.com/news/volkswagen-turns-to-direct-sourcing-of-semiconductors/692165/)
- [VW Group new corporate design announcement](https://www.volkswagen-group.com/en/press-releases/more-progressive-more-digital-more-international-new-volkswagen-group-corporate-design-17600)
- [GroupUI design system — Red Dot Design Award](https://www.red-dot.org/project/groupui-41315)
- [MHP as Catena-X solution provider for VW AG suppliers](https://www.mhp.com/en/insights/newsroom/news-detail/view/catena-x-mhp-is-solution-provider-for-volkswagen-ag-suppliers)
- [VW LkSG Report 2024](https://www.volkswagen-group.com/en/publications/more/report-on-the-lksg-supply-chain-due-diligence-act-2024-3041)
- [How Group Logistics is overcoming crises — Automotive Logistics](https://www.automotivelogistics.media/oems/how-group-logistics-is-overcoming-crises-and-shaping-volkswagens-future-supply-chain/195728)
- [Volkswagen augmenting supply chain resiliency](https://theferrarigroup.com/volkswagen-augmenting-efforts-in-supply-chain-resiliency/)

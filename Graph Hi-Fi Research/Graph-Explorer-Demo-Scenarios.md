# Graph Explorer — Three Demo Scenarios

*Scenario design for the N-tier Supplier Monitor prototype · VW Group executive demo · 30 May 2026*

---

## How to use this document

Three scenarios, each built to prove a **different capability of the connected supply chain graph** that a flat table or dashboard structurally cannot match:

| # | Scenario | Capability it proves | Core question(s) answered |
|---|---|---|---|
| **A** | **One Chip, Two Platforms** | Impact blast radius — one risk, many endpoints | Q1 (blast radius), Q10 (escalation) |
| **B** | **The Redundancy That Wasn't** | Hidden concentration / shared dependency | Q3 (hidden concentration), Q2 (hidden SPOF), Q5 (alternative path) |
| **C** | **The Safe European Supplier** | Ownership / control-chain risk | Q4 (ownership), Q3 (concentration by owner) |

**Critical design choice: all three run on ONE shared dataset.** The prototype is a single supply chain network. Each scenario lights up a different part of it and asks a different question. This is itself a selling point — *one network, three questions a director couldn't answer this morning.* The full shared dataset is specified in the appendix; each scenario lists only the elements its specific reveal depends on.

**Cast convention.** Real names are used for the healthy, established players the audience will recognise (Continental, Bosch, Infineon, the VW models and plants). Invented-but-plausible names are used for the suppliers carrying the risk, so the demo defames no real company. Each scenario is anchored to a real precedent VW or the wider industry has actually lived through, cited at the end.

---

## Scenario A — "One Chip, Two Platforms"
**Capability: impact blast radius — one risk fans out to many endpoints.**

**Inciting event.**
A Tier-2 automotive semiconductor maker in Asia — **SuntoraMicro** — issues a profit warning and breaches a debt covenant. It sits in a region under tightening export controls, so a financial wobble and a geopolitical squeeze land in the same week. A Prewave/Bloomberg-style alert fires: *"SuntoraMicro — covenant breach, going-concern language in filing."* To the purchasing desk it reads as a minor commodity-chip vendor most people in the room have never heard of.

**The question the user asks.**
> *"If SuntoraMicro stops shipping, what production of ours stops — and when?"*

**Why a table / dashboard fails.**
SuntoraMicro is a Tier-2. It has no direct contract line in SAP — VW buys from **Continental** (Tier-1), not from SuntoraMicro. A supplier table shows the alert against a name with no obvious link to any VW program. To get from "this chip maker" to "these cars at these plants," an analyst must hand-explode multi-level BOMs and phone Continental to learn which of *their* sub-suppliers is affected. A dashboard can show that SuntoraMicro's risk score went red; it cannot show that the red travels two tiers down into two different vehicle platforms. Only ~2% of firms have any visibility past Tier-2 (McKinsey), which is exactly why the 2021 chip crunch became a $210B / 7.7M-unit blast-radius blindness problem.

**What the graph reveals.**
Select SuntoraMicro and trace forward. Its power MOSFETs flow through Continental into a **traction-inverter power module** (MEB electric platform); its one MCU flows through Continental into an **engine-control unit** (MQB combustion platform). From there the path fans out: the inverter feeds **ID.3 and ID.4 at Zwickau** and **ID.7 at Emden**; the ECU feeds **Golf and Tiguan at Wolfsburg**. One distressed Tier-2 → 2 parts → 2 assemblies → **2 platforms (electric and combustion) → 3 plants → 5 programs**, each annotated with days-of-supply and the date the line goes dark. The graph also ranks them: the inverter path has the shortest runway, so Zwickau goes dark first.

**The moment of insight.**
The executive expects a chip problem to be contained to "the electronics stuff." When SuntoraMicro is selected, the highlight sweeps simultaneously into the **EV flagship line and the combustion cash-cow line** — two parts of the business the room thinks of as completely separate — and a counter reads *"5 programs · 3 plants · first line down in 9 days."* The "oh" is the realisation that a name no one recognised sits underneath both the future and the present of the product range at once.

**Key data needed (nodes + edges).**
- **Suppliers:** SuntoraMicro (Tier-2, region = export-controlled, risk = financial + geo); Continental (Tier-1).
- **Parts:** power MOSFET (×1), MCU (×1) — both *supplied by* SuntoraMicro.
- **Assemblies:** traction-inverter power module (*contains* MOSFET); engine-control unit (*contains* MCU) — both *built by* Continental.
- **Plants:** Zwickau, Emden, Wolfsburg.
- **Programs:** ID.3, ID.4 (Zwickau); ID.7 (Emden); Golf, Tiguan (Wolfsburg).
- **Edges:** SuntoraMicro → MOSFET / MCU (*supplies*); part → assembly (*built-into*); assembly → program (*feeds*); program → plant (*produced-at*).
- **Attributes that make the reveal land:** per-part days-of-supply + in-transit buffer (drives the "line down in N days" ranking); a risk signal on SuntoraMicro (financial + geo) to colour the origin red.

---

## Scenario B — "The Redundancy That Wasn't"
**Capability: hidden concentration — two "independent" supply paths that quietly share one upstream source.**

**Inciting event.**
A wafer foundry in Asia — **Pan-Asia Wafer (PAW)** — announces an allocation cut: data-centre and memory demand is being prioritised over automotive (the real 2025–26 DRAM/mature-node squeeze), and a separate quality hold takes one line offline. No VW supplier is named in the alert. PAW is a Tier-3 — VW has never signed a contract with them and may not know the name.

**The question the user asks.**
> *"We deliberately dual-sourced this safety controller across two suppliers — is that redundancy real?"*

**Why a table / dashboard fails.**
On paper VW did everything right: the critical controller is sourced from **two different Tier-1s — Continental and Bosch** — specifically so no single supplier failure can stop the line. A sourcing table shows two approved vendors, two part numbers, two contracts: a green "dual-sourced" status. The table has no column for *"what fab makes the silicon inside each one,"* because that lives two tiers below the contract, in each Tier-1's own supply base. The shared dependency is invisible precisely because the data that would expose it sits in a place the OEM's systems don't reach. This is the "dual-sourced at Tier-1, single-sourced at Tier-2/3" trap — and it is how the Renesas Naka fire took out ~30% of the world's automotive MCUs from a single building.

**What the graph reveals.**
Trace the controller upstream along *both* approved paths. The Continental path and the Bosch path start as two clearly separate branches — then converge: both Tier-1s buy the underlying die from the **same foundry, Pan-Asia Wafer**. The deliberate redundancy collapses into a single point of failure one tier deeper than anyone was looking. The graph also answers the natural follow-up — *which programs are exposed through this hidden chokepoint?* — and surfaces that the same PAW dependency quietly underpins programs at two plants, so the concentration is bigger than the one controller that triggered the question.

**The moment of insight.**
Two paths drawn side by side as independent — the whole point of dual-sourcing — visibly **merge into one upstream supplier** as the trace runs. The screen makes the abstract concrete: the two "separate" lines bend toward each other and meet at a single red dot labelled with a foundry name no one in the room contracted with. The "oh" is *"our backup and our primary are the same company upstream — we paid for redundancy we never actually had."*

**Key data needed (nodes + edges).**
- **Suppliers:** Continental (Tier-1), Bosch (Tier-1), Pan-Asia Wafer / PAW (Tier-3, risk = operational/allocation + capacity).
- **Parts:** the safety controller as built by Continental (part A) and the equivalent built by Bosch (part B); the **shared die / wafer** fabbed by PAW that sits inside both.
- **Programs / plants:** at least two programs across two plants that draw this controller (e.g. an MEB program at Zwickau and an MQB program at Wolfsburg) so the concentration spans more than one line.
- **Edges:** Continental → part A and Bosch → part B (*supplies*); **part A → PAW die and part B → PAW die (*material-dependency* — the convergence edge that does all the work)**; die → PAW (*supplied-by*); parts → programs → plants downstream.
- **The essential trick:** the two Tier-1 paths must be modelled as genuinely separate down to the die, then share exactly one Tier-3 node. Without that single shared upstream node, there is no reveal.

---

## Scenario C — "The Safe European Supplier"
**Capability: ownership / control-chain risk — a supplier that looks safe until you see who controls it.**

**Inciting event.**
Having felt the SuntoraMicro scare (Scenario A), VW's purchasing team qualifies a European alternative for the inverter chip: **Veldhoven Semiconductors**, a Netherlands-based maker with a long industrial heritage. It is the textbook de-risking move — bring critical silicon back to Europe. Then a compliance alert fires: Veldhoven's ultimate parent has been added to an export-control entity list, and a government has signalled it may intervene in the company's governance.

**The question the user asks.**
> *"Our new European source is genuinely independent of the geography we're trying to leave — right?"*

**Why a table / dashboard fails.**
Every field a supplier table cares about says "safe": country = Netherlands, region = EU, tier = qualified alternate, geo-risk = low. Ownership lives in a different universe — Bloomberg, D&B, Orbis, commercial registries — and is **never joined** to the part/program data. So the table confidently shows a low-risk European supplier sitting next to the high-risk Asian one, and the de-risking looks complete. The single most important fact — *who actually controls this company* — is structurally absent from the view that drives the decision. You "diversify" into the exact risk you were escaping and feel safer for it.

**What the graph reveals.**
Switch on the **ownership overlay.** Veldhoven connects upward, past its Dutch operating entity, to an ultimate parent — **Hongqiao Tech Holdings** — domiciled in and controlled from the very jurisdiction VW was trying to diversify away from, and now entity-listed. The "European" supplier is European in address only; in control terms it is the same exposure, one layer up. The kicker: the overlay also draws a second line from Hongqiao down to **SuntoraMicro** — the original Asian supplier from Scenario A. The two sources VW believed were independent, on two continents, **roll up to a single owner.** The redundancy is fictional not because of a shared fab (Scenario B) but because of a shared owner.

**The moment of insight.**
The map shows two supplier dots far apart — one in Europe, one in Asia — that the room reads as "diversified." When the ownership overlay is toggled on, **two new lines shoot upward from both dots and meet at a single parent company.** The geographic distance the executive was relying on for safety becomes irrelevant in one animation. The "oh" is *"we don't have two suppliers — we have one owner with two addresses."* This is the Nexperia pattern exactly: a Dutch-based chipmaker, Chinese-owned, where the control structure itself — not any factory — became the disruption.

**Key data needed (nodes + edges).**
- **Suppliers:** Veldhoven Semiconductors (Tier-2, country = NL, geo-risk = low *on its own attributes*); SuntoraMicro (Tier-2, Asia, from Scenario A).
- **Owner / legal entities:** Veldhoven's Dutch operating entity → **Hongqiao Tech Holdings** (ultimate parent, jurisdiction = high-risk, compliance flag = entity-listed). SuntoraMicro also *controlled-by* Hongqiao.
- **The part link:** Veldhoven *supplies* (or is qualified to supply) the same inverter MOSFET as SuntoraMicro, so both attach to the Scenario A inverter path — that's what makes "independent alternate" believable before the overlay.
- **Edges:** Veldhoven → Hongqiao and SuntoraMicro → Hongqiao (***owned-by / controlled-by* — the two edges that create the reveal**); intermediate-entity edges so the chain is visibly multi-level, not a single hop; a compliance/sanction signal on Hongqiao.
- **Toggle behaviour:** ownership edges must be a layer the user switches *on*, so the "looks safe → is controlled" flip is a deliberate, demoable moment rather than always-on clutter.

---

## The shared dataset (build once, demo three times)

All three scenarios are slices of one network. Building this single graph makes the demo coherent — the director sees the same map answer three different questions.

**Suppliers.** Continental (T1, electronics), Bosch (T1, power electronics), Infineon (T2, healthy dual-source contrast), SuntoraMicro (T2, Asia — financial + geo risk), Veldhoven Semiconductors (T2, NL — clean attributes, dirty parent), Pan-Asia Wafer / PAW (T3 foundry — allocation/operational risk).

**Owner entities.** Hongqiao Tech Holdings (ultimate parent of both SuntoraMicro and Veldhoven; entity-listed) + one intermediate holding entity per supplier so chains are multi-level.

**Parts & assemblies.** Power MOSFET and MCU (SuntoraMicro / Veldhoven); traction-inverter power module and engine-control unit (Continental); DC-DC converter (dual-sourced Infineon-via-Bosch — the healthy green path that contrasts with every red one); the shared safety-controller die (PAW) sitting inside both a Continental and a Bosch controller.

**Plants.** Zwickau (MEB), Emden (MEB), Wolfsburg (MQB).

**Programs.** ID.3, ID.4 (Zwickau); ID.7 (Emden); Golf, Tiguan (Wolfsburg). Cupra Born / Audi Q4 e-tron optional at Zwickau for visual richness.

**Relationship types** (per the product data model): *supply*, *ownership*, *financial dependency*, *process/material dependency*, *compliance*. **Risk signals** (financial, operational, geo, compliance) attach to suppliers, sites and owners and are what colours a path red.

**The one healthy path that makes the red ones credible.** The DC-DC converter on the ID.4 is genuinely dual-sourced (Infineon via Bosch, no shared fab, no shared owner). Keep it visibly green in all three scenarios — it is the control case that proves the tool isn't just painting everything red for drama.

> **Audience-language note (per project rules).** In anything the executive sees or hears — labels, tooltips, the presenter's script — use *suppliers, sites, parts, plants, paths, connections, dependencies.* Never *nodes, edges, vertices.* The node/edge vocabulary in the "key data needed" sections above is for the prototype builder only.

---

## Real-world anchors (so the room can't dismiss it as a toy)

- **Scenario A — blast radius.** The 2021 semiconductor crunch cost the auto industry an estimated **$210B in revenue and 7.7M unbuilt vehicles** (AlixPartners), largely because OEMs couldn't see fast enough which deep-tier chips fed which programs. Mature-node and DRAM allocation pressure returned in **2025–26**, with memory makers prioritising data-centre demand over automotive.
- **Scenario B — hidden concentration.** The **Renesas Naka fab fire (March 2021)** disabled a single building responsible for roughly **30% of the world's automotive microcontrollers**, taking ~100 days to fully recover — a textbook deep-tier shared dependency that blindsided multiple OEMs at once. Auto silicon funnels through a handful of oligopolistic foundries, so "two suppliers, one fab" is the structural norm, not an edge case.
- **Scenario C — ownership / control risk.** **Nexperia/Wingtech (Sept 2025 onward):** the Dutch government invoked a Cold-War-era law to take control of Netherlands-based Nexperia — owner of ~40% of Europe's foundational automotive chips — because its **Chinese parent Wingtech** (on the US Entity List since Dec 2024) made the *control structure itself* the risk. China retaliated by halting Nexperia exports; **Bosch reported disruption at three plants** while VW and ZF reported adequate buffers; the VDA flagged elevated supply risk into **Q1 2026**. A European address did not equal European control.
- **Regulatory backbone for all three.** Under the German Supply Chain Due Diligence Act (**LkSG**), once VW has substantiated knowledge of an indirect-supplier risk it is expected to act and document — with fines up to **€8M or 2% of global turnover** and exclusion from public contracts. The graph turns "we couldn't see it" into "we saw it, here's the audit trail."

---

## Sources

- Nexperia/Wingtech ownership-control crisis: [CNBC — Dutch government takes control of Nexperia (13 Oct 2025)](https://www.cnbc.com/2025/10/13/dutch-government-takes-control-of-chinese-owned-chipmaker-nexperia.html); [CNBC — Nexperia issues urgent plea to its China unit (28 Nov 2025)](https://www.cnbc.com/2025/11/28/nexperia-crisis-dutch-chipmaker-issues-urgent-plea-to-its-china-unit.html); [Automotive News — VW, ZF secure chips; Bosch struggling](https://www.autonews.com/volkswagen/ane-vw-chips-production-nexperia-suppliers-1119/); [Bruegel — the Nexperia crisis and Chinese investment](https://www.bruegel.org/newsletter/nexperia-crisis-wake-call-europes-approach-chinese-investment)
- Shared-fab / mature-node concentration: [Tom's Hardware — Nexperia fallout, mature-node chip market in crisis](https://www.tomshardware.com/tech-industry/semiconductors/nexperia-fallout-threatens-automobile-production-as-japanese-carmakers-warn-of-supply-disruptions-while-european-companies-prep-assembly-line-shut-downs-mature-node-chip-market-in-crisis-as-supply-dwindles); [S&P Global — DRAM makers prioritise AI data centres, sparking automotive shortage](https://www.spglobal.com/automotive-insights/en/blogs/2025/12/dram-makers-ai-data-centers-semiconductor-shortage)
- 2021 chip crunch ($210B / 7.7M units): [AlixPartners forecast](https://www.alixpartners.com/newsroom/press-release-shortages-related-to-semiconductors-to-cost-the-auto-industry-210-billion-in-revenues-this-year-says-new-alixpartners-forecast/)
- Renesas Naka fab fire (~30% auto MCUs; ~100-day recovery): [Data Center Dynamics](https://www.datacenterdynamics.com/en/news/renesas-semiconductor-fab-catches-fire-impacting-chip-production/)
- Sub-tier visibility (~2% beyond Tier-2): [McKinsey — Future-proofing the supply chain](https://www.mckinsey.com/capabilities/operations/our-insights/future-proofing-the-supply-chain)
- LkSG (fines up to €8M / 2% of turnover; indirect-supplier duty): [CSR-in-Deutschland (Federal Government)](https://www.csr-in-deutschland.de/EN/Legislation/German-Supply-Chain-Act/german-supply-chain-act.html)
- VW plant/model allocation (Zwickau/Emden/Wolfsburg/Dresden, 2024–25 restructuring): [electrive — Zwickau to lose models, Dresden to end](https://www.electrive.com/2024/12/20/vw-reaches-deal-with-unions-zwickau-to-lose-models-production-in-dresden-to-end/)
- Ukraine wire-harness shock precedent (~7% of EU harnesses; VW Zwickau/Dresden halts, 2022): see project working note *Ntier-Risk-Decisions-Before-After.md*

*Company names carrying risk in these scenarios (SuntoraMicro, Veldhoven Semiconductors, Hongqiao Tech Holdings, Pan-Asia Wafer) are illustrative constructs. The risk patterns and cited cases (Nexperia/Wingtech, Renesas, the 2021 crunch, the 2025–26 mature-node squeeze, LkSG) are real and sourced above.*

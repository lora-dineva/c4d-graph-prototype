# N-Tier Supplier Risk — The Decisions First, Then the Graph

*Working note for the Graph Explorer prototype (N-tier Supplier Monitor, VW Group context) · 30 May 2026*

---

## Purpose

Before designing the prototype, articulate the value in the language of **decisions** — what VW purchasing managers, supply chain directors, and risk officers actually decide in a crisis, and how a connected supply chain graph changes each decision. Functional value first; the prototype works backwards from here.

**How to read this.** Five decisions, in the order a crisis forces them. Part 1 is how each is made today (information required, where it lives, time to assemble, what breaks when it's late). Part 2 is what the connected graph changes. Part 3 is one before/after line per decision for an executive audience. A short closing maps the decisions to what the prototype must show.

**What "the connected graph" means here.** One model that links Tier 1–3 suppliers, their sites, the parts and assemblies they make, the plants and vehicle programs those parts feed, plus ownership chains and live risk signals. It does **not** replace SAP, Celonis, Bloomberg, Prewave, or Catena-X — it reads from them and makes their data answer questions none of them can answer alone.

**One scenario, threaded throughout** (company names illustrative; the risk event is a prototype scenario, with real-world precedents cited):

> A Tier-2 semiconductor supplier in Asia — call it **SuntoraMicro** — issues a profit warning and breaches a debt covenant (**financial risk**) while sitting in a region under tightening export controls (**geopolitical risk**). Its automotive-grade power MOSFETs and one MCU reach VW through Tier-1 **Continental**, which builds them into a **traction-inverter power module** (for the MEB EVs) and an **engine-control unit** (for the MQB cars). The inverter module has **no qualified second source** — a single point of failure. It feeds the **ID.4 and ID.3** built at **Zwickau**; the ECU feeds the **Golf** at **Wolfsburg**. A dual-sourced DC-DC converter on the same ID.4 (Infineon via Bosch) provides the healthy contrast. And SuntoraMicro's ultimate parent, it turns out, also controls a **second Tier-2** that VW planned to switch to — so two "independent" supply paths share one owner.

**On the numbers.** Industry benchmarks are sourced inline. VW-specific operational figures are approximate and flagged. Plant downtime costs are industry-wide survey figures, not VW-specific.

---

## Part 1 — The five decisions, as they're made today

### Decision 1 — Scope the blast radius and decide whether to escalate
*"An alert just fired on a Tier-2. How bad is this, what production stops and when, and who needs to be in the room?"* — core questions 1 and 10.

| Facet | Today |
|---|---|
| **Information required** | The failing supplier's full downstream footprint: every part it (and its sub-tier) feeds, the assemblies those parts sit in, the plants and vehicle programs consuming them, current buffer and in-transit stock per part, and which programs are actually building this week. |
| **Where it lives** | Supplier master and single-level BOM in SAP; multi-level BOM in SAP/PLM; inventory in SAP/MES; build schedule in production planning; the external trigger in Prewave/Bloomberg/news. The Tier-2→part→program linkage usually lives in **no system** — it's in buyers' heads, emails, or a Tier-1's records you have to phone for. |
| **Time to assemble** | Hours to days. The Tier-1 footprint is queryable; the deep-tier chain needs manual BOM explosion plus calls to the Tier-1 to learn which of *their* sub-suppliers is affected. Only ~2% of firms have visibility beyond Tier-2 (McKinsey). |
| **What breaks when it's late** | You over-react (halt or air-freight across programs that aren't exposed) or under-react (miss a program that shares the part). Escalation stalls while analysts assemble the picture — and at roughly **$1.3M–$2M+ per hour** for a stopped automotive plant (industry surveys; on the order of $30–50M for a lost day), being late to escalate is measured in shifts. |

The 2021 chip crunch — an estimated **$210B in lost auto revenue and 7.7M units** not built (AlixPartners) — was in large part a blast-radius blindness problem: OEMs could not see fast enough which deep-tier chips fed which programs to prioritise the scarce supply.

*Scenario:* the SuntoraMicro warning lands. Today you know it's a Tier-2 chip maker. You do **not** immediately know it reaches ID.4/ID.3 at Zwickau and the Golf at Wolfsburg through Continental. Establishing that mapping is the first scramble.

### Decision 2 — Confirm single-point-of-failure exposure and read the runway
*"Is this part single-sourced with no qualified alternative, and how many days until the line stops?"* — core questions 2 and 5.

| Facet | Today |
|---|---|
| **Information required** | Per affected part: the approved vendor list (is there a second source?), whether any alternate is actually qualified/PPAP-approved *for these programs*, alternate site routes for the same part, days-of-supply on hand and in transit, and the supplier's own buffer. |
| **Where it lives** | AVL in SAP/sourcing; qualification status in supplier-quality/PLM; alternate routings sometimes in SAP, often tribal knowledge; days-of-supply in SAP/MES. Sub-tier single-sourcing — where two Tier-1s unknowingly buy the same chip — is almost never visible anywhere. |
| **Time to assemble** | Half a day to days. The dangerous case, a deep-tier SPOF, may never surface until the line stops. |
| **What breaks when it's late** | You discover the single point of failure *after* it fails. A part shown as "dual-sourced" at Tier-1 can be single-sourced at Tier-2. Mis-reading the runway means either panic-expediting at air-freight cost or getting caught with zero buffer. |

Precedent: the **Renesas Naka fab fire** (March 2021) took out one plant supplying ~30% of the world's automotive microcontrollers and needed roughly **100 days** to fully recover — a deep-tier SPOF that blindsided many OEMs.

*Scenario:* the MEB traction-inverter module has no qualified second source — a true SPOF. The ID.4's DC-DC converter, by contrast, is dual-sourced (Infineon via Bosch) and safe. Today, telling those two apart for every part on the program is a manual sourcing review.

### Decision 3 — Expose hidden concentration and ownership/control risk
*"Is this bigger than it looks because programs secretly share one Tier-3 — and is our 'alternative' actually controlled by the same owner?"* — core questions 3 and 4.

| Facet | Today |
|---|---|
| **Information required** | Which programs and parts converge on the same Tier-3 supplier or site; the ownership/control chain above each supplier (ultimate parent, major shareholders, state ownership); whether two nominally separate suppliers roll up to one entity. |
| **Where it lives** | Concentration is implicit across thousands of BOM lines — stored nowhere as a "shared dependency." Ownership lives in Bloomberg/D&B/Orbis, registries, or external SCRM — and is **never linked** to your part/program data. Connecting "this owner controls both suppliers" to "both feed our ID.4" is a manual research project. |
| **Time to assemble** | Days to weeks — if attempted at all. Usually it isn't, until a crisis forces it. |
| **What breaks when it's late** | You "dual-source" into the same parent and feel safe with no real redundancy. You miss that several programs share one Tier-3 until that Tier-3 fails. Control risk hides one layer up, out of sight. |

Precedent: **Nexperia/Wingtech** (Oct 2025) — a Dutch-based chipmaker, Chinese-owned, where the *control structure itself* became the risk when the Dutch state intervened; Bosch and others warned of automotive shortages. If your "alternate" chip source shares that parent, your redundancy is fictional.

*Scenario:* SuntoraMicro's ultimate parent also controls the second Tier-2 you planned to switch to. On paper, two suppliers. In control terms, one. The ownership overlay is the only place this shows up *before* you commit to the switch.

### Decision 4 — Choose and sequence the mitigation, knowing the knock-on effects
*"Reallocate, expedite, qualify an alternate, redesign, or pre-build — which lever, in what order, and what does each one break elsewhere?"* — core questions 9 and 5.

| Facet | Today |
|---|---|
| **Information required** | Feasible alternates and their qualification lead time; spare capacity at alternate sites; which *other* programs draw from the buffer you'd reallocate; the requalification/PPAP timeline; the cost of each lever; and the downstream effects of a switch (does the alternate share the same Tier-3 or geography?). |
| **Where it lives** | Capacity in SAP and supplier conversations; qualification timelines in supplier-quality; cross-program buffer contention only visible by querying every program's BOM; switch knock-ons effectively unknowable without the full network in one place. |
| **Time to assemble** | Days — and most change-impact effects aren't modelled at all; they're discovered after the decision. |
| **What breaks when it's late** | You reallocate stock to save Program A and quietly starve Program B. You re-source to an "independent" alternate that shares the failing Tier-3 or the same sanctioned region. You start a requalification that won't finish before you run out. |

*Scenario:* you pull inverter modules from a lower-priority program to protect ID.4 at Zwickau — but that program's build at Emden needs them next week, and the proposed alternate routes back to SuntoraMicro's parent (Decision 3). Both knock-ons are invisible in SAP.

### Decision 5 — Quantify geopolitical and regulatory exposure, and decide what to disclose
*"How much of this program's supply runs through high-risk geographies or owners, where are we dependent on Tier-3s we never contracted with, and what must we document — to the board and under LkSG?"* — core questions 6, 7 and 8.

| Facet | Today |
|---|---|
| **Information required** | Geographic footprint of the full multi-tier chain (where every site sits); ownership/state-control exposure; concentration in sanctioned or high-risk regions; Tier-3 dependencies you have no direct contract with; the audit trail LkSG expects. |
| **Where it lives** | Site geography scattered across supplier master and Tier-1 records; geopolitical risk in external feeds; LkSG documentation in GRC tools or spreadsheets, disconnected from the actual part/program structure; Tier-3 dependence largely invisible. |
| **Time to assemble** | Weeks for a genuine multi-tier geographic assessment; LkSG reporting is a recurring manual burden. |
| **What breaks when it's late** | LkSG non-compliance carries fines **up to €8M or 2% of global annual turnover**, plus exclusion from German public contracts for up to three years — and the law expects you to act on indirect suppliers once you have substantiated knowledge of a risk. You can't act on, or document, what you can't see. |

Precedent: geographic concentration converts to a stoppage overnight. **Ukraine supplied ~7% of the EU's wire harnesses**; when war broke out in 2022, VW halted Zwickau and Dresden and reshuffled production of an estimated 50,000–100,000 cars (Leoni plants at Stryi and Kolomyja). The concentration was knowable in advance; it just wasn't visible on demand.

*Scenario:* a board question — "how exposed is the MEB platform to this region and this owner?" — today triggers a multi-week manual study. SuntoraMicro's region also hosts two other critical Tier-2s; that concentration is both a strategic fact and an LkSG fact you currently can't surface on request.

---

## Part 2 — What the connected graph changes

### Decision 1 — Blast radius
**In seconds, not hours:** select the failing supplier and the path lights up to every affected part, assembly, plant, and program, with current buffer and days-to-line-down per part — the picture analysts spent a day reconstructing.
**Newly answerable:** *"What stops, where, and on which date?"* answered live and ranked by severity, instead of pieced together after the fact.
**Blind spots removed:** no more over- or under-reacting; the escalation packet assembles itself, so you escalate within minutes with the right scope and the right people.

### Decision 2 — SPOF exposure
**In seconds, not days:** every affected part is flagged single- versus multi-source, with alternate routes shown — or their absence made explicit — across all tiers, not just Tier-1.
**Newly answerable:** *"Which of these parts has no qualified alternative anywhere in the network?"* — including hidden Tier-2 SPOFs where two Tier-1s draw the same chip.
**Blind spots removed:** the "dual-sourced at Tier-1, single-sourced at Tier-2" trap disappears; runway is read off the connected model, not estimated.

### Decision 3 — Concentration and ownership
**In seconds, not weeks:** the ownership overlay collapses suppliers to their controlling entities, and shared Tier-3 dependencies across programs highlight instantly.
**Newly answerable:** *"Do my two alternatives share an owner?"* and *"Which programs unknowingly share one Tier-3?"* — previously a manual research project, now a view.
**Blind spots removed:** fictional redundancy and hidden concentration — the Nexperia pattern — surface *before* you commit, not after.

### Decision 4 — Mitigation and change-impact
**In seconds, not after the fact:** simulate a switch or reallocation and the model shows every downstream program, buffer, and new exposure the change touches — before you act.
**Newly answerable:** *"If I switch this part, what else breaks — and does the alternate inherit the same Tier-3 or geographic risk?"*
**Blind spots removed:** no more starving Program B to save Program A unknowingly; no re-sourcing into the same root dependency you're trying to escape.

### Decision 5 — Geopolitical and regulatory
**In seconds, not weeks:** filter any program by geography or ownership and the share of its supply passing through a region or controlling entity is quantified on demand.
**Newly answerable:** *"How exposed is MEB to this region and this owner, and which Tier-3s underpin it?"* — board- and LkSG-ready in one view.
**Blind spots removed:** undocumented Tier-3 dependence and geographic concentration become visible and exportable, turning LkSG from a manual reconstruction into a standing report.

---

## Part 3 — Before / after, one line per decision

| # | Decision | Today | With the connected graph |
|---|---|---|---|
| 1 | **Blast radius** | Hours to days of manual BOM explosion and supplier calls to learn what a failing supplier actually stops. | One click traces the failure to every affected part, plant, and program — in seconds. |
| 2 | **SPOF exposure** | You find out a part had no backup when the line stops. | Every single point of failure, including hidden ones two tiers down, is flagged before it fails. |
| 3 | **Concentration & ownership** | "Alternative" suppliers and "separate" programs are assumed independent. | Shared owners and shared Tier-3s are exposed, so redundancy is real, not fictional. |
| 4 | **Change impact** | Mitigations are chosen blind to their knock-on effects and discovered afterward. | Every switch or reallocation is simulated against the whole network before you commit. |
| 5 | **Geo & regulatory** | A region, owner, or LkSG question triggers a multi-week manual study. | Exposure is quantified on demand, and LkSG evidence is a standing view. |

**For the executive in the room:** today, the answer to *"if this supplier fails, what happens to our production?"* is assembled by people, over hours or days, from systems that don't talk to each other — and it's often wrong at exactly the edges that matter most: the deep tiers where disruptions actually start, and where only ~2% of companies have any visibility. The connected graph turns that from a fire drill into a click. The value is not a better-looking dashboard; it is **deciding correctly in the first hour instead of the third day**.

---

## What this means for the prototype

The demo earns credibility by showing the *decision*, not the technology. In one sitting, a VW director should be able to: trace a Tier-2 failure to named programs and plants (Decision 1); see one part flagged as a true single point of failure beside a healthy dual-sourced part (Decision 2); switch on an ownership overlay that reveals two "separate" suppliers share one parent (Decision 3); and contrast a high-risk path with a healthy one to show change-impact and geographic exposure (Decisions 4–5).

That set maps exactly onto the four core questions the prototype must answer convincingly — **blast radius, single-point-of-failure, hidden concentration, and ownership** — with the semiconductor scenario as the spine. Everything else is secondary to making those four decisions feel faster and safer on screen than they are in real life today.

---

## Sources

- Plant downtime cost (automotive): [Manufacturing.net — the $22,000-per-minute problem](https://www.manufacturing.net/home/article/13055083/the-22000perminute-manufacturing-problem); [ReliaMag — cost of unplanned downtime in manufacturing (2026 data)](https://reliamag.com/articles/cost-unplanned-downtime-manufacturing/); [ThomasNet — downtime costs auto industry $22k/minute](https://news.thomasnet.com/companystory/downtime-costs-auto-industry-22k-minute-survey-481017)
- 2021 chip shortage ($210B / 7.7M units): [AlixPartners press release](https://www.alixpartners.com/newsroom/press-release-shortages-related-to-semiconductors-to-cost-the-auto-industry-210-billion-in-revenues-this-year-says-new-alixpartners-forecast/); [CNBC](https://www.cnbc.com/2021/09/23/chip-shortage-expected-to-cost-auto-industry-210-billion-in-2021.html)
- Sub-tier visibility (~2% to Tier-3; ~42% to Tier-2; disruptions >1 month every ~3.7 years): [McKinsey — Future-proofing the supply chain](https://www.mckinsey.com/capabilities/operations/our-insights/future-proofing-the-supply-chain); [World Economic Forum — leveraging digital tools in the disruption era](https://www.weforum.org/stories/2025/01/supply-chain-disruption-digital-winners-losers/)
- German Supply Chain Act / LkSG (fines up to €8M or 2% of turnover; public-contract exclusion; in force 2023): [CSR-in-Deutschland (Federal Government)](https://www.csr-in-deutschland.de/EN/Legislation/German-Supply-Chain-Act/german-supply-chain-act.html); [Circularise — LkSG due-diligence obligations explained](https://www.circularise.com/blogs/german-supply-chain-act-lksg-due-diligence-obligations-explained)
- Renesas Naka fab fire (March 2021; ~30% global auto MCU share; ~100-day recovery): [Data Center Dynamics](https://www.datacenterdynamics.com/en/news/renesas-semiconductor-fab-catches-fire-impacting-chip-production/); [Omdia](https://omdia.tech.informa.com/blogs/2021/mar/fire-at-renesas-wafer-fab)
- Nexperia/Wingtech ownership-control event (Oct–Nov 2025): [CNBC](https://www.cnbc.com/2025/10/13/dutch-government-takes-control-of-chinese-owned-chipmaker-nexperia.html); [Al Jazeera](https://www.aljazeera.com/news/2025/10/14/why-has-dutch-government-taken-control-of-china-owned-chipmaker-nexperia)
- Ukraine wire-harness shock (2022; ~7% of EU harnesses; VW Zwickau/Dresden halts; 50k–100k cars reshuffled): [Fleet News](https://www.fleetnews.co.uk/news/manufacturer-news/2022/03/16/ukraine-war-vw-moves-wiring-harness-production-as-supply-chain-issues-grow); [Euronews](https://www.euronews.com/next/2022/03/02/autos-ukraine-suppliers)
- German automotive supplier insolvencies (H1 2024 +60% YoY; 2025 forecast +30%): [Xinhua](https://english.news.cn/20240814/aa634df86c654ad0854d1daa1ae0c2e6/c.html); [Automotive News Europe](https://www.autonews.com/manufacturing/suppliers/ane-suppliers-jobs-auto-industry-crisis-germany-1002/)

*Company names in the worked scenario are illustrative; the risk event is a prototype construct. Cited cases (Renesas, Nexperia/Wingtech, Ukraine, AlixPartners, McKinsey, LkSG) are real and sourced above.*

# The 10 Questions the Supply Chain Graph Must Answer

**N-tier Supplier Monitor — Graph Explorer · Prototype Research**
Audience for the prototype: VW Group purchasing and supply chain risk leadership.

---

## Why these questions, and why a graph

Every question below has the same defining property: the answer does not live in any single supplier, part, or plant record. It lives in the *connections between them*. A list or a filter can tell you "ASM is a chip supplier in China." Only the connected network can tell you that ASM is the **sole** source of the one chip inside a control module fitted to three vehicle programs built at two plants — and that the same hidden owner sits above a second supplier you thought was independent.

That gap — between knowing an entity's attributes and knowing its position in the network — is exactly what the Graph Explorer exists to close. The ten questions are ordered roughly from "easy to grasp, high impact" to "specialised but decisive." The final section ranks the three that should carry the demo.

### Scenario cast (used consistently throughout)

A single, coherent example network keeps every question concrete and comparable:

- **Anhui Semiconductor Manufacturing (ASM)** — *fictional* Tier-2 chip maker, Hefei (China). Two fab sites: **Hefei Fab 1**, **Hefei Fab 2**. Flagged for **financial distress + geopolitical exposure**. Makes the **MCU-7** automotive microcontroller.
- **Continental** — Tier-1, Regensburg (Germany). Builds the **BCM-X4 body control module**, which uses the MCU-7. Single-sourced into multiple programs.
- **Bosch** — Tier-1. Alternative control-module source used in the change-impact scenario.
- **Suzhou Connector Co.** — *fictional* Tier-2, China. Looks independent of ASM. Secretly co-owned with it.
- **Greatwall Capital (Shanghai)** — *fictional* holding company. Ultimate owner of **both** ASM and Suzhou Connector.
- **Kyushu Substrate** — *fictional* Tier-3, Japan. Supplies wafer substrate into multiple chip makers — a hidden shared dependency.
- **Leoni** and **Aptiv** — Tier-1 harness suppliers, dual-sourced (the healthy, resilient contrast).
- **Programs:** Golf and Tiguan (MQB platform), ID.4 (MEB, EV), and the next-gen **SSP** EV platform.
- **Plants:** Wolfsburg (Golf, Tiguan), Zwickau (ID.4).

> All unit counts, day counts, and supplier counts in this document are **illustrative placeholders** for the prototype scenario, not sourced industry benchmarks.

---

## 1. Blast radius — "If ASM fails, what stops?"

**The question.** "Anhui Semiconductor was just flagged for insolvency. If they stop shipping, which of our parts, plants, and vehicle programs actually stop — and how soon?"

**Why it needs the connections (not a lookup).** ASM's own record says "chip supplier, China." It says nothing about consequence. The fact that matters — its MCU-7 is the only qualified chip in Continental's BCM-X4, which is fitted to Golf, Tiguan, and ID.4, built at Wolfsburg and Zwickau — exists *only* in the chain of relationships, never in one record. Filtering "suppliers in China" returns a list; it cannot return a stopped production line. You have to follow the dependency outward, several hops, to turn "a supplier" into "two plants down."

**The trace, in plain terms.** Start at ASM. Follow *supplies* relationships forward, carrying the dependency at each step: ASM → MCU-7 chip → Continental BCM-X4 → Golf, Tiguan, ID.4 → Wolfsburg, Zwickau. Stop at the program and plant layer — that is "what stops."

**What it looks like in the prototype.** Click ASM; it pulses red. Three supply paths light up forward through the chip and the control module; three program tiles (Golf, Tiguan, ID.4) and two plant markers (Wolfsburg, Zwickau) turn red. Side panel: *"Blast radius — 1 chip, 1 Tier-1 module, 3 programs, 2 plants. Earliest line stop: ~18 days (Regensburg buffer). No alternative source on the critical link."* A **SPOF** badge appears on the MCU-7 connection.

---

## 2. Dependency concentration — "Which single suppliers or sites would do the most damage if they disappeared?"

**The question.** "Forget any specific alert. Across the whole network, which one supplier or site — if it vanished tomorrow — would take down the most production? Rank them for me."

**Why it needs the connections (not a lookup).** This is a structural property of the *whole* network, not an attribute you can sort on. The riskiest supplier is rarely the biggest by spend: a tiny, cheap chip can sit on the only path to several high-volume programs. "Damage if removed" depends entirely on how many downstream program and plant paths route through that point and have no alternative — a question of *position in the network*. Answering it means, in effect, removing each supplier in turn and measuring how much of the program layer goes unreachable.

**The trace, in plain terms.** For each supplier and site, trace every forward path to programs and plants. Count the programs and plants that lose *all* routes once that supplier is removed (weight by program volume). Rank everything by that score.

**What it looks like in the prototype.** A "concentration leaderboard" panel: **#1 ASM** (sole route to 3 programs), #2 Continental Regensburg site, #3 Kyushu Substrate. Selecting a row greys the network and lights up only the programs that would go dark. A heat ring around each supplier encodes its concentration score. The headline insight for VW: *the highest structural risk (a small Tier-2 chip vendor) is not the highest-spend supplier* — concentration is invisible on a spend report.

---

## 3. Hidden shared risk — "Which programs share a Tier-3 dependency without knowing it?"

**The question.** "Our Golf team and our ID.4 team buy from different Tier-1s and think they're diversified. Do they secretly bottom out at the same Tier-3? If that supplier sneezes, do two 'independent' programs both catch a cold?"

**Why it needs the connections (not a lookup).** Each program's bill of materials looks independent at Tier-1. The shared dependency is buried three levels down and reached through *different* intermediate suppliers, so no single program report can reveal it. The only way to see it is to trace every program down to its deepest tier and look for a **convergence point** — a Tier-3 that multiple distinct upward paths pass through. "Do these two paths meet?" is a pure connectivity question; a flat table physically cannot express it.

**The trace, in plain terms.** Start at each program (Golf, ID.4). Follow supply relationships downward through Tier-1 → Tier-2 → Tier-3, collecting the set of deep suppliers each program reaches. Intersect the sets. Anything in the overlap is a hidden shared dependency. Here: Golf reaches Kyushu Substrate via Continental → ASM; ID.4 reaches the *same* Kyushu Substrate via a different Tier-1 and Tier-2.

**What it looks like in the prototype.** Select two program tiles; the graph draws their two supply trees in two colours. Where the trees converge, a supplier flashes amber: *"Kyushu Substrate feeds both Golf and ID.4 through different Tier-1s — concentration invisible in either program's BOM."* An overlap counter reads *"Shared deep dependencies: 1."* This is the moment that proves the graph sees what today's tools cannot.

---

## 4. Ownership risk — "Who actually controls ASM, and is it the same entity controlling another supplier?"

**The question.** "We treat ASM and Suzhou Connector as two separate, diversified suppliers. But who *ultimately* owns them — and are we fooling ourselves about diversification?"

**Why it needs the connections (not a lookup).** Supply and ownership are two different relationship types laid over the same suppliers. The supply view says ASM and Suzhou are unrelated — they sit on different parts. The ownership view says both roll up to Greatwall Capital. The risk appears *only when you overlay the two*: one owner sitting silently above two supposedly independent supply paths. No supplier record carries "ultimate owner = same as supplier #4471." You have to climb the ownership chain to a common root, then map that root back down onto the supply network. This is also the direct LkSG / due-diligence hook.

**The trace, in plain terms.** From ASM, follow *owned-by* links upward to the ultimate parent (ASM → Hefei Holdings → Greatwall Capital). Do the same from Suzhou Connector. When the chains meet at a common root, project back down: which parts and programs depend on suppliers under that owner? The real exposure is the *union* of their blast radii, not each in isolation.

**What it looks like in the prototype.** Toggle "Ownership overlay." Dashed control-lines rise from ASM and Suzhou Connector and converge on a single Greatwall Capital marker at the top; both suppliers and everything downstream of them share one colour. Panel: *"Apparent suppliers: 2. Ultimate owner: 1 (Greatwall Capital). Combined exposure: 4 programs, 2 plants. Diversification is nominal, not real."*

---

## 5. Alternative path — "If Hefei Fab 1 goes down, is there another site for the same part?"

**The question.** "ASM's Hefei Fab 1 is the site with the problem. Do we have another qualified route to the MCU-7 — ASM's other fab, or a different supplier entirely — or is this the only door?"

**Why it needs the connections (not a lookup).** "Can the part still be made?" is a *reachability* question. Knowing the part exists, or that ASM has two fabs, is not enough — you need to know whether any path from a still-running site reaches the *same qualified part*. Two sites of one supplier in one region is correlated failure dressed up as redundancy; a genuinely independent second source in a different geography is real resilience. Only the topology distinguishes them.

**The trace, in plain terms.** From the part (MCU-7), follow *supplied-by* links backward to every site and supplier that can produce it. Remove the failed site (Hefei Fab 1). Check whether any remaining path survives — and whether it is *independent* (different owner, different region) or merely a sibling site of the same parent.

**What it looks like in the prototype.** Hefei Fab 1 is greyed and crossed out; the graph searches for alternative routes to MCU-7. *SPOF case:* no independent path — a red "No alternative source" banner, with Hefei Fab 2 highlighted but tagged *"same owner, same region — correlated risk."* *Healthy contrast (wiring harness):* a green alternate path lights up from Aptiv — *"Alternative source qualified: Aptiv (Romania), ~3-week switch."* The two outcomes side by side make the SPOF visceral.

---

## 6. Geopolitical exposure — "How much of the Golf supply chain passes through high-risk geographies?"

**The question.** "For the Golf platform specifically — what share of its supply chain, by depth and by criticality, runs through high-risk regions, and is any of it single-sourced there?"

**Why it needs the connections (not a lookup).** Geographic risk at Tier-1 is easy and usually reassuring — a German Tier-1, a German plant. The danger hides deep: that same Tier-1 can bottom out at a Chinese Tier-3. To quantify Golf's real exposure you must trace its *entire* multi-tier tree, tag each supplier by geography, then aggregate — crucially weighting by whether a high-risk supplier also sits on a single-sourced critical path. "Count suppliers in China" misses that one of them is a SPOF and the rest are replaceable.

**The trace, in plain terms.** Start at Golf. Expand the full supply tree backward across all tiers. Tag each supplier with a country/region risk score. Aggregate the share of paths touching a high-risk geography, and flag any high-risk supplier that is *also* a single point of failure. Here: Golf → Continental (DE, low) → ASM (Hefei, high, SPOF) → Kyushu Substrate (JP, medium).

**What it looks like in the prototype.** Select Golf, turn on "geo-risk heat." Suppliers recolour green→red by region. A meter reads *"Golf deep supply chain: ~22% of dependencies pass through high-risk geographies; 1 of them is a single point of failure (ASM, Hefei)."* The high-risk SPOF pulses, and a small map inset shows the chain crossing into the red region.

---

## 7. Program-to-supplier — "Which suppliers touch the new EV platform, and what are their risk profiles?"

**The question.** "We're standing up the SSP next-gen EV platform. Pull every supplier that touches it, all tiers, with each one's risk profile — so I know where to aim due-diligence effort first."

**Why it needs the connections (not a lookup).** A program's *direct* Tier-1 suppliers are in the sourcing system. The full roster — every Tier-2 and Tier-3 standing behind those Tier-1s — is not; it can only be reconstructed by walking the supply tree. And the risk profile has to travel with each supplier as you go. This is a one-program, all-tiers fan-out that no single table holds, turned into a prioritised worklist.

**The trace, in plain terms.** Start at SSP. Follow supply relationships backward to every tier, collecting each distinct supplier reached. Attach each supplier's risk attributes (financial, geographic, single-source status). Sort by risk and by criticality.

**What it looks like in the prototype.** Select SSP; its full supplier constellation expands and everything unrelated fades out. Each supplier is coloured by risk score; single points of failure are ringed. A sortable side list: *"47 suppliers touch SSP across 3 tiers · 4 high-risk · 2 single-sourced · top concern: ASM (Tier-2, financial + geopolitical, SPOF)."* The graph has produced the due-diligence queue, not just a picture.

---

## 8. Tier-3 exposure — "Where are we dependent on suppliers we have never directly contracted with?"

**The question.** "We hold contracts with our Tier-1s. But where are we *critically* dependent on a Tier-3 we've never met, never audited, and have no contractual leverage over?"

**Why it needs the connections (not a lookup).** Contracts exist at Tier-1; dependency runs far deeper. The exposure VW wants is precisely the *difference* between the dependency network (deep) and the contract network (shallow). You find it by tracing dependency to its full depth, then subtracting the suppliers you actually hold a contract with. Whatever remains — and is critical — is uncontracted exposure. That subtraction is only possible when both relationship types are in one connected model.

**The trace, in plain terms.** Trace dependency from all programs backward to all tiers (the dependency set). Separately mark suppliers with a direct VW contract (the contract set, essentially Tier-1). Subtract one from the other; keep the deep suppliers that are single points of failure or high-volume. Here: ASM and Kyushu Substrate — no VW contract, yet Golf and ID.4 cannot be built without them.

**What it looks like in the prototype.** A "contract vs. dependency" toggle. Contracted suppliers render solid; uncontracted-but-critical suppliers render hollow and flagged. Panel: *"12 suppliers are critical to production with no direct VW contract · 2 are single points of failure (ASM, Kyushu Substrate) · no audit on file."* These are surfaced as the leverage gap to close.

---

## 9. Change impact — "If we switch from ASM to Bosch for the MCU, what else is affected?"

**The question.** "Say we re-source the MCU-7 away from ASM to a Bosch-supplied alternative. What does that ripple into — which other programs need re-validation, what residual ASM exposure stays, and does the switch quietly create a *new* concentration somewhere else?"

**Why it needs the connections (not a lookup).** A sourcing change is never local. The part being switched may feed several programs (so all of them re-validate); the outgoing supplier may still supply other parts (so you haven't fully exited them); and the incoming supplier may introduce a *new* shared dependency or geographic concentration elsewhere. Seeing the whole ripple means examining everything connected to *both* the old and the new supplier — a neighbourhood query on the network, not a single line-item edit in a BOM.

**The trace, in plain terms.** From the part (MCU-7), find every program and plant it feeds (these re-validate). From ASM, find all *other* parts still supplied (residual exposure). From the new source (Bosch), trace forward to check whether it already feeds those same programs — which would create a new convergence. Union all affected elements into one impact set.

**What it looks like in the prototype.** A "change simulation" mode. Drag the MCU-7 source from ASM to Bosch; the graph redraws — green for newly added paths, red for removed paths, amber for a newly created shared dependency. Panel: *"Switch affects 3 programs (re-validation needed) · removes the ASM SPOF · but creates a new concentration: Bosch becomes sole MCU source for both Golf and ID.4 · residual ASM exposure: 1 connector part remains."* A before/after risk score quantifies the trade.

---

## 10. Escalation path — "This alert fired — what is the exact chain to production, and who acts?"

**The question.** "A financial-distress alert just fired on ASM. Don't make me go digging — show me the exact chain from this event to our production line, with the time-to-impact, and tell me who owns the next action."

**Why it needs the connections (not a lookup).** The alert lands on a supplier; the decision-maker needs the precise, ordered route from that supplier to the specific plant and program at risk, with the responsible owner attached at each step. That route is a single traced path through the network carrying time and ownership attributes — the connective tissue between an external signal and an internal action owner. A dashboard can show "alert on ASM." Only the graph shows "ASM → MCU-7 → BCM-X4 → Golf at Wolfsburg, 18-day buffer, owner: commodity buyer."

**The trace, in plain terms.** Start at the alerted supplier (ASM). Follow the single highest-criticality, shortest-time-to-impact path forward to production: ASM → MCU-7 → Continental BCM-X4 → Golf → Wolfsburg. Attach the responsible owner and the buffer/lead-time at each hop. Surface the fastest-to-impact path first.

**What it looks like in the prototype.** The alert badge lands on ASM; "Trace to production" animates a single bright path hop-by-hop to Wolfsburg, on a timeline: *"Day 0 alert → Day 18 buffer depletes → Day 18 Golf line stop, Wolfsburg."* Each hop carries an owner chip — commodity buyer → Tier-1 supplier-quality → plant logistics. A "Create action" button hands off to the right person (via the Action Workspace module, referenced but out of scope here). This is the "from signal to owner in one screen" payoff.

---

## How these map to risk types

Financial insolvency and geopolitical exposure at Tier-2/Tier-3 — the prototype's priority risk types — are the *trigger* in questions 1, 5, 6, and 10, and the *thing being uncovered* in 2, 3, 4, 7, 8, and 9. Every question routes back to the same scenario: a distressed, geopolitically exposed chip supplier that no one realised sat under so much of the production network.

---

## Ranking: the 3 questions the prototype should lead with

If the demo can only land three points cleanly in front of skeptical VW leadership, lead with **1 (Blast radius), 3 (Hidden shared risk), and 4 (Ownership risk)** — in that order. They form a deliberate narrative arc: *hook → unique insight → strategic differentiation*.

**1 · Blast radius — the hook.** It is the most legible idea in the room: anyone understands it in five seconds, it is the most visual moment in the tool, and it reframes a dry "supplier alert" into "two plants stop." It earns attention and sets up everything after it. A demo that cannot do this convincingly will not survive the first five minutes.

**3 · Hidden shared risk — the credibility-maker.** This is the question VW genuinely *cannot* answer today in SAP, Celonis, or a spend report, because the convergence is buried three tiers down and reached through different suppliers. When two "independent" programs visibly collapse onto one hidden Tier-3, that is the "we didn't know that — and we couldn't have known that" moment. It proves the graph earns its place rather than duplicating tools VW already owns.

**4 · Ownership risk — the differentiation and regulatory hook.** "Your diversification is an illusion — one owner sits above both suppliers" is a gut-punch insight that speaks straight to LkSG due-diligence pressure. It also visually demonstrates the platform's depth by overlaying a *second* relationship type (ownership) on the supply network — something a flat tool structurally cannot do. This is the point that lifts the prototype from "useful" to "strategic."

**Why not the others first.** Question 2 (concentration) is powerful but more abstract — a centrality leaderboard lands harder *after* the audience has felt one concrete blast radius, so it makes a strong fourth. Question 10 (escalation) is the natural closing beat once 1, 3, and 4 have established trust — it shows the path to *action*, but it is a workflow payoff rather than a demonstration of what only a graph can see. Questions 5–9 are highly valuable in the product but are deepening moves: best framed as "and it also answers…" once the core three have done their work.

**Note on project mandate.** The project brief requires the prototype to compellingly answer questions 1, 2, 3, and 4. The recommendation above keeps the *spotlight* on 1, 3, and 4 for narrative impact, with 2 staged immediately behind 1 as the "now see it across the whole network" expansion — so all four mandated questions are demonstrated, with three carrying the story and the fourth reinforcing it.

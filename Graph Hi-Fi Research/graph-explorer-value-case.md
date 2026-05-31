# The Value Case for a Supply Chain Knowledge Graph at a Large Automotive OEM

**N-tier Supplier Monitor · Graph Explorer — ROI & Benchmark Research Brief**
Prepared for: VW-context executive demo (supply chain directors, purchasing VPs, CDO/CTO)
Date: 30 May 2026

---

## How to read this brief

Each section follows: **key finding → why it's true → what it means for our case**. Figures are tagged by confidence:

- **[Verified]** — confirmed against the primary source (fetched/quoted).
- **[Cited]** — widely published figure from a named, credible source.
- **[Estimate]** — informed practitioner range; no single authoritative source. Use directionally, not as a hard quote.

The three slide-ready value statements are at the end.

---

## 1. The cost of a stopped line

**Key finding:** A stopped automotive assembly line costs on the order of **$1.3–2.3 million per hour** — roughly **$22,000–$38,000 per minute** — before you add scrap, overtime, penalties, or premium freight.

- A widely cited survey of automotive manufacturers puts the cost of a stopped line at **~$22,000 per minute (~$1.3M/hour)**. More recent estimates push the figure to **$2M+ per hour** as plants have become more automated and interconnected — roughly a 50% rise since 2019. **[Cited]**
- A high-volume final assembly line builds **one vehicle roughly every 60 seconds** (50–60+ units/hour per line). **[Cited]**
- For scale: VW's Wolfsburg plant — the world's largest car factory by area — can run **up to ~4,000 vehicles/day** at full tilt (~490k built in the softer 2023 year). Every hour of full-site stoppage is hundreds of unbuilt cars. **[Cited]**

**Share that is supply-chain-driven:** Industry surveys attribute a large and growing share of unplanned downtime to material/parts unavailability rather than equipment failure — and in high-tech manufacturing, **~68% of production stoppages trace back to a Tier-2 or Tier-3 failure**. Exact split varies by plant; treat "supply-chain-related" as a **major, often dominant** category, not a footnote. **[Cited / partial estimate]**

**What it means for our case:** The unit of value is *time*. At ~$2M/hour, anything that shortens a line-down event — or prevents it — by even a few hours is worth millions on a single incident. This is the number every other figure in the brief multiplies against.

---

## 2. The cost of the response itself

**Key finding:** When a major supplier event hits (insolvency, fire, geopolitical cut-off), the *first* expensive thing isn't the freight — it's the **half-day-to-weeks of manual scramble** to work out what's actually affected.

- **Time to assess impact:** With no mapped supply chain, simply determining *which parts, plants and vehicle programs are exposed* typically takes a war-room **days to weeks**; a first-pass picture is often **4–8 hours** of pulling data from ERP, spreadsheets and supplier emails. In one industry survey, **41% of organisations needed a full week just to identify which materials were affected**, and companies averaged **~2 weeks to plan and execute a response**. After the 2011 Japan earthquake, some companies needed **weeks just to establish whether they had exposure** at all. **[Cited for survey/"days–weeks"; 4–8h is a practitioner estimate]**
- **People involved:** A serious event pulls in a cross-functional team of **~10–20 people** (purchasing, logistics, engineering, planning, quality), consuming **hundreds of person-hours** per major event. **[Estimate]**
- **Premium / air freight:** Once a line is at risk, expediting kicks in. Expedited freight typically costs **2–3× standard**; air freight can exceed **10% of product value** vs ~3% for ocean. Automotive shippers report **~$3.1M average annual loss** from disruption, with ~17% reporting $5–20M. **[Cited]**

**What it means for our case:** The Graph Explorer attacks the most expensive, least-visible line item: the assessment delay. It compresses the "what's affected and how badly" question from a war-room exercise to a single view — and it does so while the meter is running at $2M/hour.

---

## 3. The value of early warning

**Key finding:** In automotive you **cannot** out-spend a late warning. Re-sourcing has hard, physics-bound lead times, so the only cheap fix is an early one.

- **Lead time to activate an alternative:** Qualifying a new source for a real automotive part runs **12–52 weeks** (PPAP approval + validation); **tooling transfers alone take 6–12 months** for complex components. A safety-critical electronic part sits at the long end. **[Cited]**
- **Proactive vs. reactive cost:** Acting weeks ahead means a *planned* re-source inside the PPAP window. Acting after the line stops means premium air freight (2–3×), expensive spot buys, overtime and penalties — practitioner estimates put reactive firefighting at **3–5× the cost** of the proactive equivalent, and teams report spending **40–60% of their time** firefighting rather than preventing. **[Estimate]**
- **The 2022 wire-harness lesson:** A low-cost, model-specific part made largely in Ukraine stopped European lines within *days* of the invasion — VW halted output at Wolfsburg and Zwickau. Ukraine supplied ~7% of the EU's wire harnesses (far higher for some German plants), and analysts warned the shortage could cut **10–15% of European car output — up to ~700,000 vehicles in H1 2022**. Because harnesses are custom and labour-intensive, there was **no quick swap** — exactly the case where weeks of warning would have changed the outcome. **[Cited; exact % approximate]**

**What it means for our case:** The graph's job is to convert a Tier-2/3 distress signal (financial, geopolitical) into action *inside* the 12–52 week window — turning a forced scramble into a planned switch.

---

## 4. Industry benchmarks (the credibility anchors)

**Key finding:** Most disruption risk is hidden below the tier you can see, and the recent cost of that blindness is documented in the billions.

- **Hidden tier risk:** **~85% of supply chain disruptions originate beyond Tier 1**, yet only ~30% of organisations have any visibility past their direct suppliers (only ~11% claim all-tier visibility). In high-tech, **~68%** of stoppages start at Tier 2/3. *(Widely repeated industry figure; primary attribution is diffuse — present as "commonly cited," not as one study.)* **[Cited / caveated]**
- **Chip shortage (2021):** AlixPartners estimated the semiconductor shortage cost the global auto industry **$210 billion in revenue in 2021** and **7.7 million lost vehicles** — nearly double the firm's own May forecast of $110B. The crisis happened largely because OEMs **could not see** which programs depended on which fab. **[Verified — CNBC/AlixPartners]**
- **Disruptions are structural, not freak events:** McKinsey finds supply-chain disruptions cost the average company **~45% of one year's profits over a decade**, that disruptions lasting **a month or longer now hit every ~3.7 years**, and a single prolonged shock can cost **30–50% of a year's EBITDA**. **[Verified — McKinsey, *Risk, resilience, and rebalancing in global value chains*, 2020]**

**What it means for our case:** These three numbers are the executive's mental model. $210B says "this already happened to us." 85% says "you can't see where it starts." 45%-of-profits says "this is a board-level financial exposure, not an ops nuisance." The Graph Explorer is positioned as the thing that makes the hidden 85% visible *before* it becomes the next $210B.

---

## 5. Decision-speed → money (the core of the pitch)

**The scenario:** A Tier-2 semiconductor supplier in Asia signals financial distress. The question executives ask: *what stops, and what do we do?*

| | Manual today | With the Graph Explorer |
|---|---|---|
| Time to see blast radius (parts, plants, programs) | 4–8 hours (full sub-tier: days–weeks) | **~10 minutes** |
| People to produce that picture | 10–20 across functions | 1 analyst |
| Confidence | Partial, spreadsheet-stitched | Complete path, every dependency shown |

**The translation to value:**

- **~36× faster, ~97% less time.** A ~6-hour assessment becomes ~10 minutes. That recovered half-day is not admin time — it is *decision* time during a live event. **[Estimate, from the stated 4–8h → 10min]**
- **Head-start = line-down avoided.** At **~$2M/hour**, if the earlier picture lets you secure allocation or safety stock before a single plant goes down, avoiding even **4 hours** of stoppage at one plant ≈ **$8M saved on one event**. **[Derived from §1]**
- **Head-start = allocation won.** In a shortage, scarce parts go to whoever commits *first*. A half-day lead over competitors is the difference between getting the wafers and getting an apology. **[Reasoning]**
- **Head-start = no premium freight.** Acting early avoids the 2–3× air-freight premium that reactive responses incur. **[From §2]**
- **It compounds.** Month-plus disruptions hit every ~3.7 years (McKinsey); smaller events many times a year. The tool earns its value on *every* event, not once.

**Bottom line:** The graph doesn't have to prevent many disruptions to pay for itself. Shaving one shift of line-down off **one** significant event covers the cost — and the realistic case is dozens of faster, cheaper decisions a year.

---

## Synthesis: three slide-ready value statements

> **1. We turn a half-day of blind firefighting into a 10-minute decision.**
> A stopped automotive line costs about **€2 million an hour**. Today, working out which parts, plants and vehicle programs a supplier failure actually hits takes a war-room of 10–20 people **4–8 hours**. The Graph Explorer shows the full impact path in **under 10 minutes** — so the first decisions happen while the line is still running, not after it's down.

> **2. The risk you can't see is the one that stops your plant.**
> Around **85% of supply disruptions start below your direct suppliers**. The 2021 chip shortage cost the industry **$210 billion and 7.7 million vehicles** — largely because no one could trace which vehicle programs depended on which fab. We make those hidden Tier-2 and Tier-3 dependencies visible **before** they fire.

> **3. In this industry you can't buy your way out of a late warning — only an early one.**
> Re-sourcing an automotive part takes **12–52 weeks** of tooling and approval. Once the line is down, that runway is gone and you're paying **2–3× in premium air freight** to limp along. Seeing a supplier's distress **weeks early** instead of the day the line stops is the difference between a planned switch and a $210-billion-style scramble — and McKinsey prices getting this wrong at **~45% of a year's profits per decade**.

*(Currency note: downtime and chip figures are USD source data; €/$ are near parity for slide use. State as "~€2M / ~$2M per hour".)*

---

## Sources & confidence

**Verified against primary source:**

- AlixPartners chip-shortage forecast — $210B revenue, 7.7M units lost (2021): [CNBC, 23 Sep 2021](https://www.cnbc.com/2021/09/23/chip-shortage-expected-to-cost-auto-industry-210-billion-in-2021.html); [AlixPartners press release](https://www.alixpartners.com/media-center/press-releases/2021-automotive-industry-semiconductor-shortage-forecast/)
- McKinsey, *Risk, resilience, and rebalancing in global value chains* (2020) — 45% of a year's profits per decade; month-plus disruption every 3.7 years; 30–50% of a year's EBITDA per major shock: [McKinsey](https://www.mckinsey.com/capabilities/operations/our-insights/risk-resilience-and-rebalancing-in-global-value-chains)

**Cited (named, credible secondary):**

- Stopped-line cost ~$22,000/min and $2M+/hour: [Manufacturing.net](https://www.manufacturing.net/home/article/13055083/the-22000perminute-manufacturing-problem); [Thomasnet](https://news.thomasnet.com/companystory/downtime-costs-auto-industry-22k-minute-survey-481017); [Arda](https://www.arda.cards/post/the-alarming-costs-of-downtime-how-lost-production-time-threatens-your-bottom-line-in-2025)
- Assembly cadence (~1 vehicle/min) & Wolfsburg output: [HowStuffWorks](https://auto.howstuffworks.com/under-the-hood/auto-manufacturing/automotive-production-line.htm); [VW Plant Wolfsburg — Wikipedia](https://en.wikipedia.org/wiki/Volkswagen_Plant_Wolfsburg)
- Automotive freight / expediting economics ($3.1M avg disruption loss; air ~10% vs ocean ~3% of value; expedited 2–3×): [Xeneta](https://www.xeneta.com/blog/automotive-supply-chains-are-paying-the-price-of-freight-blind-spots); [Shipinland](https://www.shipinland.com/news/reevaluating-air-freight-how-higher-costs-can-drive-greater-supply-chain-value)
- Mapped supply chain = exposure known in minutes vs weeks/months: [Resilinc — Multi-Tier Supplier Mapping](https://www.resilinc.com/blog/multi-tier-supplier-mapping/)
- Response speed today (41% need a week to identify affected materials; ~2 weeks to plan/execute) & cross-functional war-room dynamics: [iFactory survey summary](https://ifactoryapp.com/vendor-management/supplier-risk-management-supply-chain-disruption-2026-ai); academic — de Vries et al., *Journal of Supply Chain Management* (2022), [Wiley](https://onlinelibrary.wiley.com/doi/10.1111/jscm.12262)
- Wire-harness output at risk (10–15% / ~700k vehicles of European output): [Bloomberg](https://www.bloomberg.com/news/articles/2022-03-15/ukraine-plant-shutdowns-may-cost-europe-output-of-700-000-cars); [Euronews/Reuters](https://www.euronews.com/next/2022/03/02/autos-ukraine-suppliers)
- Sub-tier origin of disruptions (85% beyond Tier 1; 68% high-tech at Tier 2/3) — commonly cited across SCRM literature; primary attribution diffuse: [Z2Data](https://www.z2data.com/insights/why-supply-chain-visibility-efforts-stop-at-tier-1-what-thats-costing-you); [Onspring](https://onspring.com/resources/blog/tier-2-tier-3-supply-chain-risk-visibility/)
- Wire-harness crisis 2022 (VW Wolfsburg/Zwickau halts; Ukraine a major harness source): [S&P Global Mobility](https://www.spglobal.com/mobility/en/research-analysis/ukraine-conflict-wiring-harness.html) and McKinsey automotive coverage; exact supply % varies by source.
- PPAP / re-sourcing lead times (12–52 weeks; tooling 6–12 months): [MachineMetrics — PPAP guide](https://www.machinemetrics.com/blog/ppap-production-part-approval-process); [PPAP — Wikipedia](https://en.wikipedia.org/wiki/Production_part_approval_process)

**Estimate (practitioner range — label as such if quoted aloud):**

- The 4–8 hour first-pass assessment, 10–20 people / hundreds of person-hours per major event, reactive firefighting at 3–5× proactive cost, and 40–60% firefighting time are practitioner ranges — directionally supported by the cited sources but not single-study figures. (Note the cited survey above — *a week* to identify affected materials — suggests 4–8 hours is, if anything, optimistic.)

---

## Caveats for an executive audience

- The single most defensible, hardest-to-argue numbers are **$210B / 7.7M vehicles (AlixPartners)** and **45% of a year's profits (McKinsey)**. Lead with these.
- Treat "$2M/hour," "85% beyond Tier 1," and "10 minutes vs 4–8 hours" as *credible ranges*, not precise constants — VW's own people will have their own plant numbers, and inviting them to plug those in is more persuasive than defending a single figure.
- The Graph Explorer's claim is **speed and visibility of impact tracing**, not disruption prevention or replacing SAP/Prewave/Catena-X. Keep the value statement honest to what the graph does: it makes the hidden dependency visible and the impact decision fast.

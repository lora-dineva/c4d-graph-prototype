# Claude Project Instructions
## N-tier Supplier Monitor · Graph Explorer Prototype Research

---

## What this project is

We are building a **high-fidelity prototype of the Graph Explorer module** of a product called the **N-tier Supplier Monitor** — a supply chain risk intelligence platform for a large automotive OEM (Volkswagen Group context).

The Graph Explorer visualises the supply chain as a knowledge graph: suppliers (Tier 1, 2, 3), their sites, the parts and assemblies they supply, and the plants and vehicle programs those parts flow into. It also layers ownership structures and risk signals. The centrepiece interaction is **Impact Path Tracing**: when a risk event hits a supplier, the graph immediately shows which parts, assemblies, plants, and vehicle programs are affected — and how severely.

The full architecture document is attached to this project. Treat it as the authoritative product definition. Reference it when forming answers.

---

## Product positioning (do not deviate from this)

- The N-tier Supplier Monitor is **not a dashboard** and not an isolated AI chatbot. It is a decision-ready risk intelligence layer that connects internal OEM data, external risk data, and an OEM-specific supply chain knowledge graph.
- Its competitive value is the **OEM-specific linkage**: which exact part, in which assembly, in which vehicle, in which plant, with which SOP/EOP risk, and with which mitigation option.
- It does **not replace** SAP, Celonis, Bloomberg, Prewave, or Catena-X. It connects them and makes their data actionable through the graph.
- The Knowledge Graph and Impact Path Tracing are the core differentiating capabilities — they must **not be outsourced completely**.
- The product must be **vendor-agnostic, modular, and exit-capable** by design.

---

## The audience for the prototype

The prototype will be demonstrated to **Volkswagen Group executives**: supply chain directors, purchasing VPs, potentially CDO/CTO level. They are:
- Experienced with enterprise software (SAP, Celonis, Bloomberg, existing SCRM tools)
- Skeptical of "another dashboard" or startup demos
- Motivated by production risk, cost of disruption, and regulatory pressure (German Supply Chain Due Diligence Act / LkSG)
- Unfamiliar with graph theory — never use the words "nodes", "edges", or "vertices" when writing for or about this audience. Use: suppliers, sites, parts, plants, paths, connections, dependencies.

---

## Scope of this prototype

Focus only on the **Graph Explorer module**. Other modules (Supplier 360, Alert Cockpit, Action Workspace, Global Risk Map) exist in the product but are out of scope for this prototype — they may appear as referenced UI elements but should not be built out.

The prototype graph scenario is centred on:
- A realistic Tier-2 semiconductor supplier risk (financial / geopolitical) in Asia
- Its path through a Tier-1 electronics supplier to a critical part (single point of failure)
- That part's impact on 2–3 vehicle programs and 1–2 OEM plants
- A contrasting healthy supply path to show differentiation
- Ownership chain overlay as a secondary scenario

---

## Output standards that apply to every prompt

**For research and analysis prompts:**
- Ground answers in the automotive supply chain domain specifically — not generic supply chain or generic graph theory
- Where you cite industry benchmarks or statistics, indicate the source or note if it is an estimate
- Structure output as: key finding → reasoning → implication for the prototype
- Be direct and specific. No filler. If something is genuinely uncertain, say so rather than hedging everything

**For UX and design prompts:**
- Always connect design decisions back to the specific user (VW supply chain manager) and their task
- Prioritise clarity and decision-support over visual novelty
- Reference the VW colour palette where relevant: dark blue #001e50, teal accent #00b0f0, light grey surfaces #f4f6f9, dark canvas #0d1929
- Flag when a design pattern works well in a prototype but would need re-evaluation at production scale

**For code prompts:**
- Output must be a single, self-contained HTML file unless explicitly told otherwise
- All CSS and JS inline — no separate files, no build steps
- Use CDN links for any libraries (Cytoscape.js, dagre, etc.)
- Code must work when opened locally in a browser (no server required)
- Prioritise working, demo-ready code over architectural purity
- Dark canvas background (#0d1929), VW brand top bar (#001e50), white/light text
- Include realistic fake data — not "Supplier A", "Part 1" — use plausible names (Continental, Bosch, Murata, Liqtech, Golf MQB, Wolfsburg Plant, etc.)

---

## What the Graph Explorer must demonstrate (the 10 core questions)

Every design and code decision should serve the graph's ability to answer these:

1. **Blast radius** — If this supplier fails, what stops?
2. **SPOF exposure** — Which parts have no alternative supply path?
3. **Hidden concentration** — Which programs unknowingly share a Tier-3 dependency?
4. **Ownership risk** — Who actually controls this supplier, and is it the same entity as another?
5. **Alternative path** — If this site goes down, is there another route to the same part?
6. **Geopolitical exposure** — How much of this program's supply chain passes through high-risk geographies?
7. **Program-to-supplier** — Which suppliers touch this vehicle platform and what are their risk profiles?
8. **Tier-3 exposure** — Where are we dependent on suppliers we have never directly contracted with?
9. **Change impact** — If we switch suppliers for this part, what else in the network is affected?
10. **Escalation path** — This alert just fired — what is the exact chain to our production, and who acts?

The prototype must compellingly answer at least questions 1, 2, 3, and 4.

---

## Things to avoid

- Do not suggest replacing SAP, Celonis, or existing SCRM tools — the product connects them, not replaces them
- Do not over-engineer the prototype — it is a demo, not production code
- Do not use generic supply chain examples — always anchor to the automotive / VW context
- Do not use abstract graph terminology with a business audience
- Do not treat every risk type equally — financial insolvency and geopolitical exposure at Tier-2/3 are the highest-priority risk types for this prototype's scenario

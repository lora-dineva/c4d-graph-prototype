# Complexity Analysis Prompt — Zero-Setup Demo

Use this prompt to analyze the product / FE / BE / sample-data specs and rate how complex
it is to build a demo a colleague can run with **no installs and no Docker**. Paste your
specs at the bottom before running.

---

You are a senior solution architect. I will give you the product, frontend, backend, and
sample-data specs for a demo we want to build. Analyze them and produce a complexity
assessment focused on ONE goal: a colleague must be able to run the demo with ZERO setup.

Hard constraints (non-negotiable):
- Runs by opening a single file in a browser. No dependency installation (no npm/pip),
  no Docker, no build step, no local server.
- The backend is simulated in the browser (mock API layer + in-memory state). Use the
  provided sample data, inlined.
- Any third-party library is loaded via CDN or inlined — never installed.

Do the following:
1. Requirements inventory: list every technical requirement implied by the specs
   (features, screens, data entities, interactions, external integrations).
2. Classify each requirement as:
   A — trivially client-side,
   B — client-side with a mock/fake,
   C — genuinely needs a real backend/service (flag it).
3. For every C, propose an in-browser fake that preserves the demo experience, or
   recommend cutting it for the demo. Nothing should remain that requires a server.
4. Overall complexity rating (Low / Medium / High) with a one-line justification, plus a
   rough build-effort estimate.
5. Recommended architecture: the simplest design that meets the constraints — name the
   framework (via CDN), how the mock API and state work, and how sample data is embedded.
   Default to a single self-contained index.html unless you justify otherwise.
6. Risks & mitigations: CDN/offline dependence, file:// restrictions, data volume, state
   persistence across reloads, browser compatibility.
7. "Share & run" instructions: exactly what the colleague receives and the steps to run it
   (target: open index.html, nothing else).

Specs:
<paste product / FE / BE / sample-data docs here>

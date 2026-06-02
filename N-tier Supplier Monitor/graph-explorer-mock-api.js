/* =============================================================================
 * Graph Explorer — IN-BROWSER MOCK API  (no server, no fetch, no build)
 * -----------------------------------------------------------------------------
 * Implements the §3.4 endpoint surface as Promise-returning client functions
 * over the active graph dataset (graph-explorer-data.js + use-case modules).
 * Method bodies are pure graph traversal — swap them for fetch() later and
 * the UI never changes.
 *
 * Depends on globals: ACTIVE_GRAPH, ACTIVE_USE_CASE, USE_CASES, ALERTS, …
 * MUST be loaded AFTER the data <script> blocks.
 * ===========================================================================*/

(function (global) {
  "use strict";

  function getActiveGraph() {
    return (typeof ACTIVE_GRAPH !== "undefined" && ACTIVE_GRAPH) ? ACTIVE_GRAPH : GRAPH;
  }
  function getActiveUseCase() {
    return (typeof ACTIVE_USE_CASE !== "undefined" && ACTIVE_USE_CASE) ? ACTIVE_USE_CASE : "semiconductor";
  }
  function getUseCaseConfig() {
    if (typeof USE_CASES !== "undefined" && USE_CASES[getActiveUseCase()]) return USE_CASES[getActiveUseCase()];
    return { alerts: ALERTS, alertHistory: ALERT_HISTORY || {}, warnings: [], systemViews: SYSTEM_VIEWS || [] };
  }
  function getActiveAlerts() { return getUseCaseConfig().alerts || ALERTS; }
  function getActiveAlertHistory() { return getUseCaseConfig().alertHistory || ALERT_HISTORY || {}; }
  function getActiveWarnings() { return getUseCaseConfig().warnings || (typeof KG_CASE1_WARNINGS !== "undefined" ? KG_CASE1_WARNINGS : []); }

  // ---- indexes -------------------------------------------------------------
  const N = new Map();
  const OUT = new Map();
  const IN  = new Map();

  function indexGraph() {
    const G = getActiveGraph();
    N.clear(); OUT.clear(); IN.clear();
    G.nodes.forEach(n => { N.set(n.data.id, n.data); OUT.set(n.data.id, []); IN.set(n.data.id, []); });
    G.edges.forEach(e => {
      if (!OUT.has(e.data.source)) OUT.set(e.data.source, []);
      if (!IN.has(e.data.target))  IN.set(e.data.target, []);
      OUT.get(e.data.source).push(e.data);
      IN.get(e.data.target).push(e.data);
    });
  }
  indexGraph();

  const node = id => N.get(id);
  const isSupplier = id => { const d = N.get(id); return d && d.type === "supplier"; };
  const FWD = new Set(["SUPPLIES","PART_OF_ASSEMBLY","USED_IN","ASSEMBLED_AT","MATERIAL_DEPENDENCY","MANUFACTURED_AT"]);

  function followFwd(e) {
    if (!FWD.has(e.relationship)) return false;
    if (e.relationship === "SUPPLIES" && isSupplier(e.target)) return false;
    if (e.relationship === "MANUFACTURED_AT") return false;
    return true;
  }

  const reply = (val, ms = 60) => new Promise(res => setTimeout(() => res(val), ms));

  function forwardReach(sourceId) {
    const seenN = new Set([sourceId]), seenE = new Set(), q = [sourceId];
    while (q.length) {
      const cur = q.shift();
      (OUT.get(cur) || []).forEach(e => {
        if (!followFwd(e)) return;
        seenE.add(e.id);
        if (!seenN.has(e.target)) { seenN.add(e.target); q.push(e.target); }
      });
    }
    return { nodes: seenN, edges: seenE };
  }

  function upstreamSuppliers(programId) {
    const seen = new Set([programId]), suppliers = new Set(), q = [programId];
    while (q.length) {
      const cur = q.shift();
      (IN.get(cur) || []).forEach(e => {
        if (!(FWD.has(e.relationship) || e.relationship === "SUPPLIES")) return;
        if (!seen.has(e.source)) {
          seen.add(e.source);
          if (isSupplier(e.source)) suppliers.add(e.source);
          q.push(e.source);
        }
      });
    }
    return suppliers;
  }

  const PATH_TEMPLATES = {
    t2_siltech: [
      { id:"p_ddc_golf",  severity:"critical", spof:true, revenueAtRisk:22000000, bufferDays:29, label:"Display Driver IC → Wolfsburg → Golf",
        hops:[ {id:"t2_siltech",role:"supplier",owner:"commodity buyer"}, {id:"part_ddc",role:"part",spof:true}, {id:"asm_infotainment",role:"assembly"}, {id:"plant_wolfsburg",role:"plant",owner:"plant logistics"}, {id:"prog_golf",role:"program",bufferDays:29} ] },
      { id:"p_ddc_tig",   severity:"critical", spof:true, revenueAtRisk:12000000, bufferDays:29, label:"Display Driver IC → Wolfsburg → Tiguan",
        hops:[ {id:"t2_siltech",role:"supplier"}, {id:"part_ddc",role:"part",spof:true}, {id:"asm_infotainment",role:"assembly"}, {id:"plant_wolfsburg",role:"plant"}, {id:"prog_tiguan",role:"program",bufferDays:29} ] },
      { id:"p_mos_id4",   severity:"critical", spof:true, revenueAtRisk:16000000, bufferDays:9,  label:"Power MOSFET → Zwickau → ID.4  (first line down)",
        hops:[ {id:"t2_siltech",role:"supplier",owner:"commodity buyer"}, {id:"part_mosfet",role:"part",spof:true}, {id:"asm_inverter",role:"assembly"}, {id:"plant_zwickau",role:"plant",owner:"plant logistics"}, {id:"prog_id4",role:"program",bufferDays:9} ] },
      { id:"p_mos_id7",   severity:"high",     spof:true, revenueAtRisk:8000000,  bufferDays:14, label:"Power MOSFET → Emden → ID.7",
        hops:[ {id:"t2_siltech",role:"supplier"}, {id:"part_mosfet",role:"part",spof:true}, {id:"asm_inverter",role:"assembly"}, {id:"plant_emden",role:"plant"}, {id:"prog_id7",role:"program",bufferDays:14} ] }
    ],
    kg_magnet_material: [
      { id:"p_kg_mag_meb", severity:"high", spof:false, revenueAtRisk:0, bufferDays:null,
        label:"Magnet Material → Magnet Set → Electric Motor → HVAC Compressor → Thermal Mgmt → MEB",
        hops:[
          { id:"kg_magnet_material", role:"part" },
          { id:"kg_magnet_set", role:"part" },
          { id:"kg_electric_motor", role:"part" },
          { id:"kg_hvac_compressor", role:"part" },
          { id:"kg_thermal_management_system", role:"assembly" },
          { id:"kg_meb_platform", role:"program" }
        ]
      }
    ],
    kg2_hagen_plant: [
      { id:"p_kg2_hagen_meb", severity:"high", spof:false, revenueAtRisk:0, bufferDays:null,
        label:"Hagen Plant → Suspension Spring → Rear Chassis Module → Vehicle Chassis → MEB",
        hops:[
          { id:"kg2_hagen_plant", role:"site" },
          { id:"kg2_suspension_spring", role:"part" },
          { id:"kg2_rear_chassis_module", role:"part" },
          { id:"kg2_vehicle_chassis", role:"assembly" },
          { id:"kg2_meb_platform", role:"program" }
        ]
      }
    ],
    kg2_steel: [
      { id:"p_kg2_steel_meb", severity:"medium", spof:false, revenueAtRisk:0, bufferDays:null,
        label:"Steel → Steel Tubes → Rear Chassis Module → Vehicle Chassis → MEB",
        hops:[
          { id:"kg2_steel", role:"part" },
          { id:"kg2_steel_tubes", role:"part" },
          { id:"kg2_rear_chassis_module", role:"part" },
          { id:"kg2_vehicle_chassis", role:"assembly" },
          { id:"kg2_meb_platform", role:"program" }
        ]
      }
    ]
  };

  const KG_PATH_EDGES = new Set([
    "kg_e_mat_magnet", "kg_e_magnet_motor", "kg_e_motor_hvac",
    "kg_e_hvac_tms", "kg_e_tms_meb"
  ]);

  const mockApi = {

    getGraph() {
      const G = getActiveGraph();
      return reply({
        nodes: G.nodes, edges: G.edges,
        meta: { counts: {
          suppliers: G.nodes.filter(n => n.data.type === "supplier").length,
          parts:     G.nodes.filter(n => n.data.type === "part").length,
          plants:    G.nodes.filter(n => n.data.type === "plant").length,
          programs:  G.nodes.filter(n => n.data.type === "program").length,
          nodes: G.nodes.length, edges: G.edges.length
        }}
      });
    },

    getEntity(id) {
      const d = node(id);
      if (!d) return reply(null);
      const supplies = (OUT.get(id) || []).filter(e => e.relationship === "SUPPLIES" || e.relationship === "QUALIFIED_FOR");
      const warning = getActiveWarnings().find(w => w.nodeId === id) || null;
      return reply({
        ...d,
        ownershipChainAvailable: !!d.ultimateParentId,
        alerts: getActiveAlerts().filter(a => a.supplierId === id),
        history: getActiveAlertHistory()[id] || null,
        supplies: supplies.map(e => ({ partOrEntity: e.target, criticality: e.criticality, spof: !!e.spof, qualified: !!e.qualified_alternate })),
        warning
      });
    },

    traceImpact(sourceId) {
      const { nodes, edges } = forwardReach(sourceId);
      const ids = [...nodes];
      const partIds    = ids.filter(i => node(i)?.type === "part");
      const spofParts  = partIds.filter(i => node(i)?.single_point_of_failure);
      const plantIds   = ids.filter(i => node(i)?.type === "plant" || node(i)?.type === "site");
      const programIds = ids.filter(i => node(i)?.type === "program");
      const revenueAtRisk = spofParts.reduce((s,i) => s + (node(i)?.revenue_at_risk || 0), 0);

      const paths = (PATH_TEMPLATES[sourceId] || []).slice()
        .sort((a,b) => (b.revenueAtRisk || 0) - (a.revenueAtRisk || 0));
      const first = paths.reduce((m,p) => (p.bufferDays != null && p.bufferDays < m.bufferDays ? p : m), { bufferDays: Infinity });

      const G = getActiveGraph();
      const altEdges = G.edges.filter(e => e.data.relationship === "QUALIFIED_FOR" && partIds.includes(e.data.target));
      const anyIndependentAlt = altEdges.some(e => !e.data.correlated_owner);

      return reply({
        source: { id: sourceId, ...node(sourceId) },
        affectedNodeIds: ids.filter(i => i !== sourceId),
        affectedEdgeIds: [...edges],
        summary: {
          plantsAtRisk: plantIds.length,
          spofCount: spofParts.length, spofParts,
          partsAffected: partIds.length,
          revenueAtRisk,
          programs: programIds.map(i => node(i)?.name),
          programIds,
          earliestSOPatRisk: sourceId.indexOf("kg_") === 0 ? "2026-Q4" : "2026-Q3",
          firstLineDown: first.bufferDays === Infinity ? null
            : { program: node(first.hops?.at(-1)?.id)?.name, days: first.bufferDays },
          alternativeStatus: anyIndependentAlt ? "independent_available" : "none_independent",
          qualificationLeadWeeks: altEdges[0]?.data.lead_time_weeks || 22,
          lksgDisclosureRequired: !!node(sourceId)?.lksgDisclosureRequired
        },
        paths,
        healthyContrast: (typeof SCENARIOS !== "undefined" && SCENARIOS.healthy_control) ? SCENARIOS.healthy_control : null
      });
    },

    traceWarning(warningId) {
      const w = getActiveWarnings().find(x => x.id === warningId);
      if (!w) return reply(null);
      const affected = new Set(w.affectedNodeIds);
      const edgeIds = [];
      getActiveGraph().edges.forEach(e => {
        const d = e.data;
        if (affected.has(d.source) && affected.has(d.target)) edgeIds.push(d.id);
      });
      const chainLabels = w.affectedNodeIds
        .map(id => node(id))
        .filter(d => d && d.type !== "supplier" && d.type !== "site" && d.type !== "plant")
        .map(d => d.name);
      return reply({
        warning: w,
        source: { id: w.nodeId, ...node(w.nodeId) },
        affectedNodeIds: [...w.affectedNodeIds],
        affectedEdgeIds: edgeIds,
        chainLabel: chainLabels.join(" → "),
        summary: {
          programs: w.affectedNodeIds.filter(id => node(id)?.type === "program").map(id => node(id).name),
          programIds: w.affectedNodeIds.filter(id => node(id)?.type === "program"),
          plantsAtRisk: w.affectedNodeIds.filter(id => node(id)?.type === "plant" || node(id)?.type === "site").length,
          partsAffected: w.affectedNodeIds.filter(id => node(id)?.type === "part" || node(id)?.type === "assembly").length,
          affectedChain: chainLabels.join(" → ")
        },
        paths: PATH_TEMPLATES[w.nodeId] || PATH_TEMPLATES.kg_magnet_material || []
      });
    },

    getConcentration() {
      const G = getActiveGraph();
      const spofParts = G.nodes
        .filter(n => n.data.type === "part" && n.data.single_point_of_failure)
        .map(n => n.data.id);
      const scoreMap = {};
      spofParts.forEach(sp => {
        const programs = [...forwardReach(sp).nodes].filter(i => node(i)?.type === "program");
        mandatorySuppliersFor(sp).forEach(sid => {
          if (!scoreMap[sid]) scoreMap[sid] = new Set();
          programs.forEach(p => scoreMap[sid].add(p));
        });
      });
      const rows = Object.entries(scoreMap).map(([sid, set]) => {
        const progs = [...set];
        const vol = progs.reduce((s,p) => s + (node(p)?.annual_volume || 0), 0);
        return { supplierId: sid, name: node(sid)?.name, tier: node(sid)?.tier,
                 programsLostIfRemoved: progs, weightedVolume: vol, score: progs.length * 1e9 + vol };
      }).sort((a,b) => b.score - a.score);
      return reply(rows);
    },

    getSharedDependencies(programIds) {
      const sets = programIds.map(upstreamSuppliers);
      let inter = [...(sets[0] || [])];
      for (let i = 1; i < sets.length; i++) inter = inter.filter(x => sets[i].has(x));
      inter.sort((a,b) => (node(b)?.tier||0) - (node(a)?.tier||0));
      return reply({
        shared: inter.map(id => ({ id, name: node(id)?.name, tier: node(id)?.tier, riskLevel: node(id)?.risk_level })),
        headline: inter.find(id => node(id)?.tier === 3) || inter[0] || null,
        overlapCount: inter.length
      });
    },

    getOwnershipChain(entityId) {
      const chain = [];
      let cur = entityId, guard = 0;
      while (cur && guard++ < 12) {
        chain.push({ id: cur, ...node(cur) });
        const up = (OUT.get(cur) || []).find(e => e.relationship === "OWNED_BY" && e.layoutClass === "ownership");
        if (!up) break;
        chain.push({ edge: true, stake: up.stake, sanctionRisk: up.sanctionRisk, verified: up.verified, source: up.source_ref });
        cur = up.target;
      }
      const ult = chain.filter(c => !c.edge).at(-1);
      const sponsor = (IN.get(entityId) || []).find(e => e.relationship === "HOLDS_STAKE");
      return reply({
        chain,
        ultimateParent: ult ? { id: ult.id, name: ult.name, sanctionScreeningStatus: ult.sanctionScreeningStatus,
                                complianceFlag: ult.complianceFlag, country: ult.country } : null,
        financialSponsor: sponsor ? { ...node(sponsor.source), stake: sponsor.stake, board: sponsor.board } : null,
        dataFreshness: "Orbis/Bureau van Dijk · Verified Q4 2024 · Verify before regulatory submission"
      });
    },

    getOwnerConcentration() {
      const G = getActiveGraph();
      const byParent = {};
      G.nodes.forEach(n => {
        const pid = n.data.ultimateParentId;
        if (n.data.type === "supplier" && pid) {
          if (!byParent[pid]) byParent[pid] = [];
          byParent[pid].push(n.data.id);
        }
      });
      const rows = Object.entries(byParent)
        .filter(([, s]) => s.length > 1)
        .map(([pid, s]) => ({
          ultimateParentId: pid, ultimateParentName: node(pid)?.name,
          sanctioned: node(pid)?.sanctionScreeningStatus === "sanctioned",
          suppliers: s.map(id => node(id)?.name), supplierIds: s, count: s.length,
          combinedPrograms: [...new Set(s.flatMap(sid => [...upstreamProgramsOf(sid)]))].map(i => node(i)?.name)
        }))
        .sort((a,b) => b.count - a.count);
      return reply(rows);
    },

    getAlternatives(partId, excludeSupplierId) {
      const active = (IN.get(partId) || []).filter(e => e.relationship === "SUPPLIES");
      const qualified = (IN.get(partId) || []).filter(e => e.relationship === "QUALIFIED_FOR");
      const alts = [];
      active.forEach(e => { if (e.source !== excludeSupplierId) alts.push(mkAlt(e.source, partId, false)); });
      qualified.forEach(e => alts.push(mkAlt(e.source, partId, true, e)));
      const independent = alts.filter(a => a.independent);
      return reply({ partId, alternatives: alts, hasIndependent: independent.length > 0,
        verdict: independent.length ? "alternative_qualified" : "no_independent_source" });
    },

    simulateResource(partId, newSupplierId) {
      const programsToRevalidate = [...forwardReach(partId).nodes].filter(i => node(i)?.type === "program").map(i => node(i)?.name);
      const oldSupplier = currentSupplierOf(partId);
      const residual = oldSupplier ? [...forwardReach(oldSupplier).nodes]
        .filter(i => node(i)?.type === "part" && i !== partId).map(i => node(i)?.name) : [];
      const newReach = [...forwardReach(newSupplierId).nodes];
      const newConc = newReach.filter(i => node(i)?.type === "program" && programsToRevalidate.includes(node(i)?.name)).map(i => node(i)?.name);
      return reply({
        part: node(partId)?.name, from: node(oldSupplier)?.name, to: node(newSupplierId)?.name,
        programsToRevalidate, residualExposureOnOldSupplier: residual,
        newConcentrationCreated: newConc,
        removesSpof: !!node(partId)?.single_point_of_failure,
        note: newConc.length ? `Switch creates a new shared dependency on ${node(newSupplierId)?.name} for: ${newConc.join(", ")}` : "No new concentration created."
      });
    },

    search(q) {
      const term = (q || "").trim().toLowerCase();
      if (!term) return reply({ suppliers:[], parts:[], programs:[], suggestion:null });
      const hit = d => (d.name || "").toLowerCase().includes(term) || (d.part_number||"").toLowerCase().includes(term);
      const all = getActiveGraph().nodes.map(n => n.data);
      const group = t => all.filter(d => d.type === t && hit(d))
        .map(d => ({ id:d.id, name:d.name, tier:d.tier, country:d.country, risk_level:d.risk_level, part_number:d.part_number }));
      let suppliers = group("supplier"), parts = group("part"), programs = group("program");
      let suggestion = null;
      if (!suppliers.length && !parts.length && !programs.length) {
        const cand = all.filter(d => d.type === "supplier")
          .map(d => ({ d, dist: lev(term, (d.name||"").toLowerCase().slice(0, term.length+2)) }))
          .sort((a,b) => a.dist - b.dist)[0];
        if (cand && cand.dist <= 3) suggestion = cand.d.name;
      }
      return reply({ suppliers, parts, programs, suggestion });
    },

    getAlerts() {
      const order = { critical:0, high:1, medium:2, info:3 };
      const alerts = getActiveAlerts();
      const rows = alerts.slice().sort((a,b) =>
        (order[a.severity]-order[b.severity]) || (b.ts.localeCompare(a.ts)));
      return reply({ alerts: rows, count: rows.filter(a => a.status === "active").length });
    },
    ackAlert(id, user) {
      const a = getActiveAlerts().find(x => x.id === id);
      if (a) { a.status = "acknowledged"; a.ackBy = user || "demo user"; a.ackAt = new Date().toISOString(); }
      return reply({ ok: !!a, alert: a });
    },

    listViews() {
      let mine = [];
      try { mine = JSON.parse(localStorage.getItem("ge_my_views") || "[]"); } catch (e) {}
      const cfg = getUseCaseConfig();
      return reply({ system: cfg.systemViews || SYSTEM_VIEWS || [], mine });
    },
    saveView(view) {
      const v = { id: "my_" + Date.now(), ...view };
      try {
        const cur = JSON.parse(localStorage.getItem("ge_my_views") || "[]");
        cur.push(v); localStorage.setItem("ge_my_views", JSON.stringify(cur));
      } catch (e) { /* file:// may block localStorage */ }
      return reply({ ok: true, view: v });
    }
  };

  function currentSupplierOf(partId) {
    const e = (IN.get(partId) || []).find(x => x.relationship === "SUPPLIES");
    return e ? e.source : null;
  }
  function currentSupplierNode(partId) { const s = currentSupplierOf(partId); return s ? node(s) : null; }

  function mkAlt(supplierId, partId, qualifiedOnly, edge) {
    const src = node(supplierId), curNode = currentSupplierNode(partId);
    const sameOwner = !!(src?.ultimateParentId && curNode?.ultimateParentId && src.ultimateParentId === curNode.ultimateParentId);
    const correlated = !!(edge?.correlated_owner) || sameOwner;
    return {
      supplierId, name: src?.name, country: src?.country,
      qualifiedOnly, sameOwner: correlated,
      sameRegion: !!(src && curNode && src.country === curNode.country),
      leadTimeWeeks: edge?.lead_time_weeks || null,
      independent: !qualifiedOnly ? true : !correlated
    };
  }

  function mandatorySuppliersFor(spofPartId, acc) {
    const result = acc || new Set();
    const direct = (IN.get(spofPartId) || []).filter(e => e.relationship === "SUPPLIES");
    if (direct.length === 1) {
      const sid = direct[0].source;
      result.add(sid);
      climbMandatory(sid, result);
    }
    (IN.get(spofPartId) || [])
      .filter(e => e.relationship === "MATERIAL_DEPENDENCY")
      .forEach(e => mandatorySuppliersFor(e.source, result));
    return result;
  }
  function climbMandatory(supplierId, result) {
    const inputs = (IN.get(supplierId) || []).filter(e => e.relationship === "SUPPLIES");
    if (inputs.length === 1) {
      const u = inputs[0].source;
      if (!result.has(u)) { result.add(u); climbMandatory(u, result); }
    }
  }

  function upstreamProgramsOf(supplierId) {
    return new Set([...forwardReach(supplierId).nodes].filter(i => node(i)?.type === "program"));
  }
  function lev(a, b) {
    const m = a.length, n = b.length, d = Array.from({length:m+1}, (_,i)=>[i, ...Array(n).fill(0)]);
    for (let j=0;j<=n;j++) d[0][j]=j;
    for (let i=1;i<=m;i++) for (let j=1;j<=n;j++)
      d[i][j] = Math.min(d[i-1][j]+1, d[i][j-1]+1, d[i-1][j-1] + (a[i-1]===b[j-1]?0:1));
    return d[m][n];
  }

  global.mockApi = mockApi;
  global.geReindex = indexGraph;

})(typeof window !== "undefined" ? window : globalThis);

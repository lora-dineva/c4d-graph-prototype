/* =============================================================================
 * Graph Explorer — RECONCILED DEMO DATASET  (single source of truth)
 * N-tier Supplier Monitor · VW Group prototype
 * -----------------------------------------------------------------------------
 * This is the FINAL, deduped dataset that the spec (Graph-Explorer-PRD-FE-BE-Spec.md)
 * only described. Build Decisions applied:
 *   #1 structural-risk palette vs alert palette are separate roles
 *   #2 lowercase enums everywhere (risk_level/risk_type/alert_status/...)
 *   #3 ONE merged cast, one canonical name per entity
 *   #4 hierarchical layout = TB (OEM/programs at top, Tier-3 at bottom)
 *   #5 panel width 380px (FE concern, not data)
 *
 * MUST be INLINED into index.html as a <script> block. Do NOT fetch() it on file://.
 * Cytoscape element format: { data: { id, ... } }.
 *
 * Layout/traversal contract:
 *   edge.relationship : SUPPLIES | PART_OF_ASSEMBLY | USED_IN | ASSEMBLED_AT |
 *                       MATERIAL_DEPENDENCY | MANUFACTURED_AT | OWNED_BY |
 *                       QUALIFIED_FOR | HOLDS_STAKE
 *   edge.layoutClass  : structure | process | material | supply | ownership
 *                       -> ownership edges are EXCLUDED from dagre layout (overlay only)
 *   Forward "blast-radius" traversal follows ONLY downstream relationships
 *   { SUPPLIES(→part only), PART_OF_ASSEMBLY, USED_IN, ASSEMBLED_AT, MATERIAL_DEPENDENCY }
 *   and SKIPS supplier→supplier SUPPLIES (business edges) so risk does not
 *   over-propagate to a Tier-1's unrelated parts.
 *
 * Tier ranks for TB dagre pinning:
 *   oem/program:0  plant:1  assembly:2  part:3  T1:4  site:4  T2:5  T3:6
 *   (ultimate_parent/intermediate_holding/financial_sponsor are overlay-only,
 *    inserted ABOVE rank 0 when the ownership layer is toggled on.)
 * ===========================================================================*/

const GRAPH = {
  nodes: [

    /* ── OEM ───────────────────────────────────────────────────────────── */
    { data: { id:"oem_vw", type:"oem", name:"Volkswagen Group", label:"Volkswagen Group" } },

    /* ── Vehicle programs ──────────────────────────────────────────────── */
    { data: { id:"prog_golf",   type:"program", name:"Golf",   label:"Golf (MQB)",   platform:"MQB", plant:"plant_wolfsburg", annual_volume:520000, risk_level:"medium" } },
    { data: { id:"prog_tiguan", type:"program", name:"Tiguan", label:"Tiguan (MQB)", platform:"MQB", plant:"plant_wolfsburg", annual_volume:340000, risk_level:"high" } },
    { data: { id:"prog_id4",    type:"program", name:"ID.4",   label:"ID.4 (MEB)",   platform:"MEB", plant:"plant_zwickau",   annual_volume:210000, risk_level:"high" } },
    { data: { id:"prog_id7",    type:"program", name:"ID.7",   label:"ID.7 (MEB)",   platform:"MEB", plant:"plant_emden",     annual_volume:90000,  risk_level:"medium" } },

    /* ── Plants ────────────────────────────────────────────────────────── */
    { data: { id:"plant_wolfsburg", type:"plant", name:"Wolfsburg", label:"Wolfsburg Plant", country:"Germany", city:"Wolfsburg", lat:52.43, lng:10.79, risk_level:"high",   program_ids:["prog_golf","prog_tiguan"] } },
    { data: { id:"plant_zwickau",   type:"plant", name:"Zwickau",   label:"Zwickau Plant",   country:"Germany", city:"Zwickau",   lat:50.72, lng:12.49, risk_level:"high",   program_ids:["prog_id4"] } },
    { data: { id:"plant_emden",     type:"plant", name:"Emden",     label:"Emden Plant",     country:"Germany", city:"Emden",     lat:53.36, lng:7.21,  risk_level:"medium", program_ids:["prog_id7"] } },

    /* ── Assemblies ────────────────────────────────────────────────────── */
    { data: { id:"asm_infotainment", type:"assembly", name:"MQB Infotainment System", label:"MQB Infotainment", part_count:147, program_ids:["prog_golf","prog_tiguan"] } },
    { data: { id:"asm_inverter",     type:"assembly", name:"Traction Inverter Module", label:"Traction Inverter", part_count:96,  program_ids:["prog_id4","prog_id7"] } },
    { data: { id:"asm_brake",        type:"assembly", name:"Brake Safety Controller",  label:"Brake Safety Ctrl", part_count:54,  program_ids:["prog_golf","prog_id4"] } },
    { data: { id:"asm_dcdc",         type:"assembly", name:"DC-DC Converter Unit",     label:"DC-DC Converter",   part_count:38,  program_ids:["prog_id4"] } },
    { data: { id:"asm_eaxle",        type:"assembly", name:"e-Axle Drive Unit",        label:"e-Axle Drive",      part_count:72,  program_ids:["prog_id4"] } },

    /* ── Parts ─────────────────────────────────────────────────────────── */
    // SPOF #1 — the Scenario-A hook (combustion path)
    { data: { id:"part_ddc", type:"part", name:"Display Driver IC MX7023", label:"Display Driver IC\nMX7023", part_number:"SLT-IC-7023", commodity_group:"semiconductor",
              risk_level:"critical", single_point_of_failure:true, annual_volume:840000, revenue_at_risk:34000000, stock_cover_weeks:4.2, stockout_date:"2026-08-14" } },
    // SPOF #2 — the Scenario-A hook (EV path); shortest runway -> first line down
    { data: { id:"part_mosfet", type:"part", name:"Power MOSFET PX-88", label:"Power MOSFET\nPX-88", part_number:"SLT-PX-88", commodity_group:"semiconductor",
              risk_level:"critical", single_point_of_failure:true, annual_volume:610000, revenue_at_risk:24000000, stock_cover_weeks:1.3, stockout_date:"2026-06-09" } },
    { data: { id:"part_headunit",        type:"part", name:"Infotainment Head Unit MIB3", label:"Head Unit MIB3",        part_number:"VW-3Q0-035-867-A", commodity_group:"infotainment",      risk_level:"high",   single_point_of_failure:false } },
    { data: { id:"part_inverter_module", type:"part", name:"Inverter Power Stage",        label:"Inverter Power Stage", part_number:"CON-IPS-400",      commodity_group:"power_electronics", risk_level:"high",   single_point_of_failure:false } },
    { data: { id:"part_brake_conti",     type:"part", name:"Brake Controller (Continental)", label:"Brake Ctrl (Conti)", part_number:"CON-BSC-21", commodity_group:"safety_electronics", risk_level:"medium", single_point_of_failure:false } },
    { data: { id:"part_brake_bosch",     type:"part", name:"Brake Controller (Bosch)",       label:"Brake Ctrl (Bosch)", part_number:"BOS-BSC-19", commodity_group:"safety_electronics", risk_level:"medium", single_point_of_failure:false } },
    // Scenario-B shared fab die — SPOF hidden one tier below the "dual-sourced" controllers
    { data: { id:"part_paw_die", type:"part", name:"ASIL-D Controller Die", label:"ASIL-D Die", part_number:"PAW-ASILD-7", commodity_group:"semiconductor",
              risk_level:"high", single_point_of_failure:true } },
    // Healthy green control path — genuinely dual-sourced, no shared fab/owner
    { data: { id:"part_dcdc",  type:"part", name:"DC-DC Converter", label:"DC-DC Converter", part_number:"VW-DCDC-12", commodity_group:"power_electronics", risk_level:"low",    single_point_of_failure:false } },
    { data: { id:"part_eaxle", type:"part", name:"e-Axle Drive Unit", label:"e-Axle Unit",   part_number:"KRW-EAX-3",  commodity_group:"drivetrain",       risk_level:"medium", single_point_of_failure:false } },

    /* ── Tier-1 suppliers ──────────────────────────────────────────────── */
    { data: { id:"t1_harman",      type:"supplier", tier:1, name:"Harman International", label:"Harman Intl", country:"USA",     risk_level:"high",   risk_type:"concentration", financial_score:62, alert_status:"active" } },
    { data: { id:"t1_continental", type:"supplier", tier:1, name:"Continental",         label:"Continental", country:"Germany", risk_level:"low",    risk_type:"none",          financial_score:78, alert_status:"none" } },
    { data: { id:"t1_bosch",       type:"supplier", tier:1, name:"Robert Bosch",        label:"Bosch",       country:"Germany", risk_level:"low",    risk_type:"none",          financial_score:81, alert_status:"none" } },
    // PE-owned, high-leverage — drives the PE / debt Risk-Signals cue (ownership-overlay doc §5)
    { data: { id:"t1_kraftwerk",   type:"supplier", tier:1, name:"Kraftwerk Drivetrain GmbH", label:"Kraftwerk Drivetrain", country:"Germany",
              risk_level:"medium", risk_type:"financial_insolvency", financial_score:48, alert_status:"watch",
              peOwned:true, leverageRatio:4.2, debtMaturityYear:2027, creditRating:"B+" } },

    /* ── Tier-1 sites ──────────────────────────────────────────────────── */
    { data: { id:"site_harman_shenzhen", type:"site", tier:1, name:"Harman Shenzhen",        label:"Harman Shenzhen",      country:"China",   city:"Shenzhen",   lat:22.54, lng:114.06, risk_level:"high", operatorEntityId:"t1_harman" } },
    { data: { id:"site_conti_regensburg",type:"site", tier:1, name:"Continental Regensburg", label:"Conti Regensburg",     country:"Germany", city:"Regensburg", lat:49.01, lng:12.10,  risk_level:"low",  operatorEntityId:"t1_continental" } },
    { data: { id:"site_bosch_reutlingen",type:"site", tier:1, name:"Bosch Reutlingen",       label:"Bosch Reutlingen",     country:"Germany", city:"Reutlingen", lat:48.49, lng:9.20,   risk_level:"low",  operatorEntityId:"t1_bosch" } },

    /* ── Tier-2 suppliers ──────────────────────────────────────────────── */
    // THE distressed source — Scenario A source AND Scenario C shared-owner sibling of Veldhoven
    { data: { id:"t2_siltech", type:"supplier", tier:2, name:"SilTech Malaysia", label:"SilTech Malaysia", country:"Malaysia", lat:5.41, lng:100.33,
              risk_level:"critical", risk_type:"financial_insolvency", secondary_risk_type:"geopolitical", financial_score:24, alert_status:"critical",
              single_point_of_failure:false, ultimateParentId:"parent_hongqiao", lksgDisclosureRequired:true, autoTrace:true } },
    // "Safe European supplier" — clean attributes, dirty parent (same as SilTech) — Scenario C
    { data: { id:"t2_veldhoven", type:"supplier", tier:2, name:"Veldhoven Semiconductors", label:"Veldhoven Semi", country:"Netherlands", lat:51.42, lng:5.40,
              risk_level:"low", risk_type:"none", financial_score:74, alert_status:"none", ultimateParentId:"parent_hongqiao", ownership_risk:true } },
    { data: { id:"t2_infineon", type:"supplier", tier:2, name:"Infineon Technologies", label:"Infineon", country:"Germany", risk_level:"low", risk_type:"none", financial_score:80, alert_status:"none" } },
    { data: { id:"t2_renesas",  type:"supplier", tier:2, name:"Renesas Electronics",  label:"Renesas",  country:"Japan",   risk_level:"low", risk_type:"none", financial_score:79, alert_status:"none" } },

    /* ── Tier-3 suppliers ──────────────────────────────────────────────── */
    // Scenario-B shared foundry AND the Q3 hidden convergence (also feeds SilTech)
    { data: { id:"t3_paw", type:"supplier", tier:3, name:"Pan-Asia Wafer", label:"Pan-Asia Wafer", country:"Taiwan", lat:24.78, lng:120.99,
              risk_level:"high", risk_type:"operational", financial_score:58, alert_status:"active", lksgDisclosureRequired:true } },
    { data: { id:"t3_siltronic", type:"supplier", tier:3, name:"Siltronic AG",        label:"Siltronic",  country:"Germany", risk_level:"medium", risk_type:"none" } },
    { data: { id:"t3_shinetsu",  type:"supplier", tier:3, name:"Shin-Etsu Chemical",  label:"Shin-Etsu",  country:"Japan",   risk_level:"low",    risk_type:"none" } },

    /* ── Ownership entities (overlay layer — inserted above the graph) ──── */
    { data: { id:"holding_pearl",     type:"intermediate_holding", name:"Pearl River Holdings",  label:"Pearl River Holdings",  incorporationCountry:"China",       sanctionScreeningStatus:"clear" } },
    { data: { id:"holding_veldhoven", type:"intermediate_holding", name:"Veldhoven Holding B.V.",label:"Veldhoven Holding B.V.",incorporationCountry:"Netherlands", sanctionScreeningStatus:"clear" } },
    { data: { id:"parent_hongqiao",   type:"ultimate_parent", name:"Hongqiao Tech Holdings", label:"Hongqiao Tech Holdings", country:"China", entityType:"sovereign",
              sanctionScreeningStatus:"sanctioned", complianceFlag:"entity_listed", supplierCount:2, concentrationFlag:true, estimatedRevenue:"¥1.4T" } },
    { data: { id:"pe_advent", type:"financial_sponsor", name:"Advent International", label:"Advent International", fundVintage:2019, aum:"€18B", leverageRatio:4.2, debtMaturityYear:2027, strategy:"buyout" } }
  ],

  edges: [

    /* ── Structure: programs & plants → OEM (kept in layout, anchors top) ─ */
    { data:{ id:"e_golf_oem",   source:"prog_golf",       target:"oem_vw", relationship:"OWNED_BY", layoutClass:"structure" } },
    { data:{ id:"e_tig_oem",    source:"prog_tiguan",     target:"oem_vw", relationship:"OWNED_BY", layoutClass:"structure" } },
    { data:{ id:"e_id4_oem",    source:"prog_id4",        target:"oem_vw", relationship:"OWNED_BY", layoutClass:"structure" } },
    { data:{ id:"e_id7_oem",    source:"prog_id7",        target:"oem_vw", relationship:"OWNED_BY", layoutClass:"structure" } },
    { data:{ id:"e_wob_oem",    source:"plant_wolfsburg", target:"oem_vw", relationship:"OWNED_BY", layoutClass:"structure" } },
    { data:{ id:"e_zwi_oem",    source:"plant_zwickau",   target:"oem_vw", relationship:"OWNED_BY", layoutClass:"structure" } },
    { data:{ id:"e_emd_oem",    source:"plant_emden",     target:"oem_vw", relationship:"OWNED_BY", layoutClass:"structure" } },

    /* ── Process: program → plant ──────────────────────────────────────── */
    { data:{ id:"e_golf_wob", source:"prog_golf",   target:"plant_wolfsburg", relationship:"MANUFACTURED_AT", layoutClass:"process" } },
    { data:{ id:"e_tig_wob",  source:"prog_tiguan", target:"plant_wolfsburg", relationship:"MANUFACTURED_AT", layoutClass:"process" } },
    { data:{ id:"e_id4_zwi",  source:"prog_id4",    target:"plant_zwickau",   relationship:"MANUFACTURED_AT", layoutClass:"process" } },
    { data:{ id:"e_id7_emd",  source:"prog_id7",    target:"plant_emden",     relationship:"MANUFACTURED_AT", layoutClass:"process" } },

    /* ── Process: assembly → plant ─────────────────────────────────────── */
    { data:{ id:"e_info_wob",  source:"asm_infotainment", target:"plant_wolfsburg", relationship:"ASSEMBLED_AT", layoutClass:"process" } },
    { data:{ id:"e_inv_zwi",   source:"asm_inverter",     target:"plant_zwickau",   relationship:"ASSEMBLED_AT", layoutClass:"process" } },
    { data:{ id:"e_inv_emd",   source:"asm_inverter",     target:"plant_emden",     relationship:"ASSEMBLED_AT", layoutClass:"process" } },
    { data:{ id:"e_brk_wob",   source:"asm_brake",        target:"plant_wolfsburg", relationship:"ASSEMBLED_AT", layoutClass:"process" } },
    { data:{ id:"e_brk_zwi",   source:"asm_brake",        target:"plant_zwickau",   relationship:"ASSEMBLED_AT", layoutClass:"process" } },
    { data:{ id:"e_dcdc_zwi",  source:"asm_dcdc",         target:"plant_zwickau",   relationship:"ASSEMBLED_AT", layoutClass:"process" } },
    { data:{ id:"e_eax_zwi",   source:"asm_eaxle",        target:"plant_zwickau",   relationship:"ASSEMBLED_AT", layoutClass:"process" } },

    /* ── Material: part → assembly ─────────────────────────────────────── */
    { data:{ id:"e_ddc_info",  source:"part_ddc",             target:"asm_infotainment", relationship:"PART_OF_ASSEMBLY", layoutClass:"material" } },
    { data:{ id:"e_hu_info",   source:"part_headunit",        target:"asm_infotainment", relationship:"PART_OF_ASSEMBLY", layoutClass:"material" } },
    { data:{ id:"e_mos_inv",   source:"part_mosfet",          target:"asm_inverter",     relationship:"PART_OF_ASSEMBLY", layoutClass:"material" } },
    { data:{ id:"e_ips_inv",   source:"part_inverter_module", target:"asm_inverter",     relationship:"PART_OF_ASSEMBLY", layoutClass:"material" } },
    { data:{ id:"e_bc_brk",    source:"part_brake_conti",     target:"asm_brake",        relationship:"PART_OF_ASSEMBLY", layoutClass:"material" } },
    { data:{ id:"e_bb_brk",    source:"part_brake_bosch",     target:"asm_brake",        relationship:"PART_OF_ASSEMBLY", layoutClass:"material" } },
    { data:{ id:"e_dcdc_asm",  source:"part_dcdc",            target:"asm_dcdc",         relationship:"PART_OF_ASSEMBLY", layoutClass:"material" } },
    { data:{ id:"e_eax_asm",   source:"part_eaxle",           target:"asm_eaxle",        relationship:"PART_OF_ASSEMBLY", layoutClass:"material" } },

    /* ── Material: part → program (USED_IN); risk_propagation on SPOF chips */
    { data:{ id:"e_ddc_golf", source:"part_ddc",             target:"prog_golf",   relationship:"USED_IN", layoutClass:"material", risk_propagation:true } },
    { data:{ id:"e_ddc_tig",  source:"part_ddc",             target:"prog_tiguan", relationship:"USED_IN", layoutClass:"material", risk_propagation:true } },
    { data:{ id:"e_hu_golf",  source:"part_headunit",        target:"prog_golf",   relationship:"USED_IN", layoutClass:"material" } },
    { data:{ id:"e_hu_tig",   source:"part_headunit",        target:"prog_tiguan", relationship:"USED_IN", layoutClass:"material" } },
    { data:{ id:"e_mos_id4",  source:"part_mosfet",          target:"prog_id4",    relationship:"USED_IN", layoutClass:"material", risk_propagation:true } },
    { data:{ id:"e_mos_id7",  source:"part_mosfet",          target:"prog_id7",    relationship:"USED_IN", layoutClass:"material", risk_propagation:true } },
    { data:{ id:"e_ips_id4",  source:"part_inverter_module", target:"prog_id4",    relationship:"USED_IN", layoutClass:"material" } },
    { data:{ id:"e_ips_id7",  source:"part_inverter_module", target:"prog_id7",    relationship:"USED_IN", layoutClass:"material" } },
    { data:{ id:"e_bc_golf",  source:"part_brake_conti",     target:"prog_golf",   relationship:"USED_IN", layoutClass:"material" } },
    { data:{ id:"e_bc_id4",   source:"part_brake_conti",     target:"prog_id4",    relationship:"USED_IN", layoutClass:"material" } },
    { data:{ id:"e_bb_golf",  source:"part_brake_bosch",     target:"prog_golf",   relationship:"USED_IN", layoutClass:"material" } },
    { data:{ id:"e_bb_id4",   source:"part_brake_bosch",     target:"prog_id4",    relationship:"USED_IN", layoutClass:"material" } },
    { data:{ id:"e_dcdc_id4", source:"part_dcdc",            target:"prog_id4",    relationship:"USED_IN", layoutClass:"material" } },
    { data:{ id:"e_eax_id4",  source:"part_eaxle",           target:"prog_id4",    relationship:"USED_IN", layoutClass:"material" } },

    /* ── Material dependency: SHARED DIE convergence (Scenario B) ───────── */
    /* direction = die → controller, so forward traversal flows PAW→die→both controllers */
    { data:{ id:"e_die_bc", source:"part_paw_die", target:"part_brake_conti", relationship:"MATERIAL_DEPENDENCY", layoutClass:"material", convergence:true } },
    { data:{ id:"e_die_bb", source:"part_paw_die", target:"part_brake_bosch", relationship:"MATERIAL_DEPENDENCY", layoutClass:"material", convergence:true } },

    /* ── Supply: Tier-1 → part ─────────────────────────────────────────── */
    { data:{ id:"e_harman_hu",  source:"t1_harman",      target:"part_headunit",        relationship:"SUPPLIES", layoutClass:"supply", criticality:"sole_source" } },
    { data:{ id:"e_conti_ips",  source:"t1_continental", target:"part_inverter_module", relationship:"SUPPLIES", layoutClass:"supply", criticality:"sole_source" } },
    { data:{ id:"e_conti_bc",   source:"t1_continental", target:"part_brake_conti",     relationship:"SUPPLIES", layoutClass:"supply", criticality:"dual_source" } },
    { data:{ id:"e_bosch_bb",   source:"t1_bosch",       target:"part_brake_bosch",     relationship:"SUPPLIES", layoutClass:"supply", criticality:"dual_source" } },
    { data:{ id:"e_bosch_dcdc", source:"t1_bosch",       target:"part_dcdc",            relationship:"SUPPLIES", layoutClass:"supply", criticality:"dual_source" } },
    { data:{ id:"e_conti_dcdc", source:"t1_continental", target:"part_dcdc",            relationship:"SUPPLIES", layoutClass:"supply", criticality:"dual_source" } },
    { data:{ id:"e_krw_eax",    source:"t1_kraftwerk",   target:"part_eaxle",           relationship:"SUPPLIES", layoutClass:"supply", criticality:"sole_source" } },
    { data:{ id:"e_paw_die",    source:"t3_paw",         target:"part_paw_die",         relationship:"SUPPLIES", layoutClass:"supply", criticality:"sole_source" } },

    /* ── Supply: Tier-2 → part (the SPOF chips) ────────────────────────── */
    { data:{ id:"e_silt_ddc", source:"t2_siltech", target:"part_ddc",    relationship:"SUPPLIES", layoutClass:"supply", criticality:"sole_source", spof:true, risk_propagation:true, alert:"critical_financial" } },
    { data:{ id:"e_silt_mos", source:"t2_siltech", target:"part_mosfet", relationship:"SUPPLIES", layoutClass:"supply", criticality:"sole_source", spof:true, risk_propagation:true, alert:"critical_financial" } },

    /* ── Supply: business Tier-2 → Tier-1 (display only — SKIPPED by trace) */
    { data:{ id:"e_silt_harman", source:"t2_siltech", target:"t1_harman",      relationship:"SUPPLIES", layoutClass:"supply", business:true, risk_propagation:true } },
    { data:{ id:"e_silt_conti",  source:"t2_siltech", target:"t1_continental", relationship:"SUPPLIES", layoutClass:"supply", business:true, risk_propagation:true } },
    { data:{ id:"e_inf_bosch",   source:"t2_infineon", target:"t1_bosch",      relationship:"SUPPLIES", layoutClass:"supply", business:true } },
    { data:{ id:"e_ren_conti",   source:"t2_renesas",  target:"t1_continental",relationship:"SUPPLIES", layoutClass:"supply", business:true } },

    /* ── Qualified alternate (NOT an active supply; correlated owner) ───── */
    { data:{ id:"e_veld_mos", source:"t2_veldhoven", target:"part_mosfet", relationship:"QUALIFIED_FOR", layoutClass:"supply",
             qualified_alternate:true, correlated_owner:true, lead_time_weeks:22 } },

    /* ── Supply: Tier-3 → Tier-2 (hidden shared Tier-3 = Q3) ────────────── */
    { data:{ id:"e_paw_silt",   source:"t3_paw",       target:"t2_siltech", relationship:"SUPPLIES", layoutClass:"supply", business:true, hidden_dependency:true } },
    { data:{ id:"e_siln_silt",  source:"t3_siltronic", target:"t2_siltech", relationship:"SUPPLIES", layoutClass:"supply", business:true } },
    { data:{ id:"e_shin_inf",   source:"t3_shinetsu",  target:"t2_infineon",relationship:"SUPPLIES", layoutClass:"supply", business:true } },
    { data:{ id:"e_shin_ren",   source:"t3_shinetsu",  target:"t2_renesas", relationship:"SUPPLIES", layoutClass:"supply", business:true } },

    /* ── Process: part → site, site → Tier-1 (geo provenance) ──────────── */
    { data:{ id:"e_hu_szx",   source:"part_headunit",        target:"site_harman_shenzhen", relationship:"MANUFACTURED_AT", layoutClass:"process" } },
    { data:{ id:"e_ips_reg",  source:"part_inverter_module", target:"site_conti_regensburg",relationship:"MANUFACTURED_AT", layoutClass:"process" } },
    { data:{ id:"e_bb_reu",   source:"part_brake_bosch",     target:"site_bosch_reutlingen",relationship:"MANUFACTURED_AT", layoutClass:"process" } },
    { data:{ id:"e_szx_harman", source:"site_harman_shenzhen", target:"t1_harman",      relationship:"OWNED_BY", layoutClass:"structure" } },
    { data:{ id:"e_reg_conti",  source:"site_conti_regensburg",target:"t1_continental", relationship:"OWNED_BY", layoutClass:"structure" } },
    { data:{ id:"e_reu_bosch",  source:"site_bosch_reutlingen",target:"t1_bosch",       relationship:"OWNED_BY", layoutClass:"structure" } },

    /* ── Ownership overlay (EXCLUDED from layout; arc above graph) ──────── */
    { data:{ id:"o_silt_pearl", source:"t2_siltech",       target:"holding_pearl",     relationship:"OWNED_BY", layoutClass:"ownership", stake:0.68, direct:true, verified:"2024-Q4", source_ref:"orbis" } },
    { data:{ id:"o_pearl_hq",   source:"holding_pearl",    target:"parent_hongqiao",   relationship:"OWNED_BY", layoutClass:"ownership", stake:0.90, direct:true, verified:"2024-Q4", source_ref:"orbis", sanctionRisk:"flagged" } },
    { data:{ id:"o_veld_hold",  source:"t2_veldhoven",     target:"holding_veldhoven", relationship:"OWNED_BY", layoutClass:"ownership", stake:1.00, direct:true, verified:"2024-Q4", source_ref:"orbis" } },
    { data:{ id:"o_hold_hq",    source:"holding_veldhoven",target:"parent_hongqiao",   relationship:"OWNED_BY", layoutClass:"ownership", stake:0.55, direct:true, verified:"2024-Q4", source_ref:"orbis", sanctionRisk:"flagged" } },
    { data:{ id:"o_advent_krw", source:"pe_advent",        target:"t1_kraftwerk",      relationship:"HOLDS_STAKE", layoutClass:"ownership", stake:0.51, board:true, acquired:"2021-03" } }
  ]
};

/* ── Tier ranking for TB dagre pinning ─────────────────────────────────── */
const TIER_RANK = {
  oem:0, program:0, plant:1, assembly:2, part:3,
  supplier_1:4, site:4, supplier_2:5, supplier_3:6
};
// helper: rankOf(node) -> use type, and for suppliers append tier
function rankOf(d){
  if (d.type === "supplier") return TIER_RANK["supplier_"+d.tier] ?? 99;
  return TIER_RANK[d.type] ?? 99; // ownership entities have no rank (overlay only)
}

/* ── Seeded alerts (mock feed — no server) ─────────────────────────────── */
const ALERTS = [
  { id:"al_silt_1", supplierId:"t2_siltech",      severity:"critical", riskType:"financial_insolvency", title:"Covenant breach + going-concern language in filing", ts:"2026-05-31T09:38", status:"active",  ackBy:null },
  { id:"al_paw_1",  supplierId:"t3_paw",          severity:"high",     riskType:"operational",          title:"Allocation cut — automotive deprioritised for data-centre demand", ts:"2026-05-30T16:12", status:"active", ackBy:null },
  { id:"al_hq_1",   supplierId:"parent_hongqiao", severity:"high",     riskType:"compliance",           title:"Ultimate parent added to export-control entity list", ts:"2026-05-29T11:00", status:"active", ackBy:null },
  { id:"al_krw_1",  supplierId:"t1_kraftwerk",    severity:"medium",   riskType:"financial_insolvency", title:"€380M refinancing due 2027 — covenant headroom <15%", ts:"2026-05-20T08:00", status:"active", ackBy:null },
  { id:"al_conti_1",supplierId:"t1_continental",  severity:"info",     riskType:"compliance",           title:"ESG audit scheduled", ts:"2026-05-18T10:00", status:"active", ackBy:null }
];

/* ── Alert history per supplier (mini-timeline; trend = escalating/stabilising) */
const ALERT_HISTORY = {
  t2_siltech: { trend:"escalating", events:[
    { severity:"critical", title:"Insolvency filing detected",       date:"2026-05-31", status:"active",   ackBy:"M. Schmidt", ackAt:"2026-05-31T10:42" },
    { severity:"high",     title:"Q1 2026 financial stress flag",    date:"2026-03-12", status:"resolved", closed:"2026-03-18" },
    { severity:"info",     title:"New ownership filing (Hongqiao)",   date:"2026-01-02", status:"resolved", closed:"auto" }
  ]},
  t3_paw: { trend:"escalating", events:[
    { severity:"high", title:"Allocation cut — automotive deprioritised", date:"2026-05-30", status:"active" },
    { severity:"info", title:"Quality hold lifted on Line 2",            date:"2026-04-08", status:"resolved" }
  ]},
  t1_kraftwerk: { trend:"escalating", events:[
    { severity:"medium", title:"Refinancing window flagged (2027)", date:"2026-05-20", status:"active" }
  ]}
};

/* ── System (read-only) saved views ────────────────────────────────────── */
const SYSTEM_VIEWS = [
  { id:"view_golf_critical", name:"Critical Path – Golf MQB",      filters:{ program:["prog_golf"], risk_level:["critical","high"] }, layers:{ risk:true },               focus:"prog_golf" },
  { id:"view_apac_geo",      name:"APAC Geopolitical Exposure",     filters:{ risk_type:["geopolitical"], country:["Malaysia","Taiwan","China"] }, layers:{ risk:true },     focus:"t2_siltech" },
  { id:"view_spof_semi",     name:"SPOF – Semiconductors",          filters:{ commodity:["semiconductor"], spof_only:true }, layers:{},                                       focus:null },
  { id:"view_lksg",          name:"LkSG Due Diligence",             filters:{ lksg:true }, layers:{ ownership:true },                                                         focus:"parent_hongqiao" },
  { id:"view_owner_conc",    name:"Ownership Concentration",        filters:{}, layers:{ ownership:true },                                                                    focus:"parent_hongqiao" }
];

/* =============================================================================
 * SCENARIO ANSWER KEYS — expected mock-API outputs. Use these as the
 * acceptance oracle: the implemented functions in graph-explorer-mock-api.js
 * MUST reproduce these. Numbers are the single reconciled set (no more €28M-vs-€42M).
 * ===========================================================================*/
const SCENARIOS = {

  // ── A · "One Chip, Two Platforms" — blast radius (Q1, Q10) ─────────────
  A_blast_radius: {
    trigger: "traceImpact('t2_siltech')",
    expect: {
      affectedPlants: ["plant_wolfsburg","plant_zwickau","plant_emden"], // 3
      plantsAtRisk: 3,
      spofParts: ["part_ddc","part_mosfet"], spofCount: 2,
      partsAffected: 2,
      programs: ["prog_golf","prog_tiguan","prog_id4","prog_id7"],        // 4 (EV + combustion)
      revenueAtRisk: 58000000,                                            // 34M (IC) + 24M (MOSFET)
      firstLineDown: { program:"prog_id4", plant:"plant_zwickau", days:9 },// MOSFET runway shortest
      earliestSOPatRisk: "2026-Q3",
      alternativeStatus: "none_independent",  // Veldhoven qualified for MOSFET but shares owner
      qualificationLeadWeeks: 22,
      lksgDisclosureRequired: true
    }
  },

  // ── B · "The Redundancy That Wasn't" — hidden concentration (Q3,Q2,Q5) ─
  B_hidden_concentration: {
    trigger: "getSharedDependencies(['prog_golf','prog_id4'])",
    expect: {
      sharedDeepSuppliers: ["t2_siltech","t3_paw"],
      headline_supplier: "t3_paw",      // dual-sourced brake controller converges on one fab
      via: { prog_golf:["t1_harman→t2_siltech→t3_paw","t1_continental→part_paw_die→t3_paw"],
             prog_id4: ["t1_bosch→part_paw_die→t3_paw","t2_siltech→t3_paw"] },
      note: "Brake Safety Controller is dual-sourced Continental+Bosch but both dies are fabbed by Pan-Asia Wafer."
    }
  },

  // ── C · "The Safe European Supplier" — ownership/control (Q4,Q3) ───────
  C_ownership_risk: {
    trigger: "getOwnershipChain('t2_veldhoven') + getOwnerConcentration()",
    expect: {
      chain: ["t2_veldhoven","holding_veldhoven","parent_hongqiao"],
      ultimateParent: "parent_hongqiao",
      ultimateParentFlags: { sanctionScreeningStatus:"sanctioned", complianceFlag:"entity_listed", country:"China" },
      ownerConcentration: { parent_hongqiao: ["t2_siltech","t2_veldhoven"] }, // 2 "independent" suppliers, 1 owner
      reveal: "European address, sanctioned Chinese control; same owner as the Asian source SilTech."
    }
  },

  // ── Healthy control path — proves the tool isn't painting everything red ─
  healthy_control: {
    part: "part_dcdc",
    expect: { criticality:"dual_source", shared_fab:false, shared_owner:false, risk_level:"low",
              paths:["t1_bosch→t2_infineon","t1_continental→t2_renesas"], colour:"green" }
  },

  // ── Q2 concentration leaderboard (top entries) ────────────────────────
  Q2_concentration_leaderboard: {
    trigger: "getConcentration()",
    expect_top: [
      { supplierId:"t2_siltech", programsLostIfRemoved:["prog_golf","prog_tiguan","prog_id4","prog_id7"], note:"sole route to 4 programs via 2 SPOF chips" },
      { supplierId:"t3_paw",     programsLostIfRemoved:["prog_golf","prog_id4"], note:"shared fab under both brake controllers + feeds SilTech" }
    ]
  }
};

/* Expose globals for the inlined build (and for quick console validation). */
if (typeof window !== "undefined") {
  window.GRAPH = GRAPH; window.ALERTS = ALERTS; window.ALERT_HISTORY = ALERT_HISTORY;
  window.SYSTEM_VIEWS = SYSTEM_VIEWS; window.SCENARIOS = SCENARIOS;
  window.TIER_RANK = TIER_RANK; window.rankOf = rankOf;
  window.ACTIVE_GRAPH = GRAPH;
  window.ACTIVE_USE_CASE = "semiconductor";
}

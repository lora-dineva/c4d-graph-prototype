/* =============================================================================
 * Knowledge Graph Case 2 — Vehicle Chassis (MEB)
 * Ported from Suport/Knowledge_Graph_Case_2.html into Graph Explorer schema.
 * ===========================================================================*/

const KG_CASE2_POSITIONS = {
  kg2_meb_platform: { x: 720, y: 46 },
  kg2_vehicle_chassis: { x: 720, y: 162 },
  kg2_plant_wolfsburg: { x: 1000, y: 162 },
  kg2_rear_chassis_module: { x: 720, y: 332 },
  kg2_brodier_module: { x: 1000, y: 312 },
  kg2_site_dusseldorf: { x: 1000, y: 352 },
  kg2_steel_tubes: { x: 720, y: 506 },
  kg2_brodier_tubes: { x: 1000, y: 486 },
  kg2_site_lingen: { x: 1000, y: 526 },
  kg2_suspension_spring: { x: 260, y: 680 },
  kg2_thyssenkrupp: { x: 510, y: 660 },
  kg2_hagen_plant: { x: 510, y: 700 },
  kg2_steel: { x: 720, y: 710 },
  kg2_unknown_supplier: { x: 1000, y: 690 },
  kg2_site_unknown: { x: 1000, y: 730 }
};

const GRAPH_KG_CASE2 = {
  nodes: [
    { data: {
      id: "kg2_meb_platform", type: "program", name: "MEB", label: "MEB",
      platform: "MEB", tier_label: "OEM - Platform",
      description: "Vehicle platform shown at the top of the chassis supply chain.",
      roleInSupplyChain: "Final platform receiving the integrated vehicle chassis.",
      notes: "Displayed as the OEM platform in the source graph.",
      position: KG_CASE2_POSITIONS.kg2_meb_platform
    }},
    { data: {
      id: "kg2_vehicle_chassis", type: "assembly", name: "Vehicle Chassis", label: "Vehicle Chassis",
      tier_label: "OEM - System",
      description: "Main OEM system block for the vehicle chassis.",
      roleInSupplyChain: "OEM-level system integrated into the vehicle platform.",
      notes: "Wolfsburg Plant (DE) is shown as producing this system.",
      position: KG_CASE2_POSITIONS.kg2_vehicle_chassis
    }},
    { data: {
      id: "kg2_plant_wolfsburg", type: "plant", name: "Wolfsburg Plant (DE)", label: "Wolfsburg Plant",
      country: "Germany", city: "Wolfsburg", tier_label: "OEM - System",
      description: "Manufacturing plant shown as producing the vehicle chassis.",
      roleInSupplyChain: "Production site for the vehicle chassis.",
      notes: "Company ownership is not specified in the diagram.",
      position: KG_CASE2_POSITIONS.kg2_plant_wolfsburg
    }},
    { data: {
      id: "kg2_rear_chassis_module", type: "part", name: "Rear Chassis Module", label: "Rear Chassis Module",
      commodity_group: "chassis", tier_label: "Tier 1",
      description: "Tier 1 rear chassis module belonging to the vehicle chassis.",
      roleInSupplyChain: "Major chassis module supplied into the vehicle chassis.",
      notes: "Supplied by Benteler and produced at Düsseldorf Plant (DE) according to the diagram.",
      position: KG_CASE2_POSITIONS.kg2_rear_chassis_module
    }},
    { data: {
      id: "kg2_brodier_module", type: "supplier", tier: 1, name: "Benteler", label: "Benteler",
      country: "Germany", risk_level: "low", risk_type: "none", tier_label: "Tier 1",
      description: "Tier 1 supplier shown as supplying the rear chassis module.",
      roleInSupplyChain: "Supplier of the rear chassis module.",
      notes: "Displayed next to the rear chassis module node.",
      position: KG_CASE2_POSITIONS.kg2_brodier_module
    }},
    { data: {
      id: "kg2_site_dusseldorf", type: "site", name: "Dusseldorf Plant (DE)", label: "Dusseldorf Plant",
      country: "Germany", tier_label: "Tier 1",
      description: "Manufacturing plant shown as producing the rear chassis module.",
      roleInSupplyChain: "Production site for the rear chassis module.",
      notes: "Displayed next to the rear chassis module node.",
      position: KG_CASE2_POSITIONS.kg2_site_dusseldorf
    }},
    { data: {
      id: "kg2_steel_tubes", type: "part", name: "Steel Tubes", label: "Steel Tubes",
      commodity_group: "chassis", tier_label: "Tier 1",
      description: "Tier 1 steel tube component belonging to the rear chassis module.",
      roleInSupplyChain: "Structural component used in the rear chassis module.",
      notes: "Supplied by Benteler and produced at Lingen Plant (DE) according to the diagram.",
      position: KG_CASE2_POSITIONS.kg2_steel_tubes
    }},
    { data: {
      id: "kg2_brodier_tubes", type: "supplier", tier: 1, name: "Benteler", label: "Benteler",
      country: "Germany", risk_level: "low", risk_type: "none", tier_label: "Tier 1",
      description: "Supplier shown as supplying steel tubes.",
      roleInSupplyChain: "Supplier of steel tubes used in the rear chassis module.",
      notes: "Displayed next to the steel tubes node.",
      position: KG_CASE2_POSITIONS.kg2_brodier_tubes
    }},
    { data: {
      id: "kg2_site_lingen", type: "site", name: "Lingen Plant (DE)", label: "Lingen Plant",
      country: "Germany", tier_label: "Tier 1",
      description: "Manufacturing plant shown as producing steel tubes.",
      roleInSupplyChain: "Production site for steel tubes.",
      notes: "Displayed next to the steel tubes node.",
      position: KG_CASE2_POSITIONS.kg2_site_lingen
    }},
    { data: {
      id: "kg2_suspension_spring", type: "part", name: "Suspension Spring", label: "Suspension Spring",
      commodity_group: "chassis", tier_label: "Tier 2",
      description: "Tier 2 suspension spring belonging to the rear chassis module.",
      roleInSupplyChain: "Suspension component used in the rear chassis module.",
      notes: "Supplied by ThyssenKrupp and produced at Hagen Plant (DE) according to the diagram.",
      position: KG_CASE2_POSITIONS.kg2_suspension_spring
    }},
    { data: {
      id: "kg2_thyssenkrupp", type: "supplier", tier: 2, name: "ThyssenKrupp", label: "ThyssenKrupp",
      country: "Germany", risk_level: "medium", risk_type: "operational", tier_label: "Tier 2",
      description: "Supplier shown as supplying the suspension spring.",
      roleInSupplyChain: "Supplier of suspension springs used in the rear chassis module.",
      notes: "The warning marker highlights the Hagen suspension-spring plant closure risk and its impact path into the chassis supply chain.",
      position: KG_CASE2_POSITIONS.kg2_thyssenkrupp
    }},
    { data: {
      id: "kg2_hagen_plant", type: "site", name: "Hagen Plant (DE)", label: "Hagen Plant",
      country: "Germany", tier_label: "Tier 2",
      risk_level: "high", risk_type: "operational", alert_status: "active",
      warningId: "plant_closure_risk_warning",
      description: "Manufacturing plant shown as producing the suspension spring.",
      roleInSupplyChain: "Production site for suspension springs.",
      notes: "thyssenkrupp is gradually phasing out production at this site.",
      position: KG_CASE2_POSITIONS.kg2_hagen_plant
    }},
    { data: {
      id: "kg2_steel", type: "part", name: "Steel", label: "Steel",
      commodity_group: "raw_material", tier_label: "Tier 2",
      risk_level: "medium", risk_type: "economic", alert_status: "active",
      warningId: "steel_industry_pressure_warning",
      description: "Raw material shown as feeding steel tubes and suspension springs.",
      roleInSupplyChain: "Base material for steel tubes and suspension springs.",
      notes: "The source image labels the relation to components as belongs_to.",
      position: KG_CASE2_POSITIONS.kg2_steel
    }},
    { data: {
      id: "kg2_unknown_supplier", type: "supplier", tier: 2, name: "Unknown Supplier", label: "Unknown Supplier",
      country: "Unknown", risk_level: "low", risk_type: "none", tier_label: "Tier 2",
      description: "Unidentified supplier shown as supplying steel.",
      roleInSupplyChain: "Upstream supplier of steel material.",
      notes: "Supplier name is unknown in the source diagram.",
      position: KG_CASE2_POSITIONS.kg2_unknown_supplier
    }},
    { data: {
      id: "kg2_site_unknown", type: "site", name: "Unknown Plant (DE)", label: "Unknown Plant",
      country: "Germany", tier_label: "Tier 2",
      description: "Unidentified plant shown as producing steel.",
      roleInSupplyChain: "Production site for steel material.",
      notes: "Plant name is unknown in the source diagram.",
      position: KG_CASE2_POSITIONS.kg2_site_unknown
    }}
  ],

  edges: [
    { data: { id: "kg2_e_chassis_meb", source: "kg2_vehicle_chassis", target: "kg2_meb_platform", relationship: "USED_IN", layoutClass: "material" }},
    { data: { id: "kg2_e_wob_chassis", source: "kg2_plant_wolfsburg", target: "kg2_vehicle_chassis", relationship: "MANUFACTURED_AT", layoutClass: "process" }},
    { data: { id: "kg2_e_rear_chassis", source: "kg2_rear_chassis_module", target: "kg2_vehicle_chassis", relationship: "PART_OF_ASSEMBLY", layoutClass: "material" }},
    { data: { id: "kg2_e_bent_rear", source: "kg2_brodier_module", target: "kg2_rear_chassis_module", relationship: "SUPPLIES", layoutClass: "supply" }},
    { data: { id: "kg2_e_duss_rear", source: "kg2_site_dusseldorf", target: "kg2_rear_chassis_module", relationship: "MANUFACTURED_AT", layoutClass: "process" }},
    { data: { id: "kg2_e_tubes_rear", source: "kg2_steel_tubes", target: "kg2_rear_chassis_module", relationship: "PART_OF_ASSEMBLY", layoutClass: "material" }},
    { data: { id: "kg2_e_bent_tubes", source: "kg2_brodier_tubes", target: "kg2_steel_tubes", relationship: "SUPPLIES", layoutClass: "supply" }},
    { data: { id: "kg2_e_ling_tubes", source: "kg2_site_lingen", target: "kg2_steel_tubes", relationship: "MANUFACTURED_AT", layoutClass: "process" }},
    { data: { id: "kg2_e_spring_rear", source: "kg2_suspension_spring", target: "kg2_rear_chassis_module", relationship: "PART_OF_ASSEMBLY", layoutClass: "material" }},
    { data: { id: "kg2_e_tk_spring", source: "kg2_thyssenkrupp", target: "kg2_suspension_spring", relationship: "SUPPLIES", layoutClass: "supply" }},
    { data: { id: "kg2_e_hagen_spring", source: "kg2_hagen_plant", target: "kg2_suspension_spring", relationship: "MANUFACTURED_AT", layoutClass: "process" }},
    { data: { id: "kg2_e_steel_tubes", source: "kg2_steel", target: "kg2_steel_tubes", relationship: "MATERIAL_DEPENDENCY", layoutClass: "material", risk_propagation: true }},
    { data: { id: "kg2_e_us_steel", source: "kg2_unknown_supplier", target: "kg2_steel", relationship: "SUPPLIES", layoutClass: "supply" }},
    { data: { id: "kg2_e_up_steel", source: "kg2_site_unknown", target: "kg2_steel", relationship: "MANUFACTURED_AT", layoutClass: "process" }}
  ]
};

const KG_CASE2_WARNINGS = [
  {
    id: "plant_closure_risk_warning",
    nodeId: "kg2_hagen_plant",
    title: "Suspension Spring Plant Closure Risk",
    summary: "thyssenkrupp Automotive Technology decided to gradually scale back production at the Hagen Springs and Stabilizers site and close the local Competence Center, with about 300 jobs to be cut over two years. The company cites weak European automotive demand, low site utilization, high energy and labor costs in Germany, and rising competition from China. In this supply-chain scenario, the closure is a VW disruption risk because suspension springs are bulky and heavy components that are not normally buffered in large stock.",
    affectedNodeIds: [
      "kg2_hagen_plant",
      "kg2_suspension_spring",
      "kg2_rear_chassis_module",
      "kg2_vehicle_chassis",
      "kg2_meb_platform"
    ],
    sources: [
      {
        region: "Sample",
        sourceType: "Official company press release",
        label: "thyssenkrupp Automotive Technology: phase-out of Hagen Springs and Stabilizers site",
        url: "https://www.thyssenkrupp-automotive-technology.com/en/press-detail/springs-and-stabilizers%3A-management-decides-to-gradually-phase-out-production-site-in-hagen-297551"
      },
      {
        region: "Germany",
        sourceType: "Video report",
        label: "YouTube report on thyssenkrupp Hagen plant closure",
        url: "https://www.youtube.com/watch?v=t8m2qqb0AME"
      }
    ]
  },
  {
    id: "steel_industry_pressure_warning",
    nodeId: "kg2_steel",
    title: "Steel Industry Economic Pressure Risk",
    summary: "The steel node is marked with an industry and economic pressure risk. Recent German automotive-market forecasts still point to a weak recovery versus pre-crisis levels, reducing demand pressure from automotive customers, while steel production remains exposed to electricity and energy-cost pressure. For the VW chassis chain, this creates upstream risk for steel inputs that feed steel tubes and then the rear chassis module.",
    affectedNodeIds: [
      "kg2_steel",
      "kg2_steel_tubes",
      "kg2_rear_chassis_module",
      "kg2_vehicle_chassis",
      "kg2_meb_platform"
    ],
    sources: [
      {
        region: "Germany",
        sourceType: "Automotive industry association",
        label: "VDA: Production and market in Germany, January 2026",
        url: "https://www.vda.de/en/press/press-releases/2026/260204_Car-production-in-Germany-in-January_2026"
      },
      {
        region: "Germany",
        sourceType: "Automotive industry association",
        label: "VDA: Forecasts for 2026",
        url: "https://www.vda.de/en/press/press-releases/2025/251208_PM_Forecasts_2026"
      },
      {
        region: "Germany",
        sourceType: "Steel industry association",
        label: "WV Stahl: Steel industry perspective on the Automotive Package",
        url: "https://www.wvstahl.de/publikationen/position-the-perspective-of-the-steel-industry-in-germany-on-the-automotive-package/"
      },
      {
        region: "Germany",
        sourceType: "Steel industry association",
        label: "WV Stahl: Energy prices must be lowered to strengthen resilience",
        url: "https://www.wvstahl.de/statements/resilienz-staerken-heisst-energiepreise-senken/"
      }
    ]
  }
];

const KG_CASE2_ALERTS = [
  {
    id: "kg2_al_hagen_1",
    supplierId: "kg2_hagen_plant",
    severity: "high",
    riskType: "operational",
    title: "Hagen suspension spring plant phase-out may disrupt rear chassis supply",
    ts: "2026-05-20T09:15",
    status: "active",
    ackBy: null
  },
  {
    id: "kg2_al_steel_1",
    supplierId: "kg2_steel",
    severity: "medium",
    riskType: "economic",
    title: "Steel industry economic pressure may affect chassis tube inputs",
    ts: "2026-05-22T11:40",
    status: "active",
    ackBy: null
  }
];

const KG_CASE2_SCENARIO = {
  E_plant_closure: {
    trigger: "traceWarning('plant_closure_risk_warning')",
    expect: {
      affectedPrograms: ["MEB"],
      affectedPlants: ["Wolfsburg Plant (DE)"],
      partsAffected: 4,
      programs: ["MEB"],
      programIds: ["kg2_meb_platform"],
      plantIds: ["kg2_plant_wolfsburg"],
      affectedChain: "Hagen Plant → Suspension Spring → Rear Chassis Module → Vehicle Chassis → MEB"
    }
  },
  F_steel_pressure: {
    trigger: "traceWarning('steel_industry_pressure_warning')",
    expect: {
      affectedPrograms: ["MEB"],
      affectedPlants: ["Wolfsburg Plant (DE)"],
      partsAffected: 4,
      programs: ["MEB"],
      programIds: ["kg2_meb_platform"],
      plantIds: ["kg2_plant_wolfsburg"],
      affectedChain: "Steel → Steel Tubes → Rear Chassis Module → Vehicle Chassis → MEB"
    }
  }
};

if (typeof USE_CASES !== "undefined") {
  USE_CASES.chassis_supply = {
    id: "chassis_supply",
    label: "Vehicle chassis",
    graph: GRAPH_KG_CASE2,
    alerts: KG_CASE2_ALERTS,
    alertHistory: {},
    systemViews: [],
    warnings: KG_CASE2_WARNINGS,
    scenarios: ["e", "f"],
    defaultLayout: "preset",
    features: { ownership: false, concentration: false },
    sampleDataNote: "Sample data created for demonstration purposes"
  };
}

if (typeof window !== "undefined") {
  window.GRAPH_KG_CASE2 = GRAPH_KG_CASE2;
  window.KG_CASE2_WARNINGS = KG_CASE2_WARNINGS;
  window.KG_CASE2_ALERTS = KG_CASE2_ALERTS;
  window.KG_CASE2_SCENARIO = KG_CASE2_SCENARIO;
  window.KG_CASE2_POSITIONS = KG_CASE2_POSITIONS;
}

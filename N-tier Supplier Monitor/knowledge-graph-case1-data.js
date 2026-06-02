/* =============================================================================
 * Knowledge Graph Case 1 — Thermal Management System (MEB)
 * Ported from Suport/Knowledge_Graph_Case_1.html into Graph Explorer schema.
 * ===========================================================================*/

const KG_CASE1_POSITIONS = {
  kg_meb_platform: { x: 530, y: 46 },
  kg_thermal_management_system: { x: 530, y: 146 },
  kg_plant_wolfsburg: { x: 790, y: 132 },
  kg_hvac_compressor: { x: 530, y: 280 },
  kg_hannon: { x: 790, y: 260 },
  kg_site_palmela: { x: 790, y: 300 },
  kg_electric_motor: { x: 530, y: 430 },
  kg_nidec: { x: 790, y: 410 },
  kg_site_kyoto: { x: 790, y: 450 },
  kg_winding_wires: { x: 230, y: 590 },
  kg_sumitomo_electric: { x: 480, y: 568 },
  kg_site_aachen: { x: 480, y: 610 },
  kg_magnet_set: { x: 660, y: 590 },
  kg_magnet_gmbh: { x: 925, y: 568 },
  kg_site_hanau: { x: 925, y: 610 },
  kg_copper: { x: 230, y: 750 },
  kg_sumitomo_corp: { x: 480, y: 730 },
  kg_site_japan_refinery: { x: 480, y: 770 },
  kg_magnet_material: { x: 660, y: 750 },
  kg_unknown_supplier_a: { x: 925, y: 750 }
};

const GRAPH_KG_CASE1 = {
  nodes: [
    { data: {
      id: "kg_meb_platform", type: "program", name: "MEB", label: "MEB",
      platform: "MEB", tier_label: "OEM - Platform",
      description: "Vehicle platform shown at the top of the diagram. The thermal management system is part of this platform.",
      roleInSupplyChain: "Final platform receiving the integrated thermal management system.",
      notes: "Displayed as the OEM platform in the source graph.",
      position: KG_CASE1_POSITIONS.kg_meb_platform
    }},
    { data: {
      id: "kg_thermal_management_system", type: "assembly", name: "Thermal Management System", label: "Thermal Mgmt System",
      tier_label: "OEM - System",
      description: "Main system block responsible for vehicle thermal management, integrating HVAC compressor and related component chains.",
      roleInSupplyChain: "OEM-level system integrated into the vehicle platform.",
      notes: "Wolfsburg Plant is shown as producing this system.",
      position: KG_CASE1_POSITIONS.kg_thermal_management_system
    }},
    { data: {
      id: "kg_plant_wolfsburg", type: "plant", name: "Wolfsburg Plant", label: "Wolfsburg Plant",
      country: "Germany", city: "Wolfsburg", tier_label: "OEM - System",
      description: "Manufacturing plant shown as producing the thermal management system.",
      roleInSupplyChain: "Production site for the top-level thermal management system.",
      notes: "Company ownership is not specified in the diagram.",
      position: KG_CASE1_POSITIONS.kg_plant_wolfsburg
    }},
    { data: {
      id: "kg_hvac_compressor", type: "part", name: "HVAC Compressor (HVAC-CMP-4711)", label: "HVAC Compressor",
      part_number: "HVAC-CMP-4711", commodity_group: "thermal", tier_label: "Tier 1",
      description: "Tier 1 HVAC compressor component that belongs to the thermal management system.",
      roleInSupplyChain: "Key supplied component for refrigerant compression in the vehicle thermal management system.",
      notes: "Supplier Hannon and Palmela Plant (Portugal) are shown next to this component.",
      position: KG_CASE1_POSITIONS.kg_hvac_compressor
    }},
    { data: {
      id: "kg_hannon", type: "supplier", tier: 1, name: "Hannon", label: "Hannon",
      country: "Portugal", risk_level: "low", risk_type: "none", tier_label: "Tier 1",
      description: "Tier 1 supplier shown as supplying the HVAC compressor.",
      roleInSupplyChain: "Supplier of the HVAC compressor to the thermal management system chain.",
      notes: "Name appears as 'Hannon' in the source image.",
      position: KG_CASE1_POSITIONS.kg_hannon
    }},
    { data: {
      id: "kg_site_palmela", type: "site", name: "Palmela Plant (Portugal)", label: "Palmela Plant",
      country: "Portugal", tier_label: "Tier 1",
      description: "Manufacturing plant shown as producing the CO2 compressor.",
      roleInSupplyChain: "Production site for the CO2 compressor.",
      notes: "The diagram does not explicitly connect Palmela Plant (Portugal) to Hannon.",
      position: KG_CASE1_POSITIONS.kg_site_palmela
    }},
    { data: {
      id: "kg_electric_motor", type: "part", name: "Electric Motor", label: "Electric Motor",
      commodity_group: "drivetrain", tier_label: "Tier 2",
      description: "Tier 2 electric motor that belongs to the HVAC compressor assembly.",
      roleInSupplyChain: "Subcomponent used by the HVAC compressor.",
      notes: "Supplied by NIDEC and produced at Kyoto Plant according to the diagram.",
      position: KG_CASE1_POSITIONS.kg_electric_motor
    }},
    { data: {
      id: "kg_nidec", type: "supplier", tier: 2, name: "NIDEC", label: "NIDEC",
      country: "Japan", risk_level: "low", risk_type: "none", tier_label: "Tier 2",
      description: "Tier 2 supplier shown as supplying the electric motor.",
      roleInSupplyChain: "Supplier of the electric motor used in the compressor.",
      notes: "Displayed in the Tier 2 supplier lane.",
      position: KG_CASE1_POSITIONS.kg_nidec
    }},
    { data: {
      id: "kg_site_kyoto", type: "site", name: "Kyoto Plant", label: "Kyoto Plant",
      country: "Japan", tier_label: "Tier 2",
      description: "Manufacturing plant shown as producing the electric motor.",
      roleInSupplyChain: "Production site for the electric motor.",
      notes: "The diagram does not explicitly connect Kyoto Plant to NIDEC.",
      position: KG_CASE1_POSITIONS.kg_site_kyoto
    }},
    { data: {
      id: "kg_winding_wires", type: "part", name: "Winding Wires", label: "Winding Wires",
      commodity_group: "electrical", tier_label: "Tier 3",
      description: "Tier 3 component used in the electric motor.",
      roleInSupplyChain: "Subcomponent of the electric motor, likely forming motor windings.",
      notes: "Contains copper and is supplied by Sumitomo Electric.",
      position: KG_CASE1_POSITIONS.kg_winding_wires
    }},
    { data: {
      id: "kg_sumitomo_electric", type: "supplier", tier: 3, name: "Sumitomo Electric", label: "Sumitomo Electric",
      country: "Germany", risk_level: "low", risk_type: "none", tier_label: "Tier 3",
      description: "Tier 3 supplier shown as supplying winding wires.",
      roleInSupplyChain: "Supplier of winding wires used in the electric motor.",
      notes: "Displayed on the right side of the winding wire node.",
      position: KG_CASE1_POSITIONS.kg_sumitomo_electric
    }},
    { data: {
      id: "kg_site_aachen", type: "site", name: "Aachen Plant", label: "Aachen Plant",
      country: "Germany", tier_label: "Tier 3",
      description: "Manufacturing plant shown as producing winding wires.",
      roleInSupplyChain: "Production site for winding wires.",
      notes: "The diagram does not explicitly connect Aachen Plant to Sumitomo Electric.",
      position: KG_CASE1_POSITIONS.kg_site_aachen
    }},
    { data: {
      id: "kg_magnet_set", type: "part", name: "Magnet Set", label: "Magnet Set",
      commodity_group: "magnetics", tier_label: "Tier 3",
      description: "Tier 3 magnet set used in the electric motor.",
      roleInSupplyChain: "Subcomponent of the electric motor, likely part of rotor or stator magnetic assembly.",
      notes: "Contains magnet material and is supplied by Magnet GmbH.",
      position: KG_CASE1_POSITIONS.kg_magnet_set
    }},
    { data: {
      id: "kg_magnet_gmbh", type: "supplier", tier: 3, name: "Magnet GmbH", label: "Magnet GmbH",
      country: "Germany", risk_level: "low", risk_type: "none", tier_label: "Tier 3",
      description: "Tier 3 supplier shown as supplying the magnet set.",
      roleInSupplyChain: "Supplier of the magnet set used in the electric motor.",
      notes: "Displayed on the right side of the magnet set node.",
      position: KG_CASE1_POSITIONS.kg_magnet_gmbh
    }},
    { data: {
      id: "kg_site_hanau", type: "site", name: "Hanau Plant", label: "Hanau Plant",
      country: "Germany", tier_label: "Tier 3",
      description: "Manufacturing plant shown as producing the magnet set.",
      roleInSupplyChain: "Production site for the magnet set.",
      notes: "The diagram does not explicitly connect Hanau Plant to Magnet GmbH.",
      position: KG_CASE1_POSITIONS.kg_site_hanau
    }},
    { data: {
      id: "kg_copper", type: "part", name: "Copper", label: "Copper",
      commodity_group: "raw_material", tier_label: "Tier n",
      description: "Raw material shown as contained in winding wires.",
      roleInSupplyChain: "Base material for winding wires.",
      notes: "The source image labels the relation to winding wires as 'contains'.",
      position: KG_CASE1_POSITIONS.kg_copper
    }},
    { data: {
      id: "kg_sumitomo_corp", type: "supplier", tier: 3, name: "Sumitomo Corp.", label: "Sumitomo Corp.",
      country: "Japan", risk_level: "low", risk_type: "none", tier_label: "Tier n",
      description: "Supplier shown as supplying copper.",
      roleInSupplyChain: "Upstream supplier of copper material.",
      notes: "Displayed next to the copper node.",
      position: KG_CASE1_POSITIONS.kg_sumitomo_corp
    }},
    { data: {
      id: "kg_site_japan_refinery", type: "site", name: "Japan Refinery", label: "Japan Refinery",
      country: "Japan", tier_label: "Tier n",
      description: "Refinery shown as producing copper.",
      roleInSupplyChain: "Production site for copper material.",
      notes: "Displayed next to the copper node.",
      position: KG_CASE1_POSITIONS.kg_site_japan_refinery
    }},
    { data: {
      id: "kg_magnet_material", type: "part", name: "Magnet Material", label: "Magnet Material",
      commodity_group: "raw_material", tier_label: "Tier n",
      risk_level: "high", risk_type: "geopolitical", alert_status: "active",
      warningId: "magnet_material_export_control_warning",
      description: "Raw or base material shown as contained in the magnet set.",
      roleInSupplyChain: "Base material for the magnet set.",
      notes: "Specific chemistry is not identified in the diagram.",
      position: KG_CASE1_POSITIONS.kg_magnet_material
    }},
    { data: {
      id: "kg_unknown_supplier_a", type: "supplier", tier: 3, name: "Unknown Supplier A", label: "Unknown Supplier A",
      country: "Unknown", risk_level: "medium", risk_type: "concentration", tier_label: "Tier n",
      description: "Unidentified supplier shown as supplying magnet material.",
      roleInSupplyChain: "Upstream supplier of magnet material.",
      notes: "Supplier name is unknown in the source diagram.",
      position: KG_CASE1_POSITIONS.kg_unknown_supplier_a
    }}
  ],

  edges: [
    { data: { id: "kg_e_tms_meb", source: "kg_thermal_management_system", target: "kg_meb_platform", relationship: "USED_IN", layoutClass: "material" }},
    { data: { id: "kg_e_wob_tms", source: "kg_plant_wolfsburg", target: "kg_thermal_management_system", relationship: "MANUFACTURED_AT", layoutClass: "process" }},
    { data: { id: "kg_e_hvac_tms", source: "kg_hvac_compressor", target: "kg_thermal_management_system", relationship: "PART_OF_ASSEMBLY", layoutClass: "material" }},
    { data: { id: "kg_e_hannon_hvac", source: "kg_hannon", target: "kg_hvac_compressor", relationship: "SUPPLIES", layoutClass: "supply" }},
    { data: { id: "kg_e_palm_hvac", source: "kg_site_palmela", target: "kg_hvac_compressor", relationship: "MANUFACTURED_AT", layoutClass: "process" }},
    { data: { id: "kg_e_motor_hvac", source: "kg_electric_motor", target: "kg_hvac_compressor", relationship: "PART_OF_ASSEMBLY", layoutClass: "material" }},
    { data: { id: "kg_e_nidec_motor", source: "kg_nidec", target: "kg_electric_motor", relationship: "SUPPLIES", layoutClass: "supply" }},
    { data: { id: "kg_e_kyoto_motor", source: "kg_site_kyoto", target: "kg_electric_motor", relationship: "MANUFACTURED_AT", layoutClass: "process" }},
    { data: { id: "kg_e_wire_motor", source: "kg_winding_wires", target: "kg_electric_motor", relationship: "PART_OF_ASSEMBLY", layoutClass: "material" }},
    { data: { id: "kg_e_magnet_motor", source: "kg_magnet_set", target: "kg_electric_motor", relationship: "PART_OF_ASSEMBLY", layoutClass: "material" }},
    { data: { id: "kg_e_sumi_wire", source: "kg_sumitomo_electric", target: "kg_winding_wires", relationship: "SUPPLIES", layoutClass: "supply" }},
    { data: { id: "kg_e_aach_wire", source: "kg_site_aachen", target: "kg_winding_wires", relationship: "MANUFACTURED_AT", layoutClass: "process" }},
    { data: { id: "kg_e_mgmbh_magnet", source: "kg_magnet_gmbh", target: "kg_magnet_set", relationship: "SUPPLIES", layoutClass: "supply" }},
    { data: { id: "kg_e_hanau_magnet", source: "kg_site_hanau", target: "kg_magnet_set", relationship: "MANUFACTURED_AT", layoutClass: "process" }},
    { data: { id: "kg_e_copper_wire", source: "kg_copper", target: "kg_winding_wires", relationship: "MATERIAL_DEPENDENCY", layoutClass: "material" }},
    { data: { id: "kg_e_scorp_copper", source: "kg_sumitomo_corp", target: "kg_copper", relationship: "SUPPLIES", layoutClass: "supply" }},
    { data: { id: "kg_e_ref_copper", source: "kg_site_japan_refinery", target: "kg_copper", relationship: "MANUFACTURED_AT", layoutClass: "process" }},
    { data: { id: "kg_e_mat_magnet", source: "kg_magnet_material", target: "kg_magnet_set", relationship: "MATERIAL_DEPENDENCY", layoutClass: "material", risk_propagation: true }},
    { data: { id: "kg_e_usa_mat", source: "kg_unknown_supplier_a", target: "kg_magnet_material", relationship: "SUPPLIES", layoutClass: "supply" }}
  ]
};

const KG_CASE1_WARNINGS = [
  {
    id: "magnet_material_export_control_warning",
    nodeId: "kg_magnet_material",
    title: "Magnet Material Supply Risk",
    summary: "The supply of magnet materials may be at risk because China is setting export controls on rare-earth-related items for other countries.",
    affectedNodeIds: [
      "kg_magnet_material",
      "kg_magnet_set",
      "kg_electric_motor",
      "kg_hvac_compressor",
      "kg_thermal_management_system",
      "kg_meb_platform"
    ],
    sources: [
      {
        region: "China",
        sourceType: "Government / official regulation",
        label: "MOFCOM Notice 2025 No. 61",
        url: "https://www.mofcom.gov.cn/zwgk/zcfb/art/2025/art_7fc9bff0fb4546ecb02f66ee77d0e5f6.html"
      },
      {
        region: "Western",
        sourceType: "Policy research / official translation",
        label: "CSET English translation and analysis",
        url: "https://cset.georgetown.edu/wp-content/uploads/t0656_china_rare_earth_controls_2025_61_EN.pdf"
      },
      {
        region: "Western",
        sourceType: "News agency",
        label: "Reuters report on tighter rare-earth magnet export license scrutiny",
        url: "https://www.reuters.com/world/china/china-is-making-it-harder-get-rare-earth-magnet-export-licenses-sources-say-2025-10-14/"
      }
    ]
  }
];

const KG_CASE1_ALERTS = [
  {
    id: "kg_al_magnet_1",
    supplierId: "kg_magnet_material",
    severity: "high",
    riskType: "geopolitical",
    title: "Rare-earth export controls may restrict magnet material supply",
    ts: "2026-05-28T14:20",
    status: "active",
    ackBy: null
  }
];

const KG_CASE1_SCENARIO = {
  D_magnet_export_control: {
    trigger: "traceWarning('magnet_material_export_control_warning')",
    expect: {
      affectedPrograms: ["MEB"],
      affectedPlants: ["Wolfsburg Plant"],
      partsAffected: 5,
      programs: ["MEB"],
      programIds: ["kg_meb_platform"],
      plantIds: ["kg_plant_wolfsburg"],
      affectedChain: "Magnet Material → Magnet Set → Electric Motor → HVAC Compressor → Thermal Management System → MEB"
    }
  }
};

const USE_CASES = {
  semiconductor: {
    id: "semiconductor",
    label: "Semiconductor risk",
    graph: typeof GRAPH !== "undefined" ? GRAPH : null,
    alerts: typeof ALERTS !== "undefined" ? ALERTS : [],
    alertHistory: typeof ALERT_HISTORY !== "undefined" ? ALERT_HISTORY : {},
    systemViews: typeof SYSTEM_VIEWS !== "undefined" ? SYSTEM_VIEWS : [],
    scenarios: ["a", "b", "c"],
    defaultLayout: "dagre",
    features: { ownership: true, concentration: true }
  },
  thermal_mgmt: {
    id: "thermal_mgmt",
    label: "Thermal management",
    graph: GRAPH_KG_CASE1,
    alerts: KG_CASE1_ALERTS,
    alertHistory: {},
    systemViews: [],
    warnings: KG_CASE1_WARNINGS,
    scenarios: ["d"],
    defaultLayout: "preset",
    features: { ownership: false, concentration: false },
    sampleDataNote: "Sample data created for demonstration purposes"
  }
};

if (typeof window !== "undefined") {
  window.GRAPH_KG_CASE1 = GRAPH_KG_CASE1;
  window.KG_CASE1_WARNINGS = KG_CASE1_WARNINGS;
  window.KG_CASE1_ALERTS = KG_CASE1_ALERTS;
  window.KG_CASE1_SCENARIO = KG_CASE1_SCENARIO;
  window.KG_CASE1_POSITIONS = KG_CASE1_POSITIONS;
  window.USE_CASES = USE_CASES;
}

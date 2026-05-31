# VW N-tier Supplier Monitor — Graph Data Model

**Prototype:** Volkswagen Supply Chain Knowledge Graph  
**Renderer:** Cytoscape.js (compatible with vis.js with minor key renames)  
**Nodes:** 30 | **Edges:** 46

---

## Scenario Summary

A Malaysian semiconductor manufacturer (**SilTech Malaysia Sdn Bhd**, Tier-2) is in **critical financial distress** (financial score: 24/100). It is the **sole supplier** of the Display Driver IC `MX7023` — a single point of failure embedded in the Infotainment Head Unit `MIB3`, which is supplied by Harman International (Tier-1) and used across **both the Golf MQB and Tiguan MQB-evo programs** at Wolfsburg and Emden plants.

**Critical propagation chain:**  
`SilTech MY (CRITICAL)` → `Display Driver IC MX7023 (SPOF)` → `MQB Infotainment Assembly` → `Golf MQB` + `Tiguan MQB-evo` @ `Wolfsburg Plant` + `Emden Plant`

---

## Schema Reference

### Node Types

| `type`      | Key Properties |
|-------------|----------------|
| `oem`       | name |
| `program`   | name, risk_level |
| `plant`     | name, country, city, risk_level, program_ids |
| `assembly`  | name, part_count, program_ids |
| `part`      | name, part_number, commodity_group, risk_level, single_point_of_failure |
| `supplier`  | name, country, tier, risk_level, risk_type, financial_score*, alert_status* |
| `site`      | name, country, city, tier, risk_level |

*Tier-1 only

### Edge Types

| `relationship`      | Semantics |
|--------------------|-----------|
| `SUPPLIES`         | Supplier → Part or Supplier → Supplier (upstream) |
| `MANUFACTURED_AT`  | Program or Part → Plant or Site |
| `USED_IN`          | Part → Program |
| `OWNED_BY`         | Program, Plant, or Site → owning entity |
| `PART_OF_ASSEMBLY` | Part → Assembly |
| `ASSEMBLED_AT`     | Assembly → Plant |

---

## Cytoscape.js Elements JSON

Paste directly into `cy.add(elements)` or initialise with `elements:` in `cytoscape({...})`.

```json
{
  "elements": {
    "nodes": [

      // ── OEM ──────────────────────────────────────────────────────────
      {
        "data": {
          "id": "oem_vw",
          "label": "Volkswagen AG",
          "name": "Volkswagen AG",
          "type": "oem"
        }
      },

      // ── Vehicle Programs ─────────────────────────────────────────────
      {
        "data": {
          "id": "prog_golf",
          "label": "Golf Platform MQB",
          "name": "Golf Platform MQB",
          "type": "program",
          "risk_level": "MEDIUM"
        }
      },
      {
        "data": {
          "id": "prog_tiguan",
          "label": "Tiguan Platform MQB-evo",
          "name": "Tiguan Platform MQB-evo",
          "type": "program",
          "risk_level": "HIGH"
        }
      },

      // ── Plants ───────────────────────────────────────────────────────
      {
        "data": {
          "id": "plant_wolfsburg",
          "label": "Wolfsburg Main Plant",
          "name": "Wolfsburg Main Plant",
          "country": "Germany",
          "city": "Wolfsburg",
          "type": "plant",
          "risk_level": "HIGH",
          "program_ids": ["prog_golf"]
        }
      },
      {
        "data": {
          "id": "plant_emden",
          "label": "Emden Plant",
          "name": "Emden Plant",
          "country": "Germany",
          "city": "Emden",
          "type": "plant",
          "risk_level": "HIGH",
          "program_ids": ["prog_tiguan"]
        }
      },

      // ── Assemblies ───────────────────────────────────────────────────
      {
        "data": {
          "id": "asm_infotainment",
          "label": "MQB Infotainment System",
          "name": "MQB Infotainment System Assembly",
          "type": "assembly",
          "part_count": 147,
          "program_ids": ["prog_golf", "prog_tiguan"]
        }
      },
      {
        "data": {
          "id": "asm_bcm",
          "label": "Body Control Module Assembly",
          "name": "Body Control Module Assembly",
          "type": "assembly",
          "part_count": 89,
          "program_ids": ["prog_golf"]
        }
      },
      {
        "data": {
          "id": "asm_adas",
          "label": "ADAS Sensor Cluster",
          "name": "ADAS Sensor Cluster Assembly",
          "type": "assembly",
          "part_count": 63,
          "program_ids": ["prog_golf", "prog_tiguan"]
        }
      },

      // ── Parts ────────────────────────────────────────────────────────
      {
        "data": {
          "id": "part_iu",
          "label": "Infotainment Head Unit MIB3",
          "name": "Infotainment Head Unit MIB3",
          "part_number": "VW-3Q0-035-867-A",
          "type": "part",
          "commodity_group": "In-Vehicle Infotainment",
          "risk_level": "CRITICAL",
          "single_point_of_failure": true
        }
      },
      {
        "data": {
          "id": "part_ddc",
          "label": "Display Driver IC MX7023",
          "name": "Display Driver IC MX7023",
          "part_number": "SLT-IC-7023-REV2",
          "type": "part",
          "commodity_group": "Semiconductor",
          "risk_level": "CRITICAL",
          "single_point_of_failure": true
        }
      },
      {
        "data": {
          "id": "part_bcm",
          "label": "BCM Module J519",
          "name": "Body Control Module J519",
          "part_number": "VW-5Q0-937-086-B",
          "type": "part",
          "commodity_group": "Body Electronics",
          "risk_level": "MEDIUM",
          "single_point_of_failure": false
        }
      },
      {
        "data": {
          "id": "part_radar",
          "label": "77GHz Radar Module",
          "name": "77GHz Radar Sensor Module",
          "part_number": "CON-7Q0-907-567-C",
          "type": "part",
          "commodity_group": "ADAS Sensors",
          "risk_level": "HIGH",
          "single_point_of_failure": false
        }
      },
      {
        "data": {
          "id": "part_conn",
          "label": "Connectivity Module LTE/BT",
          "name": "Connectivity Module LTE/Bluetooth",
          "part_number": "HMN-CM-5500-LTE",
          "type": "part",
          "commodity_group": "Connectivity",
          "risk_level": "LOW",
          "single_point_of_failure": false
        }
      },

      // ── Tier-1 Suppliers ─────────────────────────────────────────────
      {
        "data": {
          "id": "t1_harman",
          "label": "Harman International",
          "name": "Harman International Industries",
          "country": "USA",
          "type": "supplier",
          "tier": 1,
          "risk_level": "HIGH",
          "risk_type": "Concentration Risk",
          "financial_score": 62,
          "alert_status": "ACTIVE"
        }
      },
      {
        "data": {
          "id": "t1_continental",
          "label": "Continental Automotive",
          "name": "Continental Automotive Technologies GmbH",
          "country": "Germany",
          "type": "supplier",
          "tier": 1,
          "risk_level": "LOW",
          "risk_type": "None",
          "financial_score": 78,
          "alert_status": "NONE"
        }
      },
      {
        "data": {
          "id": "t1_bosch",
          "label": "Robert Bosch GmbH",
          "name": "Robert Bosch GmbH",
          "country": "Germany",
          "type": "supplier",
          "tier": 1,
          "risk_level": "MEDIUM",
          "risk_type": "Capacity Risk",
          "financial_score": 81,
          "alert_status": "WATCH"
        }
      },

      // ── Tier-1 Supplier Sites ────────────────────────────────────────
      {
        "data": {
          "id": "site_harman_shenzhen",
          "label": "Harman Shenzhen Mfg",
          "name": "Harman Manufacturing Centre Shenzhen",
          "country": "China",
          "city": "Shenzhen",
          "type": "site",
          "tier": 1,
          "risk_level": "HIGH"
        }
      },
      {
        "data": {
          "id": "site_harman_novi",
          "label": "Harman Novi R&D",
          "name": "Harman Engineering Centre Novi",
          "country": "USA",
          "city": "Novi, MI",
          "type": "site",
          "tier": 1,
          "risk_level": "LOW"
        }
      },
      {
        "data": {
          "id": "site_continental_regensburg",
          "label": "Continental Regensburg",
          "name": "Continental Automotive Regensburg Plant",
          "country": "Germany",
          "city": "Regensburg",
          "type": "site",
          "tier": 1,
          "risk_level": "LOW"
        }
      },
      {
        "data": {
          "id": "site_bosch_reutlingen",
          "label": "Bosch Reutlingen",
          "name": "Bosch Semiconductor Plant Reutlingen",
          "country": "Germany",
          "city": "Reutlingen",
          "type": "site",
          "tier": 1,
          "risk_level": "MEDIUM"
        }
      },

      // ── Tier-2 Suppliers ─────────────────────────────────────────────
      {
        "data": {
          "id": "t2_siltech",
          "label": "SilTech Malaysia ⚠ CRITICAL",
          "name": "SilTech Malaysia Sdn Bhd",
          "country": "Malaysia",
          "type": "supplier",
          "tier": 2,
          "risk_level": "CRITICAL",
          "risk_type": "Financial Risk",
          "financial_score": 24,
          "alert_status": "CRITICAL"
        }
      },
      {
        "data": {
          "id": "t2_nxp",
          "label": "NXP Semiconductors",
          "name": "NXP Semiconductors N.V.",
          "country": "Netherlands",
          "type": "supplier",
          "tier": 2,
          "risk_level": "MEDIUM",
          "risk_type": "Geopolitical Risk"
        }
      },
      {
        "data": {
          "id": "t2_renesas",
          "label": "Renesas Electronics",
          "name": "Renesas Electronics Corporation",
          "country": "Japan",
          "type": "supplier",
          "tier": 2,
          "risk_level": "LOW",
          "risk_type": "None"
        }
      },
      {
        "data": {
          "id": "t2_yazaki",
          "label": "Yazaki Europe",
          "name": "Yazaki Europe Ltd",
          "country": "Germany",
          "type": "supplier",
          "tier": 2,
          "risk_level": "LOW",
          "risk_type": "None"
        }
      },
      {
        "data": {
          "id": "t2_te",
          "label": "TE Connectivity",
          "name": "TE Connectivity Ltd",
          "country": "Switzerland",
          "type": "supplier",
          "tier": 2,
          "risk_level": "LOW",
          "risk_type": "None"
        }
      },

      // ── Tier-3 Suppliers ─────────────────────────────────────────────
      {
        "data": {
          "id": "t3_siltronic",
          "label": "Siltronic AG",
          "name": "Siltronic AG",
          "country": "Germany",
          "type": "supplier",
          "tier": 3,
          "risk_level": "MEDIUM"
        }
      },
      {
        "data": {
          "id": "t3_shineetsu",
          "label": "Shin-Etsu Chemical",
          "name": "Shin-Etsu Chemical Co. Ltd",
          "country": "Japan",
          "type": "supplier",
          "tier": 3,
          "risk_level": "LOW"
        }
      },
      {
        "data": {
          "id": "t3_sumitomo",
          "label": "Sumitomo Metal Mining",
          "name": "Sumitomo Metal Mining Co. Ltd",
          "country": "Japan",
          "type": "supplier",
          "tier": 3,
          "risk_level": "LOW"
        }
      },
      {
        "data": {
          "id": "t3_umicore",
          "label": "Umicore N.V.",
          "name": "Umicore N.V.",
          "country": "Belgium",
          "type": "supplier",
          "tier": 3,
          "risk_level": "LOW"
        }
      },
      {
        "data": {
          "id": "t3_basf",
          "label": "BASF Electronic Materials",
          "name": "BASF Electronic Materials GmbH",
          "country": "Germany",
          "type": "supplier",
          "tier": 3,
          "risk_level": "LOW"
        }
      }

    ],

    "edges": [

      // ── OEM ownership ────────────────────────────────────────────────
      {
        "data": {
          "id": "e01",
          "source": "prog_golf",
          "target": "oem_vw",
          "label": "OWNED_BY",
          "relationship": "OWNED_BY"
        }
      },
      {
        "data": {
          "id": "e02",
          "source": "prog_tiguan",
          "target": "oem_vw",
          "label": "OWNED_BY",
          "relationship": "OWNED_BY"
        }
      },
      {
        "data": {
          "id": "e03",
          "source": "plant_wolfsburg",
          "target": "oem_vw",
          "label": "OWNED_BY",
          "relationship": "OWNED_BY"
        }
      },
      {
        "data": {
          "id": "e04",
          "source": "plant_emden",
          "target": "oem_vw",
          "label": "OWNED_BY",
          "relationship": "OWNED_BY"
        }
      },

      // ── Programs → Plants ────────────────────────────────────────────
      {
        "data": {
          "id": "e05",
          "source": "prog_golf",
          "target": "plant_wolfsburg",
          "label": "MANUFACTURED_AT",
          "relationship": "MANUFACTURED_AT"
        }
      },
      {
        "data": {
          "id": "e06",
          "source": "prog_tiguan",
          "target": "plant_emden",
          "label": "MANUFACTURED_AT",
          "relationship": "MANUFACTURED_AT"
        }
      },

      // ── Assemblies → Plants ──────────────────────────────────────────
      {
        "data": {
          "id": "e07",
          "source": "asm_infotainment",
          "target": "plant_wolfsburg",
          "label": "ASSEMBLED_AT",
          "relationship": "ASSEMBLED_AT"
        }
      },
      {
        "data": {
          "id": "e08",
          "source": "asm_infotainment",
          "target": "plant_emden",
          "label": "ASSEMBLED_AT",
          "relationship": "ASSEMBLED_AT"
        }
      },
      {
        "data": {
          "id": "e09",
          "source": "asm_bcm",
          "target": "plant_wolfsburg",
          "label": "ASSEMBLED_AT",
          "relationship": "ASSEMBLED_AT"
        }
      },
      {
        "data": {
          "id": "e10",
          "source": "asm_adas",
          "target": "plant_wolfsburg",
          "label": "ASSEMBLED_AT",
          "relationship": "ASSEMBLED_AT"
        }
      },
      {
        "data": {
          "id": "e11",
          "source": "asm_adas",
          "target": "plant_emden",
          "label": "ASSEMBLED_AT",
          "relationship": "ASSEMBLED_AT"
        }
      },

      // ── Parts → Assemblies ───────────────────────────────────────────
      {
        "data": {
          "id": "e12",
          "source": "part_iu",
          "target": "asm_infotainment",
          "label": "PART_OF_ASSEMBLY",
          "relationship": "PART_OF_ASSEMBLY"
        }
      },
      {
        "data": {
          "id": "e13",
          "source": "part_ddc",
          "target": "asm_infotainment",
          "label": "PART_OF_ASSEMBLY",
          "relationship": "PART_OF_ASSEMBLY"
        }
      },
      {
        "data": {
          "id": "e14",
          "source": "part_conn",
          "target": "asm_infotainment",
          "label": "PART_OF_ASSEMBLY",
          "relationship": "PART_OF_ASSEMBLY"
        }
      },
      {
        "data": {
          "id": "e15",
          "source": "part_bcm",
          "target": "asm_bcm",
          "label": "PART_OF_ASSEMBLY",
          "relationship": "PART_OF_ASSEMBLY"
        }
      },
      {
        "data": {
          "id": "e16",
          "source": "part_radar",
          "target": "asm_adas",
          "label": "PART_OF_ASSEMBLY",
          "relationship": "PART_OF_ASSEMBLY"
        }
      },

      // ── Parts → Programs ─────────────────────────────────────────────
      {
        "data": {
          "id": "e17",
          "source": "part_iu",
          "target": "prog_golf",
          "label": "USED_IN",
          "relationship": "USED_IN"
        }
      },
      {
        "data": {
          "id": "e18",
          "source": "part_iu",
          "target": "prog_tiguan",
          "label": "USED_IN",
          "relationship": "USED_IN"
        }
      },
      {
        "data": {
          "id": "e19",
          "source": "part_ddc",
          "target": "prog_golf",
          "label": "USED_IN",
          "relationship": "USED_IN",
          "risk_propagation": true
        }
      },
      {
        "data": {
          "id": "e20",
          "source": "part_ddc",
          "target": "prog_tiguan",
          "label": "USED_IN",
          "relationship": "USED_IN",
          "risk_propagation": true
        }
      },
      {
        "data": {
          "id": "e21",
          "source": "part_bcm",
          "target": "prog_golf",
          "label": "USED_IN",
          "relationship": "USED_IN"
        }
      },
      {
        "data": {
          "id": "e22",
          "source": "part_radar",
          "target": "prog_golf",
          "label": "USED_IN",
          "relationship": "USED_IN"
        }
      },
      {
        "data": {
          "id": "e23",
          "source": "part_radar",
          "target": "prog_tiguan",
          "label": "USED_IN",
          "relationship": "USED_IN"
        }
      },

      // ── Tier-1 → Parts (SUPPLIES) ────────────────────────────────────
      {
        "data": {
          "id": "e24",
          "source": "t1_harman",
          "target": "part_iu",
          "label": "SUPPLIES",
          "relationship": "SUPPLIES"
        }
      },
      {
        "data": {
          "id": "e25",
          "source": "t1_harman",
          "target": "part_conn",
          "label": "SUPPLIES",
          "relationship": "SUPPLIES"
        }
      },
      {
        "data": {
          "id": "e26",
          "source": "t1_continental",
          "target": "part_bcm",
          "label": "SUPPLIES",
          "relationship": "SUPPLIES"
        }
      },
      {
        "data": {
          "id": "e27",
          "source": "t1_bosch",
          "target": "part_radar",
          "label": "SUPPLIES",
          "relationship": "SUPPLIES"
        }
      },

      // ── Parts → Manufacturing Sites ──────────────────────────────────
      {
        "data": {
          "id": "e28",
          "source": "part_iu",
          "target": "site_harman_shenzhen",
          "label": "MANUFACTURED_AT",
          "relationship": "MANUFACTURED_AT"
        }
      },
      {
        "data": {
          "id": "e29",
          "source": "part_conn",
          "target": "site_harman_shenzhen",
          "label": "MANUFACTURED_AT",
          "relationship": "MANUFACTURED_AT"
        }
      },
      {
        "data": {
          "id": "e30",
          "source": "part_bcm",
          "target": "site_continental_regensburg",
          "label": "MANUFACTURED_AT",
          "relationship": "MANUFACTURED_AT"
        }
      },
      {
        "data": {
          "id": "e31",
          "source": "part_radar",
          "target": "site_bosch_reutlingen",
          "label": "MANUFACTURED_AT",
          "relationship": "MANUFACTURED_AT"
        }
      },

      // ── Sites → Tier-1 Suppliers (OWNED_BY) ─────────────────────────
      {
        "data": {
          "id": "e32",
          "source": "site_harman_shenzhen",
          "target": "t1_harman",
          "label": "OWNED_BY",
          "relationship": "OWNED_BY"
        }
      },
      {
        "data": {
          "id": "e33",
          "source": "site_harman_novi",
          "target": "t1_harman",
          "label": "OWNED_BY",
          "relationship": "OWNED_BY"
        }
      },
      {
        "data": {
          "id": "e34",
          "source": "site_continental_regensburg",
          "target": "t1_continental",
          "label": "OWNED_BY",
          "relationship": "OWNED_BY"
        }
      },
      {
        "data": {
          "id": "e35",
          "source": "site_bosch_reutlingen",
          "target": "t1_bosch",
          "label": "OWNED_BY",
          "relationship": "OWNED_BY"
        }
      },

      // ── Tier-2 → Part / Tier-1 (SUPPLIES) ───────────────────────────
      // Critical chain: SilTech Malaysia → DDC chip (SPOF)
      {
        "data": {
          "id": "e36",
          "source": "t2_siltech",
          "target": "part_ddc",
          "label": "SUPPLIES",
          "relationship": "SUPPLIES",
          "alert": "CRITICAL_FINANCIAL_RISK",
          "risk_propagation": true
        }
      },
      // Business relationship: SilTech is a qualified Tier-2 under Harman
      {
        "data": {
          "id": "e37",
          "source": "t2_siltech",
          "target": "t1_harman",
          "label": "SUPPLIES",
          "relationship": "SUPPLIES",
          "alert": "CRITICAL_FINANCIAL_RISK",
          "risk_propagation": true
        }
      },
      {
        "data": {
          "id": "e38",
          "source": "t2_nxp",
          "target": "t1_harman",
          "label": "SUPPLIES",
          "relationship": "SUPPLIES"
        }
      },
      {
        "data": {
          "id": "e39",
          "source": "t2_renesas",
          "target": "t1_bosch",
          "label": "SUPPLIES",
          "relationship": "SUPPLIES"
        }
      },
      {
        "data": {
          "id": "e40",
          "source": "t2_yazaki",
          "target": "t1_continental",
          "label": "SUPPLIES",
          "relationship": "SUPPLIES"
        }
      },
      {
        "data": {
          "id": "e41",
          "source": "t2_te",
          "target": "t1_continental",
          "label": "SUPPLIES",
          "relationship": "SUPPLIES"
        }
      },

      // ── Tier-3 → Tier-2 (SUPPLIES) ───────────────────────────────────
      // Siltronic & Shin-Etsu supply silicon wafers/materials to SilTech
      {
        "data": {
          "id": "e42",
          "source": "t3_siltronic",
          "target": "t2_siltech",
          "label": "SUPPLIES",
          "relationship": "SUPPLIES"
        }
      },
      {
        "data": {
          "id": "e43",
          "source": "t3_shineetsu",
          "target": "t2_siltech",
          "label": "SUPPLIES",
          "relationship": "SUPPLIES"
        }
      },
      {
        "data": {
          "id": "e44",
          "source": "t3_umicore",
          "target": "t2_nxp",
          "label": "SUPPLIES",
          "relationship": "SUPPLIES"
        }
      },
      {
        "data": {
          "id": "e45",
          "source": "t3_sumitomo",
          "target": "t2_te",
          "label": "SUPPLIES",
          "relationship": "SUPPLIES"
        }
      },
      {
        "data": {
          "id": "e46",
          "source": "t3_basf",
          "target": "t2_renesas",
          "label": "SUPPLIES",
          "relationship": "SUPPLIES"
        }
      }

    ]
  }
}
```

---

## Loading in Cytoscape.js

```js
const cy = cytoscape({
  container: document.getElementById('cy'),
  elements: graphData.elements,   // paste the JSON object above as graphData
  style: [
    { selector: 'node[type="oem"]',      style: { 'background-color': '#1a1a2e', 'color': '#fff' } },
    { selector: 'node[type="program"]',  style: { 'background-color': '#16213e' } },
    { selector: 'node[type="plant"]',    style: { 'background-color': '#0f3460' } },
    { selector: 'node[type="assembly"]', style: { 'background-color': '#533483' } },
    { selector: 'node[type="part"]',     style: { 'background-color': '#e94560' } },
    { selector: 'node[type="supplier"][tier=1]', style: { 'background-color': '#2d6a4f' } },
    { selector: 'node[type="site"]',     style: { 'background-color': '#40916c' } },
    { selector: 'node[type="supplier"][tier=2]', style: { 'background-color': '#b5838d' } },
    { selector: 'node[type="supplier"][tier=3]', style: { 'background-color': '#6d6875' } },
    // Critical risk highlight
    { selector: 'node[risk_level="CRITICAL"]', style: { 'border-color': '#ff0000', 'border-width': 4 } },
    { selector: 'node[single_point_of_failure]', style: { 'border-style': 'dashed' } },
    // Critical propagation edges
    { selector: 'edge[risk_propagation]', style: { 'line-color': '#ff0000', 'width': 3 } },
    { selector: 'node', style: { 'label': 'data(label)', 'font-size': 11 } },
    { selector: 'edge', style: { 'label': 'data(label)', 'font-size': 9, 'curve-style': 'bezier', 'target-arrow-shape': 'triangle' } }
  ],
  layout: { name: 'breadthfirst', directed: true }
});
```

---

## Suggested Cytoscape.js Layouts

| Layout | Best for |
|--------|----------|
| `breadthfirst` | Tier hierarchy (OEM → T1 → T2 → T3) |
| `dagre` (plugin) | Cleaner DAG with proper level separation |
| `cose` | Force-directed, good for dense sub-graphs |
| `cola` (plugin) | Constrained layout with tier lanes |

For tier-lane separation, set `breadthfirst` with `roots: ['oem_vw']` and `directed: true`.

---

## Node & Edge Counts

| Category | Count |
|----------|-------|
| OEM | 1 |
| Programs | 2 |
| Plants | 2 |
| Assemblies | 3 |
| Parts | 5 |
| Tier-1 Suppliers | 3 |
| Tier-1 Sites | 4 |
| Tier-2 Suppliers | 5 |
| Tier-3 Suppliers | 5 |
| **Total Nodes** | **30** |
| **Total Edges** | **46** |

# AquaVision Prayagraj Sangam: Comprehensive Technical Report
## Autonomous Multi-Agent AI System for Sacred River Confluence Telemetry, Machine Learning Analytics, and Public Ecological Safeguarding (UN SDG-6)

---

### Document Overview & Metadata
* **Project Title:** AquaVision Prayagraj Sangam
* **Domain:** Environmental IoT, Hydro-informatics, Multi-Agent AI Systems, Public Health Surveillance
* **Target Ecosystem:** Prayagraj Triveni Sangam (Sacred Confluence of Ganga, Yamuna & Mythical Saraswati)
* **Dataset Scale:** 46,528 Continuous IoT Telemetry Observations × 8 Physicochemical Attributes
* **Analytics Environment:** Google Colab (Data Cleaning, Plausibility Filtering, Pearson Heatmap Analysis)
* **Frontend Implementation:** React 19, Vite, Tailwind CSS, Lucide Icons, Recharts, Supabase Cloud
* **Target SDG Goals:** UN SDG-6 (Clean Water and Sanitation), SDG-11 (Sustainable Cities), SDG-14 (Life Below Water)
* **Generated Word Document (.docx):** [`AquaVision_Sangam_Water_Quality_Comprehensive_Report.docx`](./AquaVision_Sangam_Water_Quality_Comprehensive_Report.docx)

---

## 1. Executive Summary & Problem Statement

### 1.1 The Ecological and Cultural Context
The **Triveni Sangam** in Prayagraj, India—the sacred confluence of the Ganga, Yamuna, and mythical subterranean Saraswati—represents one of the most culturally revered and ecologically sensitive freshwater ecosystems on Earth. During recurring mega-pilgrimage gatherings such as the **Maha Kumbh Mela** and the annual **Magh Mela**, between **100 million and 240 million pilgrims** gather to perform holy ritual bathing (*Snan*). Concurrently, ritual offerings of flowers, milk, organic matter, and holy ash are introduced into the waters within tightly constrained spatial zones.

### 1.2 The Fatal Flaws in Conventional Water Quality Monitoring
Historically, regulatory bodies such as the Central Pollution Control Board (CPCB) and State Pollution Control Boards (SPCBs) have relied on manual grab sampling. While laboratory methods are standardized, they suffer from fatal handicaps in dynamic pilgrimage environments:
1. **Severe Diagnostic Incubation Latency (24 to 72 Hours):** Standard biochemical parameters such as 5-day Biochemical Oxygen Demand ($BOD_5$) and fecal coliform counts require multiday incubation. By the time lab results confirm that water is unsafe or heavily contaminated, millions of bathers have already entered the river, risking waterborne infections, gastroenteritis, and acute dermatitis.
2. **Blindness to Diurnal Hypoxic Inversions:** Freshwater river ecosystems undergo pronounced photosynthetic day/night fluctuations. Dissolved Oxygen (DO) peaks during sunny afternoons due to algal photosynthesis, but drops precipitously between **03:00 AM and 05:00 AM** due to continuous aquatic respiration. Conventional grab samples taken during daylight office hours (10:00 AM – 04:00 PM) fail to capture dangerous nocturnal and pre-dawn hypoxia ($DO < 3.5 \text{ mg/L}$)—the exact period when devout pilgrims perform the most auspicious *Brahma Muhurta* holy dips.
3. **Absence of Predictive Foresight:** Traditional monitoring is purely retrospective. It documents past contamination but cannot forecast how upstream reservoir discharges (e.g., from Narora or Tehri dams) or sudden crowd surges will impact water quality over the next 24 hours to 7 days.

---

## 2. Dataset Provenance & In-Depth Technical Specification

### 2.1 Origin and Collection Methodology
To build a realistic and reliable predictive system, this study analyzes continuous surface water quality telemetry collected from continuous IoT monitoring stations and floating sensor buoys deployed along the River Ganga and Yamuna reach at Prayagraj. The dataset captures real-time sensor recordings logged during the **2019 Kumbh Mela** and throughout the following annual hydrological cycle.

### 2.2 Dataset Dimensions & Attributes
* **Total Records:** Exactly **46,528 continuous telemetry observations**
* **Total Columns:** **8 features** (`Date`, `DO`, `pH`, `ORP`, `Cond`, `Temp`, `WQI`, `Status`)
* **Temporal Coverage:** January 12, 2019 (commencement of the 2019 Prayagraj Kumbh Mela) through early 2020.

| Feature | Full Scientific Name | Units | Operating Range | CPCB Class B Standard (Outdoor Bathing) |
| :--- | :--- | :--- | :--- | :--- |
| **Date** | Observation Timestamp | YYYY-MM-DD HH:MM:SS | Jan 2019 – Jan 2020 | Continuous time-series index |
| **DO** | Dissolved Oxygen | mg/L (ppm) | 1.5 – 14.0 | $\ge 5.0 \text{ mg/L}$ (Mandatory for safe bathing) |
| **pH** | Potential of Hydrogen | pH scale (0–14) | 6.5 – 9.0 (Spikes to 12.9) | $6.5 - 8.5$ (Neutral to slightly alkaline) |
| **ORP** | Oxidation-Reduction Potential | V or mV | -0.35 to +0.35 V | $\ge +0.25 \text{ V}$ (+250 mV) indicates oxidizing health |
| **Cond** | Electrical Conductivity | mS/cm or $\mu$S/cm | 0.04 – 55.0 mS/cm | $< 500\ \mu\text{S/cm}$ ($< 0.5 \text{ mS/cm}$) for fresh water |
| **Temp** | Water Temperature | °C | 17.0 – 30.5 °C | Ambient seasonal range (18–25 °C optimal) |
| **WQI** | Water Quality Index | Score (0–100) | 15.0 – 95.0 | $\ge 65 = \text{Good}$, $\ge 80 = \text{Excellent/Safe}$ |
| **Status** | Suitability Grade | String Category | Very Poor to Good | CPCB Outdoor Bathing Suitability |

---

## 3. Data Cleaning, Preprocessing & Exploratory Analysis (Google Colab)

### 3.1 Preprocessing Pipeline
Raw IoT buoy telemetry in natural riverine settings is vulnerable to packet drops, biological sensor fouling, electrochemical drift, and calibration dropouts. The Google Colab preprocessing pipeline addressed these issues through:
1. **Timestamp Normalization:** Parsed to Indian Standard Time (IST, UTC+5:30), sorted chronologically, and reindexed for uniform sequential time-series modeling.
2. **Physical Boundary Validation & Biofouling Filtering:** Filtered extreme unphysical readings—such as temporary pH spikes reaching 12.99 and ORP crashing to -0.35 V caused by sediment fouling during riverbed churning. Imputed using Exponentially Weighted Moving Averages (EWMA).
3. **Gap Imputation:** Sensor disconnections under 2 hours were linearly interpolated; extended disconnections utilized diurnal seasonal median matching.

### 3.2 Longitudinal Time-Series Analysis: Temperature & ORP
The cleaned time-series reveals key seasonal dynamics across 2019–2020:
* **Temperature:** Rose from a winter baseline of 18.0 °C in January 2019 to a peak summer high of ~30.0 °C in June/July 2019, before declining back to 22.0 °C by December.
* **ORP (Oxidation-Reduction Potential):** Maintained an average oxidizing potential of +0.10 V to +0.18 V. Downward dips coincided with heavy bathing peak days and post-monsoon organic influx, followed by natural re-aeration recovery.

### 3.3 Correlation Analysis & Hydro-Chemical Findings
The Pearson correlation heatmap computed in Google Colab revealed fundamental physical couplings:
* **DO vs. Temperature ($r = -0.94$ — Extremely Strong Negative):** Directly obeys Henry’s Law of gas solubility in water. Cold winter waters hold significantly higher dissolved oxygen (~12–14 mg/L) than warm summer waters (~6–7 mg/L).
* **pH vs. DO ($r = +0.44$ — Moderate Positive):** Photosynthetic algae absorb aqueous carbon dioxide ($CO_2$), depleting carbonic acid and simultaneously increasing both dissolved oxygen and alkalinity (higher pH).
* **pH vs. Temperature ($r = -0.39$):** Higher water temperatures accelerate biological microbial decomposition, releasing $CO_2$ and shifting water toward lower pH.
* **pH vs. ORP ($r = -0.35$):** Reflects the Nernstian electrochemical relationship where higher alkalinity (elevated pH) systematically lowers the redox oxidation potential.

---

## 4. Proposed Solution: The AquaVision Multi-Agent AI System

AquaVision organizes water monitoring, forecasting, and risk mitigation into four collaborative autonomous agents:

```
[ IoT Sensor Buoys / Telemetry ]
               │
               ▼
   ┌────────────────────────────────────────┐
   │ Agent 1: Data Acquisition & Preprocess │
   │ (Ingestion, Plausibility, Filtering)   │
   └────────────────────────────────────────┘
               │
               ▼
   ┌────────────────────────────────────────┐
   │ Agent 2: Diagnostic Evaluation (WQI)   │
   │ (CPCB Bathing Suitability, Violations) │
   └────────────────────────────────────────┘
               │
               ▼
   ┌────────────────────────────────────────┐
   │ Agent 3: ML Predictive Forecaster      │
   │ (24h Diurnal Cycle & 7-Day Trend)      │
   └────────────────────────────────────────┘
               │
               ▼
   ┌────────────────────────────────────────┐
   │ Agent 4: Risk Advisory & Mitigation    │
   │ (Field Directives, Aeration, Warnings) │
   └────────────────────────────────────────┘
```

1. **Agent 1 (Acquisition & Preprocessing):** Continuously ingests live sensor streams, filters electrochemical sensor noise, applies boundary limits, and establishes baselines across Sangam monitoring sectors.
2. **Agent 2 (Diagnostic Evaluation):** Calculates the CPCB Weighted Arithmetic Water Quality Index ($WQI = \sum w_i q_i / \sum w_i$), checks parameter thresholds, and assigns safety categories (Class A to E).
3. **Agent 3 (ML Predictive Forecaster):** Runs a 24-hour diurnal diurnal cycle model to forecast nocturnal DO dips and a 7-day longitudinal forecasting model calibrated to river flow and dam discharge trends.
4. **Agent 4 (Risk Advisory & Mitigation Directives):** Synthesizes diagnostic findings and forecasts into an automated hazard matrix. Triggers actionable directives: aerator cascades, STP drain diversions, and public safety alerts.

---

## 5. Frontend Web Application & Implementation

The application is built using **React 19**, **Vite**, and **Tailwind CSS**, featuring:
* **Multi-Agent 4-Stage Pipeline Dashboard:** Includes real-time sensor monitors, interactive pilgrimage surge simulations, a 1-click live scan button, and detailed stage progression.
* **Public Water Quality Tester & File Upload Portal ("Today's Sangam Water Tester"):** Enables pilgrims, field volunteers, and researchers to test manual samples or drop CSV/JSON telemetry logs to receive instant CPCB grades, religious bathing suitability ratings, and 7-day forecasts.
* **Sangam Water Records & Analytics:** Cloud-synchronized logging powered by Supabase for longitudinal trend tracking and reporting.

---

## 6. Real-World Utility & UN SDG-6 Alignment

* **UN SDG-6 Target 6.3 (Water Quality Improvement):** Rapid detection of organic effluent ($BOD > 5.0\text{ mg/L}$) and industrial salinity surges prompts immediate drain diversions to Sewage Treatment Plants (STPs).
* **UN SDG-6 Target 6.6 (Ecosystem Protection):** Predictive pre-dawn oxygen alerts protect the endangered Ganges River Dolphin (*Platanista gangetica*) and native fish species from lethal nocturnal hypoxia.
* **Public Health Protection for 100M+ Pilgrims:** Eliminates the 48-hour diagnostic lag, mitigating the risk of waterborne disease outbreaks during mass religious bathing.
* **Autonomous Administrative Directives:** Provides closed-loop, data-driven action orders to irrigation engineers, STP plant operators, and municipal authorities.

---

### Output Documents Created
1. **Complete Microsoft Word Document:** [`AquaVision_Sangam_Water_Quality_Comprehensive_Report.docx`](file:///e:/Desktop/SDG/AquaVision_Sangam_Water_Quality_Comprehensive_Report.docx) *(Contains all 5 embedded figures, formatted tables, custom typography, and styling).*
2. **Markdown Technical Report:** [`AquaVision_Sangam_Water_Quality_Comprehensive_Report.md`](file:///e:/Desktop/SDG/AquaVision_Sangam_Water_Quality_Comprehensive_Report.md)

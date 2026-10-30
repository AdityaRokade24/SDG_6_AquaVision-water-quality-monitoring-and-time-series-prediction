# SDG 6 AquaVision: Water Quality Monitoring and Time-Series Prediction

> **Autonomous Multi-Agent AI System for Sacred River Confluence Telemetry, Machine Learning Predictive Analytics, and Public Ecological Safeguarding (UN SDG-6)**

[![UN SDG](https://img.shields.io/badge/UN%20SDG-Goal%206%3A%20Clean%20Water-00AED9?style=for-the-badge&logo=unitednations)](https://sdgs.un.org/goals/goal6)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

---

## 📌 Overview

**AquaVision Prayagraj Sangam** is an advanced environmental IoT and predictive intelligence platform designed to safeguard freshwater ecosystems and millions of pilgrims during major river bathing events (e.g., Prayagraj Triveni Sangam, Kumbh Mela).

By addressing key pitfalls of legacy grab-sampling methods—such as 24–72 hour diagnostic incubation latencies and blindness to pre-dawn hypoxic drops—AquaVision leverages high-frequency sensor telemetry, multi-agent AI pipelines, real-time Water Quality Index (WQI) computation, and time-series forecasting.

---

## 🚀 Key Multi-Agent Architecture

AquaVision organizes end-to-end data processing into 4 autonomous agents:

1. **Agent 1: Telemetry Acquisition & Ingestion**
   - Ingests real-time continuous IoT observations (DO, pH, ORP, Conductivity, Temperature).
   - Simulates and bridges live monitoring stations along river confluences.
   - Fallback and direct integration with live station APIs and Supabase.

2. **Agent 2: Physicochemical Analysis & WQI Engine**
   - Applies weighted arithmetic Water Quality Index (WQI) algorithms calibrated against CPCB Class B standards.
   - Detects diurnal hypoxic inversions and classifies water suitability.

3. **Agent 3: Time-Series Forecasting & ML Prediction**
   - Runs predictive modeling to forecast key metrics (WQI, Dissolved Oxygen, pH) 24 to 72 hours in advance.
   - Incorporates trend forecasting, upstream releases, and seasonal hydrological shifts.

4. **Agent 4: Risk Alert & Autonomous Ecological Safeguarding**
   - Evaluates multi-parameter thresholds to trigger real-time hazard alerts (e.g., pre-dawn hypoxia, chemical spikes).
   - Dispatches actionable advisory recommendations for municipal authorities and public health teams.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS, Lucide Icons, Recharts
- **Database & Backend:** Supabase Cloud (PostgreSQL with real-time subscriptions)
- **Analytics & ML Engine:** Python (Google Colab / NumPy / Pandas data cleaning & Pearson correlation analysis)
- **Reporting:** Automated multi-format technical report generation (`generate_report.py`)

---

## ⚡ Quick Start

### Prerequisites
- Node.js (v18+ recommended)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/AdityaRokade24/SDG_6_AquaVision-water-quality-monitoring-and-time-series-prediction.git
cd SDG_6_AquaVision-water-quality-monitoring-and-time-series-prediction

# Install dependencies
npm install

# Start the local development server
npm run dev
```

### Environment Configuration (Optional)
To connect to your own Supabase project:
1. Create a `.env.local` file:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
2. Apply the schema located in `supabase/schema.sql` to your Supabase SQL editor.

---

## 📊 Dataset & Research References
- **Dataset Scale:** 46,528 continuous telemetry observations across 8 physicochemical attributes from Prayagraj Triveni Sangam reach.
- **Reference Standards:** Central Pollution Control Board (CPCB) Class B standards for outdoor bathing.
- **Detailed Documentation:** Refer to [`AquaVision_Sangam_Water_Quality_Comprehensive_Report.md`](./AquaVision_Sangam_Water_Quality_Comprehensive_Report.md) for full scientific benchmarks and statistical validations.

---

## 📜 License
This project is open-source under the [MIT License](LICENSE).

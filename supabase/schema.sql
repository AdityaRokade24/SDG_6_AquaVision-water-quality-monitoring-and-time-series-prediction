-- ==========================================================
-- SDG-6 AquaVision River Ganga Database Schema
-- Run this migration in your Supabase SQL Editor
-- ==========================================================

-- 1. Enable UUID extension
create extension if not exists "uuid-ossp";

-- 2. Stations Table
create table if not exists public.monitoring_stations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  river text not null default 'Ganga',
  reach_zone text not null,
  latitude double precision not null,
  longitude double precision not null,
  status text not null default 'Online', -- Online, Warning, Maintenance, Offline
  last_wqi numeric(5,2),
  last_reading_at timestamp with time zone default timezone('utc'::text, now()),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Telemetry Logs Table (Stores Manual & IoT Station Ingestion)
create table if not exists public.water_telemetry (
  id uuid primary key default uuid_generate_v4(),
  station_id uuid references public.monitoring_stations(id) on delete set null,
  station_name text not null,
  ph numeric(4,2) not null,
  do_level numeric(5,2) not null, -- Dissolved Oxygen (mg/L)
  temperature numeric(4,1) not null, -- Celsius
  conductivity numeric(7,1) not null, -- µS/cm
  orp numeric(6,1) not null, -- Oxidation Reduction Potential (mV)
  turbidity numeric(6,2) not null, -- NTU
  bod numeric(5,2) not null, -- Biochemical Oxygen Demand (mg/L)
  wqi numeric(5,2) not null, -- Calculated Water Quality Index (0-100)
  status text not null, -- Excellent, Good, Moderate, Poor, Critical
  risk_level text not null default 'Low', -- Low, Moderate, High, Critical
  logged_by text default 'Field Officer',
  notes text,
  recorded_at timestamp with time zone default timezone('utc'::text, now()),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. Multi-Agent Predictions Table
create table if not exists public.agent_predictions (
  id uuid primary key default uuid_generate_v4(),
  telemetry_id uuid references public.water_telemetry(id) on delete cascade,
  station_name text not null,
  horizon_hours integer not null default 24,
  predicted_wqi numeric(5,2) not null,
  confidence_score numeric(4,2) not null default 0.94,
  forecasted_parameters jsonb not null,
  remediation_advisory text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 5. Department Alerts & Incidents Table
create table if not exists public.department_alerts (
  id uuid primary key default uuid_generate_v4(),
  station_name text not null,
  severity text not null, -- Low, Medium, High, Critical
  parameter text not null,
  breached_value numeric(7,2) not null,
  threshold_limit text not null,
  message text not null,
  is_resolved boolean default false,
  resolved_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 6. Indexes for Fast Filtering
create index if not exists idx_telemetry_station on public.water_telemetry(station_name);
create index if not exists idx_telemetry_recorded on public.water_telemetry(recorded_at desc);
create index if not exists idx_alerts_unresolved on public.department_alerts(is_resolved) where is_resolved = false;

-- 7. Seed Initial Ganga & Sangam Monitoring Stations
insert into public.monitoring_stations (name, river, reach_zone, latitude, longitude, status, last_wqi)
values 
  ('Prayagraj Triveni Sangam', 'Ganga & Yamuna Confluence', 'Middle Ganga Basin', 25.4358, 81.8463, 'Online', 78.4),
  ('Varanasi Dashashwamedh Ghat', 'Ganga', 'Middle Ganga Basin', 25.3076, 83.0107, 'Online', 68.2),
  ('Haridwar Har Ki Pauri', 'Ganga', 'Upper Ganga Basin', 29.9577, 78.1743, 'Online', 89.5),
  ('Kanpur Jajmau Industrial Zone', 'Ganga', 'Middle Ganga Basin', 26.4312, 80.4075, 'Warning', 42.1),
  ('Rishikesh Laxman Jhula Stream', 'Ganga', 'Himalayan Foothills', 30.1261, 78.3247, 'Online', 94.2)
on conflict do nothing;

-- 8. Seed Initial Baseline Telemetry
insert into public.water_telemetry (station_name, ph, do_level, temperature, conductivity, orp, turbidity, bod, wqi, status, risk_level, logged_by, notes)
values
  ('Prayagraj Triveni Sangam', 7.4, 7.2, 22.5, 380, 290, 8.4, 2.8, 78.4, 'Good', 'Low', 'Dr. V. Sharma (Officer #402)', 'Morning religious gathering influx; normal flow'),
  ('Varanasi Dashashwamedh Ghat', 7.8, 5.8, 24.1, 510, 220, 14.2, 4.2, 68.2, 'Moderate', 'Moderate', 'Insp. K. Rao (Officer #118)', 'Moderate urban runoff detected near ghat steps'),
  ('Haridwar Har Ki Pauri', 7.2, 8.9, 18.2, 210, 360, 3.8, 1.4, 89.5, 'Good', 'Low', 'S. Negi (Hydrologist #009)', 'Pristine Himalayan melt flow; high aeration'),
  ('Kanpur Jajmau Industrial Zone', 8.6, 3.1, 26.8, 980, 110, 32.5, 9.6, 42.1, 'Poor', 'Critical', 'Automated IoT Station #KJ-04', 'High organic and saline effluent breach detected'),
  ('Rishikesh Laxman Jhula Stream', 7.1, 9.4, 16.5, 175, 390, 2.1, 0.9, 94.2, 'Excellent', 'Low', 'Officer R. Rawat (#002)', 'Optimal pristine water parameters compliant with CPCB Class A')
on conflict do nothing;

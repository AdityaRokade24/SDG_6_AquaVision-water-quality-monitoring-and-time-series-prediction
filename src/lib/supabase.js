// ==========================================================
// Supabase Client with Automatic Offline LocalStorage Fallback
// Provides permanent storage for the Water Quality Department
// ==========================================================

import { createClient } from '@supabase/supabase-js';

const STORAGE_KEYS = {
  CONFIG: 'sdg6_supabase_config',
  LOGS: 'sdg6_department_telemetry_logs',
  STATIONS: 'sdg6_monitoring_stations',
  ALERTS: 'sdg6_department_alerts'
};

// Initial Seed Logs for Department Table
const INITIAL_SEED_LOGS = [
  {
    id: 'log-101',
    station_name: 'Prayagraj Triveni Sangam',
    ph: 7.4,
    do_level: 7.2,
    temperature: 22.5,
    conductivity: 380,
    orp: 290,
    turbidity: 8.4,
    bod: 2.8,
    wqi: 78.4,
    status: 'Good',
    risk_level: 'Low',
    logged_by: 'Dr. V. Sharma (CPCB Officer #402)',
    notes: 'Morning pilgrim gathering influx; stable confluence flow',
    recorded_at: new Date(Date.now() - 3600 * 1000 * 3).toISOString()
  },
  {
    id: 'log-102',
    station_name: 'Varanasi Dashashwamedh Ghat',
    ph: 7.8,
    do_level: 5.8,
    temperature: 24.1,
    conductivity: 510,
    orp: 220,
    turbidity: 14.2,
    bod: 4.2,
    wqi: 68.2,
    status: 'Moderate',
    risk_level: 'Moderate',
    logged_by: 'Insp. K. Rao (Officer #118)',
    notes: 'Moderate urban runoff detected near ghat steps',
    recorded_at: new Date(Date.now() - 3600 * 1000 * 8).toISOString()
  },
  {
    id: 'log-103',
    station_name: 'Haridwar Har Ki Pauri',
    ph: 7.2,
    do_level: 8.9,
    temperature: 18.2,
    conductivity: 210,
    orp: 360,
    turbidity: 3.8,
    bod: 1.4,
    wqi: 89.5,
    status: 'Good',
    risk_level: 'Low',
    logged_by: 'S. Negi (Hydrologist #009)',
    notes: 'Pristine Himalayan melt flow; high aeration index',
    recorded_at: new Date(Date.now() - 3600 * 1000 * 16).toISOString()
  },
  {
    id: 'log-104',
    station_name: 'Kanpur Jajmau Industrial Zone',
    ph: 8.6,
    do_level: 3.1,
    temperature: 26.8,
    conductivity: 980,
    orp: 110,
    turbidity: 32.5,
    bod: 9.6,
    wqi: 42.1,
    status: 'Poor',
    risk_level: 'Critical',
    logged_by: 'IoT Station Sensor #KJ-04',
    notes: 'High organic and saline effluent breach detected downstream',
    recorded_at: new Date(Date.now() - 3600 * 1000 * 22).toISOString()
  },
  {
    id: 'log-105',
    station_name: 'Rishikesh Laxman Jhula Stream',
    ph: 7.1,
    do_level: 9.4,
    temperature: 16.5,
    conductivity: 175,
    orp: 390,
    turbidity: 2.1,
    bod: 0.9,
    wqi: 94.2,
    status: 'Excellent',
    risk_level: 'Low',
    logged_by: 'Officer R. Rawat (#002)',
    notes: 'Optimal pristine water parameters compliant with Class A standard',
    recorded_at: new Date(Date.now() - 3600 * 1000 * 30).toISOString()
  }
];

export function getSupabaseConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CONFIG);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse Supabase config', e);
  }
  const envUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || '';
  const envKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || '';
  return {
    url: envUrl,
    anonKey: envKey,
    isConnected: Boolean(envUrl && envKey)
  };
}

export function saveSupabaseConfig(config) {
  localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
}

export function getSupabaseClient() {
  const config = getSupabaseConfig();
  if (config.url && config.anonKey) {
    try {
      return createClient(config.url, config.anonKey);
    } catch (err) {
      console.warn('Could not initialize Supabase client:', err);
    }
  }
  return null;
}

// ==========================================================
// Unified Storage API (Supabase or LocalStorage Fallback)
// ==========================================================

export async function fetchTelemetryLogs() {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('water_telemetry')
        .select('*')
        .order('recorded_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return { data, source: 'supabase' };
      }
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local store:', err);
    }
  }

  // Local fallback
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (stored) {
      return { data: JSON.parse(stored), source: 'local' };
    }
    // Seed initial
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(INITIAL_SEED_LOGS));
    return { data: INITIAL_SEED_LOGS, source: 'local' };
  } catch (e) {
    return { data: INITIAL_SEED_LOGS, source: 'local' };
  }
}

export async function insertTelemetryRecord(newRecord) {
  const recordWithMeta = {
    id: `log-${Date.now()}`,
    recorded_at: new Date().toISOString(),
    ...newRecord
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('water_telemetry')
        .insert([recordWithMeta])
        .select();

      if (!error && data) {
        // Also mirror locally
        mirrorToLocal(data[0] || recordWithMeta);
        return { data: data[0] || recordWithMeta, source: 'supabase' };
      }
    } catch (err) {
      console.warn('Supabase insert failed, saving to local store:', err);
    }
  }

  // Local storage save
  const updated = mirrorToLocal(recordWithMeta);
  return { data: recordWithMeta, source: 'local', allLogs: updated };
}

function mirrorToLocal(record) {
  try {
    const existingRaw = localStorage.getItem(STORAGE_KEYS.LOGS);
    const logs = existingRaw ? JSON.parse(existingRaw) : [...INITIAL_SEED_LOGS];
    const updated = [record, ...logs.filter(l => l.id !== record.id)];
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('LocalStorage write error', e);
    return [record];
  }
}

export async function deleteTelemetryRecord(recordId) {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('water_telemetry').delete().eq('id', recordId);
    } catch (e) {
      console.warn('Supabase delete error', e);
    }
  }

  try {
    const existingRaw = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (existingRaw) {
      const logs = JSON.parse(existingRaw).filter(l => l.id !== recordId);
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
      return logs;
    }
  } catch (e) {
    console.error('LocalStorage delete error', e);
  }
  return [];
}

import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Legend,
  LineChart,
  Line,
  Cell
} from 'recharts';
import { 
  Activity, 
  Waves, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck,
  Droplets
} from 'lucide-react';
import { GANGA_STATIONS } from '../../lib/sampleStations';

export default function StationAnalytics({ logs }) {
  // Aggregate KPIs
  const totalLogs = logs.length;
  const avgWQI = totalLogs > 0 
    ? Math.round((logs.reduce((acc, curr) => acc + (parseFloat(curr.wqi) || 0), 0) / totalLogs) * 10) / 10 
    : 75;
  const safeCount = logs.filter(l => (parseFloat(l.wqi) || 0) >= 70).length;
  const safePercent = totalLogs > 0 ? Math.round((safeCount / totalLogs) * 100) : 80;
  const criticalCount = logs.filter(l => l.risk_level === 'Critical' || (parseFloat(l.wqi) || 0) < 45).length;

  // Station comparison data
  const stationAggregates = GANGA_STATIONS.map(st => {
    const stationLogs = logs.filter(l => l.station_name === st.name);
    const stationWQI = stationLogs.length > 0 
      ? Math.round(stationLogs.reduce((acc, c) => acc + (parseFloat(c.wqi) || 0), 0) / stationLogs.length)
      : (st.name.includes('Rishikesh') ? 94 : st.name.includes('Kanpur') ? 42 : st.name.includes('Haridwar') ? 89 : 76);
    
    return {
      name: st.name.split(' ')[0], // short name
      fullName: st.name,
      wqi: stationWQI,
      do_level: st.presetData.do_level,
      bod: st.presetData.bod,
      status: st.status
    };
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      
      {/* 4 Overview KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-slate-900/80 border border-slate-800 flex items-center gap-3.5 sm:gap-4">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shrink-0">
            <Droplets className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-white font-mono">{totalLogs}</div>
            <div className="text-[11px] sm:text-xs text-slate-400 font-medium">Telemetry Logs Stored</div>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-slate-900/80 border border-slate-800 flex items-center gap-3.5 sm:gap-4">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">{avgWQI} / 100</div>
            <div className="text-[11px] sm:text-xs text-slate-400 font-medium">Ganga Average WQI</div>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-slate-900/80 border border-slate-800 flex items-center gap-3.5 sm:gap-4">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-blue-400 font-mono">{safePercent}%</div>
            <div className="text-[11px] sm:text-xs text-slate-400 font-medium">Bathing Safety Index</div>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-slate-900/80 border border-slate-800 flex items-center gap-3.5 sm:gap-4">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-rose-400 font-mono">{criticalCount}</div>
            <div className="text-[11px] sm:text-xs text-slate-400 font-medium">Active High/Critical Risks</div>
          </div>
        </div>

      </div>

      {/* Comparative Graphs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        
        {/* WQI Comparison Across Sangam Sectors */}
        <div className="glass-panel p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-cyan-500/20">
          <div className="mb-5 sm:mb-6">
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Waves className="w-4 h-4 text-cyan-400" />
              Triveni Sangam Sector Comparison (Confluence & Inflow)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparison across Central Buoy, Yamuna Inflow, Upper Ganga, and Kila Ghat
            </p>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stationAggregates} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                    borderColor: '#0284c7', 
                    borderRadius: '16px',
                    fontSize: '12px'
                  }} 
                  formatter={(val, name, item) => [`${val} / 100`, item.payload.fullName]}
                />
                <Bar dataKey="wqi" name="Water Quality Index" radius={[6, 6, 0, 0]}>
                  {stationAggregates.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.wqi >= 80 ? '#10b981' : entry.wqi >= 60 ? '#00f2fe' : entry.wqi >= 45 ? '#f59e0b' : '#f43f5e'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inverse Correlation: DO vs BOD */}
        <div className="glass-panel p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-cyan-500/20">
          <div className="mb-5 sm:mb-6">
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Oxygen Aeration vs. Organic Decomposition
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Classic inverse dynamic: High BOD organic sewage depresses Dissolved Oxygen
            </p>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stationAggregates} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                    borderColor: '#0284c7', 
                    borderRadius: '16px',
                    fontSize: '12px'
                  }} 
                />
                <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '8px' }} />
                <Line type="monotone" dataKey="do_level" stroke="#10b981" strokeWidth={3} name="DO (mg/L)" />
                <Line type="monotone" dataKey="bod" stroke="#f43f5e" strokeWidth={3} name="BOD (mg/L)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}

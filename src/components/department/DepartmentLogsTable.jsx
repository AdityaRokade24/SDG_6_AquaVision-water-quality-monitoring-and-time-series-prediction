import React, { useState } from 'react';
import { 
  Database, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle,
  RefreshCw,
  User,
  FileText
} from 'lucide-react';
import { deleteTelemetryRecord } from '../../lib/supabase';

export default function DepartmentLogsTable({ logs, setLogs, onRefresh, dataSource }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredLogs = logs.filter(item => {
    const matchesSearch = 
      (item.station_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.logged_by || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.notes || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || item.status?.toUpperCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to remove this telemetry log?')) {
      await deleteTelemetryRecord(id);
      setLogs(prev => prev.filter(l => l.id !== id));
    }
  };

  const exportAllCSV = () => {
    if (filteredLogs.length === 0) return;
    const headers = ['ID', 'Station', 'Recorded_At', 'WQI', 'Status', 'Risk_Level', 'pH', 'DO_mgL', 'Temp_C', 'BOD_mgL', 'Conductivity', 'Turbidity', 'ORP', 'Logged_By', 'Notes'];
    const rows = filteredLogs.map(l => [
      `"${l.id}"`,
      `"${l.station_name}"`,
      `"${l.recorded_at}"`,
      l.wqi,
      `"${l.status}"`,
      `"${l.risk_level || 'Low'}"`,
      l.ph,
      l.do_level,
      l.temperature,
      l.bod,
      l.conductivity,
      l.turbidity,
      l.orp,
      `"${l.logged_by || 'Officer'}"`,
      `"${(l.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encoded);
    link.setAttribute("download", `Department_Water_Telemetry_Logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="glass-panel p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-cyan-500/20 shadow-xl">
      
      {/* Table Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 sm:pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-cyan-400 shrink-0" />
              Prayagraj Triveni Sangam Telemetry Records
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-cyan-300 border border-slate-700 uppercase">
              Storage: {dataSource === 'supabase' ? 'Supabase Cloud' : 'Local Storage'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Historical confluence records, citizen testing entries, and CPCB official sensor readings
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={onRefresh}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 transition active:scale-95"
            title="Refresh database records"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={exportAllCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition border border-slate-700 active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 my-4 sm:my-5">
        <div className="relative w-full sm:w-64 md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search stations, officers, notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
          />
        </div>

        {/* Status Category Tabs (Horizontal Scrollable on Mobile) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none w-full sm:w-auto -mx-1 px-1 sm:mx-0 sm:px-0">
          {['ALL', 'EXCELLENT', 'GOOD', 'MODERATE', 'POOR', 'CRITICAL'].map((cat) => (
            <button
              key={cat}
              onClick={() => setStatusFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold tracking-wide transition whitespace-nowrap shrink-0 ${
                statusFilter === cat
                  ? 'bg-cyan-500 text-white shadow'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop View: Full Data Table (Hidden on Mobile < sm) */}
      <div className="hidden sm:block overflow-x-auto rounded-2xl border border-slate-800/80 bg-slate-950/40">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-800">
            <tr>
              <th className="px-4 py-3">Station & Timestamp</th>
              <th className="px-3 py-3">WQI Score</th>
              <th className="px-3 py-3">CPCB Status</th>
              <th className="px-3 py-3">pH</th>
              <th className="px-3 py-3">DO (mg/L)</th>
              <th className="px-3 py-3">BOD (mg/L)</th>
              <th className="px-3 py-3">Temp (°C)</th>
              <th className="px-3 py-3">Logged By</th>
              <th className="px-3 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan="9" className="px-4 py-8 text-center text-slate-400">
                  No telemetry records matching your filter. Type or upload data above to add entries.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => {
                const recordedDate = log.recorded_at ? new Date(log.recorded_at) : new Date();
                const isPoor = log.status === 'Poor' || log.status === 'Critical';
                const isExc = log.status === 'Excellent';

                return (
                  <tr key={log.id} className="hover:bg-slate-900/40 transition">
                    <td className="px-4 py-3">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                        <span className="truncate max-w-[180px]">{log.station_name}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{recordedDate.toLocaleDateString()} {recordedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </td>

                    <td className="px-3 py-3">
                      <span className={`font-mono font-bold text-sm ${
                        isExc ? 'text-emerald-400' : isPoor ? 'text-rose-400' : 'text-cyan-300'
                      }`}>
                        {log.wqi}
                      </span>
                    </td>

                    <td className="px-3 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        log.status === 'Excellent' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' :
                        log.status === 'Good' ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30' :
                        log.status === 'Moderate' ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' :
                        'bg-rose-500/10 text-rose-300 border-rose-500/30'
                      }`}>
                        {log.status}
                      </span>
                    </td>

                    <td className="px-3 py-3 font-mono text-slate-200">{log.ph}</td>
                    <td className="px-3 py-3 font-mono text-slate-200">{log.do_level}</td>
                    <td className="px-3 py-3 font-mono text-slate-200">{log.bod}</td>
                    <td className="px-3 py-3 font-mono text-slate-200">{log.temperature}°C</td>

                    <td className="px-3 py-3">
                      <div className="text-slate-300 truncate max-w-[120px]">{log.logged_by || 'Officer'}</div>
                    </td>

                    <td className="px-3 py-3 text-right">
                      <button
                        onClick={() => handleDelete(log.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition"
                        title="Delete log record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile View: High-Density Responsive Card Stack (Shown on Mobile < sm) */}
      <div className="sm:hidden space-y-3">
        {filteredLogs.length === 0 ? (
          <div className="p-6 rounded-2xl bg-slate-950/40 border border-slate-800 text-center text-xs text-slate-400">
            No telemetry records matching your filter.
          </div>
        ) : (
          filteredLogs.map((log) => {
            const recordedDate = log.recorded_at ? new Date(log.recorded_at) : new Date();
            const isPoor = log.status === 'Poor' || log.status === 'Critical';
            const isExc = log.status === 'Excellent';

            return (
              <div 
                key={log.id} 
                className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3 hover:border-cyan-500/30 transition"
              >
                {/* Card Header: Station & WQI Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-bold text-white text-sm flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{log.station_name}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{recordedDate.toLocaleDateString()} at {recordedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className={`font-mono font-extrabold text-base ${
                      isExc ? 'text-emerald-400' : isPoor ? 'text-rose-400' : 'text-cyan-300'
                    }`}>
                      WQI {log.wqi}
                    </div>
                    <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                      log.status === 'Excellent' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' :
                      log.status === 'Good' ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30' :
                      log.status === 'Moderate' ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' :
                      'bg-rose-500/10 text-rose-300 border-rose-500/30'
                    }`}>
                      {log.status}
                    </span>
                  </div>
                </div>

                {/* Parameter Matrix 4-grid */}
                <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-slate-800/80 text-center">
                  <div className="p-1.5 rounded-lg bg-slate-900/60 border border-slate-800">
                    <div className="text-[9px] text-slate-400">pH</div>
                    <div className="text-xs font-mono font-bold text-slate-200 mt-0.5">{log.ph}</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-slate-900/60 border border-slate-800">
                    <div className="text-[9px] text-slate-400">DO</div>
                    <div className="text-xs font-mono font-bold text-cyan-300 mt-0.5">{log.do_level}</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-slate-900/60 border border-slate-800">
                    <div className="text-[9px] text-slate-400">BOD</div>
                    <div className="text-xs font-mono font-bold text-slate-200 mt-0.5">{log.bod}</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-slate-900/60 border border-slate-800">
                    <div className="text-[9px] text-slate-400">Temp</div>
                    <div className="text-xs font-mono font-bold text-slate-200 mt-0.5">{log.temperature}°C</div>
                  </div>
                </div>

                {/* Footer: Logged By & Delete */}
                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                  <div className="flex items-center gap-1 truncate max-w-[220px]">
                    <User className="w-3 h-3 text-slate-500 shrink-0" />
                    <span className="truncate">{log.logged_by || 'Officer'}</span>
                  </div>

                  <button
                    onClick={() => handleDelete(log.id)}
                    className="p-1 text-slate-500 hover:text-rose-400 active:scale-95 transition"
                    title="Delete log record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {log.notes && (
                  <div className="text-[10px] text-slate-400 italic bg-slate-900/40 p-2 rounded-lg border border-slate-800/50">
                    "{log.notes}"
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}

import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Save, 
  Download, 
  Sparkles, 
  Droplet,
  Calendar,
  Building2,
  Share2
} from 'lucide-react';
import { calculateWQI, PARAM_STANDARDS } from '../../lib/wqiEngine';
import { forecast24Hours, forecast7Days, evaluateRiskAdvisory } from '../../lib/forecastingEngine';
import { insertTelemetryRecord } from '../../lib/supabase';
import confetti from 'canvas-confetti';

export default function TodaysResultModal({ isOpen, onClose, telemetryData, onRecordSaved }) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Compute evaluation
  const analysis = telemetryData ? calculateWQI(telemetryData) : null;
  const forecast24h = telemetryData ? forecast24Hours(telemetryData) : [];
  const forecast7d = telemetryData ? forecast7Days(telemetryData) : [];
  const advisory = (telemetryData && analysis) ? evaluateRiskAdvisory(
    { ...telemetryData, wqi: analysis.wqi },
    forecast24h,
    forecast7d
  ) : null;

  const wqi = analysis?.wqi ?? 0;

  // Trigger celebratory confetti if water quality is high
  React.useEffect(() => {
    if (isOpen && wqi >= 80) {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.5 } });
    }
  }, [isOpen, wqi]);

  if (!isOpen || !telemetryData || !analysis || !advisory) return null;

  const { status, classCode, color, description, violations } = analysis;

  const handleSaveToCloud = async () => {
    setIsSaving(true);
    try {
      const record = {
        station_name: telemetryData.station_name || 'Today Monitoring Station',
        ph: parseFloat(telemetryData.ph),
        do_level: parseFloat(telemetryData.do_level),
        temperature: parseFloat(telemetryData.temperature),
        conductivity: parseFloat(telemetryData.conductivity),
        orp: parseFloat(telemetryData.orp),
        turbidity: parseFloat(telemetryData.turbidity),
        bod: parseFloat(telemetryData.bod),
        wqi: analysis.wqi,
        status: analysis.status,
        risk_level: advisory.overallRisk,
        logged_by: telemetryData.logged_by || 'Field Hydrologist',
        notes: telemetryData.notes || "Today's Field Telemetry Ingestion"
      };

      const result = await insertTelemetryRecord(record);
      setIsSaving(false);
      setSaveSuccess(true);
      if (onRecordSaved) onRecordSaved(result.data);
    } catch (e) {
      console.error(e);
      setIsSaving(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Station', 'Recorded_At', 'WQI', 'Status', 'Risk_Level', 'pH', 'DO_mgL', 'Temp_C', 'Cond_uScm', 'BOD_mgL', 'Turbidity_NTU', 'ORP_mV'];
    const row = [
      `"${telemetryData.station_name || 'River Station'}"`,
      new Date().toISOString(),
      analysis.wqi,
      `"${analysis.status}"`,
      `"${advisory.overallRisk}"`,
      telemetryData.ph,
      telemetryData.do_level,
      telemetryData.temperature,
      telemetryData.conductivity,
      telemetryData.bod,
      telemetryData.turbidity,
      telemetryData.orp
    ];
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), row.join(',')].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CPCB_Water_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-cyan-500/40 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl shadow-cyan-950/70 my-auto max-h-[92vh] overflow-y-auto">
        
        {/* Ambient Glow */}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3.5 sm:pb-4 border-b border-slate-800 relative z-10">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shrink-0">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-xl font-extrabold text-white tracking-tight">
                  Today's Water Quality Result
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 uppercase">
                  Live Analysis
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 truncate max-w-[240px] sm:max-w-md">
                {telemetryData.station_name || 'River Ganga Station'} • Logged by {telemetryData.logged_by || 'Field Officer'}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0 active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Score & Status Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 my-5 sm:my-6">
          
          {/* Dial / Score */}
          <div className="p-4 sm:p-6 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col items-center justify-center text-center">
            <div className="text-[10px] sm:text-[11px] uppercase font-bold text-slate-400 tracking-wider">
              Water Quality Index
            </div>
            <div 
              className="text-4xl sm:text-5xl font-mono font-black my-1 sm:my-2"
              style={{ color }}
            >
              {wqi}
            </div>
            <span 
              className="px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border"
              style={{ color, borderColor: `${color}60`, backgroundColor: `${color}15` }}
            >
              {status}
            </span>
            <span className="text-[10px] text-slate-400 mt-2 font-medium">
              {classCode}
            </span>
          </div>

          {/* Compliance & Bathing Suitability */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                  Pilgrim Snan Suitability
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-extrabold uppercase border ${
                  wqi >= 70 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}>
                  {wqi >= 70 ? 'Optimal for Snan' : 'Bathing Caution'}
                </span>
              </div>
              <div className="text-xs sm:text-sm font-bold text-white mt-1.5 sm:mt-2">
                {wqi >= 75 ? 'Safe for Sacred Holy Dip' : wqi >= 55 ? 'Requires Ghat Filtration' : 'Hazardous for Bathing'}
              </div>
              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                {description}
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] sm:text-xs">
              <span className="text-slate-400">CPCB Hazard Level:</span>
              <span className={`font-bold ${
                advisory.overallRisk === 'Critical' ? 'text-rose-400' :
                advisory.overallRisk === 'High' ? 'text-orange-400' :
                advisory.overallRisk === 'Moderate' ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {advisory.overallRisk} Risk
              </span>
            </div>
          </div>

          {/* 7-Day Trend Outlook & Confluence Hours */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-[10px] sm:text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                7-Day Prognosis & Snan Window
              </span>
              <div className="text-xs sm:text-sm font-bold text-cyan-300 mt-1.5 sm:mt-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
                <span>Next 7 Days Trend</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                Projected WQI drift: <strong className="text-white">{advisory.wqiTrend7d > 0 ? `+${advisory.wqiTrend7d}` : advisory.wqiTrend7d} pts</strong>.
                Lowest 24h DO: <strong className="text-emerald-300">{advisory.min24hDO} mg/L</strong>.
              </p>
              <div className="mt-2 text-[10px] text-cyan-300 bg-cyan-950/40 p-1.5 rounded-lg border border-cyan-500/20">
                ☀️ <strong>Optimal Snan Hours:</strong> 07:00 AM – 05:30 PM
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
              Validated against CPCB Gazette Class B
            </div>
          </div>

        </div>

        {/* Parameters Grid */}
        <div className="mb-5 sm:mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 sm:mb-3 flex items-center gap-1.5">
            <Droplet className="w-3.5 h-3.5 text-cyan-400" />
            Today's Ingested Physicochemical Parameters
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
            {Object.entries(PARAM_STANDARDS).map(([key, std]) => {
              const val = telemetryData[key];
              const q_i = analysis.subIndices[key] || 0;
              return (
                <div key={key} className="p-2.5 sm:p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 truncate">{std.name}</div>
                  <div className="text-xs sm:text-sm font-mono font-bold text-cyan-300 mt-0.5">
                    {val} <span className="text-[10px] text-slate-500 font-normal">{std.unit}</span>
                  </div>
                  <div className="text-[9px] text-slate-400 mt-1 flex justify-between">
                    <span>Score: {q_i}/100</span>
                    <span className={q_i >= 70 ? 'text-emerald-400' : 'text-amber-400'}>
                      {q_i >= 70 ? 'Optimal' : 'Caution'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Violations notice if any */}
        {violations && violations.length > 0 && (
          <div className="mb-5 p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-200 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white">Alert:</span> {violations.map(v => `${v.name} (${v.value} vs limit ${v.limit})`).join(', ')}
            </div>
          </div>
        )}

        {/* Action Buttons: Save to Supabase Cloud & Export */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={handleExportCSV}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition flex items-center justify-center gap-2 active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download CPCB Lab Report (CSV)</span>
          </button>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition text-center"
            >
              Close
            </button>

            <button
              id="modal-save-to-dept-btn"
              onClick={handleSaveToCloud}
              disabled={isSaving || saveSuccess}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg active:scale-95 ${
                saveSuccess
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-500/25'
              }`}
            >
              {isSaving ? (
                <span>Saving to Database...</span>
              ) : saveSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                  <span>Stored in Sangam Records</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Store in Sangam Records</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

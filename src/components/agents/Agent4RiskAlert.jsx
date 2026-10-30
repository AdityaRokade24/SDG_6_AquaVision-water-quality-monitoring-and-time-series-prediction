import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle2, 
  Save, 
  RotateCcw, 
  ExternalLink,
  Waves
} from 'lucide-react';
import { evaluateRiskAdvisory, forecast24Hours, forecast7Days } from '../../lib/forecastingEngine';
import { calculateWQI } from '../../lib/wqiEngine';
import { insertTelemetryRecord } from '../../lib/supabase';

export default function Agent4RiskAlert({ 
  cleanedData, 
  analysisResult, 
  predictionData, 
  onResetPipeline,
  onGoToDepartment 
}) {
  const [advisory, setAdvisory] = useState(null);
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle' | 'saving' | 'saved' | 'error'

  useEffect(() => {
    const data = cleanedData || {};
    const analysis = analysisResult || calculateWQI(data);
    const hourly24 = predictionData?.hourly24 || forecast24Hours(data);
    const daily7d = predictionData?.daily7d || forecast7Days(data);

    const adv = evaluateRiskAdvisory(
      { ...data, wqi: analysis.wqi },
      hourly24,
      daily7d
    );
    setAdvisory(adv);
  }, [cleanedData, analysisResult, predictionData]);

  if (!advisory) {
    return (
      <div className="glass-panel p-8 sm:p-12 rounded-2xl sm:rounded-3xl text-center">
        <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto animate-spin mb-3" />
        <p className="text-xs sm:text-sm text-slate-300">Synthesizing Risk Matrix & Remediation Actions...</p>
      </div>
    );
  }

  const { overallRisk, badgeColor, alerts, mitigations, min24hDO, min7dWQI, wqiTrend7d } = advisory;

  const handleSaveToDepartment = async () => {
    setSaveStatus('saving');
    try {
      const data = cleanedData || {};
      const currentWqi = analysisResult?.wqi ?? advisory.currentWQI;
      const currentStatus = analysisResult?.status ?? 'Adequate';

      const newRecord = {
        station_name: data.station_name || 'River Ganga Station',
        ph: data.ph,
        do_level: data.do_level,
        temperature: data.temperature,
        conductivity: data.conductivity,
        orp: data.orp,
        turbidity: data.turbidity,
        bod: data.bod,
        wqi: currentWqi,
        status: currentStatus,
        risk_level: overallRisk,
        logged_by: 'AI Multi-Agent Pipeline',
        notes: `Predicted min 24h DO: ${min24hDO} mg/L, 7d WQI trend: ${wqiTrend7d > 0 ? '+' : ''}${wqiTrend7d}`
      };

      await insertTelemetryRecord(newRecord);
      setSaveStatus('saved');
    } catch (err) {
      console.error(err);
      setSaveStatus('error');
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="glass-panel p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-cyan-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-400/30 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                Agent 4: Autonomous Risk Assessment & Alerts
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Decision Support Protocol
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Risk Advisory & Remediation Directives
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Synthesizes physical anomalies, ML 24h diurnal DO dips, and longitudinal CPCB criteria into actionable mitigation orders.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full lg:w-auto shrink-0">
            <button
              id="save-to-records-btn"
              onClick={handleSaveToDepartment}
              disabled={saveStatus === 'saving' || saveStatus === 'saved'}
              className={`px-5 py-2.5 rounded-xl sm:rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg active:scale-95 ${
                saveStatus === 'saved'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-500/25'
              }`}
            >
              {saveStatus === 'saving' ? (
                <span>Persisting to Database...</span>
              ) : saveStatus === 'saved' ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                  <span>Saved in Sangam Database</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save to Sangam Records</span>
                </>
              )}
            </button>

            <button
              onClick={onResetPipeline}
              className="px-4 py-2.5 rounded-xl sm:rounded-2xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center justify-center gap-1.5 active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Pipeline</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Risk Classification & Early Warnings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        
        {/* Overall Risk Scorecard */}
        <div className="glass-panel p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-cyan-500/20 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Overall Ecological Risk Level
            </span>
            
            <div className="mt-4 flex items-center gap-4">
              <div 
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-white font-extrabold shadow-lg shrink-0"
                style={{ backgroundColor: `${badgeColor}30`, border: `2px solid ${badgeColor}`, color: badgeColor }}
              >
                <ShieldAlert className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: badgeColor }}>
                  {overallRisk} Risk
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  CPCB Hazard Matrix Compliance
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="space-y-3 mt-6 pt-6 border-t border-slate-800">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Current WQI:</span>
                <span className="font-mono font-bold text-white">{analysisResult?.wqi ?? advisory?.currentWQI}/100</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Lowest 24h DO Forecast:</span>
                <span className={`font-mono font-bold ${min24hDO < 4.0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {min24hDO} mg/L
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">7-Day WQI Trajectory:</span>
                <span className={`font-mono font-bold ${wqiTrend7d >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {wqiTrend7d > 0 ? `+${wqiTrend7d}` : wqiTrend7d} points
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onGoToDepartment}
            className="w-full mt-6 py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-cyan-300 transition flex items-center justify-center gap-2 active:scale-95"
          >
            <Waves className="w-4 h-4 text-cyan-400" />
            <span>View Sangam Water Records & Analytics</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Early Warning Feed & Directives */}
        <div className="lg:col-span-2 space-y-5 sm:space-y-6">
          
          {/* Active Alerts List */}
          <div className="glass-panel p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-cyan-500/20">
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Automated Early Warning Advisories ({alerts.length})
            </h3>

            <div className="space-y-3">
              {alerts.map((al, idx) => (
                <div 
                  key={idx}
                  className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border flex items-start gap-3 transition ${
                    al.severity === 'CRITICAL' ? 'bg-rose-950/40 border-rose-500/40 text-rose-200' :
                    al.severity === 'WARNING' ? 'bg-amber-950/40 border-amber-500/40 text-amber-200' :
                    al.severity === 'HIGH' ? 'bg-orange-950/40 border-orange-500/40 text-orange-200' :
                    'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                  }`}
                >
                  <AlertTriangle className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-0.5 ${
                    al.severity === 'CRITICAL' ? 'text-rose-400' :
                    al.severity === 'WARNING' ? 'text-amber-400' :
                    al.severity === 'HIGH' ? 'text-orange-400' :
                    'text-emerald-400'
                  }`} />
                  <div>
                    <div className="text-xs font-bold text-white">{al.title}</div>
                    <div className="text-[11px] text-slate-300 mt-1 leading-relaxed">{al.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Mitigation Directives */}
          <div className="glass-panel p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-cyan-500/20">
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Recommended Field Actions & Remediation Protocols
            </h3>

            <div className="space-y-3">
              {mitigations.map((m, idx) => (
                <div key={idx} className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0 ${
                      m.priority.includes('P1') ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                      m.priority.includes('P2') ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {m.priority}
                    </span>
                    <span className="text-xs text-slate-200 font-medium leading-snug">
                      {m.action}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

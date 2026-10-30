import React, { useEffect } from 'react';
import { 
  Activity, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle2, 
  Info,
  TrendingDown,
  Droplet
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { calculateWQI, PARAM_STANDARDS } from '../../lib/wqiEngine';

export default function Agent2Analysis({ 
  cleanedData, 
  analysisResult, 
  setAnalysisResult, 
  onComplete 
}) {
  useEffect(() => {
    if (cleanedData) {
      const result = calculateWQI(cleanedData);
      setAnalysisResult(result);

      if (result.wqi >= 85) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#00f2fe', '#10b981', '#38bdf8']
        });
      }
    }
  }, [cleanedData]);

  if (!analysisResult) {
    return (
      <div className="glass-panel p-8 sm:p-12 rounded-2xl sm:rounded-3xl text-center">
        <Activity className="w-8 h-8 text-cyan-400 mx-auto animate-spin mb-3" />
        <p className="text-xs sm:text-sm text-slate-300">Computing CPCB Water Quality Index...</p>
      </div>
    );
  }

  const { wqi, status, classCode, color, description, subIndices, violations } = analysisResult;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="glass-panel p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-cyan-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                Agent 2: Diagnostic Evaluation
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Station: {cleanedData.station_name || 'Prayagraj Triveni Sangam'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Prayagraj Sangam WQI & Sacred Bathing Analysis
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Evaluated against CPCB Class B Outdoor Bathing & WHO river criteria across 7 weighted physicochemical parameters.
            </p>
          </div>

          <button
            id="proceed-to-agent-3-btn"
            onClick={onComplete}
            className="w-full sm:w-auto px-6 py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 shadow-lg shadow-emerald-500/25 transition flex items-center justify-center gap-2 group shrink-0 active:scale-95"
          >
            <span>Proceed to Agent 3: Prediction</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Main Scorecard & Gauge Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        
        {/* Left: Animated Radial Dial Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-cyan-500/20 flex flex-col items-center justify-center text-center relative">
          <div className="relative flex items-center justify-center w-44 h-44 sm:w-56 sm:h-56">
            {/* SVG Radial Meter */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="48"
                stroke="rgba(30, 41, 59, 0.8)"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="60"
                cy="60"
                r="48"
                stroke={color}
                strokeWidth="9"
                strokeDasharray={2 * Math.PI * 48}
                strokeDashoffset={2 * Math.PI * 48 * (1 - wqi / 100)}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-1000 ease-out"
                style={{ filter: `drop-shadow(0 0 12px ${color}80)` }}
              />
            </svg>

            {/* Inner Content */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl sm:text-5xl font-extrabold tracking-tighter text-white font-mono">
                {wqi}
              </span>
              <span className="text-[10px] sm:text-xs uppercase font-bold tracking-widest text-slate-400 mt-1">
                WQI SCORE
              </span>
              <span 
                className="mt-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wide border"
                style={{ color, borderColor: `${color}60`, backgroundColor: `${color}20` }}
              >
                {status}
              </span>
            </div>
          </div>

          <div className="mt-4 text-center">
            <div className="text-xs sm:text-sm font-bold text-slate-200">{classCode}</div>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-1 max-w-xs">{description}</p>
          </div>
        </div>

        {/* Right: Parameter Breakdown Matrix */}
        <div className="lg:col-span-2 glass-panel p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-cyan-500/20">
          <div className="flex items-center justify-between mb-5 sm:mb-6">
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Droplet className="w-4 h-4 text-cyan-400" />
              Physicochemical Sub-Index Breakdown
            </h3>
            <span className="text-[11px] sm:text-xs text-slate-400">Target Score: 100</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {Object.entries(PARAM_STANDARDS).map(([key, std]) => {
              const val = cleanedData[key];
              const q_i = subIndices?.[key] || 0;
              const isWarning = q_i < 65;
              const isCritical = q_i < 40;

              return (
                <div 
                  key={key} 
                  className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/30 transition"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-300">{std.name}</span>
                    <span className="font-mono font-bold text-cyan-400">
                      {val} {std.unit}
                    </span>
                  </div>

                  {/* Sub-index Progress Bar */}
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden my-2">
                    <div 
                      className={`h-full rounded-full transition-all duration-700 ${
                        isCritical ? 'bg-rose-500' : isWarning ? 'bg-amber-400' : 'bg-emerald-400'
                      }`}
                      style={{ width: `${Math.min(100, q_i)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Sub-index: <strong className="text-white">{q_i}/100</strong></span>
                    <span className={isCritical ? 'text-rose-400 font-bold' : isWarning ? 'text-amber-400' : 'text-emerald-400'}>
                      {isCritical ? 'Critical Breach' : isWarning ? 'Sub-optimal' : 'Safe Compliance'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Threshold Violations Notice */}
          {violations && violations.length > 0 && (
            <div className="mt-5 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-rose-950/30 border border-rose-500/30 flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-rose-300">
                  {violations.length} CPCB Threshold Violation(s) Flagged
                </h4>
                <ul className="text-[11px] text-slate-300 space-y-1 mt-1 list-disc list-inside">
                  {violations.map((v, idx) => (
                    <li key={idx}>
                      <strong className="text-white">{v.name}:</strong> Recorded {v.value} ({v.limit}) - Severity: {v.severity}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

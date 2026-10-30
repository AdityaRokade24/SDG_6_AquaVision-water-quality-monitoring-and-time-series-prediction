import React, { useState } from 'react';
import { 
  Database, 
  MapPin, 
  Sliders, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Sparkles,
  RefreshCw,
  Cpu,
  Waves,
  Radio
} from 'lucide-react';
import { SANGAM_SECTORS } from '../../lib/sampleStations';
import { PARAM_STANDARDS } from '../../lib/wqiEngine';

export default function Agent1Acquisition({ 
  rawTelemetry, 
  setRawTelemetry, 
  cleanedData, 
  setCleanedData, 
  onComplete,
  onTriggerLiveApi
}) {
  const [selectedSector, setSelectedSector] = useState(SANGAM_SECTORS[0].name);
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationReport, setValidationReport] = useState(null);

  // Load a sector preset
  const handleSelectSector = (sector) => {
    setSelectedSector(sector.name);
    setRawTelemetry({
      ...sector.presetData,
      station_name: sector.name,
      reach_zone: sector.reach
    });
    setValidationReport(null);
  };

  const handleInputChange = (field, val) => {
    setRawTelemetry(prev => ({
      ...prev,
      [field]: val
    }));
    setValidationReport(null);
  };

  // Run Agent 1 logic
  const handleExecuteAgent1 = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const sanitized = {};
      const anomalies = [];
      let totalParams = 0;
      let validParams = 0;

      for (const [key, std] of Object.entries(PARAM_STANDARDS)) {
        totalParams++;
        const num = parseFloat(rawTelemetry[key]);

        if (isNaN(num)) {
          sanitized[key] = std.ideal;
          anomalies.push({ param: std.name, issue: 'Missing or non-numeric reading. Imputed with standard Sangam baseline.' });
        } else {
          let clamped = num;
          if (key === 'ph' && (num < 0 || num > 14)) {
            clamped = Math.min(14, Math.max(0, num));
            anomalies.push({ param: 'pH Level', issue: `Sensor reading ${num} outside physical scale (0-14). Clamped to ${clamped}.` });
          } else if (key === 'do_level' && num < 0) {
            clamped = 0;
            anomalies.push({ param: 'DO', issue: 'Negative DO reading clamped to 0 mg/L.' });
          } else {
            validParams++;
          }
          sanitized[key] = Math.round(clamped * 100) / 100;
        }
      }

      sanitized.station_name = rawTelemetry.station_name || 'Prayagraj Triveni Sangam';
      sanitized.processed_at = new Date().toISOString();
      const confidence = Math.round((validParams / totalParams) * 100);

      const report = {
        confidenceScore: confidence,
        anomalies,
        isClean: anomalies.length === 0,
        telemetryVector: sanitized
      };

      setValidationReport(report);
      setCleanedData(sanitized);
      setIsProcessing(false);
    }, 500);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Visual Hero Banner: Prayagraj Triveni Sangam Sunrise */}
      <div className="relative rounded-3xl overflow-hidden border border-cyan-500/30 shadow-2xl shadow-cyan-950/40 group">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#030712] via-[#030712]/50 to-transparent" />
        <img 
          src="/assets/ganga_river_hero.jpg" 
          alt="Prayagraj Triveni Sangam Confluence at Sunrise" 
          className="w-full h-60 sm:h-80 object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-95"
        />
        
        <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 backdrop-blur-md flex items-center gap-1.5">
                <Waves className="w-3.5 h-3.5 text-cyan-400" />
                Prayagraj Triveni Sangam IoT Network
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Ganga & Yamuna Confluence
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Agent 1: Sangam Telemetry Acquisition & Preprocessing
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Monitors live water parameters across sacred bathing ghats and floating buoys at Prayagraj Triveni Sangam. Open for everyone—pilgrims, citizens, and scientists.
            </p>
          </div>

          <button
            id="hero-live-sangam-wqi-btn"
            onClick={onTriggerLiveApi}
            className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-500/25 to-blue-500/25 border border-cyan-400/50 hover:border-cyan-300 backdrop-blur-md flex items-center gap-3 shrink-0 shadow-lg shadow-cyan-500/20 group transition hover:scale-105 active:scale-95"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/30 flex items-center justify-center text-cyan-300 group-hover:scale-110 transition-transform">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div className="text-left">
              <div className="text-[10px] uppercase font-bold text-cyan-300 tracking-wider">Instant 1-Click Live Scan</div>
              <div className="text-xs font-black text-white">Fetch Today's Sangam WQI</div>
            </div>
          </button>
        </div>
      </div>

      {/* Raw Sensor Inputs Grid */}
      <div className="glass-panel p-6 rounded-3xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Sangam Water Physicochemical Sensors
            </h3>
            <p className="text-xs text-slate-400">
              Adjust any parameter to evaluate simulated runoff, pilgrimage surges, or seasonal shifts
            </p>
          </div>
          
          <button
            onClick={() => handleSelectSector(SANGAM_SECTORS[0])}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs text-slate-300 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Sangam Baseline</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* pH Input */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/40 transition">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-200">pH Level</label>
              <span className="text-[11px] text-cyan-400 font-mono font-bold">{rawTelemetry.ph}</span>
            </div>
            <input
              type="range"
              min="0"
              max="14"
              step="0.1"
              value={rawTelemetry.ph}
              onChange={(e) => handleInputChange('ph', parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>0</span>
              <span className="text-emerald-400 font-bold">Ideal (7.0 - 7.5)</span>
              <span>14</span>
            </div>
          </div>

          {/* Dissolved Oxygen (DO) */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/40 transition">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-200">Dissolved Oxygen (DO)</label>
              <span className="text-[11px] text-cyan-400 font-mono font-bold">{rawTelemetry.do_level} mg/L</span>
            </div>
            <input
              type="range"
              min="0"
              max="15"
              step="0.1"
              value={rawTelemetry.do_level}
              onChange={(e) => handleInputChange('do_level', parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span className="text-rose-400">Hypoxic (&lt;4)</span>
              <span className="text-emerald-400 font-bold">Bathing (&gt;5.0)</span>
              <span>15 mg/L</span>
            </div>
          </div>

          {/* BOD */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/40 transition">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-200">BOD (Organic Load)</label>
              <span className="text-[11px] text-cyan-400 font-mono font-bold">{rawTelemetry.bod} mg/L</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              step="0.1"
              value={rawTelemetry.bod}
              onChange={(e) => handleInputChange('bod', parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span className="text-emerald-400 font-bold">Clean (&lt;2)</span>
              <span className="text-amber-400">Safe: ≤3.0</span>
              <span className="text-rose-400">High (&gt;5)</span>
            </div>
          </div>

          {/* Water Temperature */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/40 transition">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-200">Water Temperature</label>
              <span className="text-[11px] text-cyan-400 font-mono font-bold">{rawTelemetry.temperature} °C</span>
            </div>
            <input
              type="range"
              min="5"
              max="40"
              step="0.5"
              value={rawTelemetry.temperature}
              onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>5 °C</span>
              <span className="text-emerald-400 font-bold">Sangam Avg: 22°C</span>
              <span>40 °C</span>
            </div>
          </div>

          {/* Electrical Conductivity */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/40 transition">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-200">Electrical Conductivity</label>
              <span className="text-[11px] text-cyan-400 font-mono font-bold">{rawTelemetry.conductivity} µS/cm</span>
            </div>
            <input
              type="range"
              min="50"
              max="1500"
              step="10"
              value={rawTelemetry.conductivity}
              onChange={(e) => handleInputChange('conductivity', parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span className="text-emerald-400 font-bold">Fresh (&lt;400)</span>
              <span>750</span>
              <span className="text-rose-400">Saline</span>
            </div>
          </div>

          {/* Turbidity */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/40 transition">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-200">Turbidity (NTU)</label>
              <span className="text-[11px] text-cyan-400 font-mono font-bold">{rawTelemetry.turbidity} NTU</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="50"
              step="0.5"
              value={rawTelemetry.turbidity}
              onChange={(e) => handleInputChange('turbidity', parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span className="text-emerald-400 font-bold">Clear (&lt;5)</span>
              <span>10 NTU</span>
              <span className="text-amber-400">Monsoon Silt</span>
            </div>
          </div>

          {/* ORP */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/40 transition">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-200">ORP (Redox Potential)</label>
              <span className="text-[11px] text-cyan-400 font-mono font-bold">{rawTelemetry.orp} mV</span>
            </div>
            <input
              type="range"
              min="50"
              max="500"
              step="5"
              value={rawTelemetry.orp}
              onChange={(e) => handleInputChange('orp', parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span className="text-rose-400">&lt;150 mV</span>
              <span className="text-emerald-400 font-bold">Self-Cleansing (&gt;250)</span>
              <span>500 mV</span>
            </div>
          </div>

          {/* Trigger Action */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/40 to-blue-950/40 border border-cyan-500/30 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-cyan-300 mb-1 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-cyan-400" />
                Pipeline Execution
              </div>
              <p className="text-[11px] text-slate-400">
                Run Agent 1 to sanitize readings and construct the clean feature vector.
              </p>
            </div>

            <button
              id="execute-agent-1-btn"
              onClick={handleExecuteAgent1}
              disabled={isProcessing}
              className="w-full mt-3 py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Preprocessing...</span>
                </>
              ) : (
                <>
                  <span>Run Agent 1 (Acquisition)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Validation Report Card */}
      {validationReport && (
        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 animate-fade-in bg-gradient-to-b from-slate-900/90 to-emerald-950/20">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  Agent 1 Preprocessing Complete
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                    Health: {validationReport.confidenceScore}% Confidence
                  </span>
                </h4>
                <p className="text-xs text-slate-400">
                  Telemetry sanitized for {rawTelemetry.station_name || 'Prayagraj Triveni Sangam'}
                </p>
              </div>
            </div>

            <button
              id="proceed-to-agent-2-btn"
              onClick={onComplete}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 shadow-lg shadow-emerald-500/25 transition flex items-center gap-2 group"
            >
              <span>Proceed to Agent 2: Analysis</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-4">
            {Object.entries(PARAM_STANDARDS).map(([key, std]) => (
              <div key={key} className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 truncate">{std.name}</div>
                <div className="text-xs font-mono font-bold text-cyan-300 mt-0.5">
                  {cleanedData[key]} <span className="text-[9px] text-slate-500">{std.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

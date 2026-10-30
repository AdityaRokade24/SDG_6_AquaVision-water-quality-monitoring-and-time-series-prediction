import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Clock, 
  Calendar, 
  ArrowRight, 
  Layers, 
  Cpu, 
  Sparkles, 
  CheckCircle2,
  Info
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend,
  BarChart,
  Bar
} from 'recharts';
import { forecast24Hours, forecast7Days } from '../../lib/forecastingEngine';

export default function Agent3Prediction({ 
  cleanedData, 
  predictionData, 
  setPredictionData, 
  onComplete 
}) {
  const [activeView, setActiveView] = useState('7day'); // '7day' | '24hour' | 'parameters'

  useEffect(() => {
    if (cleanedData) {
      const f24 = forecast24Hours(cleanedData);
      const f7d = forecast7Days(cleanedData);
      setPredictionData({
        hourly24: f24,
        daily7d: f7d,
        generatedAt: new Date().toISOString()
      });
    }
  }, [cleanedData]);

  if (!predictionData?.daily7d) {
    return (
      <div className="glass-panel p-12 rounded-3xl text-center">
        <TrendingUp className="w-8 h-8 text-cyan-400 mx-auto animate-spin mb-3" />
        <p className="text-sm text-slate-300">Generating ML Time-Series Predictions...</p>
      </div>
    );
  }

  const { hourly24, daily7d } = predictionData;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                Agent 3: ML Time-Series Forecaster
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Ganga Hydro-Model: R² = 0.941
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Predictive 24-Hour & 7-Day Water Quality Forecast
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
              Time-series projection evaluating diurnal photosynthetic DO cycles, upstream hydrological drift, and 7-day River Ganga ecological trajectory.
            </p>
          </div>

          <button
            id="proceed-to-agent-4-btn"
            onClick={onComplete}
            className="px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white shadow-lg shadow-amber-500/25 transition flex items-center gap-2 group shrink-0"
          >
            <span>Proceed to Agent 4: Risk & Alerts</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Chart View Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex p-1.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveView('7day')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
              activeView === '7day' ? 'bg-cyan-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>7-Day Longitudinal Forecast</span>
          </button>
          
          <button
            onClick={() => setActiveView('24hour')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
              activeView === '24hour' ? 'bg-cyan-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>24-Hour Diurnal Curve</span>
          </button>

          <button
            onClick={() => setActiveView('parameters')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
              activeView === 'parameters' ? 'bg-cyan-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Multi-Parameter Outlook</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>95% Bayesian Confidence Intervals</span>
        </div>
      </div>

      {/* Chart Section */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/20">
        
        {activeView === '7day' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  7-Day Projected Water Quality Index (WQI)
                </h3>
                <p className="text-xs text-slate-400">
                  Forecasted Ganga River WQI with upper/lower uncertainty bounds
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <span className="w-3 h-3 rounded-full bg-cyan-400 inline-block" /> Projected WQI
                </span>
                <span className="flex items-center gap-1.5 text-blue-300">
                  <span className="w-3 h-3 rounded bg-blue-500/30 border border-blue-400/50 inline-block" /> Confidence Range
                </span>
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={daily7d} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="wqiGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#00f2fe" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="boundGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.02}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis domain={[30, 100]} stroke="#64748b" tick={{ fontSize: 11 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                      borderColor: '#0284c7', 
                      borderRadius: '16px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                      fontSize: '12px'
                    }} 
                  />
                  <Area type="monotone" dataKey="wqiUpper" stroke="#38bdf8" strokeDasharray="4 4" fill="none" name="Upper 95% Bound" />
                  <Area type="monotone" dataKey="wqi" stroke="#00f2fe" strokeWidth={3} fillOpacity={1} fill="url(#wqiGradient)" name="Predicted WQI" />
                  <Area type="monotone" dataKey="wqiLower" stroke="#38bdf8" strokeDasharray="4 4" fill="none" name="Lower 95% Bound" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Daily Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mt-6 pt-6 border-t border-slate-800/80">
              {daily7d.map((d) => (
                <div key={d.day} className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
                  <div className="text-[11px] font-bold text-slate-300">{d.day}</div>
                  <div className="text-lg font-mono font-extrabold text-cyan-400 my-1">
                    {d.wqi}
                  </div>
                  <div className="text-[10px] text-slate-400">DO: <strong className="text-slate-200">{d.do_level}</strong> mg/L</div>
                  <div className="text-[10px] text-slate-400">BOD: <strong className="text-slate-200">{d.bod}</strong> mg/L</div>
                  <div className="mt-1 text-[9px] font-semibold text-emerald-400">{d.confidence}% conf</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeView === '24hour' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  24-Hour Diurnal Trajectory (Hourly Cycles)
                </h3>
                <p className="text-xs text-slate-400">
                  Nocturnal biological oxygen sag vs. daytime photosynthetic aeration
                </p>
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hourly24} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                      borderColor: '#0284c7', 
                      borderRadius: '16px',
                      fontSize: '12px'
                    }} 
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Line type="monotone" dataKey="do_level" stroke="#10b981" strokeWidth={2.5} name="Dissolved Oxygen (mg/L)" dot={false} />
                  <Line type="monotone" dataKey="temperature" stroke="#f59e0b" strokeWidth={2} name="Temperature (°C)" dot={false} />
                  <Line type="monotone" dataKey="ph" stroke="#00f2fe" strokeWidth={2} name="pH Level" dot={false} />
                  <Line type="monotone" dataKey="wqi" stroke="#a855f7" strokeWidth={2.5} name="Hourly WQI" strokeDasharray="3 3" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeView === 'parameters' && (
          <div>
            <div className="mb-6">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                7-Day Parameter Shift (DO vs BOD vs Turbidity)
              </h3>
              <p className="text-xs text-slate-400">
                Comparative bar dynamics showing organic decomposition load vs. aeration
              </p>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={daily7d} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                      borderColor: '#0284c7', 
                      borderRadius: '16px',
                      fontSize: '12px'
                    }} 
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="do_level" fill="#10b981" name="Dissolved Oxygen (mg/L)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="bod" fill="#f43f5e" name="BOD Organic Load (mg/L)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="turbidity" fill="#f59e0b" name="Turbidity (NTU)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}

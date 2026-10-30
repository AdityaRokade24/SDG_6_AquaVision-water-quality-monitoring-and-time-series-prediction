import React from 'react';
import { 
  Droplets, 
  Cpu, 
  Sparkles, 
  Radio, 
  Database, 
  FileSpreadsheet, 
  History,
  Waves
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  supabaseConfig, 
  onOpenConfig,
  onFetchLiveSangam,
  isFetchingLive
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyan-500/20 bg-[#030712]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo & Prayagraj Triveni Sangam Brand */}
        <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => setActiveTab('agents')}>
          <div className="relative group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-emerald-400 p-[1.5px] shadow-lg shadow-cyan-500/25 group-hover:shadow-cyan-400/40 transition-all duration-300">
              <div className="w-full h-full bg-[#030712] rounded-2xl flex items-center justify-center">
                <Droplets className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-500 border-2 border-[#030712]"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
                AquaVision
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                Prayagraj Sangam
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Triveni Sangam Multi-Agent Water Quality & Sacred Ecology AI
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Accessible to Everyone) */}
        <nav className="flex items-center p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-inner">
          <button
            id="nav-agents-tab-btn"
            onClick={() => setActiveTab('agents')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
              activeTab === 'agents'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>4-Agent Pipeline</span>
          </button>

          <button
            id="nav-today-tab-btn"
            onClick={() => setActiveTab('today')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
              activeTab === 'today'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Test Water / Upload</span>
          </button>

          <button
            id="nav-records-tab-btn"
            onClick={() => setActiveTab('records')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
              activeTab === 'records'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">Sangam Records</span>
            <span className="sm:hidden">Records</span>
          </button>
        </nav>

        {/* Right Actions: Live API Ingestion & Supabase */}
        <div className="flex items-center gap-2.5">
          {/* Direct Live Sangam WQI Button */}
          <button
            id="live-cpcb-api-btn"
            onClick={onFetchLiveSangam}
            disabled={isFetchingLive}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 text-cyan-300 border border-cyan-400/40 shadow-sm transition hover:scale-105 active:scale-95"
            title="Directly fetch Today's Live Prayagraj Sangam Telemetry & WQI"
          >
            <Radio className={`w-3.5 h-3.5 text-cyan-400 ${isFetchingLive ? 'animate-spin' : 'animate-pulse'}`} />
            <span>{isFetchingLive ? 'Fetching Live...' : "Today's Live Sangam WQI"}</span>
          </button>

          {/* Database status */}
          <button
            id="nav-db-status-btn"
            onClick={onOpenConfig}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs border transition ${
              supabaseConfig?.isConnected
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-cyan-500/50'
            }`}
            title="Database synchronization"
          >
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span className={`w-2 h-2 rounded-full ${supabaseConfig?.isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          </button>
        </div>

      </div>
    </header>
  );
}

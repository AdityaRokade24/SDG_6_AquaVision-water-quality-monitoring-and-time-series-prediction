import React, { useState } from 'react';
import { 
  Droplets, 
  Cpu, 
  Sparkles, 
  Radio, 
  Database, 
  History,
  Menu,
  X,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  supabaseConfig, 
  onOpenConfig,
  onFetchLiveSangam,
  isFetchingLive
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSelectTab = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyan-500/20 bg-[#030712]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div 
          className="flex items-center gap-2.5 sm:gap-3.5 cursor-pointer select-none" 
          onClick={() => handleSelectTab('agents')}
        >
          <div className="relative group">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-emerald-400 p-[1.5px] shadow-lg shadow-cyan-500/25 group-hover:shadow-cyan-400/40 transition-all duration-300">
              <div className="w-full h-full bg-[#030712] rounded-xl sm:rounded-2xl flex items-center justify-center">
                <Droplets className="w-4 h-4 sm:w-6 sm:h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5 sm:h-3.5 sm:w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 bg-cyan-500 border-2 border-[#030712]"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-lg sm:text-xl font-black tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
                AquaVision
              </span>
              <span className="px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-bold tracking-wide uppercase rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                Sangam
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 hidden lg:block leading-tight">
              Triveni Sangam Multi-Agent Water Quality & Sacred Ecology AI
            </p>
          </div>
        </div>

        {/* Desktop Navigation Tabs (Hidden on mobile/tablet screens < md) */}
        <nav className="hidden md:flex items-center p-1 sm:p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-inner">
          <button
            id="nav-agents-tab-btn"
            onClick={() => handleSelectTab('agents')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
              activeTab === 'agents'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span>4-Agent Pipeline</span>
          </button>

          <button
            id="nav-today-tab-btn"
            onClick={() => handleSelectTab('today')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
              activeTab === 'today'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
            <span>Test Water / Upload</span>
          </button>

          <button
            id="nav-records-tab-btn"
            onClick={() => handleSelectTab('records')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
              activeTab === 'records'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <History className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span>Sangam Records</span>
          </button>
        </nav>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2">
          {/* Direct Live Sangam WQI Button (Visible on tablet & desktop) */}
          <button
            id="live-cpcb-api-btn"
            onClick={onFetchLiveSangam}
            disabled={isFetchingLive}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 text-cyan-300 border border-cyan-400/40 shadow-sm transition hover:scale-105 active:scale-95"
            title="Directly fetch Today's Live Prayagraj Sangam Telemetry & WQI"
          >
            <Radio className={`w-3.5 h-3.5 text-cyan-400 shrink-0 ${isFetchingLive ? 'animate-spin' : 'animate-pulse'}`} />
            <span className="hidden lg:inline">{isFetchingLive ? 'Fetching Live...' : "Today's Live Sangam WQI"}</span>
            <span className="lg:hidden">{isFetchingLive ? 'Fetching...' : "Live WQI"}</span>
          </button>

          {/* Database status button */}
          <button
            id="nav-db-status-btn"
            onClick={onOpenConfig}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs border transition ${
              supabaseConfig?.isConnected
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-cyan-500/50'
            }`}
            title="Database synchronization"
          >
            <Database className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className={`w-2 h-2 rounded-full ${supabaseConfig?.isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className="hidden xl:inline text-[11px] font-medium text-slate-400">
              {supabaseConfig?.isConnected ? 'Cloud Sync' : 'Local'}
            </span>
          </button>

          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-label="Toggle mobile menu"
            className="md:hidden p-2 rounded-xl bg-slate-900 text-slate-300 border border-slate-800 hover:border-cyan-500/50 hover:text-white transition active:scale-95"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5 text-slate-200" />}
          </button>
        </div>

      </div>

      {/* Mobile Dropdown Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-cyan-500/20 bg-[#030712]/95 backdrop-blur-2xl px-4 py-4 space-y-3 animate-fade-in shadow-2xl">
          
          <div className="space-y-1.5">
            <button
              onClick={() => handleSelectTab('agents')}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-left font-semibold text-sm transition ${
                activeTab === 'agents'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-400/40 text-cyan-200 shadow-md shadow-cyan-950/40'
                  : 'bg-slate-900/60 border border-slate-800/60 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${activeTab === 'agents' ? 'bg-cyan-500/30 text-cyan-300' : 'bg-slate-800 text-slate-400'}`}>
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold">4-Agent Pipeline</div>
                  <div className="text-[11px] text-slate-400 font-normal">Telemetry, WQI, ML & Risk Alert</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>

            <button
              onClick={() => handleSelectTab('today')}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-left font-semibold text-sm transition ${
                activeTab === 'today'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-400/40 text-cyan-200 shadow-md shadow-cyan-950/40'
                  : 'bg-slate-900/60 border border-slate-800/60 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${activeTab === 'today' ? 'bg-emerald-500/30 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold">Test Water / Upload</div>
                  <div className="text-[11px] text-slate-400 font-normal">Instant sample calculation & CSV input</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>

            <button
              onClick={() => handleSelectTab('records')}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-left font-semibold text-sm transition ${
                activeTab === 'records'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-400/40 text-cyan-200 shadow-md shadow-cyan-950/40'
                  : 'bg-slate-900/60 border border-slate-800/60 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${activeTab === 'records' ? 'bg-blue-500/30 text-blue-300' : 'bg-slate-800 text-slate-400'}`}>
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold">Sangam Records & Analytics</div>
                  <div className="text-[11px] text-slate-400 font-normal">Historical logs and comparative KPIs</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          {/* Quick mobile action for live WQI */}
          <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onFetchLiveSangam();
              }}
              disabled={isFetchingLive}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 active:scale-95 transition"
            >
              <Radio className={`w-4 h-4 ${isFetchingLive ? 'animate-spin' : 'animate-pulse'}`} />
              <span>{isFetchingLive ? 'Fetching Live Data...' : "Fetch Today's Live Sangam WQI"}</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenConfig();
              }}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span>Database Settings ({supabaseConfig?.isConnected ? 'Supabase Connected' : 'Local Storage Mode'})</span>
            </button>
          </div>

        </div>
      )}
    </header>
  );
}

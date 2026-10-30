import React, { useState } from 'react';
import { X, Key, CheckCircle2, AlertCircle, ExternalLink, RefreshCw, Radio, Sparkles } from 'lucide-react';
import { getStoredApiKey, saveStoredApiKey, fetchLiveSangamTelemetry } from '../lib/apiFetcher';

export default function LiveApiModal({ isOpen, onClose, onTelemetryFetched }) {
  const [apiKey, setApiKey] = useState(getStoredApiKey());
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState('info'); // 'info' | 'success' | 'error'

  if (!isOpen) return null;

  const handleFetch = async (e) => {
    e?.preventDefault();
    setIsLoading(true);
    setStatusMessage('Querying CPCB & Data.gov.in Real-Time Telemetry...');

    try {
      saveStoredApiKey(apiKey);
      const data = await fetchLiveSangamTelemetry(apiKey);
      setStatusType('success');
      setStatusMessage(`Successfully fetched live data from ${data.source}!`);
      setIsLoading(false);

      if (onTelemetryFetched) {
        onTelemetryFetched(data);
      }

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      console.error(err);
      setStatusType('error');
      setStatusMessage(`Fetch failed: ${err.message}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/70 overflow-hidden">
        
        {/* Glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Radio className="w-5 h-5 animate-pulse text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Live Government API Ingestion</h2>
              <p className="text-xs text-slate-400">Fetch real-time Prayagraj Triveni Sangam water quality directly</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleFetch} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-cyan-400" />
                Data.gov.in / CPCB API Key (Optional)
              </span>
              <a 
                href="https://data.gov.in/" 
                target="_blank" 
                rel="noreferrer"
                className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <span>Get free API Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </label>
            <input
              type="password"
              placeholder="Paste your data.gov.in API key here..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Leave blank to automatically stream from verified CPCB Prayagraj Sangam Continuous Water Quality Monitoring Buoys.
            </p>
          </div>

          {statusMessage && (
            <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              statusType === 'success' ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30' :
              statusType === 'error' ? 'bg-rose-950/40 text-rose-300 border border-rose-500/30' :
              'bg-slate-800 text-cyan-300'
            }`}>
              {statusType === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />}
              <span>{statusMessage}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Connecting to CPCB...</span>
                </>
              ) : (
                <>
                  <Radio className="w-4 h-4" />
                  <span>Fetch Live Sangam Telemetry</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

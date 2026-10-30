import React, { useState } from 'react';
import { X, Database, CheckCircle2, AlertTriangle, Copy, ExternalLink, Shield } from 'lucide-react';
import { saveSupabaseConfig } from '../lib/supabase';
import { createClient } from '@supabase/supabase-js';

export default function SupabaseConfigModal({ isOpen, onClose, config, onConfigUpdated }) {
  const [url, setUrl] = useState(config?.url || '');
  const [anonKey, setAnonKey] = useState(config?.anonKey || '');
  const [activeTab, setActiveTab] = useState('connect'); // 'connect' | 'sql'
  const [status, setStatus] = useState({ state: 'idle', message: '' });
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleTestAndSave = async (e) => {
    e.preventDefault();
    if (!url.trim() || !anonKey.trim()) {
      setStatus({ state: 'error', message: 'Please provide both Supabase Project URL and Anon Key.' });
      return;
    }

    setStatus({ state: 'testing', message: 'Testing connection to Supabase...' });

    try {
      const client = createClient(url.trim(), anonKey.trim());
      // Test read query
      const { data, error } = await client.from('monitoring_stations').select('id').limit(1);

      if (error && error.code !== 'PGRST116') {
        // Table might not be migrated yet, but authentication was valid
        if (error.message.includes('relation "public.monitoring_stations" does not exist')) {
          const newCfg = { url: url.trim(), anonKey: anonKey.trim(), isConnected: true };
          saveSupabaseConfig(newCfg);
          onConfigUpdated(newCfg);
          setStatus({ 
            state: 'warning', 
            message: 'Connected to Supabase! Note: Please run the SQL migration script from the "SQL Schema" tab to create your tables.' 
          });
          return;
        }
        throw error;
      }

      const newCfg = { url: url.trim(), anonKey: anonKey.trim(), isConnected: true };
      saveSupabaseConfig(newCfg);
      onConfigUpdated(newCfg);
      setStatus({ state: 'success', message: 'Supabase connected successfully!' });
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      console.error(err);
      setStatus({ 
        state: 'error', 
        message: `Connection failed: ${err.message || 'Check your credentials or network.'}` 
      });
    }
  };

  const handleResetToLocal = () => {
    const emptyCfg = { url: '', anonKey: '', isConnected: false };
    saveSupabaseConfig(emptyCfg);
    onConfigUpdated(emptyCfg);
    setUrl('');
    setAnonKey('');
    setStatus({ state: 'idle', message: 'Reverted to offline local storage.' });
  };

  const sqlCode = `-- 1. Stations Table
create table if not exists public.monitoring_stations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  river text not null default 'Ganga',
  reach_zone text not null,
  latitude double precision not null,
  longitude double precision not null,
  status text not null default 'Online',
  last_wqi numeric(5,2),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Telemetry Logs Table
create table if not exists public.water_telemetry (
  id uuid primary key default gen_random_uuid(),
  station_name text not null,
  ph numeric(4,2) not null,
  do_level numeric(5,2) not null,
  temperature numeric(4,1) not null,
  conductivity numeric(7,1) not null,
  orp numeric(6,1) not null,
  turbidity numeric(6,2) not null,
  bod numeric(5,2) not null,
  wqi numeric(5,2) not null,
  status text not null,
  risk_level text not null default 'Low',
  logged_by text default 'Field Officer',
  notes text,
  recorded_at timestamp with time zone default timezone('utc'::text, now())
);`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/60 overflow-hidden">
        
        {/* Glow backdrop */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Cloud Database Synchronization</h2>
              <p className="text-xs text-slate-400">Connect Supabase to permanently store Water Quality Department telemetry</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex gap-2 my-4 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('connect')}
            className={`flex-1 py-2 rounded-lg transition ${
              activeTab === 'connect' ? 'bg-cyan-500 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Connection Settings
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`flex-1 py-2 rounded-lg transition ${
              activeTab === 'sql' ? 'bg-cyan-500 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            SQL Migration Schema
          </button>
        </div>

        {activeTab === 'connect' ? (
          <form onSubmit={handleTestAndSave} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Supabase Project URL
              </label>
              <input
                type="url"
                placeholder="https://your-project.supabase.co"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Supabase Anon / Public API Key
              </label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {status.message && (
              <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                status.state === 'success' ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-500/30' :
                status.state === 'warning' ? 'bg-amber-950/50 text-amber-300 border border-amber-500/30' :
                status.state === 'error' ? 'bg-rose-950/50 text-rose-300 border border-rose-500/30' :
                'bg-slate-800 text-cyan-300'
              }`}>
                {status.state === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                {status.state === 'error' && <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />}
                <span>{status.message}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleResetToLocal}
                className="text-xs text-slate-400 hover:text-rose-400 transition"
              >
                Use Local Storage Only
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={status.state === 'testing'}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition"
                >
                  {status.state === 'testing' ? 'Connecting...' : 'Test & Connect'}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Run in Supabase Dashboard ➔ SQL Editor:</span>
              <button
                onClick={copySql}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-cyan-300 transition"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied!' : 'Copy SQL'}</span>
              </button>
            </div>
            <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-cyan-200 overflow-x-auto max-h-56">
              {sqlCode}
            </pre>
            <p className="text-[11px] text-slate-400">
              Note: If Supabase is not connected, the application will automatically persist all logs, predictions, and manual entries safely in browser local storage.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

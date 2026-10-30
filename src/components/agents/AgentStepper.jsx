import React from 'react';
import { Database, Activity, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

export const AGENT_STEPS = [
  {
    id: 1,
    name: 'Agent 1: Acquisition',
    shortName: 'Acquisition',
    role: 'Sensor Ingestion & Preprocessing',
    icon: Database,
    color: 'from-blue-500 to-cyan-500',
    borderColor: 'border-cyan-400',
    shadowColor: 'shadow-cyan-500/30'
  },
  {
    id: 2,
    name: 'Agent 2: WQI Analysis',
    shortName: 'Analysis',
    role: 'CPCB Water Quality Indexing',
    icon: Activity,
    color: 'from-cyan-500 to-emerald-500',
    borderColor: 'border-emerald-400',
    shadowColor: 'shadow-emerald-500/30'
  },
  {
    id: 3,
    name: 'Agent 3: ML Prediction',
    shortName: 'Prediction',
    role: '24h & 7-Day Time-Series Forecast',
    icon: TrendingUp,
    color: 'from-emerald-500 to-amber-500',
    borderColor: 'border-amber-400',
    shadowColor: 'shadow-amber-500/30'
  },
  {
    id: 4,
    name: 'Agent 4: Risk & Alerts',
    shortName: 'Risk Mitigation',
    role: 'Multi-Criteria Early Warnings',
    icon: AlertTriangle,
    color: 'from-amber-500 to-rose-500',
    borderColor: 'border-rose-400',
    shadowColor: 'shadow-rose-500/30'
  }
];

export default function AgentStepper({ currentStep, setStep, completedSteps }) {
  return (
    <div className="w-full py-4 mb-8">
      <div className="relative">
        
        {/* Background Connecting Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 bg-slate-800/80 -z-0 rounded-full mx-6 md:mx-16" />
        
        {/* Active Progress Line */}
        <div 
          className="absolute top-1/2 left-0 h-1 -translate-y-1/2 bg-gradient-to-r from-cyan-500 via-emerald-400 to-amber-400 transition-all duration-500 -z-0 rounded-full mx-6 md:mx-16"
          style={{ width: `${((currentStep - 1) / (AGENT_STEPS.length - 1)) * 100}%` }}
        />

        {/* Stepper Nodes */}
        <div className="relative z-10 flex justify-between items-center max-w-5xl mx-auto px-2">
          {AGENT_STEPS.map((agent) => {
            const Icon = agent.icon;
            const isCurrent = currentStep === agent.id;
            const isCompleted = completedSteps.includes(agent.id);
            const isAccessible = isCompleted || isCurrent || completedSteps.includes(agent.id - 1);

            return (
              <button
                key={agent.id}
                id={`stepper-node-agent-${agent.id}`}
                disabled={!isAccessible}
                onClick={() => setStep(agent.id)}
                className={`group flex flex-col items-center text-center transition-all duration-300 focus:outline-none ${
                  !isAccessible ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:scale-105'
                }`}
              >
                {/* Outer Ring */}
                <div 
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all duration-300 relative ${
                    isCurrent
                      ? `bg-gradient-to-tr ${agent.color} p-[2px] shadow-lg ${agent.shadowColor} scale-110`
                      : isCompleted
                      ? 'bg-emerald-500/20 border border-emerald-400/50 text-emerald-400'
                      : 'bg-slate-900/90 border border-slate-700/80 text-slate-400'
                  }`}
                >
                  <div className="w-full h-full bg-slate-950/90 rounded-2xl flex items-center justify-center">
                    {isCompleted && !isCurrent ? (
                      <CheckCircle className="w-6 h-6 text-emerald-400" />
                    ) : (
                      <Icon className={`w-5 h-5 md:w-6 md:h-6 ${
                        isCurrent ? 'text-white animate-pulse' : 'text-slate-400 group-hover:text-slate-200'
                      }`} />
                    )}
                  </div>

                  {/* Pulsing beacon if active */}
                  {isCurrent && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                    </span>
                  )}
                </div>

                {/* Text Labels */}
                <div className="mt-3">
                  <span className={`text-xs md:text-sm font-bold block transition ${
                    isCurrent ? 'text-cyan-300' : isCompleted ? 'text-slate-200' : 'text-slate-500'
                  }`}>
                    {agent.shortName}
                  </span>
                  <span className="hidden sm:block text-[11px] text-slate-400 max-w-[130px] truncate">
                    {agent.role}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}

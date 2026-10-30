import React from 'react';
import { Database, Activity, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

export const AGENT_STEPS = [
  {
    id: 1,
    name: 'Agent 1: Acquisition',
    shortName: 'Acquisition',
    mobileName: 'Sensors',
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
    mobileName: 'Analysis',
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
    mobileName: 'Forecast',
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
    mobileName: 'Alerts',
    role: 'Multi-Criteria Early Warnings',
    icon: AlertTriangle,
    color: 'from-amber-500 to-rose-500',
    borderColor: 'border-rose-400',
    shadowColor: 'shadow-rose-500/30'
  }
];

export default function AgentStepper({ currentStep, setStep, completedSteps }) {
  return (
    <div className="w-full py-2 sm:py-4 mb-4 sm:mb-8">
      
      {/* Mobile Step Indicator Header */}
      <div className="flex sm:hidden items-center justify-between px-1 mb-3 text-xs">
        <span className="font-bold text-cyan-300">
          Agent {currentStep}: {AGENT_STEPS[currentStep - 1]?.shortName}
        </span>
        <span className="text-[11px] text-slate-400 font-medium">
          Step {currentStep} of {AGENT_STEPS.length}
        </span>
      </div>

      <div className="relative">
        
        {/* Background Connecting Line */}
        <div className="absolute top-[20px] sm:top-1/2 left-0 right-0 h-1 sm:-translate-y-1/2 bg-slate-800/80 -z-0 rounded-full mx-6 sm:mx-12 md:mx-16" />
        
        {/* Active Progress Line */}
        <div 
          className="absolute top-[20px] sm:top-1/2 left-0 h-1 sm:-translate-y-1/2 bg-gradient-to-r from-cyan-500 via-emerald-400 to-amber-400 transition-all duration-500 -z-0 rounded-full mx-6 sm:mx-12 md:mx-16"
          style={{ width: `${((currentStep - 1) / (AGENT_STEPS.length - 1)) * 100}%` }}
        />

        {/* Stepper Nodes */}
        <div className="relative z-10 flex justify-between items-start max-w-5xl mx-auto px-1 sm:px-2">
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
                className={`group flex flex-col items-center text-center transition-all duration-300 focus:outline-none flex-1 ${
                  !isAccessible ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:scale-105 active:scale-95'
                }`}
              >
                {/* Outer Ring */}
                <div 
                  className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300 relative ${
                    isCurrent
                      ? `bg-gradient-to-tr ${agent.color} p-[2px] shadow-lg ${agent.shadowColor} scale-105 sm:scale-110`
                      : isCompleted
                      ? 'bg-emerald-500/20 border border-emerald-400/50 text-emerald-400'
                      : 'bg-slate-900/90 border border-slate-700/80 text-slate-400'
                  }`}
                >
                  <div className="w-full h-full bg-slate-950/90 rounded-xl sm:rounded-2xl flex items-center justify-center">
                    {isCompleted && !isCurrent ? (
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
                    ) : (
                      <Icon className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${
                        isCurrent ? 'text-white animate-pulse' : 'text-slate-400 group-hover:text-slate-200'
                      }`} />
                    )}
                  </div>

                  {/* Pulsing beacon if active */}
                  {isCurrent && (
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 sm:h-3 sm:w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-cyan-500"></span>
                    </span>
                  )}
                </div>

                {/* Text Labels */}
                <div className="mt-2 sm:mt-3 px-0.5 max-w-[85px] sm:max-w-[130px]">
                  <span className={`text-[10px] sm:text-xs md:text-sm font-bold block leading-tight transition ${
                    isCurrent ? 'text-cyan-300 font-extrabold' : isCompleted ? 'text-slate-200' : 'text-slate-500'
                  }`}>
                    <span className="sm:hidden">{agent.mobileName}</span>
                    <span className="hidden sm:inline">{agent.shortName}</span>
                  </span>
                  <span className="hidden md:block text-[11px] text-slate-400 truncate mt-0.5">
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

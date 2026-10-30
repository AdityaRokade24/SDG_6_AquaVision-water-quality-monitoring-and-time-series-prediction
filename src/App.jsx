import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import SupabaseConfigModal from './components/SupabaseConfigModal';
import LiveApiModal from './components/LiveApiModal';
import AgentStepper from './components/agents/AgentStepper';
import Agent1Acquisition from './components/agents/Agent1Acquisition';
import Agent2Analysis from './components/agents/Agent2Analysis';
import Agent3Prediction from './components/agents/Agent3Prediction';
import Agent4RiskAlert from './components/agents/Agent4RiskAlert';
import TodaysDataEntry from './components/department/TodaysDataEntry';
import TodaysResultModal from './components/department/TodaysResultModal';
import DepartmentLogsTable from './components/department/DepartmentLogsTable';
import StationAnalytics from './components/department/StationAnalytics';
import ErrorBoundary from './components/ErrorBoundary';

import { SANGAM_SECTORS } from './lib/sampleStations';
import { getSupabaseConfig, fetchTelemetryLogs } from './lib/supabase';
import { fetchLiveSangamTelemetry } from './lib/apiFetcher';
import { 
  Cpu, 
  Database, 
  Droplets, 
  Sparkles, 
  Waves, 
  ShieldCheck, 
  Globe, 
  Radio, 
  MapPin, 
  Clock,
  History,
  CheckCircle2
} from 'lucide-react';

export default function App() {
  // Navigation Tabs: 'agents' | 'today' | 'records'
  const [activeTab, setActiveTab] = useState('agents');

  // Supabase Configuration Modal State
  const [supabaseConfig, setSupabaseConfig] = useState(getSupabaseConfig());
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  // Live CPCB / Data.gov.in API Modal State
  const [isLiveApiModalOpen, setIsLiveApiModalOpen] = useState(false);
  const [liveApiSuccessToast, setLiveApiSuccessToast] = useState('');

  // Sangam Telemetry Logs
  const [telemetryLogs, setTelemetryLogs] = useState([]);
  const [dataSource, setDataSource] = useState('local');

  // Multi-Agent Pipeline State (Dedicated to Prayagraj Triveni Sangam)
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [rawTelemetry, setRawTelemetry] = useState({
    ...SANGAM_SECTORS[0].presetData,
    station_name: SANGAM_SECTORS[0].name,
    reach_zone: SANGAM_SECTORS[0].reach
  });
  const [cleanedData, setCleanedData] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [predictionData, setPredictionData] = useState(null);

  // Instant Today's Water Result Modal State
  const [todayModalOpen, setTodayModalOpen] = useState(false);
  const [todayModalData, setTodayModalData] = useState(null);

  // Load telemetry logs on mount
  const loadLogs = async () => {
    const { data, source } = await fetchTelemetryLogs();
    setTelemetryLogs(data || []);
    setDataSource(source);
  };

  useEffect(() => {
    loadLogs();
  }, []);

  // Agent Transitions
  const handleAgent1Complete = () => {
    if (!completedSteps.includes(1)) {
      setCompletedSteps(prev => [...prev, 1]);
    }
    setCurrentStep(2);
  };

  const handleAgent2Complete = () => {
    if (!completedSteps.includes(2)) {
      setCompletedSteps(prev => [...prev, 2]);
    }
    setCurrentStep(3);
  };

  const handleAgent3Complete = () => {
    if (!completedSteps.includes(3)) {
      setCompletedSteps(prev => [...prev, 3]);
    }
    setCurrentStep(4);
  };

  const handleResetPipeline = () => {
    setCurrentStep(1);
    setCompletedSteps([]);
    setCleanedData(null);
    setAnalysisResult(null);
    setPredictionData(null);
  };

  // Instant Today's Result Trigger
  const handleAnalyzeToday = (data) => {
    setTodayModalData(data);
    setTodayModalOpen(true);
  };

  const handleRecordSaved = (newRecord) => {
    setTelemetryLogs(prev => [newRecord, ...prev]);
  };

  const [isFetchingLive, setIsFetchingLive] = useState(false);

  // Fallback handler if LiveApiModal is used
  const handleLiveTelemetryFetched = (liveData) => {
    setRawTelemetry(prev => ({
      ...prev,
      ...liveData,
      station_name: 'Prayagraj Triveni Sangam (Live Sensor #01)'
    }));
    setCleanedData(null);
    setAnalysisResult(null);
    setPredictionData(null);
    setLiveApiSuccessToast(`Received live sensor stream from ${liveData.source}!`);
    setTimeout(() => setLiveApiSuccessToast(''), 4500);
  };

  // Directly fetch today's Prayagraj Triveni Sangam Live Telemetry and immediately show Today's WQI!
  const handleDirectFetchLiveSangam = async () => {
    setIsFetchingLive(true);
    try {
      const liveData = await fetchLiveSangamTelemetry();
      setRawTelemetry(prev => ({
        ...prev,
        ...liveData,
        station_name: 'Prayagraj Triveni Sangam (Live Sensor #01)'
      }));
      setCleanedData(null);
      setAnalysisResult(null);
      setPredictionData(null);
      
      // Automatically popup Today's Live WQI result modal directly!
      setTodayModalData({
        ...liveData,
        station_name: 'Prayagraj Triveni Sangam (Live Sensor #01)',
        logged_by: 'CPCB Continuous Sangam IoT Station #01',
        notes: "Live real-time Prayagraj Triveni Sangam continuous telemetry stream"
      });
      setTodayModalOpen(true);
      setLiveApiSuccessToast(`Fetched Today's Live Sangam Telemetry & WQI!`);
      setTimeout(() => setLiveApiSuccessToast(''), 4500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetchingLive(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Top Navbar */}
      <Navbar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        supabaseConfig={supabaseConfig}
        onOpenConfig={() => setIsConfigModalOpen(true)}
        onFetchLiveSangam={handleDirectFetchLiveSangam}
        isFetchingLive={isFetchingLive}
      />

      {/* Live API Notification Toast */}
      {liveApiSuccessToast && (
        <div className="bg-gradient-to-r from-cyan-950/90 to-blue-950/90 border-b border-cyan-400/40 py-2.5 px-4 text-center text-xs font-semibold text-cyan-300 flex items-center justify-center gap-2 animate-fade-in shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{liveApiSuccessToast}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8">
        
        {/* ======================================================== */}
        {/* TAB 1: 4-AGENT PIPELINE (Targeting Prayagraj Sangam)     */}
        {/* ======================================================== */}
        {activeTab === 'agents' && (
          <div className="space-y-6">
            
            {/* Stepper Navigation */}
            <AgentStepper 
              currentStep={currentStep}
              setStep={setCurrentStep}
              completedSteps={completedSteps}
            />

            <ErrorBoundary onReset={handleResetPipeline}>
              {/* Agent 1: Data Acquisition & Preprocessing */}
              {currentStep === 1 && (
                <Agent1Acquisition 
                  rawTelemetry={rawTelemetry}
                  setRawTelemetry={setRawTelemetry}
                  cleanedData={cleanedData}
                  setCleanedData={setCleanedData}
                  onComplete={handleAgent1Complete}
                  onTriggerLiveApi={handleDirectFetchLiveSangam}
                />
              )}

              {/* Agent 2: Water Quality Analysis (WQI & Bathing Suitability) */}
              {currentStep === 2 && (
                <Agent2Analysis 
                  cleanedData={cleanedData || rawTelemetry}
                  analysisResult={analysisResult}
                  setAnalysisResult={setAnalysisResult}
                  onComplete={handleAgent2Complete}
                />
              )}

              {/* Agent 3: ML 24h Diurnal & 7-Day Prediction */}
              {currentStep === 3 && (
                <Agent3Prediction 
                  cleanedData={cleanedData || rawTelemetry}
                  predictionData={predictionData}
                  setPredictionData={setPredictionData}
                  onComplete={handleAgent3Complete}
                />
              )}

              {/* Agent 4: Risk Advisory & Mitigation Directives */}
              {currentStep === 4 && (
                <Agent4RiskAlert 
                  cleanedData={cleanedData || rawTelemetry}
                  analysisResult={analysisResult}
                  predictionData={predictionData}
                  onResetPipeline={handleResetPipeline}
                  onGoToDepartment={() => setActiveTab('records')}
                />
              )}
            </ErrorBoundary>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: TODAY'S WATER TESTER & FILE UPLOAD (FOR EVERYONE) */}
        {/* ======================================================== */}
        {activeTab === 'today' && (
          <div className="space-y-8 animate-fade-in">
            <TodaysDataEntry onAnalyzeToday={handleAnalyzeToday} />
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: SANGAM WATER RECORDS & COMPARATIVE ANALYTICS       */}
        {/* ======================================================== */}
        {activeTab === 'records' && (
          <div className="space-y-8 animate-fade-in">
            <DepartmentLogsTable 
              logs={telemetryLogs}
              setLogs={setTelemetryLogs}
              onRefresh={loadLogs}
              dataSource={dataSource}
            />

            <StationAnalytics logs={telemetryLogs} />
          </div>
        )}

      </main>

      {/* Today's Instant Result Modal */}
      <TodaysResultModal 
        isOpen={todayModalOpen}
        onClose={() => setTodayModalOpen(false)}
        telemetryData={todayModalData}
        onRecordSaved={handleRecordSaved}
      />

      {/* Live Government API Key Modal */}
      <LiveApiModal
        isOpen={isLiveApiModalOpen}
        onClose={() => setIsLiveApiModalOpen(false)}
        onTelemetryFetched={handleLiveTelemetryFetched}
      />

      {/* Supabase Cloud Config Modal */}
      <SupabaseConfigModal 
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        config={supabaseConfig}
        onConfigUpdated={(newCfg) => {
          setSupabaseConfig(newCfg);
          loadLogs();
        }}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-[#02050e] py-6 sm:py-8 text-xs text-slate-500 mt-8 sm:mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-slate-300">AquaVision Prayagraj Sangam</span>
            <span>• Sacred Confluence of Ganga, Yamuna & Saraswati</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> CPCB Class B Bathing Standards
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <Globe className="w-3.5 h-3.5 text-cyan-400" /> UN SDG-6 Clean Water
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}

import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Sparkles, 
  Download, 
  Sliders, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  User, 
  ArrowRight,
  Info,
  Waves,
  Radio
} from 'lucide-react';
import { SANGAM_SECTORS } from '../../lib/sampleStations';
import { PARAM_STANDARDS } from '../../lib/wqiEngine';

export default function TodaysDataEntry({ onAnalyzeToday }) {
  const [entryMode, setEntryMode] = useState('manual'); // 'manual' | 'upload'
  
  // Manual form state
  const [sectorName, setSectorName] = useState(SANGAM_SECTORS[0].name);
  const [userName, setUserName] = useState('Sangam Pilgrim / Researcher');
  const [notes, setNotes] = useState("Today's morning Sangam water quality sample");
  const [formData, setFormData] = useState({
    ph: 7.42,
    do_level: 7.6,
    temperature: 22.4,
    conductivity: 385,
    orp: 288,
    turbidity: 7.8,
    bod: 2.6
  });

  // File upload state
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [parsedPreview, setParsedPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleInputChange = (key, val) => {
    setFormData(prev => ({ ...prev, [key]: val }));
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      station_name: sectorName,
      logged_by: userName,
      notes: notes
    };
    onAnalyzeToday(payload);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');
    setUploadedFile(file);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result;
        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(text);
          const data = Array.isArray(parsed) ? parsed[0] : parsed;
          populateFromUploaded(data, file.name);
        } else if (file.name.endsWith('.csv')) {
          const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
          if (lines.length < 2) {
            setUploadError('CSV must contain a header row and at least one data row.');
            return;
          }
          const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/[^a-z0-9_]/g, ''));
          const values = lines[1].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
          
          const rowObj = {};
          headers.forEach((h, idx) => {
            rowObj[h] = values[idx];
          });
          populateFromUploaded(rowObj, file.name);
        } else {
          setUploadError('Please upload a valid .csv or .json file.');
        }
      } catch (err) {
        console.error(err);
        setUploadError(`Failed to parse file: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  const populateFromUploaded = (data, filename) => {
    const extracted = {
      station_name: data.station_name || data.station || data.location || 'Prayagraj Sangam Sample',
      logged_by: data.logged_by || data.user || 'Community Telemetry Upload',
      notes: data.notes || `Uploaded from ${filename}`,
      ph: parseFloat(data.ph || data.ph_level) || 7.4,
      do_level: parseFloat(data.do_level || data.do || data.dissolved_oxygen) || 7.2,
      temperature: parseFloat(data.temperature || data.temp) || 22.0,
      conductivity: parseFloat(data.conductivity || data.ec) || 390,
      orp: parseFloat(data.orp || data.redox) || 280,
      turbidity: parseFloat(data.turbidity || data.turb) || 7.5,
      bod: parseFloat(data.bod || data.biochemical_oxygen_demand) || 2.7
    };

    setParsedPreview(extracted);
  };

  const handleAnalyzeUploaded = () => {
    if (parsedPreview) {
      onAnalyzeToday(parsedPreview);
    }
  };

  const downloadSampleCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "station_name,logged_by,ph,do_level,temperature,conductivity,orp,turbidity,bod,notes\n" +
      "\"Prayagraj Triveni Sangam Central\",\"Dr. V. Sharma\",7.4,7.8,21.5,370,310,6.5,2.4,\"Morning holy bath telemetry sample\"\n" +
      "\"Yamuna Influx Reach\",\"Community Observer\",7.6,6.9,23.1,430,265,9.2,3.1,\"Sangam convergence monitoring\"";
    const encoded = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encoded);
    link.setAttribute("download", "sample_sangam_water_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="glass-panel p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-cyan-500/20 shadow-xl relative overflow-hidden">
      
      {/* Ambient Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 sm:pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
              Public Water Quality Tester
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Prayagraj Triveni Sangam
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Today's Sangam Water Tester & File Upload
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Anyone can enter today's test values or drop a CSV/JSON telemetry file to get an instant WQI score, religious bathing safety grade, and 7-day forecast.
          </p>
        </div>

        {/* Entry mode toggle */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-semibold w-full sm:w-auto shrink-0">
          <button
            type="button"
            onClick={() => setEntryMode('manual')}
            className={`flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl transition ${
              entryMode === 'manual'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="truncate">Type Data</span>
          </button>
          <button
            type="button"
            onClick={() => setEntryMode('upload')}
            className={`flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl transition ${
              entryMode === 'upload'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="truncate">Upload File</span>
          </button>
        </div>
      </div>

      {/* Manual Entry Form */}
      {entryMode === 'manual' ? (
        <form onSubmit={handleManualSubmit} className="mt-5 sm:mt-6 space-y-5 sm:space-y-6">
          
          {/* Metadata Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                Sangam Monitoring Sector
              </label>
              <select
                value={sectorName}
                onChange={(e) => setSectorName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                {SANGAM_SECTORS.map(sec => (
                  <option key={sec.id} value={sec.name}>{sec.name}</option>
                ))}
                <option value="Prayagraj Sangam (Custom Sample)">+ Enter Custom Sangam Spot</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                Logged By (Name / Role)
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="e.g. Citizen, Student, or Field Researcher"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                Remarks / Observations
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Clean morning flow, high pilgrim activity"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Parameters Grid */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2 sm:mb-3">
              Physicochemical Sensor Values
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3">
              
              {/* pH */}
              <div className="p-3 rounded-xl sm:rounded-2xl bg-slate-950/70 border border-slate-800">
                <label className="text-[11px] font-bold text-slate-300 block mb-1">pH Level</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="14"
                  value={formData.ph}
                  onChange={(e) => handleInputChange('ph', parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs sm:text-sm font-mono font-bold text-cyan-300 focus:outline-none focus:border-cyan-400"
                />
                <span className="text-[9px] text-slate-500 mt-1 block">Safe: 6.5 - 8.5</span>
              </div>

              {/* DO */}
              <div className="p-3 rounded-xl sm:rounded-2xl bg-slate-950/70 border border-slate-800">
                <label className="text-[11px] font-bold text-slate-300 block mb-1">DO (mg/L)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="20"
                  value={formData.do_level}
                  onChange={(e) => handleInputChange('do_level', parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs sm:text-sm font-mono font-bold text-cyan-300 focus:outline-none focus:border-cyan-400"
                />
                <span className="text-[9px] text-slate-500 mt-1 block">Bathing: ≥ 5.0</span>
              </div>

              {/* BOD */}
              <div className="p-3 rounded-xl sm:rounded-2xl bg-slate-950/70 border border-slate-800">
                <label className="text-[11px] font-bold text-slate-300 block mb-1">BOD (mg/L)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="30"
                  value={formData.bod}
                  onChange={(e) => handleInputChange('bod', parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs sm:text-sm font-mono font-bold text-cyan-300 focus:outline-none focus:border-cyan-400"
                />
                <span className="text-[9px] text-slate-500 mt-1 block">Safe: ≤ 3.0</span>
              </div>

              {/* Temp */}
              <div className="p-3 rounded-xl sm:rounded-2xl bg-slate-950/70 border border-slate-800">
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Temp (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="50"
                  value={formData.temperature}
                  onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs sm:text-sm font-mono font-bold text-cyan-300 focus:outline-none focus:border-cyan-400"
                />
                <span className="text-[9px] text-slate-500 mt-1 block">18 - 25°C</span>
              </div>

              {/* Conductivity */}
              <div className="p-3 rounded-xl sm:rounded-2xl bg-slate-950/70 border border-slate-800">
                <label className="text-[11px] font-bold text-slate-300 block mb-1">EC (µS/cm)</label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  max="5000"
                  value={formData.conductivity}
                  onChange={(e) => handleInputChange('conductivity', parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs sm:text-sm font-mono font-bold text-cyan-300 focus:outline-none focus:border-cyan-400"
                />
                <span className="text-[9px] text-slate-500 mt-1 block">Fresh: &lt; 500</span>
              </div>

              {/* Turbidity */}
              <div className="p-3 rounded-xl sm:rounded-2xl bg-slate-950/70 border border-slate-800">
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Turbidity</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={formData.turbidity}
                  onChange={(e) => handleInputChange('turbidity', parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs sm:text-sm font-mono font-bold text-cyan-300 focus:outline-none focus:border-cyan-400"
                />
                <span className="text-[9px] text-slate-500 mt-1 block">Safe: &lt; 10 NTU</span>
              </div>

              {/* ORP */}
              <div className="p-3 rounded-xl sm:rounded-2xl bg-slate-950/70 border border-slate-800">
                <label className="text-[11px] font-bold text-slate-300 block mb-1">ORP (mV)</label>
                <input
                  type="number"
                  step="1"
                  min="-200"
                  max="600"
                  value={formData.orp}
                  onChange={(e) => handleInputChange('orp', parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs sm:text-sm font-mono font-bold text-cyan-300 focus:outline-none focus:border-cyan-400"
                />
                <span className="text-[9px] text-slate-500 mt-1 block">Safe: &gt; 250</span>
              </div>

            </div>
          </div>

          {/* Action Trigger */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-800">
            <span className="text-xs text-slate-400 leading-snug">
              Evaluates CPCB religious bathing suitability, 24h oxygen fluctuation, and 7-day outlook.
            </span>

            <button
              id="analyze-todays-reading-btn"
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition flex items-center justify-center gap-2 group shrink-0 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-cyan-200" />
              <span>Analyze Today's Sangam Result</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </form>
      ) : (
        /* File Upload Mode */
        <div className="mt-5 sm:mt-6 space-y-5 sm:space-y-6">
          
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="p-6 sm:p-10 md:p-12 rounded-2xl sm:rounded-3xl border-2 border-dashed border-cyan-500/30 hover:border-cyan-400 bg-slate-950/60 hover:bg-slate-950/90 text-center cursor-pointer transition group"
          >
            <input 
              ref={fileInputRef}
              type="file" 
              accept=".csv,.json" 
              onChange={handleFileUpload}
              className="hidden" 
            />
            
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>

            <h3 className="text-sm sm:text-base font-bold text-white">
              {uploadedFile ? uploadedFile.name : "Drag & drop or tap to upload Today's CSV / JSON"}
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Upload laboratory water quality reports or IoT data logs to inspect today's result instantly.
            </p>

            <span className="mt-3.5 inline-block px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Browse Files
            </span>
          </div>

          {uploadError && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {/* Parsed Preview */}
          {parsedPreview && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">
                    Parsed Telemetry: {parsedPreview.station_name}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    pH: {parsedPreview.ph} • DO: {parsedPreview.do_level} mg/L • BOD: {parsedPreview.bod} mg/L • Temp: {parsedPreview.temperature} °C
                  </div>
                </div>
              </div>

              <button
                id="analyze-uploaded-file-btn"
                onClick={handleAnalyzeUploaded}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2 shrink-0 active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Analyze Uploaded File</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2">
            <span className="text-xs text-slate-400">Need a sample format?</span>
            <button
              onClick={downloadSampleCSV}
              className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 underline underline-offset-4 transition self-start sm:self-auto"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Sample Prayagraj Sangam CSV Template</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
}

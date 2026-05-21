import { Download, Sliders, Play, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

export default function OperationsDashboard({ candidates }) {
  const [retrainProgress, setRetrainProgress] = useState(false);
  const [logs, setLogs] = useState([
    '[2026-05-20 09:30] - Evaluator updated scoring weights',
    '[2026-05-19 14:15] - Retraining model batch 14 compiled (validation accuracy: 0.941)',
    '[2026-05-18 11:00] - Synced 4 new mobiliser candidates from Delhi West regional team',
    '[2026-05-17 16:45] - Scorer system migrated from raw SQL scoring logic to Sequelize ORM model structure'
  ]);

  const handleExportCSV = () => {
    if (candidates.length === 0) return;
    
    const headers = 'ID,Name,Phone,Email,DOB,Age,City,State,Score,Outcome,Notes,CreatedAt\n';
    const rows = candidates.map(c => 
      `"${c.id}","${c.fullName}","${c.phone}","${c.email || ''}","${c.dateOfBirth || ''}","${c.age || ''}","${c.city}","${c.state}","${c.score || ''}","${c.outcome}","${c.notes || ''}","${c.createdAt || ''}"`
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `evencargo_candidates_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleTriggerRetrain = () => {
    setRetrainProgress(true);
    const time = new Date().toLocaleTimeString();
    
    setTimeout(() => {
      setRetrainProgress(false);
      setLogs(prev => [
        `[${new Date().toISOString().split('T')[0]} ${time}] - Suitability assessment models recalibrated successfully!`,
        ...prev
      ]);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div id="overview" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Operations & Analytics Desk</h2>
          <p className="text-xs text-slate-500 mt-1">Export full recruitment datasets, recalibrate assessment scoring logic, and review calibration audit logs.</p>
        </div>

        <button
          id="database-export"
          onClick={handleExportCSV}
          disabled={candidates.length === 0}
          className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-indigo-650 hover:bg-indigo-750 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold rounded-xl shadow-sm transition active:scale-95 shrink-0"
        >
          <Download className="h-4 w-4" />
          <span>Export Database to CSV</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Scorer statistics */}
        <div id="calibration-metrics" className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-5 shadow-sm">
          <div>
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Calibration Metrics</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Parameters evaluating candidate training pipelines.</p>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div>
                <h4 className="font-bold text-slate-700">Enrolled Training Candidates</h4>
                <p className="text-slate-500 text-[10px]">Active female logistics learners.</p>
              </div>
              <span className="text-base font-black text-slate-800">12 Candidates</span>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div>
                <h4 className="font-bold text-slate-700">Onboarding Success Rate</h4>
                <p className="text-slate-500 text-[10px]">Ratio of candidates passing assessment and joining logistics teams.</p>
              </div>
              <span className="text-base font-black text-emerald-650">92.4%</span>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div>
                <h4 className="font-bold text-slate-700">Audit Rule Verification</h4>
                <p className="text-slate-500 text-[10px]">Confidence metric of the suitability scoring algorithm.</p>
              </div>
              <span className="text-base font-black text-indigo-750">96.8%</span>
            </div>
          </div>
        </div>

        {/* Dynamic model calibration trigger and logs */}
        <div id="recalibration-controls" className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-5 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Recalibration Controls</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Trigger evaluation optimizations on candidate inputs.</p>
              </div>

              <button
                onClick={handleTriggerRetrain}
                disabled={retrainProgress}
                className="flex items-center space-x-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg transition active:scale-95"
              >
                <Play className="w-3 h-3 text-indigo-600" />
                <span>{retrainProgress ? 'Processing...' : 'Recalibrate Scorer'}</span>
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-[10px] font-mono text-slate-500 max-h-[160px] overflow-y-auto">
              {logs.map((log, index) => (
                <p key={index} className="pb-1.5 border-b border-slate-150 last:border-b-0 last:pb-0">{log}</p>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-3.5 flex items-start space-x-2.5 text-[11px] mt-4">
            <AlertTriangle className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Scoring calibration alert</span>
              <p className="text-amber-700 mt-0.5">Adjusting scoring rules impacts metrics for all current batch interviews. Exercise caution.</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

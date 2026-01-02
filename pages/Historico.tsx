
import React from 'react';
import { useApp } from '../contexts/AppContext';

const Historico: React.FC = () => {
  const { state } = useApp();

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight italic">Log de Auditoria</h1>
        <p className="text-slate-500 font-medium italic">Rastro completo de todas as operações financeiras.</p>
      </div>

      <div className="space-y-3">
        {state.logs.map(log => (
          <div key={log.id} className="glass-card p-6 rounded-2xl border-white/5 flex items-center justify-between group hover:border-emerald-500/20 transition-all">
             <div className="flex items-center gap-6">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  log.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' :
                  log.type === 'warning' ? 'bg-rose-500/10 text-rose-500' : 'bg-blue-500/10 text-blue-500'
                }`}>
                   <i className={`fa-solid ${
                     log.type === 'success' ? 'fa-check' :
                     log.type === 'warning' ? 'fa-triangle-exclamation' : 'fa-info'
                   }`}></i>
                </div>
                <div>
                   <h4 className="font-bold text-white tracking-tight">{log.action}</h4>
                   <p className="text-xs text-slate-500 font-medium">{log.details}</p>
                </div>
             </div>
             <div className="text-right">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Timestamp</p>
                <p className="text-xs font-bold text-slate-400 mono">{new Date(log.timestamp).toLocaleTimeString()}</p>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Historico;

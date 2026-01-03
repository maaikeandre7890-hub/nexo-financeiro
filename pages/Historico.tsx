
import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';

const Historico: React.FC = () => {
  const { state, clearHistory } = useApp();
  const [showPinInput, setShowPinInput] = useState(false);
  const [pin, setPin] = useState('');

  const handleClear = () => {
    const success = clearHistory(pin);
    if (success) {
      setShowPinInput(false);
      setPin('');
    } else {
      alert('PIN Mestre Incorreto. Tentativa registrada.');
    }
  };

  return (
    <div className="space-y-8 py-2 page-enter">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight italic">Registros de Auditoria</h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">Log imutável de transações e alterações estruturais.</p>
        </div>
        <button 
          onClick={() => setShowPinInput(true)}
          className="px-6 py-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-500 hover:text-white transition-all"
        >
          Resetar Histórico
        </button>
      </div>

      {showPinInput && (
        <div className="glass-card p-8 rounded-3xl border-rose-500/30 bg-rose-500/[0.02] flex flex-col md:flex-row items-center justify-between gap-6 animate-in zoom-in-95">
          <div className="flex items-center gap-6">
             <i className="fa-solid fa-shield-halved text-2xl text-rose-500"></i>
             <div>
                <p className="text-[10px] font-black text-rose-500 uppercase mb-1">Acesso à Chave Mestra</p>
                <p className="text-xs text-slate-400 font-medium">O reset é uma ação destrutiva. Insira o PIN mestre.</p>
             </div>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
             <input 
               type="password" 
               maxLength={6} 
               placeholder="******" 
               className="flex-1 md:flex-none bg-slate-950 border border-white/10 rounded-xl px-4 py-2 text-center text-white mono focus:border-rose-500"
               value={pin}
               onChange={(e) => setPin(e.target.value)}
             />
             <button onClick={handleClear} className="px-6 py-2 bg-rose-500 text-white font-black text-[10px] uppercase rounded-xl">Confirmar</button>
             <button onClick={() => setShowPinInput(false)} className="text-slate-500 px-2 text-xs font-bold">Sair</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {state.logs.map(log => (
          <div key={log.id} className="glass-card p-6 rounded-2xl border-white/5 flex items-center justify-between group">
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
                   <h4 className="text-sm font-bold text-white tracking-tight">{log.action}</h4>
                   <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{log.details}</p>
                </div>
             </div>
             <div className="text-right hidden md:block">
                <p className="text-[10px] font-black text-slate-700 uppercase mb-1">TIMESTAMP</p>
                <p className="text-[11px] font-bold text-slate-500 mono">{new Date(log.timestamp).toLocaleTimeString()}</p>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Historico;

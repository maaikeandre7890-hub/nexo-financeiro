import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext.tsx';

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
      alert('Código incorreto. A tentativa foi registrada por segurança.');
    }
  };

  return (
    <div className="space-y-6 md:space-y-10 page-enter">
      <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-4 text-center md:text-left">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight italic uppercase">Histórico de Ações</h1>
          <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">Registro completo de auditoria do sistema em tempo real.</p>
        </div>
        <button 
          onClick={() => setShowPinInput(true)}
          className="w-full md:w-auto px-6 py-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-500 hover:text-white transition-all active:scale-95"
        >
          Limpar Tudo
        </button>
      </div>

      {showPinInput && (
        <div className="glass-card p-6 sm:p-8 rounded-3xl border-rose-500/30 bg-rose-500/[0.02] flex flex-col items-center gap-6 animate-in zoom-in-95">
          <div className="flex flex-col items-center text-center gap-3">
             <i className="fa-solid fa-shield-halved text-2xl text-rose-500"></i>
             <div>
                <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">Acesso de Segurança</p>
                <p className="text-xs text-slate-400 font-medium">Digite o código PIN mestre de 6 dígitos para limpar.</p>
             </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
             <input 
               type="password" 
               maxLength={6} 
               placeholder="******" 
               className="w-full sm:w-32 bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-center text-white mono focus:border-rose-500 outline-none"
               value={pin}
               onChange={(e) => setPin(e.target.value)}
             />
             <div className="flex gap-2 w-full sm:w-auto">
                <button onClick={handleClear} className="flex-1 sm:flex-none px-6 py-3 bg-rose-500 text-white font-black text-[10px] uppercase rounded-xl tracking-widest">Confirmar</button>
                <button onClick={() => setShowPinInput(false)} className="flex-1 sm:flex-none px-6 py-3 bg-white/5 text-slate-500 font-black text-[10px] uppercase rounded-xl tracking-widest">Cancelar</button>
             </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {state.logs.length > 0 ? (
          state.logs.map(log => (
            <div key={log.id} className="glass-card p-4 sm:p-6 rounded-2xl border-white/5 flex items-start justify-between gap-4 group hover:border-white/10 transition-all">
               <div className="flex items-start gap-4">
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    log.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' :
                    log.type === 'warning' ? 'bg-rose-500/10 text-rose-500' : 'bg-blue-500/10 text-blue-500'
                  }`}>
                     <i className={`fa-solid text-sm ${
                       log.type === 'success' ? 'fa-check' :
                       log.type === 'warning' ? 'fa-triangle-exclamation' : 'fa-info'
                     }`}></i>
                  </div>
                  <div className="min-w-0">
                     <h4 className="text-sm font-bold text-white tracking-tight truncate">{log.action}</h4>
                     <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic">{log.details}</p>
                     {/* Mobile Timestamp */}
                     <p className="md:hidden text-[9px] font-black text-slate-700 uppercase mt-2 mono">{new Date(log.timestamp).toLocaleTimeString()}</p>
                  </div>
               </div>
               {/* Desktop Timestamp */}
               <div className="text-right hidden md:block shrink-0">
                  <p className="text-[10px] font-black text-slate-700 uppercase mb-1">REGISTRO</p>
                  <p className="text-[11px] font-bold text-slate-500 mono">{new Date(log.timestamp).toLocaleTimeString()}</p>
               </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center opacity-30 italic">
            <p className="text-sm font-black uppercase tracking-widest text-slate-600">Nenhum registro encontrado no sistema.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Historico;
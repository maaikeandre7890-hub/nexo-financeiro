
import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';

const Historico: React.FC = () => {
  const { state } = useApp();
  const [showPinInput, setShowPinInput] = useState(false);
  const [pin, setPin] = useState('');

  const handleClearHistory = () => {
    if (pin === '123456') { // PIN Mockado do dono
      alert('Histórico limpo com sucesso.');
      setShowPinInput(false);
      setPin('');
    } else {
      alert('PIN Inválido.');
    }
  };

  return (
    <div className="space-y-8 py-2 page-enter">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Audit Log<span className="text-emerald-500">.</span></h1>
          <p className="text-zinc-500 text-sm mt-2 font-medium">Registro imutável de todas as operações financeiras do sistema.</p>
        </div>
        <button 
          onClick={() => setShowPinInput(true)}
          className="px-6 py-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-500 hover:text-white transition-all"
        >
          Limpar Histórico
        </button>
      </div>

      {showPinInput && (
        <div className="glass-card p-8 rounded-3xl border-rose-500/30 bg-rose-500/[0.02] flex items-center justify-between animate-in zoom-in-95">
          <div className="flex items-center gap-6">
             <i className="fa-solid fa-shield-halved text-2xl text-rose-500"></i>
             <div>
                <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">Ação Crítica Protegida</p>
                <p className="text-xs text-zinc-400 font-medium italic">Insira o PIN DO DONO (6 dígitos) para continuar.</p>
             </div>
          </div>
          <div className="flex gap-4">
             <input 
               type="password" 
               maxLength={6} 
               placeholder="******" 
               className="bg-black border border-white/10 rounded-xl px-4 py-2 text-center text-white mono w-32 focus:outline-none focus:border-rose-500"
               value={pin}
               onChange={(e) => setPin(e.target.value)}
             />
             <button onClick={handleClearHistory} className="px-6 py-2 bg-rose-500 text-white font-black text-[10px] uppercase rounded-xl hover:bg-rose-400">Confirmar</button>
             <button onClick={() => setShowPinInput(false)} className="text-zinc-600 hover:text-white text-xs font-bold px-2">Cancelar</button>
          </div>
        </div>
      )}

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
                   <h4 className="text-sm font-bold text-white tracking-tight">{log.action}</h4>
                   <p className="text-[11px] text-zinc-500 font-medium">{log.details}</p>
                </div>
             </div>
             <div className="text-right">
                <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest mb-1">DATA/HORA</p>
                <p className="text-[11px] font-bold text-zinc-500 mono">{new Date(log.timestamp).toLocaleString('pt-BR')}</p>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Historico;

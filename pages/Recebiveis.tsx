
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

const Recebiveis: React.FC = () => {
  const { state, markAsPaid, deleteReceivable, formatNumber } = useApp();
  const [filter, setFilter] = useState<'Todos' | 'Pendente' | 'Pago' | 'Atrasado'>('Todos');
  const navigate = useNavigate();

  const filteredItems = state.receivables.filter(r => 
    filter === 'Todos' ? true : r.status === filter
  );

  const handleQuickPay = (id: string) => {
    markAsPaid(id, 'PIX');
    navigate('/dashboard');
  };

  const exportToCSV = () => {
    const headers = ['Cliente', 'Valor', 'Vencimento', 'Status', 'Categoria'];
    const rows = filteredItems.map(r => [
      r.clientName,
      formatNumber(r.amount).replace(/\./g, ''),
      r.dueDate,
      r.status,
      r.category
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `nexo_recebiveis.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 sm:space-y-12 py-6 page-enter">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 sm:gap-10">
        <div className="space-y-2 sm:space-y-4">
          <div className="flex items-center gap-3">
             <span className="text-[9px] sm:text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em]">Fluxo de Entrada</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tighter italic uppercase leading-none">Recebíveis.</h1>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={exportToCSV}
            className="p-4 sm:p-5 bg-white/5 border border-white/5 text-zinc-500 rounded-2xl hover:text-white transition-all shadow-xl"
          >
            <i className="fa-solid fa-file-export"></i>
          </button>
          <button 
            onClick={() => navigate('/recebiveis/novo')}
            className="flex-1 md:flex-none px-8 py-4 sm:py-5 bg-white text-black rounded-2xl font-black text-[10px] sm:text-[11px] uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-xl"
          >
            Novo Recebimento
          </button>
        </div>
      </div>
      
      <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar snap-x">
        {['Todos', 'Pendente', 'Pago', 'Atrasado'].map((f) => (
          <button 
            key={f} 
            onClick={() => setFilter(f as any)}
            className={`whitespace-nowrap px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl border text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all snap-start ${
              filter === f 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                : 'bg-white/[0.01] text-zinc-500 border-white/[0.03] hover:border-white/10'
            }`}
          >
            {f === 'Todos' ? 'Tudo' : f}
          </button>
        ))}
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden space-y-4">
        {filteredItems.map((rec) => (
          <div key={rec.id} className="glass-card p-5 space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h4 className="text-sm font-black text-white">{rec.clientName}</h4>
                <div className="flex gap-2 items-center">
                  <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                    rec.status === 'Pago' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' : 
                    rec.status === 'Atrasado' ? 'text-rose-500 border-rose-500/20 bg-rose-500/5' : 
                    'text-amber-500 border-amber-500/20 bg-amber-500/5'
                  }`}>
                    {rec.status}
                  </span>
                  <span className="text-[8px] font-bold text-zinc-600 uppercase mono italic">
                    {new Date(rec.dueDate).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-black text-white mono">R$ {formatNumber(rec.amount)}</p>
                <p className="text-[8px] font-bold text-zinc-700 uppercase">{rec.category}</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              {rec.status !== 'Pago' && (
                <button 
                  onClick={() => handleQuickPay(rec.id)}
                  className="flex-1 py-3 bg-emerald-500 text-black text-[9px] font-black uppercase tracking-widest rounded-xl"
                >
                  Baixa Rápida
                </button>
              )}
              <button 
                onClick={() => { if(confirm('Apagar?')) deleteReceivable(rec.id)}}
                className="w-12 py-3 bg-white/5 text-zinc-700 rounded-xl hover:text-rose-500"
              >
                <i className="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block glass-card rounded-[3rem] overflow-hidden border-white/5">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/[0.01] border-b border-white/[0.03]">
              <th className="px-10 py-6 text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">Cliente</th>
              <th className="px-10 py-6 text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">Vencimento</th>
              <th className="px-10 py-6 text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">Status</th>
              <th className="px-10 py-6 text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] text-right">Valor</th>
              <th className="px-10 py-6 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {filteredItems.map((rec) => (
              <tr key={rec.id} className="hover:bg-white/[0.01] transition-all group">
                <td className="px-10 py-8">
                  <p className="font-black text-white text-lg tracking-tight">{rec.clientName}</p>
                  <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mt-1">{rec.category}</p>
                </td>
                <td className="px-10 py-8">
                  <span className="text-sm font-black text-zinc-400 mono">{new Date(rec.dueDate).toLocaleDateString('pt-BR')}</span>
                </td>
                <td className="px-10 py-8">
                  <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                    rec.status === 'Pago' ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20' : 
                    rec.status === 'Atrasado' ? 'bg-rose-500/5 text-rose-400 border-rose-500/20' : 
                    'bg-amber-500/5 text-amber-400 border-amber-500/20'
                  }`}>
                    {rec.status}
                  </span>
                </td>
                <td className="px-10 py-8 text-right">
                  <span className="text-xl font-black text-white mono">R$ {formatNumber(rec.amount)}</span>
                </td>
                <td className="px-10 py-8 text-right">
                   <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                      {rec.status !== 'Pago' && (
                        <button 
                          onClick={() => handleQuickPay(rec.id)}
                          className="px-6 py-2 bg-emerald-500 text-black text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-400"
                        >
                          Baixar
                        </button>
                      )}
                      <button 
                        onClick={() => { if(confirm('Apagar?')) deleteReceivable(rec.id)}}
                        className="w-10 h-10 flex items-center justify-center text-zinc-700 hover:text-rose-500"
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Recebiveis;

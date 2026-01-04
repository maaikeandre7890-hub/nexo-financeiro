
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
    // Fix: Use 'PIX' instead of 'Pix' to match the type in types.ts
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
    <div className="space-y-12 py-6 page-enter">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em]">Fluxo de Entrada</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter italic uppercase leading-none">Meus <br/><span className="text-slate-600">Recebíveis.</span></h1>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button 
            onClick={exportToCSV}
            className="p-5 bg-white/5 border border-white/5 text-slate-400 rounded-2xl hover:text-white transition-all shadow-xl"
          >
            <i className="fa-solid fa-file-export"></i>
          </button>
          <button 
            onClick={() => navigate('/recebiveis/novo')}
            className="flex-1 md:flex-none px-10 py-5 bg-white text-black rounded-[2rem] font-black text-[11px] uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-xl"
          >
            Novo Recebimento
          </button>
        </div>
      </div>
      
      <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar">
        {['Todos', 'Pendente', 'Pago', 'Atrasado'].map((f) => (
          <button 
            key={f} 
            onClick={() => setFilter(f as any)}
            className={`whitespace-nowrap px-8 py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${
              filter === f 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                : 'bg-white/[0.01] text-slate-500 border-white/[0.03] hover:border-white/10'
            }`}
          >
            {f === 'Todos' ? 'Tudo' : f}
          </button>
        ))}
      </div>

      <div className="hidden md:block glass-card rounded-[4rem] overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/[0.01] border-b border-white/[0.03]">
              <th className="px-12 py-8 text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Cliente</th>
              <th className="px-12 py-8 text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Vencimento</th>
              <th className="px-12 py-8 text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Status</th>
              <th className="px-12 py-8 text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] text-right">Valor</th>
              <th className="px-12 py-8 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {filteredItems.map((rec) => (
              <tr key={rec.id} className="hover:bg-white/[0.01] transition-all group">
                <td className="px-12 py-10">
                  <p className="font-black text-white text-lg tracking-tight">{rec.clientName}</p>
                  <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mt-1">{rec.category}</p>
                </td>
                <td className="px-12 py-10">
                  <span className="text-sm font-black text-slate-400 mono">{new Date(rec.dueDate).toLocaleDateString('pt-BR')}</span>
                </td>
                <td className="px-12 py-10">
                  <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                    rec.status === 'Pago' ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20' : 
                    rec.status === 'Atrasado' ? 'bg-rose-500/5 text-rose-400 border-rose-500/20' : 
                    'bg-amber-500/5 text-amber-400 border-amber-500/20'
                  }`}>
                    {rec.status}
                  </span>
                </td>
                <td className="px-12 py-10 text-right">
                  <span className="text-xl font-black text-white mono">R$ {formatNumber(rec.amount)}</span>
                </td>
                <td className="px-12 py-10 text-right">
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
                        className="w-10 h-10 flex items-center justify-center text-slate-700 hover:text-rose-500"
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

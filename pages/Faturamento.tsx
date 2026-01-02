
import React from 'react';

const Faturamento: React.FC = () => {
  const invoices = [
    { id: 'NF-2024-001', client: 'Tecnologia Avançada SA', value: 'R$ 15.000,00', date: '12/06/2024', status: 'Emitida' },
    { id: 'NF-2024-002', client: 'Varejo Global', value: 'R$ 4.200,00', date: '14/06/2024', status: 'Processando' },
    { id: 'NF-2024-003', client: 'Indústrias Matarazzo', value: 'R$ 89.400,00', date: '15/06/2024', status: 'Emitida' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Faturamento Eletrônico</h1>
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase rounded border border-emerald-500/30">Acesso Total</span>
          </div>
          <p className="text-slate-500 font-medium">Gestão de Notas Fiscais e emissão de boletos sem limites.</p>
        </div>
        <button className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-2.5 px-8 rounded-xl transition-all flex items-center gap-2 shadow-xl shadow-emerald-500/20 active:scale-95">
          <i className="fa-solid fa-file-invoice-dollar"></i>
          Emitir Nova Nota
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Faturado (Mês)', value: 'R$ 108.600', color: 'text-emerald-500' },
          { label: 'Notas em Processamento', value: '1', color: 'text-amber-500' },
          { label: 'Limite de Emissão', value: 'Ilimitado', color: 'text-blue-500' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6 rounded-3xl border-white/5">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
            <p className={`text-2xl font-black ${stat.color} mono`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-[2.5rem] overflow-hidden border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/50 border-b border-slate-800/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Identificador</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Cliente</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Valor Bruto</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-6 text-sm font-bold text-slate-300 mono">{inv.id}</td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-white">{inv.client}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">{inv.date}</p>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-white mono">{inv.value}</td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      inv.status === 'Emitida' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="text-slate-500 hover:text-white transition-colors">
                      <i className="fa-solid fa-download"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Faturamento;

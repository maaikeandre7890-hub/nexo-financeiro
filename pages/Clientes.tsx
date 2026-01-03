
import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { AddClientModal } from '../components/Modals';

const Clientes: React.FC = () => {
  const { state } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredClients = state.clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 md:space-y-12 py-4 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8">
        <div>
          <h2 className="text-[10px] md:label-pro text-emerald-500 mb-2 md:mb-4 tracking-[0.3em] font-black uppercase">Repositório de Clientes</h2>
          <h1 className="text-3xl md:text-5xl heading-pro text-white leading-none tracking-tighter">Entidades <span className="italic text-slate-500">Corporativas</span></h1>
        </div>
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Filtrar base de dados..." 
            className="w-full md:w-80 bg-white/[0.02] border border-white/[0.05] rounded-xl py-3 md:py-4 px-6 text-xs font-bold text-white focus:outline-none focus:border-emerald-500/30 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full md:w-auto px-8 py-4 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-400 transition-all active:scale-95"
          >
            Adicionar Entidade
          </button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block glass-card rounded-[2.5rem] overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/[0.01] border-b border-white/[0.03]">
              <th className="px-10 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">ID Corporativo</th>
              <th className="px-10 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Status</th>
              <th className="px-10 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Análise de Risco</th>
              <th className="px-10 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Valor Mensal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {filteredClients.map((client) => (
              <tr key={client.id} className="hover:bg-white/[0.01] transition-all group">
                <td className="px-10 py-8">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-slate-900 border border-white/5 rounded-2xl flex items-center justify-center text-slate-500 font-black group-hover:text-emerald-500 transition-all shadow-inner">
                      {client.name.substring(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-black text-white text-base tracking-tight">{client.name}</p>
                      <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-1">ID: {client.id.toUpperCase()}</p>
                    </div>
                  </div>
                </td>
                <td className="px-10 py-8">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                    client.status === 'Ativo' ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-500 border-slate-700'
                  }`}>
                    {client.status}
                  </span>
                </td>
                <td className="px-10 py-8">
                   <div className="flex items-center gap-4">
                      <div className="w-32 h-1 bg-slate-900 rounded-full overflow-hidden border border-white/[0.03]">
                        <div className="h-full bg-emerald-500 shadow-[0_0_8px_#10b981]" style={{ width: `${client.score}%` }}></div>
                      </div>
                      <span className="text-[10px] font-black text-slate-500 mono">{client.score}%</span>
                   </div>
                </td>
                <td className="px-10 py-8 text-right">
                  <span className="text-lg font-black text-white mono">R$ {client.monthlyValue.toLocaleString()}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Grid */}
      <div className="md:hidden space-y-4">
        {filteredClients.map((client) => (
          <div key={client.id} className="glass-card p-6 rounded-2xl border-white/5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-900 border border-white/5 rounded-xl flex items-center justify-center text-slate-500 font-black">
                  {client.name.substring(0, 1).toUpperCase()}
                </div>
                <div>
                  <p className="font-black text-white text-sm tracking-tight">{client.name}</p>
                  <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">ID: {client.id.toUpperCase()}</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                client.status === 'Ativo' ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-500 border-slate-700'
              }`}>
                {client.status}
              </span>
            </div>
            <div className="flex justify-between items-end border-t border-white/5 pt-4">
              <div className="space-y-1">
                <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Saúde do Cliente</p>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${client.score}%` }}></div>
                  </div>
                  <span className="text-[9px] font-black text-zinc-400 mono">{client.score}%</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Assinatura</p>
                <p className="text-base font-black text-white mono">R$ {client.monthlyValue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AddClientModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Clientes;

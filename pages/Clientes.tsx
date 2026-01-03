
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
    <div className="space-y-12 py-6 page-enter">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em]">Diretório de Parceiros</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter italic uppercase leading-none">Meus <br/><span className="text-slate-600">Clientes.</span></h1>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative group w-full sm:w-80">
            <i className="fa-solid fa-search absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors"></i>
            <input 
              type="text" 
              placeholder="Buscar por nome..." 
              className="w-full bg-white/[0.02] border border-white/[0.05] rounded-[2rem] py-5 pl-14 pr-8 text-xs font-black text-white focus:outline-none focus:border-emerald-500/30 transition-all shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto px-10 py-5 bg-white text-black rounded-[2rem] font-black text-[11px] uppercase tracking-widest hover:bg-emerald-400 transition-all active:scale-95 shadow-xl"
          >
            Adicionar Novo
          </button>
        </div>
      </div>

      {/* Tabela Desktop Premium */}
      <div className="hidden md:block glass-card rounded-[4rem] overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/[0.01] border-b border-white/[0.03]">
              <th className="px-12 py-8 text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Identidade</th>
              <th className="px-12 py-8 text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Status</th>
              <th className="px-12 py-8 text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Saúde</th>
              <th className="px-12 py-8 text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] text-right">Faturamento /mês</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {filteredClients.map((client) => (
              <tr key={client.id} className="hover:bg-white/[0.01] transition-all group cursor-default">
                <td className="px-12 py-10">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-center text-slate-500 font-black group-hover:text-emerald-500 group-hover:border-emerald-500/20 transition-all shadow-inner text-xl">
                      {client.name.substring(0, 1).toUpperCase()}
                    </div>
                    <div className="space-y-1">
                      <p className="font-black text-white text-lg tracking-tight group-hover:translate-x-1 transition-transform">{client.name}</p>
                      <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">{client.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-12 py-10">
                  <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                    client.status === 'Ativo' ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20' : 'bg-slate-900 text-slate-600 border-white/5'
                  }`}>
                    {client.status}
                  </span>
                </td>
                <td className="px-12 py-10">
                   <div className="flex items-center gap-5">
                      <div className="w-40 h-1.5 bg-white/[0.02] rounded-full overflow-hidden border border-white/[0.05]">
                        <div className="h-full bg-emerald-500 shadow-[0_0_12px_#10b981]" style={{ width: `${client.score}%` }}></div>
                      </div>
                      <span className="text-[11px] font-black text-slate-500 mono">{client.score}%</span>
                   </div>
                </td>
                <td className="px-12 py-10 text-right">
                  <span className="text-xl font-black text-white mono">R$ {client.monthlyValue.toLocaleString()}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredClients.length === 0 && (
          <div className="py-24 text-center">
            <p className="text-xs font-black text-slate-700 uppercase tracking-[0.6em] italic">Base de dados vazia</p>
          </div>
        )}
      </div>

      {/* Cards Mobile de Alta Performance */}
      <div className="md:hidden space-y-6">
        {filteredClients.map((client) => (
          <div key={client.id} className="glass-card p-8 rounded-[3rem] border-white/5 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center justify-center text-slate-500 font-black text-lg">
                  {client.name.substring(0, 1).toUpperCase()}
                </div>
                <div>
                  <p className="font-black text-white text-base tracking-tight">{client.name}</p>
                  <p className="text-[8px] text-slate-600 font-black uppercase tracking-[0.3em]">{client.status}</p>
                </div>
              </div>
              <button className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full text-slate-500"><i className="fa-solid fa-ellipsis-vertical"></i></button>
            </div>
            <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
              <div className="space-y-1">
                <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Score Fiscal</p>
                <p className="text-sm font-black text-emerald-500 mono">{client.score}%</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Mensalidade</p>
                <p className="text-sm font-black text-white mono">R$ {client.monthlyValue.toLocaleString()}</p>
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

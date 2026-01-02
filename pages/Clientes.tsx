
import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { AddClientModal } from '../components/Modals';

const Clientes: React.FC = () => {
  const { state, deleteClient } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredClients = state.clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div>
          <h2 className="label-pro text-emerald-500 mb-4 tracking-[0.3em]">Client Database</h2>
          <h1 className="text-4xl font-extrabold text-white tracking-tighter leading-none">Gestão de <span className="italic">Portfólio</span></h1>
          <p className="text-slate-500 font-medium text-sm mt-4 italic">Monitoramento ativo de <span className="text-white font-bold">{state.clients.length} entidades corporativas.</span></p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80 group">
            <i className="fa-solid fa-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 text-xs group-focus-within:text-emerald-500 transition-colors"></i>
            <input 
              type="text" 
              placeholder="Localizar contrato ou entidade..." 
              className="w-full bg-white/[0.02] border border-white/[0.05] rounded-2xl py-4 pl-12 pr-6 text-xs font-bold text-white focus:outline-none focus:border-emerald-500/30 transition-all shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-white hover:bg-emerald-400 text-slate-950 font-black py-4 px-8 rounded-2xl transition-all flex items-center gap-3 whitespace-nowrap shadow-2xl active:scale-95 text-xs uppercase tracking-widest"
          >
            <i className="fa-solid fa-user-plus"></i>
            New Client
          </button>
        </div>
      </div>

      <div className="glass-card rounded-[3rem] overflow-hidden border-white/[0.03]">
        <div className="overflow-x-auto">
          {filteredClients.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.01] border-b border-white/[0.03]">
                  <th className="px-10 py-6 label-pro">Corporate Entity</th>
                  <th className="px-10 py-6 label-pro">Lifecycle Status</th>
                  <th className="px-10 py-6 label-pro">Health Score</th>
                  <th className="px-10 py-6 label-pro text-right">Contract MRR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-white/[0.01] transition-colors group">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/[0.05] flex items-center justify-center text-slate-400 font-black group-hover:text-emerald-500 transition-all shadow-inner">
                          {client.name.substring(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-extrabold text-white text-base tracking-tight">{client.name}</p>
                          <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mt-1">{client.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className={`inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border ${
                        client.status === 'Ativo' ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-500 border-slate-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${client.status === 'Ativo' ? 'bg-emerald-400' : 'bg-slate-500'}`}></span>
                        {client.status}
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex flex-col gap-3">
                        <div className="w-40 h-1.5 bg-slate-900 border border-white/[0.03] rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${client.score > 90 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                            style={{ width: `${client.score}%` }}
                          ></div>
                        </div>
                        <span className={`text-[10px] font-black tracking-widest uppercase ${client.score > 90 ? 'text-emerald-500' : 'text-amber-500'}`}>Score: {client.score}%</span>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <span className="text-lg font-black text-white mono tracking-tighter">R$ {client.monthlyValue.toLocaleString()}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-32 text-center flex flex-col items-center gap-8">
              <div className="w-24 h-24 bg-white/[0.02] border border-white/[0.05] rounded-full flex items-center justify-center">
                <i className="fa-solid fa-ghost text-4xl text-slate-700"></i>
              </div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-[0.2em]">Zero data points found</p>
            </div>
          )}
        </div>
      </div>
      <AddClientModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Clientes;

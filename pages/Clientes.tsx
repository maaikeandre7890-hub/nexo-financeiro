
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
    <div className="space-y-12 py-4 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-end gap-8">
        <div>
          <h2 className="label-pro text-emerald-500 mb-4 tracking-[0.3em]">Client Repository</h2>
          <h1 className="text-5xl heading-pro text-white leading-none tracking-tighter">Entidades <span className="italic text-slate-500">Corporativas</span></h1>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Filter database..." 
            className="flex-1 md:w-80 bg-white/[0.02] border border-white/[0.05] rounded-xl py-4 px-6 text-xs font-bold text-white focus:outline-none focus:border-emerald-500/30 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-4 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-400 transition-all"
          >
            Add New Entity
          </button>
        </div>
      </div>

      <div className="glass-card rounded-[2.5rem] overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/[0.01] border-b border-white/[0.03]">
              <th className="px-10 py-6 label-pro">Corporate ID</th>
              <th className="px-10 py-6 label-pro">Status</th>
              <th className="px-10 py-6 label-pro">Risk Analysis</th>
              <th className="px-10 py-6 label-pro text-right">Contract Value</th>
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
      <AddClientModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Clientes;


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

  const exportCSV = () => {
    const headers = ['ID', 'Nome', 'Email', 'Status', 'MRR', 'Score'];
    const rows = filteredClients.map(c => [c.id, c.name, c.email, c.status, c.monthlyValue, c.score]);
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "nexo_clientes.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2 italic">Carteira de Clientes</h1>
          <p className="text-slate-500 font-medium italic">Análise de <span className="text-white font-bold">{state.clients.length} contratos</span> vigentes.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button 
            onClick={exportCSV}
            className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-500 hover:text-white transition-all"
            title="Exportar CSV"
          >
            <i className="fa-solid fa-file-export"></i>
          </button>
          <div className="relative flex-1 md:w-64">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-xs"></i>
            <input 
              type="text" 
              placeholder="Buscar por nome..." 
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold text-white focus:outline-none focus:border-emerald-500/50 transition-all shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-2.5 px-6 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap shadow-lg shadow-emerald-500/20 active:scale-95"
          >
            <i className="fa-solid fa-plus"></i>
            Novo Cliente
          </button>
        </div>
      </div>

      <div className="glass-card rounded-[2.5rem] overflow-hidden border-white/5 bg-slate-900/20">
        <div className="overflow-x-auto">
          {filteredClients.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/80 border-b border-slate-800/50">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Entidade</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Nível de Risco</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">MRR Atual</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Controles</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/30">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-emerald-500/[0.02] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 font-black group-hover:text-emerald-500 transition-all shadow-inner">
                          {client.name.substring(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-white group-hover:text-emerald-400 transition-colors tracking-tight">{client.name}</p>
                          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{client.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        client.status === 'Ativo' ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-500 border-slate-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${client.status === 'Ativo' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}></span>
                        {client.status}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center w-36">
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Score de Confiança</span>
                          <span className={`text-[10px] font-bold ${client.score > 90 ? 'text-emerald-500' : 'text-amber-500'}`}>{client.score}%</span>
                        </div>
                        <div className="w-36 h-1.5 bg-slate-900 border border-slate-800 rounded-full overflow-hidden shadow-inner">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${client.score > 90 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-amber-500'}`} 
                            style={{ width: `${client.score}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-black text-white mono tracking-tighter">R$ {client.monthlyValue.toLocaleString()}</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                        <button 
                          onClick={() => deleteClient(client.id)}
                          className="w-9 h-9 rounded-xl bg-rose-500/5 text-rose-500 hover:bg-rose-500 hover:text-white transition-all border border-rose-500/10"
                        >
                          <i className="fa-solid fa-trash-can text-sm"></i>
                        </button>
                        <button className="w-9 h-9 rounded-xl bg-slate-800 text-slate-500 hover:text-white transition-all border border-slate-700">
                          <i className="fa-solid fa-ellipsis-vertical"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-32 text-center flex flex-col items-center gap-6">
              <div className="w-20 h-20 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center">
                <i className="fa-solid fa-users-slash text-4xl text-slate-700"></i>
              </div>
              <div>
                <h3 className="text-xl font-black text-white mb-2">Ecossistema Vazio</h3>
                <p className="text-slate-500 text-sm italic font-medium">Inicie o fluxo cadastrando seu primeiro cliente estratégico.</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <AddClientModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Clientes;

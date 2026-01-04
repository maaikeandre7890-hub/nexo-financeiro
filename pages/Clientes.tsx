
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Client, Receivable } from '../types';

const Clientes: React.FC = () => {
  const { state, formatNumber, deleteClient, updateClient, renegotiateClient, markAsPaid, updateReceivable } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Estados dos Modais
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [viewingParcelas, setViewingParcelas] = useState<Client | null>(null);
  const [payingClient, setPayingClient] = useState<{client: Client, rec: Receivable} | null>(null);
  const [renegotiatingClient, setRenegotiatingClient] = useState<Client | null>(null);

  const filteredClients = state.clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.document.includes(searchTerm)
  );

  const handleWhatsAppCharge = (client: Client) => {
    const nextRec = state.receivables.find(r => r.clientId === client.id && r.status !== 'Pago');
    const message = `Olá ${client.name}! Tudo bem? Gostaria de lembrá-lo do seu pagamento de R$ ${formatNumber(client.monthlyValue)} ${nextRec ? `com vencimento em ${new Date(nextRec.dueDate).toLocaleDateString('pt-BR')}` : ''}. Como podemos facilitar para você?`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${client.phone.replace(/\D/g, '')}?text=${encoded}`, '_blank');
  };

  const getNextReceivable = (clientId: string) => {
    return state.receivables
      .filter(r => r.clientId === clientId && r.status !== 'Pago')
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0];
  };

  return (
    <div className="space-y-12 py-6 page-enter relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em]">Gestão de Parceiros</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter italic uppercase leading-none">Meus <br/><span className="text-slate-600">Clientes.</span></h1>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <button 
            onClick={() => navigate('/clientes/importar')}
            className="w-full sm:w-auto px-8 py-5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 rounded-[2rem] font-black text-[11px] uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-all active:scale-95 shadow-xl"
          >
            <i className="fa-solid fa-file-import mr-2"></i> Importar Clientes
          </button>
          <button 
            onClick={() => navigate('/renegociacoes')}
            className="w-full sm:w-auto px-8 py-5 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-[2rem] font-black text-[11px] uppercase tracking-widest hover:bg-amber-500 hover:text-black transition-all active:scale-95 shadow-xl"
          >
            <i className="fa-solid fa-handshake-angle mr-2"></i> Renegociações
          </button>
          <div className="relative group w-full sm:w-64">
            <i className="fa-solid fa-search absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors"></i>
            <input 
              type="text" 
              placeholder="Buscar..." 
              className="w-full bg-white/[0.02] border border-white/[0.05] rounded-[2rem] py-5 pl-14 pr-8 text-xs font-black text-white focus:outline-none focus:border-emerald-500/30 transition-all shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => navigate('/clientes/novo')}
            className="w-full sm:w-auto px-10 py-5 bg-white text-black rounded-[2rem] font-black text-[11px] uppercase tracking-widest hover:bg-emerald-400 transition-all active:scale-95 shadow-xl"
          >
            Novo Cliente
          </button>
        </div>
      </div>

      {/* Tabela Desktop */}
      <div className="hidden md:block glass-card rounded-[4rem] overflow-hidden bg-[#020608] border-white/[0.02]">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/[0.01] border-b border-white/[0.03]">
              <th className="px-12 py-8 text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Nome do Cliente / Doc</th>
              <th className="px-12 py-8 text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Contato WhatsApp</th>
              <th className="px-12 py-8 text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Operações</th>
              <th className="px-12 py-8 text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] text-right">Mensalidade</th>
              <th className="px-12 py-8"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {filteredClients.map((client) => {
              const nextRec = getNextReceivable(client.id);
              const isAtrasado = nextRec && nextRec.dueDate < new Date().toISOString().split('T')[0];

              return (
                <tr key={client.id} className="hover:bg-white/[0.015] transition-all group border-l-4 border-l-transparent hover:border-l-emerald-500">
                  <td className="px-12 py-10">
                    <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 bg-white/[0.02] border rounded-2xl flex items-center justify-center font-black transition-all shadow-inner text-xl shrink-0 ${isAtrasado ? 'border-rose-500/40 text-rose-500' : 'border-white/10 text-slate-500 group-hover:text-emerald-500'}`}>
                        {client.name.substring(0, 1).toUpperCase()}
                      </div>
                      <div className="space-y-1">
                        <p className="font-black text-white text-lg tracking-tight group-hover:translate-x-1 transition-transform">{client.name}</p>
                        <div className="flex items-center gap-3">
                           <span className="text-[8px] font-black px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 rounded uppercase">{client.type}</span>
                           <p className="text-[10px] text-slate-600 font-black mono tracking-wider">{client.document}</p>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-12 py-10">
                    <div className="space-y-1">
                      <p className="text-[11px] text-white font-bold">{client.email}</p>
                      <p className="text-[10px] text-emerald-500/80 font-black mono tracking-widest">{client.phone}</p>
                    </div>
                  </td>
                  <td className="px-12 py-10">
                    <div className="flex items-center gap-5">
                      {[
                        { icon: 'fa-pen-to-square', label: 'Editar', tip: 'Editar dados', action: () => setEditingClient(client), color: 'group-hover/btn:bg-blue-500' },
                        { icon: 'fa-layer-group', label: 'Parcelas', tip: 'Listar títulos', action: () => setViewingParcelas(client), color: 'group-hover/btn:bg-slate-700' },
                        { icon: 'fa-hand-holding-dollar', label: 'Pagar', tip: 'Baixa rápida', action: () => {
                          const rec = getNextReceivable(client.id);
                          if (rec) setPayingClient({client, rec});
                          else alert('Tudo em dia!');
                        }, color: 'group-hover/btn:bg-emerald-500' },
                        { icon: 'fa-rotate', label: 'Renov.', tip: 'Renegociar', action: () => setRenegotiatingClient(client), color: 'group-hover/btn:bg-amber-500' },
                        { icon: 'fa-brands fa-whatsapp', label: 'Cobrar', tip: 'WhatsApp', action: () => handleWhatsAppCharge(client), color: 'group-hover/btn:bg-[#25D366]' },
                      ].map((btn, i) => (
                        <button 
                          key={i} 
                          onClick={btn.action}
                          title={btn.tip}
                          className="flex flex-col items-center gap-1.5 group/btn"
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border border-white/5 bg-white/[0.02] ${btn.color} group-hover/btn:text-black group-hover/btn:border-transparent shadow-lg`}>
                            <i className={`fa-solid ${btn.icon} text-[13px]`}></i>
                          </div>
                          <span className="text-[7px] font-black uppercase text-slate-600 group-hover/btn:text-white tracking-[0.2em]">{btn.label}</span>
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="px-12 py-10 text-right">
                    <div className="space-y-1">
                      <span className="text-xl font-black text-white mono">R$ {formatNumber(client.monthlyValue)}</span>
                      <div className="flex justify-end">
                        <p className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${isAtrasado ? 'text-rose-500 border-rose-500/30 bg-rose-500/5' : client.status === 'Em negociação' ? 'text-amber-500 border-amber-500/30 bg-amber-500/5' : 'text-emerald-500 border-emerald-500/30 bg-emerald-500/5'}`}>
                          {isAtrasado ? 'EM ATRASO' : client.status === 'Em negociação' ? 'RENEGOCIANDO' : 'ATIVO'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-12 py-10 text-right">
                    <button 
                      onClick={() => { if(confirm(`Remover permanentemente ${client.name}?`)) deleteClient(client.id)}}
                      className="text-slate-800 hover:text-rose-500 transition-all p-3 hover:bg-rose-500/5 rounded-xl"
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Cards Mobile Refinados */}
      <div className="md:hidden space-y-8">
        {filteredClients.map((client) => {
          const nextRec = getNextReceivable(client.id);
          const isAtrasado = nextRec && nextRec.dueDate < new Date().toISOString().split('T')[0];
          
          return (
            <div key={client.id} className={`glass-card p-8 rounded-[3rem] border-white/5 space-y-8 bg-[#020608] relative overflow-hidden ${isAtrasado ? 'border-rose-500/20' : ''}`}>
              {isAtrasado && <div className="absolute top-0 right-0 px-6 py-2 bg-rose-500 text-white font-black text-[8px] uppercase tracking-widest rounded-bl-3xl">Pendente</div>}
              
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center justify-center text-slate-500 font-black text-xl shadow-inner">
                  {client.name.substring(0, 1).toUpperCase()}
                </div>
                <div>
                  <p className="font-black text-white text-lg tracking-tight leading-none mb-2">{client.name}</p>
                  <p className="text-[10px] text-emerald-500 font-black mono tracking-widest">{client.phone}</p>
                </div>
              </div>
              
              <div className="bg-white/[0.02] p-8 rounded-3xl border border-white/5 flex flex-col items-center">
                 <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] mb-2">Mensalidade</span>
                 <h4 className="text-3xl font-black text-white mono">R$ {formatNumber(client.monthlyValue)}</h4>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <button onClick={() => setViewingParcelas(client)} className="py-5 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase text-slate-400 tracking-widest">Ver Parcelas</button>
                 <button onClick={() => { const rec = getNextReceivable(client.id); if(rec) setPayingClient({client, rec}) }} className="py-5 bg-emerald-500 text-black rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/10">Baixar Título</button>
              </div>

              <button 
                onClick={() => handleWhatsAppCharge(client)} 
                className="w-full py-5 bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95"
              >
                <i className="fa-brands fa-whatsapp text-lg"></i>
                Cobrar no WhatsApp
              </button>
            </div>
          );
        })}
      </div>

      {/* MODAIS OPERACIONAIS */}
      
      {/* Modal Editar */}
      {editingClient && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setEditingClient(null)}></div>
          <div className="relative w-full max-w-lg glass-card p-10 rounded-[3rem] border-white/10 space-y-8 bg-[#050c10]">
            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Editar Cliente</h3>
            <div className="space-y-6">
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nome Fantasia</label>
                 <input className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white text-sm font-bold" value={editingClient.name} onChange={e => setEditingClient({...editingClient, name: e.target.value})} />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Valor Mensal</label>
                    <input className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white text-sm font-bold mono" value={editingClient.monthlyValue} type="number" onChange={e => setEditingClient({...editingClient, monthlyValue: Number(e.target.value)})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Dia Vencimento</label>
                    <input className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white text-sm font-bold mono" value={editingClient.dueDay} type="number" min="1" max="31" onChange={e => setEditingClient({...editingClient, dueDay: Number(e.target.value)})} />
                  </div>
               </div>
               <button onClick={() => { updateClient(editingClient.id, editingClient); setEditingClient(null); }} className="w-full py-5 bg-emerald-500 text-black font-black uppercase rounded-2xl tracking-[0.2em] text-[11px]">Salvar Alterações</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Parcelas */}
      {viewingParcelas && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in zoom-in-95">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setViewingParcelas(null)}></div>
          <div className="relative w-full max-w-2xl glass-card rounded-[3rem] border-white/10 overflow-hidden bg-[#020608] flex flex-col max-h-[80vh]">
             <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                <div>
                   <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Cronograma de Parcelas</h3>
                   <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-1">{viewingParcelas.name}</p>
                </div>
                <button onClick={() => setViewingParcelas(null)} className="text-slate-500 hover:text-white"><i className="fa-solid fa-xmark text-xl"></i></button>
             </div>
             <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
                {state.receivables.filter(r => r.clientId === viewingParcelas.id).sort((a,b) => a.dueDate.localeCompare(b.dueDate)).map(r => (
                  <div key={r.id} className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-emerald-500/30 transition-all">
                     <div className="flex items-center gap-6">
                        <span className="text-[10px] font-black text-slate-600 mono">{new Date(r.dueDate).toLocaleDateString('pt-BR')}</span>
                        <span className="text-sm font-black text-white mono">R$ {formatNumber(r.amount)}</span>
                     </div>
                     <div className="flex items-center gap-4">
                        <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${r.status === 'Pago' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : r.status === 'Atrasado' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-white/5 text-slate-500 border-white/10'}`}>
                           {r.status}
                        </span>
                        {r.status !== 'Pago' && (
                          <button onClick={() => markAsPaid(r.id)} className="w-8 h-8 rounded-lg bg-emerald-500 text-black flex items-center justify-center hover:scale-110 transition-transform">
                             <i className="fa-solid fa-check text-[10px]"></i>
                          </button>
                        )}
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      )}

      {/* Modal Pagamento Rápido */}
      {payingClient && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setPayingClient(null)}></div>
          <div className="relative w-full max-w-sm glass-card p-10 rounded-[3rem] border-white/10 space-y-8 bg-[#0a151b]">
             <div className="text-center space-y-2">
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Confirmar Recebimento</p>
                <h3 className="text-3xl font-black text-white mono">R$ {formatNumber(payingClient.rec.amount)}</h3>
                <p className="text-xs text-slate-500 font-bold uppercase">{payingClient.client.name}</p>
             </div>
             
             <div className="grid grid-cols-2 gap-3">
                {['PIX', 'Boleto', 'Dinheiro', 'Transferência'].map(m => (
                  <button key={m} onClick={() => { markAsPaid(payingClient.rec.id, m as any); setPayingClient(null); }} className="py-4 rounded-xl bg-white/[0.03] border border-white/10 text-[10px] font-black text-white uppercase tracking-widest hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition-all">
                    {m}
                  </button>
                ))}
             </div>
             
             <p className="text-[9px] text-center text-slate-600 font-bold uppercase tracking-widest">Vencimento Original: {new Date(payingClient.rec.dueDate).toLocaleDateString('pt-BR')}</p>
          </div>
        </div>
      )}

      {/* Modal Renegociar */}
      {renegotiatingClient && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in slide-in-from-bottom-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setRenegotiatingClient(null)}></div>
          <div className="relative w-full max-w-md glass-card p-10 rounded-[3rem] border-white/10 space-y-8 bg-[#050c10]">
             <div>
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Renegociar Contrato</h3>
                <p className="text-xs text-slate-500 font-medium">As parcelas futuras não pagas serão substituídas pelo novo acordo.</p>
             </div>
             
             <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Novo Valor Mensal</label>
                  <input className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white text-lg font-black mono" defaultValue={renegotiatingClient.monthlyValue} type="number" id="ren-val" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Quantidade de Parcelas</label>
                  <input className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white text-lg font-black mono" defaultValue={12} type="number" id="ren-inst" />
                </div>
                <button 
                  onClick={() => {
                    const val = Number((document.getElementById('ren-val') as HTMLInputElement).value);
                    const inst = Number((document.getElementById('ren-inst') as HTMLInputElement).value);
                    renegotiateClient(renegotiatingClient.id, val, inst);
                    setRenegotiatingClient(null);
                  }}
                  className="w-full py-5 bg-amber-500 text-black font-black uppercase rounded-2xl tracking-[0.2em] text-[11px] shadow-lg shadow-amber-500/10"
                >
                  Confirmar Novo Acordo
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clientes;

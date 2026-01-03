
import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';

const Configuracoes: React.FC = () => {
  const { state, completeOnboarding, logAction } = useApp();
  const [activeAccordion, setActiveAccordion] = useState<number | null>(0);
  
  const [editData, setEditData] = useState({
    userName: state.userName,
    companyName: state.companyName,
    businessType: state.businessType
  });

  const handleSave = () => {
    completeOnboarding(editData);
    logAction('Ajuste de Perfil', 'Dados da conta atualizados nas configurações.', 'info');
    alert('Configurações salvas com sucesso!');
  };

  const toggleAccordion = (idx: number) => {
    setActiveAccordion(activeAccordion === idx ? null : idx);
  };

  return (
    <div className="space-y-8 md:space-y-10 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-2">Configurações</h1>
          <p className="text-slate-500 text-sm font-medium italic">Gerencie os dados do seu negócio e sua segurança.</p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-emerald-500 text-slate-950 font-black py-3 px-8 rounded-xl text-[10px] uppercase tracking-widest active:scale-95 transition-all"
        >
          Salvar Alterações
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-[2.5rem] border-white/5 overflow-hidden">
            
            {/* Seção Identidade */}
            <div className="border-b border-white/5">
              <div onClick={() => toggleAccordion(0)} className="p-8 hover:bg-white/[0.02] cursor-pointer flex justify-between items-center group">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-slate-500 group-hover:text-emerald-500">
                    <i className="fa-solid fa-id-card text-lg"></i>
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white mb-1">Meu Perfil e Empresa</h4>
                    <p className="text-xs text-slate-500 font-medium">Nome, empresa e tipo de negócio</p>
                  </div>
                </div>
                <i className={`fa-solid fa-chevron-down text-slate-700 transition-transform ${activeAccordion === 0 ? 'rotate-180' : ''}`}></i>
              </div>
              {activeAccordion === 0 && (
                <div className="p-8 bg-black/40 border-t border-white/5 space-y-6 animate-in slide-in-from-top-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Seu Nome</label>
                      <input 
                        type="text" 
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500/50 outline-none"
                        value={editData.userName}
                        onChange={e => setEditData({...editData, userName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nome da Empresa</label>
                      <input 
                        type="text" 
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500/50 outline-none"
                        value={editData.companyName}
                        onChange={e => setEditData({...editData, companyName: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Tipo de Negócio</label>
                    <input 
                      type="text" 
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500/50 outline-none"
                      value={editData.businessType}
                      onChange={e => setEditData({...editData, businessType: e.target.value})}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Seção Segurança */}
            <div className="border-b border-white/5 last:border-0">
              <div onClick={() => toggleAccordion(1)} className="p-8 hover:bg-white/[0.02] cursor-pointer flex justify-between items-center group">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-slate-500 group-hover:text-rose-500">
                    <i className="fa-solid fa-shield-halved text-lg"></i>
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white mb-1">Segurança (PIN Mestre)</h4>
                    <p className="text-xs text-slate-500 font-medium">Proteção para exclusão de registros</p>
                  </div>
                </div>
                <i className={`fa-solid fa-chevron-down text-slate-700 transition-transform ${activeAccordion === 1 ? 'rotate-180' : ''}`}></i>
              </div>
              {activeAccordion === 1 && (
                <div className="p-8 bg-black/40 border-t border-white/5 animate-in slide-in-from-top-2">
                  <p className="text-xs text-slate-400 mb-4">Seu PIN atual é <span className="text-white font-black mono">123456</span>. Este código é solicitado sempre que você tentar limpar o histórico de ações do sistema.</p>
                  <button className="text-[10px] font-black text-emerald-500 uppercase tracking-widest border border-emerald-500/30 px-4 py-2 rounded-lg hover:bg-emerald-500/10 transition-all">Alterar Código Mestre</button>
                </div>
              )}
            </div>

          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-8 rounded-[2.5rem] border-white/5 bg-gradient-to-br from-slate-900/50 to-transparent">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                <i className="fa-solid fa-crown text-xl"></i>
              </div>
              <div>
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Sua Assinatura</p>
                <h4 className="text-lg font-black text-white italic">PLANO VITALÍCIO</h4>
              </div>
            </div>
            <div className="space-y-4 mb-8">
               <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-bold uppercase">Espaço Usado</span>
                  <span className="text-white mono">{state.clients.length + state.receivables.length + state.expenses.length} Nodes</span>
               </div>
               <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="w-12 h-full bg-emerald-500"></div>
               </div>
            </div>
            <button className="w-full py-4 bg-zinc-900 hover:bg-zinc-800 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all border border-white/5">
               Backup dos Dados
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuracoes;

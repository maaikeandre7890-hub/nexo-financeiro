
import React, { useState } from 'react';

const Configuracoes: React.FC = () => {
  const [activeAccordion, setActiveAccordion] = useState<number | null>(0);

  const settingsItems = [
    { label: 'Perfil da Empresa', icon: 'fa-building', desc: 'Dados cadastrais e fiscais da organização', content: 'Informações de Razão Social, CNPJ e Inscrição Estadual.' },
    { label: 'Loja & Operação', icon: 'fa-store', desc: 'Personalização do PDV e regras de faturamento', content: 'Configure o nome fantasia e o parcelamento padrão.' },
    { label: 'Notificações', icon: 'fa-bell', desc: 'Gerencie alertas de vencimento e relatórios', content: 'Ative alertas via WhatsApp e E-mail.' },
    { label: 'Segurança (PIN)', icon: 'fa-shield-halved', desc: 'Controle de acesso crítico (6 dígitos)', content: 'Defina o PIN que protege exclusões de histórico.' },
  ];

  const toggleAccordion = (idx: number) => {
    setActiveAccordion(activeAccordion === idx ? null : idx);
  };

  return (
    <div className="space-y-8 md:space-y-10 animate-in fade-in duration-700">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-2">Configurações</h1>
        <p className="text-slate-500 text-sm font-medium">Gerencie sua conta e preferências de segurança.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          <div className="glass-card rounded-[2rem] md:rounded-[2.5rem] border-white/5 overflow-hidden">
            {settingsItems.map((item, idx) => (
              <div key={idx} className="border-b border-white/5 last:border-0">
                <div 
                  onClick={() => toggleAccordion(idx)}
                  className="p-6 md:p-8 hover:bg-white/[0.02] cursor-pointer transition-all flex justify-between items-center group"
                >
                  <div className="flex items-center gap-4 md:gap-6">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-slate-500 group-hover:text-emerald-500 transition-colors">
                      <i className={`fa-solid ${item.icon} text-lg`}></i>
                    </div>
                    <div>
                      <h4 className="text-sm md:text-base font-bold text-white mb-0.5 md:mb-1">{item.label}</h4>
                      <p className="text-[10px] md:text-xs text-slate-500 font-medium">{item.desc}</p>
                    </div>
                  </div>
                  <i className={`fa-solid fa-chevron-down text-slate-700 transition-transform duration-300 ${activeAccordion === idx ? 'rotate-180 text-emerald-500' : ''}`}></i>
                </div>
                {activeAccordion === idx && (
                  <div className="p-6 md:p-8 bg-black/40 border-t border-white/5 animate-in slide-in-from-top-2">
                    <p className="text-xs md:text-sm text-zinc-400 font-medium leading-relaxed mb-6">{item.content}</p>
                    <button className="px-6 py-3 bg-zinc-900 border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest text-white hover:bg-zinc-800 transition-all">Editar Informações</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-8 rounded-[2rem] md:rounded-[2.5rem] border-white/5 bg-gradient-to-br from-slate-900/50 to-transparent">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                <i className="fa-solid fa-crown text-xl"></i>
              </div>
              <div>
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Status da Conta</p>
                <h4 className="text-lg font-black text-white italic">NEXO FULL</h4>
              </div>
            </div>
            <div className="space-y-4 mb-8">
               <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-bold uppercase">Uso de Dados</span>
                  <span className="text-white mono">Ilimitado</span>
               </div>
               <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="w-1/3 h-full bg-emerald-500"></div>
               </div>
            </div>
            <button className="w-full py-4 bg-zinc-900 hover:bg-zinc-800 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all border border-white/5 active:scale-95">
               Sincronizar Nodes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuracoes;

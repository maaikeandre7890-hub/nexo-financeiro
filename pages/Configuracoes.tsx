
import React from 'react';

const Configuracoes: React.FC = () => (
  <div className="space-y-10 animate-in fade-in duration-700">
    <div>
      <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Configurações</h1>
      <p className="text-slate-500 font-medium">Gerencie sua conta e preferências de segurança.</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="glass-card rounded-[2.5rem] border-white/5 overflow-hidden">
          {[
            { label: 'Perfil da Empresa', icon: 'fa-building', desc: 'Dados cadastrais e fiscais da organização' },
            { label: 'Integração Bancária', icon: 'fa-link', desc: 'Conexões via Open Banking (Ativas)' },
            { label: 'Usuários e Permissões', icon: 'fa-users-gear', desc: 'Controle de acesso da sua equipe' },
            { label: 'Segurança e API', icon: 'fa-shield-halved', desc: 'Chaves de acesso e autenticação em dois fatores' },
          ].map((item, idx) => (
            <div key={idx} className="p-8 border-b border-white/5 hover:bg-white/[0.02] cursor-pointer transition-all flex justify-between items-center group">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-slate-500 group-hover:text-emerald-500 transition-colors shadow-inner">
                  <i className={`fa-solid ${item.icon} text-lg`}></i>
                </div>
                <div>
                  <h4 className="text-base font-bold text-white mb-1">{item.label}</h4>
                  <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
                </div>
              </div>
              <i className="fa-solid fa-chevron-right text-slate-700 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all"></i>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="glass-card p-8 rounded-[2.5rem] border-white/5 bg-gradient-to-br from-slate-900/50 to-transparent">
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
             <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
               Sua conta possui acesso vitalício a todos os módulos de inteligência financeira.
             </p>
          </div>
          <button className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all border border-white/5">
             Sincronizar Nodes
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default Configuracoes;

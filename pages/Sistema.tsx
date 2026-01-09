import React from 'react';
import { useApp } from '../contexts/AppContext.tsx';
import { APP_VERSION } from '../constants.tsx';

const Sistema: React.FC = () => {
  const { hardReset } = useApp();

  return (
    <div className="space-y-10 py-2 page-enter">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Status do Aplicativo<span className="text-emerald-500">.</span></h1>
        <p className="text-zinc-500 text-sm mt-2 font-medium">Veja se o NEXO está funcionando perfeitamente agora.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-8 rounded-3xl">
          <div className="flex items-center gap-4 mb-4">
             <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
               <i className="fa-solid fa-cloud"></i>
             </div>
             <div>
               <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Sincronização</p>
               <p className="text-sm font-black text-white">Funcionando</p>
             </div>
          </div>
          <div className="w-full h-1 bg-emerald-500/20 rounded-full">
            <div className="w-full h-full bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]"></div>
          </div>
        </div>

        <div className="glass-card p-8 rounded-3xl">
          <div className="flex items-center gap-4 mb-4">
             <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
               <i className="fa-solid fa-lock"></i>
             </div>
             <div>
               <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Segurança</p>
               <p className="text-sm font-black text-white">Protegido</p>
             </div>
          </div>
          <div className="w-full h-1 bg-emerald-500/20 rounded-full">
            <div className="w-full h-full bg-emerald-500 rounded-full"></div>
          </div>
        </div>

        <div className="glass-card p-8 rounded-3xl">
          <div className="flex items-center gap-4 mb-4">
             <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
               <i className="fa-solid fa-sparkles"></i>
             </div>
             <div>
               <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Nexo IA</p>
               <p className="text-sm font-black text-white">Ativo</p>
             </div>
          </div>
          <div className="w-full h-1 bg-emerald-500/20 rounded-full">
            <div className="w-full h-full bg-emerald-500 rounded-full"></div>
          </div>
        </div>
      </div>
      
      <div className="glass-card p-10 rounded-[3rem] border-white/5 space-y-8">
         <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
               <p className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-2">Build de Produção</p>
               <h3 className="text-2xl font-black text-white italic">NEXO Intelligence v{APP_VERSION}</h3>
               <p className="text-xs text-slate-500 font-medium italic mt-2">
                 Se o código no GitHub divergir desta versão, limpe o cache forçadamente.
               </p>
            </div>
            <button 
              onClick={hardReset}
              className="px-8 py-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-rose-500 hover:text-white transition-all active:scale-95"
            >
              Forçar Rebuild do Sistema (Hard Reset)
            </button>
         </div>
      </div>
    </div>
  );
};

export default Sistema;
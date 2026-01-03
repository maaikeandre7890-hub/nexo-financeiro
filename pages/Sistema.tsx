
import React from 'react';

const Sistema: React.FC = () => {
  return (
    <div className="space-y-10 py-2 page-enter">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Status do Sistema<span className="text-emerald-500">.</span></h1>
        <p className="text-zinc-500 text-sm mt-2 font-medium">Monitoramento de infraestrutura e serviços NEXO.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-8 rounded-3xl">
          <div className="flex items-center gap-4 mb-4">
             <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
               <i className="fa-solid fa-server"></i>
             </div>
             <div>
               <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Nexo Core</p>
               <p className="text-sm font-black text-white">Operacional</p>
             </div>
          </div>
          <div className="w-full h-1 bg-emerald-500/20 rounded-full">
            <div className="w-full h-full bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]"></div>
          </div>
        </div>

        <div className="glass-card p-8 rounded-3xl">
          <div className="flex items-center gap-4 mb-4">
             <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
               <i className="fa-solid fa-database"></i>
             </div>
             <div>
               <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Database</p>
               <p className="text-sm font-black text-white">Sincronizado</p>
             </div>
          </div>
          <div className="w-full h-1 bg-emerald-500/20 rounded-full">
            <div className="w-full h-full bg-emerald-500 rounded-full"></div>
          </div>
        </div>

        <div className="glass-card p-8 rounded-3xl">
          <div className="flex items-center gap-4 mb-4">
             <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
               <i className="fa-solid fa-brain"></i>
             </div>
             <div>
               <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">AI Engine</p>
               <p className="text-sm font-black text-white">Online</p>
             </div>
          </div>
          <div className="w-full h-1 bg-emerald-500/20 rounded-full">
            <div className="w-full h-full bg-emerald-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sistema;

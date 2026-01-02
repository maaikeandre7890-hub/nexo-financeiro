
import React from 'react';

interface Props {
  onOpenNotifications: () => void;
  onOpenAI: () => void;
  onOpenSearch: () => void;
  onToggleSidebar: () => void;
}

const Header: React.FC<Props> = ({ onOpenNotifications, onOpenAI, onOpenSearch, onToggleSidebar }) => {
  return (
    <header className="h-20 md:h-24 px-4 md:px-10 flex items-center justify-between sticky top-0 z-30 bg-[#020617]/40 backdrop-blur-2xl border-b border-slate-800/40">
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleSidebar}
          className="md:hidden p-2 text-slate-400 hover:text-emerald-500 transition-colors"
        >
          <i className="fa-solid fa-bars-staggered text-xl"></i>
        </button>

        <div 
          onClick={onOpenSearch}
          className="relative w-full max-w-[120px] md:max-w-[450px] group cursor-pointer"
        >
          <div className="absolute inset-y-0 left-0 md:left-5 flex items-center pointer-events-none">
            <i className="fa-solid fa-magnifying-glass text-slate-600 group-hover:text-emerald-500 transition-colors px-3 md:px-0"></i>
          </div>
          <div className="w-full bg-slate-900/40 border border-slate-800/60 rounded-2xl py-2.5 md:py-3 pl-10 md:pl-14 pr-4 md:pr-6 text-xs md:text-sm font-semibold text-slate-500 group-hover:bg-slate-900/80 group-hover:border-emerald-500/30 transition-all flex justify-between items-center">
            <span className="hidden md:inline">Pesquisa rápida...</span>
            <span className="md:hidden">Busca</span>
            <div className="hidden md:flex gap-1 items-center opacity-40 group-hover:opacity-100 transition-opacity">
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-[10px]">⌘</kbd>
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-[10px]">K</kbd>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-6">
        <button 
          onClick={onOpenAI}
          className="flex items-center gap-2 md:gap-3 px-3 md:px-5 py-2 md:py-2.5 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/20 rounded-2xl transition-all group overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          <i className="fa-solid fa-sparkles text-emerald-500 text-xs md:text-base"></i>
          <span className="text-[8px] md:text-[10px] font-black text-emerald-500 uppercase tracking-widest hidden sm:inline">Nexo AI</span>
        </button>
        
        <button 
          onClick={onOpenNotifications}
          className="relative p-2.5 md:p-3.5 text-slate-400 hover:text-white transition-all bg-slate-900/40 hover:bg-slate-900/80 rounded-2xl border border-slate-800/60"
        >
          <i className="fa-solid fa-bell text-lg md:text-xl"></i>
          <span className="absolute top-2.5 right-2.5 md:top-3 md:right-3 w-2 md:h-2.5 h-2 md:w-2.5 bg-rose-500 rounded-full border-[2px] md:border-[3px] border-[#0a0f1e]"></span>
        </button>

        <div className="h-10 w-[1px] bg-slate-800/60 mx-1 hidden lg:block"></div>

        <div className="flex items-center gap-4 cursor-pointer group p-1 pr-3 rounded-2xl hover:bg-slate-900/40 transition-all border border-transparent hover:border-slate-800/60 hidden sm:flex">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-blue-600 p-[2px] shadow-lg shadow-emerald-500/10">
            <div className="w-full h-full rounded-[10px] bg-[#020617] flex items-center justify-center overflow-hidden">
              <img src="https://ui-avatars.com/api/?name=Gabriel+Senna&background=020617&color=10b981&bold=true" alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="text-left hidden lg:block">
            <p className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors leading-none mb-1">Gabriel Senna</p>
            <div className="flex items-center gap-1.5">
               <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
               <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Administrador</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

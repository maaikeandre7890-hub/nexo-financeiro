
import React from 'react';

interface Props {
  onOpenNotifications: () => void;
  onOpenAI: () => void;
  onOpenSearch: () => void;
  onToggleSidebar: () => void;
}

const Header: React.FC<Props> = ({ onOpenNotifications, onOpenAI, onOpenSearch, onToggleSidebar }) => {
  return (
    <header className="h-20 px-6 md:px-12 flex items-center justify-between sticky top-0 z-40 bg-[#020617]/40 backdrop-blur-xl border-b border-white/[0.03]">
      <div className="flex items-center gap-6">
        <button 
          onClick={onToggleSidebar}
          className="md:hidden p-2 text-slate-500 hover:text-emerald-500 transition-colors"
        >
          <i className="fa-solid fa-bars-staggered"></i>
        </button>

        <div 
          onClick={onOpenSearch}
          className="relative w-full max-w-[40px] sm:max-w-[320px] group cursor-pointer"
        >
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <i className="fa-solid fa-search text-slate-600 group-hover:text-emerald-500 transition-colors text-xs"></i>
          </div>
          <div className="w-full bg-slate-900/20 border border-white/[0.05] rounded-xl py-2.5 pl-10 pr-4 text-[11px] font-semibold text-slate-500 group-hover:bg-slate-900/50 group-hover:border-emerald-500/20 transition-all flex justify-between items-center">
            <span className="hidden sm:inline">Search platform...</span>
            <kbd className="hidden sm:block px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-[9px]">⌘K</kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <button 
          onClick={onOpenAI}
          className="relative px-5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition-all text-[11px] font-black uppercase tracking-widest hidden sm:flex items-center gap-2 group overflow-hidden"
        >
          <div className="absolute inset-0 bg-emerald-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <i className="fa-solid fa-sparkles text-[10px] animate-pulse"></i>
          Brain AI
        </button>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenNotifications}
            className="p-2.5 text-slate-500 hover:text-white transition-all bg-white/[0.02] border border-white/[0.05] rounded-xl relative"
          >
            <i className="fa-solid fa-bell text-sm"></i>
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
          </button>

          <div className="w-[1px] h-6 bg-white/5 mx-2 hidden sm:block"></div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-slate-800 to-slate-900 border border-white/10 overflow-hidden shadow-xl">
              <img src="https://ui-avatars.com/api/?name=Empresario&background=020617&color=10b981&bold=true" alt="User" />
            </div>
            <div className="hidden xl:block">
              <p className="text-[11px] font-bold text-white leading-none">Empresário Pro</p>
              <p className="text-[9px] label-pro opacity-50 mt-1">NEXO-0192</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

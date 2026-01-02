
import React from 'react';

interface Props {
  onOpenNotifications: () => void;
  onOpenAI: () => void;
  onOpenSearch: () => void;
  onToggleSidebar: () => void;
}

const Header: React.FC<Props> = ({ onOpenNotifications, onOpenAI, onOpenSearch, onToggleSidebar }) => {
  return (
    <header className="h-20 px-8 md:px-12 flex items-center justify-between sticky top-0 z-40 bg-[#020617]/40 backdrop-blur-xl border-b border-white/[0.03]">
      <div className="flex items-center gap-8">
        <button 
          onClick={onToggleSidebar}
          className="md:hidden p-2 text-slate-500 hover:text-emerald-500 transition-colors"
        >
          <i className="fa-solid fa-bars-staggered"></i>
        </button>

        <div 
          onClick={onOpenSearch}
          className="relative w-full max-w-[40px] sm:max-w-[340px] group cursor-pointer"
        >
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <i className="fa-solid fa-search text-slate-600 group-hover:text-emerald-500 transition-colors text-xs"></i>
          </div>
          <div className="w-full bg-white/[0.02] border border-white/[0.05] rounded-2xl py-2.5 pl-10 pr-5 text-[11px] font-bold text-slate-500 group-hover:bg-white/[0.04] group-hover:border-white/10 transition-all flex justify-between items-center">
            <span className="hidden sm:inline opacity-60">Global search engine...</span>
            <kbd className="hidden sm:block px-2 py-0.5 rounded-lg bg-white/5 border border-white/5 text-[9px] font-black opacity-40">⌘K</kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button 
          onClick={onOpenAI}
          className="relative px-6 py-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition-all text-[11px] font-black uppercase tracking-[0.2em] hidden sm:flex items-center gap-3 group overflow-hidden"
        >
          <div className="absolute inset-0 bg-emerald-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <i className="fa-solid fa-sparkles text-[10px]"></i>
          Brain Sync
        </button>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={onOpenNotifications}
            className="p-2.5 text-slate-500 hover:text-white transition-all bg-white/[0.02] border border-white/[0.05] rounded-2xl relative"
          >
            <i className="fa-solid fa-bell text-sm"></i>
            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-emerald-500 rounded-full ring-2 ring-[#020617]"></span>
          </button>

          <div className="w-[1px] h-8 bg-white/5 mx-2 hidden sm:block"></div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-950 border border-white/10 overflow-hidden shadow-2xl relative group-hover:scale-105 transition-transform">
              <img src="https://ui-avatars.com/api/?name=Empresario&background=020617&color=10b981&bold=true" alt="User" />
            </div>
            <div className="hidden xl:block">
              <p className="text-[12px] font-black text-white leading-none tracking-tight">Admin Executive</p>
              <p className="text-[9px] label-pro opacity-40 mt-1">NEXO_PRIMARY_NODE</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

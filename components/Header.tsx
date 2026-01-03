
import React from 'react';

interface Props {
  onOpenNotifications: () => void;
  onOpenAI: () => void;
  onOpenSearch: () => void;
  onToggleSidebar: () => void;
}

const Header: React.FC<Props> = ({ onOpenNotifications, onOpenAI, onOpenSearch, onToggleSidebar }) => {
  return (
    <header className="h-16 md:h-20 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40 bg-[#071821]/90 backdrop-blur-2xl border-b border-white/[0.06]">
      <div className="flex items-center gap-3 md:gap-4">
        <button 
          onClick={onToggleSidebar} 
          className="w-10 h-10 flex items-center justify-center bg-white/[0.04] rounded-xl text-slate-400 hover:text-white transition-colors border border-white/5 active:scale-95"
        >
          <i className="fa-solid fa-bars-staggered text-sm"></i>
        </button>
        
        <div 
          onClick={onOpenSearch} 
          className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] cursor-pointer group hover:border-emerald-500/30 transition-all"
        >
          <i className="fa-solid fa-magnifying-glass text-[10px] md:text-xs text-slate-500"></i>
          <span className="text-[11px] md:text-[12px] font-bold text-slate-500 hidden sm:inline">Buscar...</span>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-8">
        <button 
          onClick={onOpenAI} 
          className="hidden md:flex items-center gap-2.5 text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] hover:text-emerald-400 transition-all"
        >
          <i className="fa-solid fa-sparkles animate-pulse"></i>
          Oráculo IA
        </button>

        <button 
          onClick={onOpenNotifications} 
          className="w-10 h-10 flex items-center justify-center bg-white/[0.04] rounded-xl text-slate-400 border border-white/5 relative active:scale-95"
        >
          <i className="fa-solid fa-bell text-xs"></i>
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-[#071821]"></span>
        </button>

        <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[10px] font-black text-emerald-500 shadow-inner">
          AD
        </div>
      </div>
    </header>
  );
};

export default Header;

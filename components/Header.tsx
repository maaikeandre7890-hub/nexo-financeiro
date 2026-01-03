
import React from 'react';

interface Props {
  onOpenNotifications: () => void;
  onOpenAI: () => void;
  onOpenSearch: () => void;
  onToggleSidebar: () => void;
}

const Header: React.FC<Props> = ({ onOpenNotifications, onOpenAI, onOpenSearch, onToggleSidebar }) => {
  return (
    <header className="h-16 px-8 flex items-center justify-between sticky top-0 z-40 bg-[#0B1C26]/80 backdrop-blur-md border-b border-white/[0.04]">
      <div className="flex items-center gap-6">
        <button onClick={onToggleSidebar} className="md:hidden text-slate-500 hover:text-white transition-colors">
          <i className="fa-solid fa-bars-staggered"></i>
        </button>
        <div onClick={onOpenSearch} className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/[0.02] border border-white/[0.05] cursor-pointer group hover:border-emerald-500/20 transition-all">
          <i className="fa-solid fa-magnifying-glass text-[11px] text-slate-600 group-hover:text-emerald-500 transition-colors"></i>
          <span className="text-[12px] font-medium text-slate-600 group-hover:text-slate-400 transition-colors">Pesquisar no sistema...</span>
          <kbd className="hidden sm:inline-block text-[9px] font-bold text-slate-700 bg-slate-900 px-1.5 py-0.5 rounded border border-white/5 ml-4">⌘K</kbd>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <button 
          onClick={onOpenAI} 
          className="flex items-center gap-2.5 text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] hover:text-emerald-400 transition-all group"
        >
          <i className="fa-solid fa-sparkles animate-pulse"></i>
          Oráculo IA
        </button>

        <div className="w-[1px] h-4 bg-white/10"></div>

        <button onClick={onOpenNotifications} className="text-slate-500 hover:text-white transition-all relative">
          <i className="fa-solid fa-bell text-sm"></i>
          <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]"></span>
        </button>

        <div className="w-8 h-8 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-[10px] font-black text-emerald-500 cursor-pointer hover:border-emerald-500/30 transition-all">
          AD
        </div>
      </div>
    </header>
  );
};

export default Header;

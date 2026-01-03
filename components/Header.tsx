
import React from 'react';
import { useApp } from '../contexts/AppContext';

interface Props {
  onOpenNotifications: () => void;
  onOpenAI: () => void;
  onOpenSearch: () => void;
  onToggleSidebar: () => void;
}

const Header: React.FC<Props> = ({ onOpenNotifications, onOpenAI, onOpenSearch, onToggleSidebar }) => {
  const { state } = useApp();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="h-16 md:h-20 px-5 md:px-10 flex items-center justify-between sticky top-0 z-[90] bg-[#071821]/95 backdrop-blur-2xl border-b border-white/[0.06]">
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleSidebar} 
          className="w-10 h-10 flex items-center justify-center bg-white/[0.04] rounded-xl text-slate-300 hover:text-white transition-colors border border-white/5 active:scale-95"
          aria-label="Menu"
        >
          <i className="fa-solid fa-bars-staggered text-sm"></i>
        </button>
        
        <div 
          onClick={onOpenSearch} 
          className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] cursor-pointer group hover:border-emerald-500/30 transition-all"
        >
          <i className="fa-solid fa-magnifying-glass text-[11px] text-slate-500 group-hover:text-emerald-500"></i>
          <span className="text-[11px] font-bold text-slate-500 hidden sm:inline">Pesquisar registros...</span>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-8">
        <button 
          onClick={onOpenAI} 
          className="hidden md:flex items-center gap-2.5 text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] hover:text-emerald-400 transition-all"
        >
          <i className="fa-solid fa-sparkles"></i>
          Oracle Concierge
        </button>

        <button 
          onClick={onOpenNotifications} 
          className="w-10 h-10 flex items-center justify-center bg-white/[0.04] rounded-xl text-slate-400 border border-white/5 relative active:scale-95 hover:text-white transition-colors"
          aria-label="Notificações"
        >
          <i className="fa-solid fa-bell text-xs"></i>
          <span className="absolute top-3 right-3 w-1.5 h-1.5 bg-emerald-500 rounded-full border border-[#071821]"></span>
        </button>

        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[11px] font-black text-emerald-500 shadow-inner group cursor-pointer hover:bg-emerald-500 hover:text-slate-950 transition-all">
          {getInitials(state.userName || 'AD')}
        </div>
      </div>
    </header>
  );
};

export default Header;

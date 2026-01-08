
import React from 'react';
import { useApp } from '../contexts/AppContext.tsx';

interface Props {
  onOpenNotifications: () => void;
  onOpenAI: () => void;
  onOpenSearch: () => void;
  onToggleSidebar: () => void;
}

const Header: React.FC<Props> = ({ onOpenNotifications, onOpenAI, onOpenSearch, onToggleSidebar }) => {
  const { state, refreshData, isRefreshing, toggleTheme } = useApp();

  return (
    <header className="h-20 md:h-24 px-8 md:px-12 flex items-center justify-between sticky top-0 z-[90] bg-[#020608]/80 border-b border-white/[0.02] backdrop-blur-xl">
      <div className="flex items-center gap-6">
        <button 
          onClick={onToggleSidebar} 
          className="w-11 h-11 flex items-center justify-center rounded-2xl border border-white/[0.04] text-zinc-600 md:hidden active:bg-white/5 transition-colors"
          aria-label="Menu"
        >
          <i className="fa-solid fa-bars-staggered text-sm"></i>
        </button>
        
        <div 
          onClick={onOpenSearch} 
          className="hidden md:flex items-center gap-4 px-6 py-2.5 rounded-2xl border border-white/[0.04] cursor-pointer hover:border-emerald-500/20 transition-all w-72 bg-white/[0.01]"
        >
          <i className="fa-solid fa-magnifying-glass text-[10px] text-zinc-700"></i>
          <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em]">Pesquisa Avançada</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={toggleTheme} 
          className="w-11 h-11 flex items-center justify-center rounded-2xl border border-white/[0.04] text-zinc-700 hover:text-emerald-500 transition-all hover:bg-white/5"
          title="Tema"
        >
          <i className={`fa-solid ${state.theme === 'dark' ? 'fa-sun' : 'fa-moon'} text-xs`}></i>
        </button>

        <button 
          onClick={refreshData} 
          disabled={isRefreshing}
          className="w-11 h-11 flex items-center justify-center rounded-2xl border border-white/[0.04] text-zinc-700 hover:text-emerald-500 transition-all hover:bg-white/5 disabled:opacity-30"
          title="Sincronizar"
        >
          <i className={`fa-solid fa-rotate text-xs ${isRefreshing ? 'animate-spin text-emerald-500' : ''}`}></i>
        </button>

        <button 
          onClick={onOpenNotifications} 
          className="w-11 h-11 flex items-center justify-center rounded-2xl border border-white/[0.04] text-zinc-700 relative hover:text-white transition-all hover:bg-white/5"
          aria-label="Alertas"
        >
          <i className="fa-solid fa-bell text-xs"></i>
          <span className="absolute top-4 right-4 w-1.5 h-1.5 bg-rose-500 rounded-full border border-[#020608]"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;

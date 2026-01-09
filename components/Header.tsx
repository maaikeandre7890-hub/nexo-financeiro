
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
    <header className="h-20 md:h-24 px-8 md:px-12 flex items-center justify-between sticky top-0 z-[90] bg-[#020608]/90 border-b border-white/[0.015] backdrop-blur-2xl">
      <div className="flex items-center gap-6">
        <button 
          onClick={onToggleSidebar} 
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-white/[0.02] text-zinc-700 md:hidden active:bg-white/5 transition-colors"
          aria-label="Menu"
        >
          <i className="fa-solid fa-bars-staggered text-sm"></i>
        </button>
        
        <div 
          onClick={onOpenSearch} 
          className="hidden md:flex items-center gap-4 px-5 py-2.5 rounded-xl border border-white/[0.02] cursor-pointer hover:border-emerald-500/10 transition-all w-72 bg-white/[0.005]"
        >
          <i className="fa-solid fa-magnifying-glass text-[10px] text-zinc-800"></i>
          <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-[0.3em]">Protocolo de Busca</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={toggleTheme} 
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-white/[0.02] text-zinc-700 hover:text-emerald-500 transition-all hover:bg-white/5"
          title="Alternar Tema"
        >
          <i className={`fa-solid ${state.theme === 'dark' ? 'fa-sun' : 'fa-moon'} text-xs`}></i>
        </button>

        <button 
          onClick={refreshData} 
          disabled={isRefreshing}
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-white/[0.02] text-zinc-700 hover:text-emerald-500 transition-all hover:bg-white/5 disabled:opacity-30"
          title="Sincronizar Dados"
        >
          <i className={`fa-solid fa-rotate text-xs ${isRefreshing ? 'animate-spin text-emerald-500' : ''}`}></i>
        </button>

        <button 
          onClick={onOpenNotifications} 
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-white/[0.02] text-zinc-700 relative hover:text-white transition-all hover:bg-white/5"
          aria-label="Alertas de Sistema"
        >
          <i className="fa-solid fa-bell text-xs"></i>
          <span className="absolute top-3.5 right-3.5 w-1 h-1 bg-rose-500 rounded-full"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;

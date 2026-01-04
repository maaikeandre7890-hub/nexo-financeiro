
import React from 'react';
import { useApp } from '../contexts/AppContext';

interface Props {
  onOpenNotifications: () => void;
  onOpenAI: () => void;
  onOpenSearch: () => void;
  onToggleSidebar: () => void;
}

const Header: React.FC<Props> = ({ onOpenNotifications, onOpenAI, onOpenSearch, onToggleSidebar }) => {
  const { state, refreshData, isRefreshing, toggleTheme } = useApp();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header className="h-24 px-8 md:px-14 flex items-center justify-between sticky top-0 z-[90] transition-colors duration-500 bg-[var(--bg-header)] backdrop-blur-3xl border-b border-[var(--border-subtle)]">
      <div className="flex items-center gap-6">
        <button 
          onClick={onToggleSidebar} 
          className="w-12 h-12 flex items-center justify-center bg-white/[0.02] rounded-2xl text-slate-400 hover:text-white transition-all border border-white/[0.05] hover:border-emerald-500/20 active:scale-90"
        >
          <i className="fa-solid fa-bars-staggered text-sm"></i>
        </button>
        
        <div 
          onClick={onOpenSearch} 
          className="hidden md:flex items-center gap-4 px-6 py-3 rounded-2xl bg-white/[0.01] border border-white/[0.05] cursor-pointer group hover:border-emerald-500/30 transition-all w-80 shadow-inner"
        >
          <i className="fa-solid fa-magnifying-glass text-[12px] text-slate-600 group-hover:text-emerald-500 transition-colors"></i>
          <span className="text-[11px] font-black text-slate-600 group-hover:text-slate-400 uppercase tracking-widest transition-colors">Pesquisar Operações</span>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        {/* TEMA TOGGLE */}
        <button 
          onClick={toggleTheme} 
          className="w-12 h-12 flex items-center justify-center bg-white/[0.02] rounded-2xl text-slate-500 border border-white/[0.05] hover:text-emerald-500 transition-all active:scale-95"
          title={`Ativar Modo ${state.theme === 'dark' ? 'Claro' : 'Escuro'}`}
        >
          <i className={`fa-solid ${state.theme === 'dark' ? 'fa-sun' : 'fa-moon'} text-sm`}></i>
        </button>

        {/* REFRESH REAL DE DADOS */}
        <button 
          onClick={refreshData} 
          disabled={isRefreshing}
          className="w-12 h-12 flex items-center justify-center bg-white/[0.02] rounded-2xl text-slate-500 border border-white/[0.05] relative hover:text-emerald-500 transition-all group disabled:opacity-50"
          title="Sincronizar Dados"
        >
          <i className={`fa-solid fa-arrows-rotate text-sm ${isRefreshing ? 'animate-spin text-emerald-500' : ''}`}></i>
        </button>

        <button 
          onClick={onOpenNotifications} 
          className="w-12 h-12 flex items-center justify-center bg-white/[0.02] rounded-2xl text-slate-500 border border-white/[0.05] relative hover:text-white transition-all group"
        >
          <i className="fa-solid fa-bell text-sm"></i>
          <span className="absolute top-4 right-4 w-2 h-2 bg-emerald-500 rounded-full border-2 border-[var(--bg-main)] shadow-[0_0_10px_#10b981]"></span>
        </button>

        <div className="w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-[12px] font-black text-emerald-500 shadow-xl cursor-pointer hover:bg-emerald-500 hover:text-black transition-all duration-500">
          {getInitials(state.userName || 'AD')}
        </div>
      </div>
    </header>
  );
};

export default Header;

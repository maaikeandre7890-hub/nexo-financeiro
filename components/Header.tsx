
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
    <header className="h-20 px-8 md:px-12 flex items-center justify-between sticky top-0 z-[90] transition-all duration-300 bg-[var(--bg-header)] backdrop-blur-md border-b border-white/[0.04]">
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleSidebar} 
          className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all md:hidden ${
            state.theme === 'light' ? 'bg-white border-slate-200 text-slate-400' : 'bg-white/[0.03] border-white/5 text-slate-500'
          }`}
        >
          <i className="fa-solid fa-bars text-sm"></i>
        </button>
        
        <div 
          onClick={onOpenSearch} 
          className={`hidden md:flex items-center gap-3 px-5 py-2.5 rounded-xl border cursor-pointer group transition-all w-64 ${
            state.theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-white/[0.02] border-white/5 hover:border-white/10'
          }`}
        >
          <i className="fa-solid fa-magnifying-glass text-[11px] text-slate-500"></i>
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">Atalho Buscar...</span>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <button 
          onClick={toggleTheme} 
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/5 text-slate-500 hover:text-emerald-500 transition-all"
          title="Alternar Tema"
        >
          <i className={`fa-solid ${state.theme === 'dark' ? 'fa-sun' : 'fa-moon'} text-sm`}></i>
        </button>

        <button 
          onClick={refreshData} 
          disabled={isRefreshing}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/5 text-slate-500 hover:text-emerald-500 transition-all disabled:opacity-50"
        >
          <i className={`fa-solid fa-rotate text-xs ${isRefreshing ? 'animate-spin text-emerald-500' : ''}`}></i>
        </button>

        <button 
          onClick={onOpenNotifications} 
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/5 text-slate-500 hover:text-white transition-all relative"
        >
          <i className="fa-solid fa-bell text-sm"></i>
          <span className="absolute top-3 right-3 w-1.5 h-1.5 bg-emerald-500 rounded-full border border-[var(--bg-main)]"></span>
        </button>

        <div className="w-9 h-9 ml-2 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center text-[10px] font-bold shadow-lg shadow-emerald-500/10">
          {getInitials(state.userName || 'AD')}
        </div>
      </div>
    </header>
  );
};

export default Header;

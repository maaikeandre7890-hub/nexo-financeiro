
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

  return (
    <header className="h-14 md:h-16 px-4 md:px-8 flex items-center justify-between sticky top-0 z-[90] bg-[var(--bg-header)] border-b border-[var(--border-subtle)] backdrop-blur-md">
      <div className="flex items-center gap-3">
        <button 
          onClick={onToggleSidebar} 
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-[var(--border-subtle)] text-[var(--text-muted)] md:hidden active:bg-white/5 transition-colors"
          aria-label="Abrir Menu"
        >
          <i className="fa-solid fa-bars-staggered text-sm"></i>
        </button>
        
        <div 
          onClick={onOpenSearch} 
          className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl border border-[var(--border-subtle)] cursor-pointer hover:border-emerald-500/30 transition-all w-64"
        >
          <i className="fa-solid fa-magnifying-glass text-[10px] text-[var(--text-deep)]"></i>
          <span className="text-[10px] font-bold text-[var(--text-deep)] uppercase tracking-widest">Buscar Operação</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={toggleTheme} 
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-[var(--border-subtle)] text-[var(--text-deep)] hover:text-emerald-500 transition-all active:scale-95"
          title="Alternar Tema"
        >
          <i className={`fa-solid ${state.theme === 'dark' ? 'fa-sun' : 'fa-moon'} text-xs`}></i>
        </button>

        <button 
          onClick={refreshData} 
          disabled={isRefreshing}
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-[var(--border-subtle)] text-[var(--text-deep)] hover:text-emerald-500 transition-all active:scale-95"
          title="Sincronizar"
        >
          <i className={`fa-solid fa-rotate text-xs ${isRefreshing ? 'animate-spin text-emerald-500' : ''}`}></i>
        </button>

        <button 
          onClick={onOpenNotifications} 
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-[var(--border-subtle)] text-[var(--text-deep)] relative active:scale-95"
          aria-label="Notificações"
        >
          <i className="fa-solid fa-bell text-xs"></i>
          <span className="absolute top-3 right-3 w-1.5 h-1.5 bg-rose-500 rounded-full border border-[var(--bg-main)]"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;

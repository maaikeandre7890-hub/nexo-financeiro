
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
    <header className="h-16 px-8 flex items-center justify-between sticky top-0 z-[90] bg-[var(--bg-header)] border-b border-[var(--border-subtle)]">
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleSidebar} 
          className="w-9 h-9 flex items-center justify-center rounded border border-[var(--border-subtle)] text-[var(--text-muted)] md:hidden"
        >
          <i className="fa-solid fa-bars text-sm"></i>
        </button>
        
        <div 
          onClick={onOpenSearch} 
          className="hidden md:flex items-center gap-3 px-4 py-2 rounded border border-[var(--border-subtle)] cursor-pointer hover:border-emerald-500/30 transition-all w-64"
        >
          <i className="fa-solid fa-magnifying-glass text-[10px] text-[var(--text-deep)]"></i>
          <span className="text-[10px] font-bold text-[var(--text-deep)] uppercase tracking-widest">Atalho Buscar</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={toggleTheme} 
          className="w-8 h-8 flex items-center justify-center rounded border border-[var(--border-subtle)] text-[var(--text-deep)] hover:text-emerald-500 transition-all"
        >
          <i className={`fa-solid ${state.theme === 'dark' ? 'fa-sun' : 'fa-moon'} text-[11px]`}></i>
        </button>

        <button 
          onClick={refreshData} 
          disabled={isRefreshing}
          className="w-8 h-8 flex items-center justify-center rounded border border-[var(--border-subtle)] text-[var(--text-deep)] hover:text-emerald-500 transition-all"
        >
          <i className={`fa-solid fa-rotate text-[10px] ${isRefreshing ? 'animate-spin text-emerald-500' : ''}`}></i>
        </button>

        <button 
          onClick={onOpenNotifications} 
          className="w-8 h-8 flex items-center justify-center rounded border border-[var(--border-subtle)] text-[var(--text-deep)] relative"
        >
          <i className="fa-solid fa-bell text-[11px]"></i>
          <span className="absolute top-2 right-2 w-1 h-1 bg-emerald-500 rounded-full"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;

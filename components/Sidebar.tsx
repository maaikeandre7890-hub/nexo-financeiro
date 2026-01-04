
import React from 'react';
import { NavLink } from 'react-router-dom';
import { NAVIGATION } from '../constants';
import BrandLogo from './BrandLogo';
import { useApp } from '../contexts/AppContext';

interface Props {
  onClose?: () => void;
}

const Sidebar: React.FC<Props> = ({ onClose }) => {
  const { state } = useApp();
  const sections = [
    { title: 'Operacional', items: NAVIGATION.slice(0, 5) },
    { title: 'Análise', items: NAVIGATION.slice(5, 9) },
    { title: 'Gestão', items: NAVIGATION.slice(9) },
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <aside className="fixed md:absolute inset-y-0 left-0 z-20 flex flex-col h-full bg-[var(--bg-sidebar)] border-r border-[var(--border-subtle)] transition-all duration-300 ease-in-out overflow-hidden w-[280px] md:w-[72px] md:hover:w-[300px] group shadow-2xl md:shadow-none">
      
      {/* Brand Header */}
      <div className="h-20 flex items-center px-6 overflow-hidden shrink-0">
        <div className="flex items-center gap-4 min-w-max">
           <BrandLogo className="w-8 h-8 shrink-0" />
           <span className="text-base font-bold tracking-tight text-[var(--text-main)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
             NEXO<span className="text-emerald-500">.</span>
           </span>
        </div>
      </div>

      {/* Navigation - Bloco único e contínuo */}
      <nav className="flex-1 py-2 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {sections.map((section, idx) => (
          <div key={idx} className="mb-0">
            <h3 className="px-6 text-[8px] font-black uppercase tracking-[0.25em] text-[var(--text-deep)] opacity-0 group-hover:opacity-40 transition-opacity duration-300 whitespace-nowrap mt-4 mb-1">
              {section.title}
            </h3>
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center h-11 px-6 transition-all duration-200 relative group/item ${
                      isActive
                        ? 'bg-emerald-500/5 text-emerald-400'
                        : 'text-[var(--text-muted)] hover:bg-white/[0.03] hover:text-[var(--text-main)]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Active Line Indicator */}
                      {isActive && (
                        <div className="absolute left-0 top-2 bottom-2 w-[2px] bg-emerald-500 rounded-r-full" />
                      )}
                      
                      <div className={`flex items-center justify-center w-[24px] shrink-0 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                        <i className={`fa-solid ${item.icon} text-[18px] opacity-90`}></i>
                      </div>

                      <span className={`ml-5 text-[14px] font-medium tracking-tight whitespace-nowrap transition-all duration-300 ${
                        isActive ? 'text-emerald-400 font-bold' : 'text-[var(--text-muted)]'
                      } opacity-0 group-hover:opacity-100 flex items-center`}>
                        {item.label}
                      </span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User Profile Section - Sem divisórias */}
      <div className="p-4 shrink-0 overflow-hidden mb-2">
        <div className="flex items-center gap-4 px-2 h-11">
          <div className="w-[28px] h-[28px] rounded bg-emerald-500 text-black flex items-center justify-center font-bold text-[10px] shrink-0 shadow-lg shadow-emerald-500/10">
            {getInitials(state.userName || 'AD')}
          </div>
          <div className="flex flex-col min-w-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-[11px] font-bold truncate text-[var(--text-main)] leading-none">
              {state.userName || 'User'}
            </p>
            <p className="text-[9px] font-bold text-[var(--text-deep)] truncate uppercase tracking-tighter leading-none mt-1">
              {state.companyName}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

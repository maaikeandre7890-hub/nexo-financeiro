
import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { NAVIGATION } from '../constants';
import BrandLogo from './BrandLogo';
import { useApp } from '../contexts/AppContext';

interface Props {
  onClose?: () => void;
}

const Sidebar: React.FC<Props> = ({ onClose }) => {
  const { state } = useApp();
  const [isHovered, setIsHovered] = useState(false);
  // Fix: Replaced NodeJS.Timeout with ReturnType<typeof setTimeout> to resolve "Cannot find namespace 'NodeJS'" error in browser environment.
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sections = [
    { title: 'Operacional', items: NAVIGATION.slice(0, 5) },
    { title: 'Análise', items: NAVIGATION.slice(5, 9) },
    { title: 'Gestão', items: NAVIGATION.slice(9) },
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Lógica de Hover Estável para Desktop
  const handleMouseEnter = () => {
    if (window.innerWidth < 768) return; // Ignora no mobile
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (window.innerWidth < 768) return; // Ignora no mobile
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 300); // Delay para evitar fechar ao passar por frestas
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Determina se deve mostrar o conteúdo expandido
  // No mobile, sempre expandido (pois o App.tsx controla a visibilidade da sidebar inteira)
  // No desktop, depende do hover
  const showFull = isHovered || window.innerWidth < 768;

  return (
    <aside 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`flex flex-col h-full bg-[var(--bg-sidebar)] border-r border-[var(--border-subtle)] transition-all duration-500 ease-in-out overflow-hidden shadow-2xl md:shadow-none ${
        isHovered ? 'md:w-[280px]' : 'md:w-[72px]'
      } w-full`}
    >
      
      {/* Brand Header */}
      <div className="h-14 md:h-20 flex items-center px-6 overflow-hidden shrink-0">
        <div className="flex items-center gap-4 min-w-max">
           <BrandLogo className="w-7 h-7 md:w-8 md:h-8 shrink-0" />
           <span className={`text-base font-bold tracking-tight text-[var(--text-main)] transition-opacity duration-300 whitespace-nowrap ${
             showFull ? 'opacity-100' : 'opacity-0'
           }`}>
             NEXO<span className="text-emerald-500">.</span>
           </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {sections.map((section, idx) => (
          <div key={idx} className="mb-4">
            <h3 className={`px-6 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-deep)] transition-opacity duration-300 whitespace-nowrap mb-2 ${
              showFull ? 'opacity-40' : 'opacity-0'
            }`}>
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center h-12 px-6 transition-all duration-200 relative group/item ${
                      isActive
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'text-[var(--text-muted)] hover:bg-white/[0.03] hover:text-[var(--text-main)]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <div className="absolute left-0 top-3 bottom-3 w-[3px] bg-emerald-500 rounded-r-full" />
                      )}
                      
                      <div className={`flex items-center justify-center w-[24px] shrink-0 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                        <i className={`fa-solid ${item.icon} text-[18px]`}></i>
                      </div>

                      <span className={`ml-5 text-[14px] font-bold tracking-tight whitespace-nowrap transition-all duration-300 ${
                        showFull ? 'opacity-100' : 'opacity-0'
                      } ${isActive ? 'text-emerald-400' : 'text-[var(--text-muted)]'}`}>
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

      {/* User Profile Section */}
      <div className="p-4 shrink-0 overflow-hidden mb-safe">
        <div className="flex items-center gap-4 px-2 h-12">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 text-black flex items-center justify-center font-bold text-[10px] shrink-0 shadow-lg shadow-emerald-500/20">
            {getInitials(state.userName || 'AD')}
          </div>
          <div className={`flex flex-col min-w-0 transition-opacity duration-300 ${
            showFull ? 'opacity-100' : 'opacity-0'
          }`}>
            <p className="text-xs font-bold truncate text-[var(--text-main)] leading-none">
              {state.userName || 'User'}
            </p>
            <p className="text-[9px] font-black text-[var(--text-deep)] truncate uppercase tracking-tighter leading-none mt-1.5 opacity-60">
              {state.companyName}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

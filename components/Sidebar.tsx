
import React, { useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { NAVIGATION } from '../constants.tsx';
import BrandLogo from './BrandLogo.tsx';
import { useApp } from '../contexts/AppContext.tsx';

interface Props {
  onClose?: () => void;
}

const Sidebar: React.FC<Props> = ({ onClose }) => {
  const { state } = useApp();
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sections = [
    { title: 'Operação', items: NAVIGATION.slice(0, 5) },
    { title: 'Análise', items: NAVIGATION.slice(5, 9) },
    { title: 'Nexo Unit', items: NAVIGATION.slice(9) },
  ];

  const handleMouseEnter = () => {
    if (window.innerWidth < 768) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (window.innerWidth < 768) return;
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 200);
  };

  const showFull = isHovered || window.innerWidth < 768;

  return (
    <aside 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`flex flex-col h-full bg-[#000000] border-r border-white/[0.015] transition-all duration-500 ease-in-out z-[150] shadow-[10px_0_40px_rgba(0,0,0,0.4)] ${
        isHovered ? 'md:w-[280px]' : 'md:w-[85px]'
      } w-full`}
    >
      {/* BRANDING HEADER */}
      <div className="h-24 flex items-center px-6 overflow-hidden shrink-0 border-b border-white/[0.01] bg-gradient-to-b from-white/[0.005] to-transparent">
        <div className="flex items-center gap-5 min-w-max">
           <BrandLogo className="w-8 h-8 shrink-0" />
           <span className={`text-2xl font-bold italic tracking-tighter text-white transition-all duration-300 ${
             showFull ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
           }`}>
             NEXO<span className="text-emerald-500">.</span>
           </span>
        </div>
        
        <button 
          onClick={onClose}
          className="md:hidden ml-auto w-10 h-10 flex items-center justify-center text-zinc-700 hover:text-white"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>

      {/* NAVIGATION SCROLL AREA */}
      <nav className="flex-1 py-10 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {sections.map((section, idx) => (
          <div key={idx} className="mb-10">
            <h3 className={`px-8 text-[8px] font-black uppercase tracking-[0.5em] text-zinc-800 transition-opacity duration-300 whitespace-nowrap mb-6 ${
              showFull ? 'opacity-100' : 'opacity-0'
            }`}>
              {section.title}
            </h3>
            <div className="space-y-0.5 px-3">
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center h-11 px-5 transition-all duration-300 relative group/item rounded-xl overflow-hidden ${
                      isActive
                        ? 'text-white bg-emerald-500/5 border border-emerald-500/[0.05]'
                        : 'text-zinc-600 hover:text-white hover:bg-white/[0.02] border border-transparent'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* INDICADOR LATERAL ULTRA-FINO (2px) */}
                      {isActive && (
                        <div className="absolute left-0 top-3 bottom-3 w-[2px] bg-emerald-500 rounded-r-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                      )}
                      
                      {/* ÍCONE */}
                      <div className={`flex items-center justify-center w-6 shrink-0 transition-all duration-300 ${
                        isActive ? 'text-emerald-400' : 'text-inherit group-hover/item:text-zinc-300'
                      }`}>
                        <i className={`fa-solid ${item.icon} text-base`}></i>
                      </div>

                      {/* LABEL TEXT */}
                      <span className={`ml-5 text-[10px] font-bold uppercase tracking-[0.15em] whitespace-nowrap transition-all duration-300 ${
                        showFull ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                      }`}>
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

      {/* USER PROFILE FOOTER */}
      <div className="p-6 shrink-0 border-t border-white/[0.01] bg-[#000000]">
        <div className="flex items-center gap-4 px-2 h-14 bg-white/[0.005] rounded-2xl border border-white/[0.01] group/user cursor-pointer hover:border-emerald-500/10 transition-all overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 text-black flex items-center justify-center font-black text-[9px] shrink-0 transition-transform group-hover/user:scale-105">
            {state.userName ? state.userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'AD'}
          </div>
          <div className={`flex flex-col min-w-0 transition-all duration-300 ${
            showFull ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
          }`}>
            <p className="text-[11px] font-bold truncate text-white leading-none tracking-tight">
              {state.userName || 'User'}
            </p>
            <p className="text-[8px] font-black text-zinc-700 truncate uppercase tracking-[0.2em] leading-none mt-1.5">
              {state.companyName}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

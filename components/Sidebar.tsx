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
    }, 150);
  };

  const showFull = isHovered || window.innerWidth < 768;

  return (
    <aside
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`flex flex-col h-full bg-[#000000] border-r border-white/[0.02] transition-all duration-500 ease-in-out z-[150] shadow-[20px_0_60px_rgba(0_0_0_0.5)] ${
        isHovered ? 'md:w-[260px]' : 'md:w-[80px]'
      } w-full`}
    >
      {/* BRANDING HEADER */}
      <div className="h-24 flex items-center px-6 overflow-hidden shrink-0 border-b border-white/[0.01] bg-gradient-to-b from-white/[0.01] to-transparent">
        <div className="flex items-center gap-4 min-w-max">
          <BrandLogo className="w-8 h-8 shrink-0" />
          <span
            className={`text-xl font-bold italic tracking-tighter text-white transition-all duration-300 ${
              showFull ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
            }`}
          >
            NEXO<span className="text-emerald-500">.</span>
          </span>
        </div>

        <button
          onClick={onClose}
          className="md:hidden ml-auto w-10 h-10 flex items-center justify-center text-zinc-500 hover:text-white"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 py-8 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {sections.map((section, idx) => (
          <div key={idx} className="mb-8">
            <h3
              className={`px-8 text-[7px] font-black uppercase tracking-[0.4em] text-zinc-700 transition-opacity duration-300 whitespace-nowrap mb-4 ${
                showFull ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {section.title}
            </h3>

            <div className="space-y-1 px-3">
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center h-10 px-4 transition-all duration-200 relative group/item rounded-lg ${
                      isActive
                        ? 'text-white bg-emerald-500/10 border border-emerald-500/10'
                        : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.03]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <div className="absolute left-0 top-2 bottom-2 w-[1.5px] bg-emerald-500 rounded-r-full shadow-[0_0_8px_#10b981]" />
                      )}

                      <div
                        className={`flex items-center justify-center w-6 shrink-0 transition-all duration-300 ${
                          isActive
                            ? 'text-emerald-400'
                            : 'text-inherit group-hover/item:text-emerald-500/60'
                        }`}
                      >
                        <i className={`fa-solid ${item.icon} text-sm`}></i>
                      </div>

                      <span
                        className={`ml-4 text-[9px] font-bold uppercase tracking-[0.1em] whitespace-nowrap transition-all duration-300 ${
                          showFull
                            ? 'opacity-100 translate-x-0'
                            : 'opacity-0 -translate-x-2'
                        }`}
                      >
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

      {/* USER FOOTER */}
      <div className="p-4 shrink-0 border-t border-white/[0.02]">
        <div className="flex items-center gap-3 px-3 h-12 bg-white/[0.02] rounded-xl border border-white/[0.01] group/user cursor-pointer hover:bg-white/[0.04] transition-all overflow-hidden">
          <div className="w-7 h-7 rounded-lg bg-emerald-500 text-black flex items-center justify-center font-black text-[8px] shrink-0">
            {state.userName
              ? state.userName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)
              : 'AD'}
          </div>

          <div
            className={`flex flex-col min-w-0 transition-all duration-300 ${
              showFull ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
            }`}
          >
            <p className="text-[10px] font-bold truncate text-zinc-100 leading-none">
              {state.userName || 'User'}
            </p>
            <p className="text-[7px] font-bold text-zinc-600 truncate uppercase tracking-widest mt-1">
              {state.companyName}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

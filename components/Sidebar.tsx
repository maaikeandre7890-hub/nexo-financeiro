
import React from 'react';
import { NavLink } from 'react-router-dom';
import { NAVIGATION } from '../constants';

interface Props {
  onClose?: () => void;
}

const LogoMark = () => (
  <div className="relative w-10 h-10 flex items-center justify-center">
    {/* Símbolo Geométrico Puro */}
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
      <rect x="2" y="2" width="8" height="8" rx="1.5" fill="#10b981" />
      <rect x="14" y="2" width="8" height="8" rx="1.5" fill="#10b981" fillOpacity="0.4" />
      <rect x="14" y="14" width="8" height="8" rx="1.5" fill="#10b981" />
      <rect x="2" y="14" width="8" height="8" rx="1.5" fill="#10b981" fillOpacity="0.4" />
      <path d="M10 6H14M10 18H14M6 10V14M18 10V14" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
    <div className="absolute inset-0 bg-emerald-500/10 blur-xl rounded-full"></div>
  </div>
);

const Sidebar: React.FC<Props> = ({ onClose }) => {
  return (
    <aside className="w-72 bg-black flex flex-col h-full z-20 relative border-r border-white/[0.03]">
      <div className="p-8 pb-10 flex items-center gap-4 relative z-10">
        <LogoMark />
        <div className="flex flex-col">
          <h1 className="text-xl font-black tracking-[-0.05em] text-white leading-none">
            NEXO
          </h1>
          <p className="text-[7px] font-bold uppercase tracking-[0.5em] text-emerald-500/60 mt-1.5 leading-none">
            Intelligence
          </p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto mt-2 relative z-10 custom-scrollbar">
        <div className="px-4 py-3 mb-2">
          <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Sistemas / Core</p>
        </div>
        
        {NAVIGATION.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative ${
                isActive
                  ? 'bg-zinc-900 text-white shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute left-0 w-1 h-4 bg-emerald-500 rounded-r-full" />
                )}
                
                <div className={`w-5 flex justify-center transition-colors ${isActive ? 'text-emerald-500' : 'text-zinc-700 group-hover:text-zinc-500'}`}>
                  <i className={`fa-solid ${item.icon} text-[11px]`}></i>
                </div>
                
                <span className="text-[12.5px] font-semibold tracking-tight">
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-6">
        <div className="p-5 rounded-2xl bg-zinc-900/50 border border-white/[0.03] flex items-center gap-4 group cursor-default">
           <div className="w-8 h-8 rounded-lg bg-black border border-white/5 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
           </div>
           <div>
              <p className="text-[9px] font-bold text-white uppercase tracking-wider">Node Status</p>
              <p className="text-[8px] text-zinc-500 font-bold uppercase mt-1 tracking-widest">
                v3.4.1-Stable
              </p>
           </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

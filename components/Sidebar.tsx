
import React from 'react';
import { NavLink } from 'react-router-dom';
import { NAVIGATION } from '../constants';

interface Props {
  onClose?: () => void;
}

const LogoMark = () => (
  <div className="relative w-8 h-8 flex items-center justify-center">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="20" height="20" rx="4" stroke="#10b981" strokeWidth="2.5" />
      <path d="M7 12H17M12 7V17" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
    <div className="absolute inset-0 bg-emerald-500/20 blur-lg rounded-full"></div>
  </div>
);

const Sidebar: React.FC<Props> = ({ onClose }) => {
  return (
    <aside className="w-64 bg-black flex flex-col h-full z-20 relative border-r border-white/[0.03]">
      <div className="p-8 flex items-center gap-3">
        <LogoMark />
        <h1 className="text-lg font-black tracking-[-0.05em] text-white">NEXO</h1>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto mt-4">
        {NAVIGATION.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-zinc-900 text-white'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40'
              }`
            }
          >
            <div className="w-5 flex justify-center">
              <i className={`fa-solid ${item.icon} text-[12px]`}></i>
            </div>
            <span className="text-[13px] font-semibold tracking-tight">
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>

      <div className="p-6">
        <div className="p-4 rounded-xl bg-zinc-900/30 border border-white/[0.03] flex items-center gap-3">
           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
           <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Sincronizado</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

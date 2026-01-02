
import React from 'react';
import { NavLink } from 'react-router-dom';
import { NAVIGATION } from '../constants';

interface Props {
  onClose?: () => void;
}

const Sidebar: React.FC<Props> = ({ onClose }) => {
  return (
    <aside className="w-72 bg-[#020617] border-r border-slate-800/50 flex flex-col h-full z-20 overflow-y-auto">
      {/* Nexo Prism Logo */}
      <div className="p-8 md:p-10 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="relative w-12 h-12 md:w-14 md:h-14 flex items-center justify-center logo-prism">
            <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full"></div>
            <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 md:w-12 md:h-12">
              <path d="M15 25L45 40V85L15 70V25Z" fill="url(#emerald_grad)" className="drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
              <path d="M50 40L85 25V70L50 85V40Z" fill="url(#sapphire_grad)" className="drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]" />
              <path d="M45 40L55 35V65L45 70V40Z" fill="white" fillOpacity="0.9" className="animate-pulse" />
              <defs>
                <linearGradient id="emerald_grad" x1="15" y1="25" x2="45" y2="85" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#10b981" />
                  <stop offset="1" stopColor="#065f46" />
                </linearGradient>
                <linearGradient id="sapphire_grad" x1="50" y1="25" x2="85" y2="85" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3b82f6" />
                  <stop offset="1" stopColor="#1e3a8a" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tighter text-white leading-none">NEXO</h1>
            <p className="text-[8px] md:text-[9px] uppercase tracking-[0.3em] text-emerald-500 font-black mt-1">SISTEMAS B2B</p>
          </div>
        </div>
        
        <button onClick={onClose} className="md:hidden text-slate-500 hover:text-white p-2">
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>

      <nav className="flex-1 px-6 space-y-2 overflow-y-auto custom-scrollbar">
        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] px-4 mb-5">Navegação Principal</p>
        {NAVIGATION.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.05)]'
                  : 'text-slate-500 hover:text-white hover:bg-slate-800/40'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <i className={`fa-solid ${item.icon} text-lg opacity-80 group-hover:scale-110 transition-transform ${isActive ? 'text-emerald-400' : ''}`}></i>
                <span className="font-bold text-sm tracking-tight">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="m-6 p-6 rounded-[2rem] bg-gradient-to-br from-emerald-500/20 to-transparent border border-emerald-500/30 relative overflow-hidden group">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl group-hover:bg-emerald-500/40 transition-all duration-1000"></div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-[0_10px_30px_rgba(16,185,129,0.3)]">
            <i className="fa-solid fa-crown text-slate-950 text-base"></i>
          </div>
          <div>
            <p className="text-xs font-black text-white uppercase tracking-tighter italic">Versão Premium</p>
            <p className="text-[9px] text-emerald-500 font-black uppercase tracking-widest mt-0.5">Acesso Liberado</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

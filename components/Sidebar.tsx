
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
    { title: 'Operacional', items: NAVIGATION.slice(0, 4) },
    { title: 'Inteligência', items: NAVIGATION.slice(4, 9) },
    { title: 'Sistema', items: NAVIGATION.slice(9) },
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <aside className={`w-full md:w-72 flex flex-col h-full z-20 relative transition-all duration-300 border-r border-[var(--border-subtle)] overflow-hidden ${state.theme === 'light' ? 'bg-[var(--bg-sidebar)]' : 'bg-[var(--bg-sidebar)]'}`}>
      <div className="pt-10 pb-10 px-8 flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-pointer">
           <BrandLogo className="w-8 h-8" />
           <span className={`text-lg font-black tracking-tighter ${state.theme === 'light' ? 'text-slate-900' : 'text-white'}`}>NEXO<span className="text-emerald-500">.</span></span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-8 overflow-y-auto custom-scrollbar scroll-smooth">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-3">
            <h3 className={`px-4 text-[10px] font-bold uppercase tracking-[0.15em] opacity-30 ${state.theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group relative ${
                      isActive
                        ? state.theme === 'light' ? 'bg-emerald-500/10 text-emerald-600 font-semibold' : 'bg-emerald-500/10 text-emerald-400 font-semibold'
                        : state.theme === 'light' ? 'text-slate-500 hover:bg-slate-100' : 'text-slate-500 hover:bg-white/[0.02] hover:text-slate-300'
                    }`
                  }
                >
                  {/* Fixed: Wrapped NavLink children in a function to correctly access isActive from scope */}
                  {({ isActive }) => (
                    <>
                      <i className={`fa-solid ${item.icon} text-[14px] ${isActive ? '' : 'opacity-40'}`}></i>
                      <span className="text-[13px] tracking-tight">
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

      <div className={`p-6 border-t border-[var(--border-subtle)] ${state.theme === 'light' ? 'bg-slate-50/50' : 'bg-black/10'}`}>
        <div className="flex items-center gap-3 p-1">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 text-black flex items-center justify-center font-bold text-[10px]">
            {getInitials(state.userName || 'AD')}
          </div>
          <div className="flex flex-col min-w-0">
            <p className={`text-xs font-bold truncate ${state.theme === 'light' ? 'text-slate-800' : 'text-white'}`}>{state.userName || 'User'}</p>
            <p className="text-[10px] font-medium text-slate-500 truncate">{state.companyName}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

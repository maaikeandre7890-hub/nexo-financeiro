
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
    <aside className="w-full md:w-72 bg-[#000000] flex flex-col h-full z-20 relative border-r border-white/[0.03] shadow-2xl overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      <div className="pt-14 pb-12 px-8 flex flex-col items-start">
        <div className="flex items-center gap-4 group cursor-pointer">
           <BrandLogo className="w-10 h-10 transition-transform duration-700 group-hover:scale-110" />
           <div className="flex flex-col">
              <span className="text-xl font-black text-white italic tracking-tighter leading-none">NEXO<span className="text-emerald-500">.</span></span>
              <span className="text-[6px] font-black text-slate-600 uppercase tracking-[0.4em] mt-1.5 opacity-60">Strategic Intelligence</span>
           </div>
        </div>
      </div>

      <nav className="flex-1 px-5 space-y-12 overflow-y-auto custom-scrollbar scroll-smooth">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-4">
            <h3 className="px-5 text-[9px] font-black text-slate-800 uppercase tracking-[0.4em]">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-500 group relative ${
                      isActive
                        ? 'text-white bg-white/[0.03] shadow-inner'
                        : 'text-slate-600 hover:text-slate-200 hover:bg-white/[0.01]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <div className="absolute left-0 w-1 h-5 bg-emerald-500 rounded-r-full shadow-[0_0_15px_#10b981]"></div>
                      )}
                      <i className={`fa-solid ${item.icon} text-[14px] transition-colors duration-500 ${isActive ? 'text-emerald-500' : 'group-hover:text-emerald-400'}`}></i>
                      <span className={`text-[13px] font-bold tracking-tight transition-all duration-500 ${isActive ? 'translate-x-1' : ''}`}>
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

      <div className="p-8 border-t border-white/[0.03] bg-black/40">
        <div className="flex items-center gap-4 group cursor-pointer p-1">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-black flex items-center justify-center font-black text-[10px] shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-500">
            {getInitials(state.userName || 'AD')}
          </div>
          <div className="flex flex-col min-w-0">
            <p className="text-xs font-black text-white truncate tracking-tight uppercase italic">{state.userName || 'User'}</p>
            <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest truncate">{state.companyName}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

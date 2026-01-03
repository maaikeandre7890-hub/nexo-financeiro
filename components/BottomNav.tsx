
import React from 'react';
import { NavLink } from 'react-router-dom';

interface Props {
  onOpenMore: () => void;
}

const BottomNav: React.FC<Props> = ({ onOpenMore }) => {
  const items = [
    { label: 'Início', path: '/dashboard', icon: 'fa-house' },
    { label: 'Receitas', path: '/recebiveis', icon: 'fa-chart-line-up' },
    { label: 'Atrasos', path: '/parcelas-atraso', icon: 'fa-calendar-day' },
    { label: 'Clientes', path: '/clientes', icon: 'fa-building-columns' },
  ];

  return (
    <nav className="md:hidden fixed bottom-6 left-5 right-5 h-16 bg-[#071821]/80 backdrop-blur-3xl border border-white/10 flex items-center justify-between px-2 z-[55] rounded-[1.75rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]">
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-0.5 transition-all duration-300 w-1/5 h-full relative ${
              isActive ? 'text-emerald-500' : 'text-slate-500'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-emerald-500 rounded-full shadow-[0_0_12px_#10b981]"></div>
              )}
              <i className={`fa-solid ${item.icon} text-lg mb-0.5 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]' : ''}`}></i>
              <span className="text-[7px] font-black uppercase tracking-[0.1em]">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
      <button
        onClick={onOpenMore}
        className="flex flex-col items-center justify-center gap-0.5 text-slate-500 active:scale-90 transition-all w-1/5 h-full"
      >
        <i className="fa-solid fa-grid-round-2 text-lg mb-0.5"></i>
        <span className="text-[7px] font-black uppercase tracking-[0.1em]">Menu</span>
      </button>
    </nav>
  );
};

export default BottomNav;

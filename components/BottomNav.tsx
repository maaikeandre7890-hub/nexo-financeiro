
import React from 'react';
import { NavLink } from 'react-router-dom';

interface Props {
  onOpenMore: () => void;
}

const BottomNav: React.FC<Props> = ({ onOpenMore }) => {
  const items = [
    { label: 'Dash', path: '/dashboard', icon: 'fa-chart-pie' },
    { label: 'Receitas', path: '/recebiveis', icon: 'fa-arrow-up-to-line' },
    { label: 'Clientes', path: '/clientes', icon: 'fa-users' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-black border-t border-white/5 flex items-center justify-around px-4 z-[55] backdrop-blur-xl bg-black/80">
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 transition-all ${
              isActive ? 'text-emerald-500 scale-110' : 'text-zinc-500'
            }`
          }
        >
          <i className={`fa-solid ${item.icon} text-lg`}></i>
          <span className="text-[10px] font-black uppercase tracking-tighter">{item.label}</span>
        </NavLink>
      ))}
      <button
        onClick={onOpenMore}
        className="flex flex-col items-center gap-1 text-zinc-500 active:scale-90 transition-all"
      >
        <i className="fa-solid fa-bars-staggered text-lg"></i>
        <span className="text-[10px] font-black uppercase tracking-tighter">Mais</span>
      </button>
    </nav>
  );
};

export default BottomNav;

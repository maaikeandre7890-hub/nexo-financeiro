import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

const BottomNav: React.FC = () => {
  const { totals } = useApp();
  const location = useLocation();

  const items = [
    { icon: 'fa-chart-pie', path: '/dashboard', label: 'Início' },
    { icon: 'fa-users', path: '/clientes', label: 'Clientes' },
    { icon: 'fa-file-invoice-dollar', path: '/recebiveis', label: 'Caixa' },
    { icon: 'fa-triangle-exclamation', path: '/parcelas-atraso', label: 'Riscos' }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[110] px-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-2 pointer-events-none">
      <div className="mx-auto max-w-[480px] bg-[#0B0D10]/95 backdrop-blur-3xl border border-white/[0.08] rounded-[2.5rem] flex items-center justify-around p-1.5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] pointer-events-auto">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-3 px-1 rounded-2xl transition-all duration-300 relative flex-1 ${
                isActive ? 'text-emerald-400' : 'text-zinc-500'
              }`}
            >
              <div className="relative mb-1.5 transition-transform duration-300 ease-out transform group-active:scale-90">
                <i className={`fa-solid ${item.icon} ${isActive ? 'text-xl' : 'text-lg'}`}></i>
                {item.path === '/parcelas-atraso' && totals.overdue > 0 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-[#0B0D10] shadow-[0_0_8px_rgba(244,63,94,0.6)]"></span>
                )}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-[0.1em] transition-opacity leading-none ${isActive ? 'opacity-100' : 'opacity-50'}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -bottom-1.5 w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.8)]"></div>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;

import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

const BottomNav: React.FC = () => {
  const { state, totals } = useApp();
  const location = useLocation();

  const items = [
    { icon: 'fa-chart-pie', path: '/dashboard', label: 'Início' },
    { icon: 'fa-users', path: '/clientes', label: 'Clientes' },
    { icon: 'fa-file-invoice-dollar', path: '/recebiveis', label: 'Caixa' },
    { icon: 'fa-triangle-exclamation', path: '/parcelas-atraso', label: 'Riscos' }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[100] px-4 pb-6 pt-2 pointer-events-none">
      <div className="mx-auto max-w-lg bg-[#0B0D10]/80 backdrop-blur-xl border border-white/[0.08] rounded-[2.5rem] flex items-center justify-around p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-auto">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-2 px-4 rounded-full transition-all duration-300 relative ${
                isActive ? 'text-emerald-400 scale-110' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <div className="relative">
                <i className={`fa-solid ${item.icon} text-lg`}></i>
                {item.path === '/parcelas-atraso' && totals.overdue > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#0B0D10]"></span>
                )}
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest mt-1.5 opacity-80">{item.label}</span>
              {isActive && (
                <div className="absolute -bottom-1 w-1 h-1 bg-emerald-400 rounded-full shadow-[0_0_8px_#10b981]"></div>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;

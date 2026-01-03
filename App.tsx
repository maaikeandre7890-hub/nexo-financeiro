
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import NotificationPanel from './components/NotificationPanel';
import AIInsightsPanel from './components/AIInsightsPanel';
import CommandBar from './components/CommandBar';
import Onboarding from './components/Onboarding';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Recebiveis from './pages/Recebiveis';
import Atraso from './pages/Atraso';
import Historico from './pages/Historico';
import Relatorios from './pages/Relatorios';
import FaturamentoLiquido from './pages/FaturamentoLiquido';
import DespesasExtras from './pages/DespesasExtras';
import Cobranca from './pages/Cobranca';
import Sistema from './pages/Sistema';
import Configuracoes from './pages/Configuracoes';
import Tutorial from './pages/Tutorial';
import NotFound from './pages/NotFound';
import BrandLogo from './components/BrandLogo';
import { useApp } from './contexts/AppContext';

const App: React.FC = () => {
  const { state } = useApp();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  const [isCommandBarOpen, setIsCommandBarOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsNotificationsOpen(false);
    setIsAIPanelOpen(false);
    setIsCommandBarOpen(false);
    setIsSidebarOpen(false);
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    const handleGlobalKeys = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsCommandBarOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeys);
    return () => window.removeEventListener('keydown', handleGlobalKeys);
  }, []);

  if (!state.onboardingCompleted) {
    return <Onboarding />;
  }

  return (
    <div className="flex min-h-screen text-slate-300 selection:bg-emerald-500/30 overflow-x-hidden font-['Inter']">
      <div 
        className={`fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[100] transition-opacity duration-500 md:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setIsSidebarOpen(false)}
      />
      
      <div className={`fixed inset-y-0 left-0 z-[110] w-[280px] transform transition-transform duration-500 ease-in-out md:relative md:translate-x-0 md:w-72 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>
      
      <div className="flex-1 flex flex-col min-w-0 h-screen relative overflow-hidden">
        <Header 
          onOpenNotifications={() => setIsNotificationsOpen(true)} 
          onOpenAI={() => setIsAIPanelOpen(true)}
          onOpenSearch={() => setIsCommandBarOpen(true)}
          onToggleSidebar={() => setIsSidebarOpen(true)}
        />
        
        <main className="flex-1 overflow-y-auto p-5 md:p-8 lg:px-14 lg:py-12 scroll-smooth relative custom-scrollbar pb-10">
          <div className="max-w-[1600px] mx-auto page-enter">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/clientes" element={<Clientes />} />
              <Route path="/recebiveis" element={<Recebiveis />} />
              <Route path="/parcelas-atraso" element={<Atraso />} />
              <Route path="/historico" element={<Historico />} />
              <Route path="/relatorios" element={<Relatorios />} />
              <Route path="/faturamento-liquido" element={<FaturamentoLiquido />} />
              <Route path="/despesas-extras" element={<DespesasExtras />} />
              <Route path="/cobranca-automatica" element={<Cobranca />} />
              <Route path="/sistema" element={<Sistema />} />
              <Route path="/configuracoes" element={<Configuracoes />} />
              <Route path="/tutorial" element={<Tutorial />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </main>

        <NotificationPanel isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
        <AIInsightsPanel isOpen={isAIPanelOpen} onClose={() => setIsAIPanelOpen(false)} />
        <CommandBar isOpen={isCommandBarOpen} onClose={() => setIsCommandBarOpen(false)} />
      </div>

      <div className="fixed bottom-8 right-6 md:bottom-12 md:right-12 z-40 group flex flex-col items-end gap-3">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-emerald-500/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-emerald-500 backdrop-blur-xl shadow-2xl pointer-events-none mb-1">
          Oracle NEXO — Análise Financeira
        </div>
        <button 
          onClick={() => setIsAIPanelOpen(true)}
          className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-tr from-emerald-600 to-emerald-400 rounded-3xl shadow-[0_20px_60px_-15px_rgba(16,185,129,0.4)] flex items-center justify-center text-slate-950 transition-all active:scale-90 border border-white/20 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <BrandLogo className="w-8 h-8 md:w-11 md:h-11" />
        </button>
      </div>
    </div>
  );
};

export default App;


import React, { useEffect, useRef } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import NotificationPanel from './components/NotificationPanel';
import AIInsightsPanel from './components/AIInsightsPanel';
import CommandBar from './components/CommandBar';
import Onboarding from './components/Onboarding';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import FormCliente from './pages/FormCliente';
import ImportarClientes from './pages/ImportarClientes';
import Recebiveis from './pages/Recebiveis';
import FormRecebivel from './pages/FormRecebivel';
import Atraso from './pages/Atraso';
import Historico from './pages/Historico';
import Relatorios from './pages/Relatorios';
import FaturamentoLiquido from './pages/FaturamentoLiquido';
import DespesasExtras from './pages/DespesasExtras';
import FormDespesa from './pages/FormDespesa';
import Cobranca from './pages/Cobranca';
import Sistema from './pages/Sistema';
import Configuracoes from './pages/Configuracoes';
import Tutorial from './pages/Tutorial';
import Renegociacoes from './pages/Renegociacoes';
import NotFound from './pages/NotFound';
import BrandLogo from './components/BrandLogo';
import { useApp } from './contexts/AppContext';

const App: React.FC = () => {
  const { state } = useApp();
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
  const [isAIPanelOpen, setIsAIPanelOpen] = React.useState(false);
  const [isCommandBarOpen, setIsCommandBarOpen] = React.useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setIsNotificationsOpen(false);
    setIsAIPanelOpen(false);
    setIsCommandBarOpen(false);
    setIsSidebarOpen(false);
    if (mainRef.current) mainRef.current.scrollTo(0, 0);
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
    <div 
      className={`flex h-screen w-full transition-colors duration-500 font-['Inter'] overflow-hidden ${
        state.theme === 'light' 
          ? 'light-theme bg-[#E2E8F0] text-[#0F172A]' 
          : 'bg-[var(--bg-main)] text-slate-300'
      }`}
    >
      {/* Sidebar Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[100] transition-opacity duration-500 md:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setIsSidebarOpen(false)}
      />
      
      <div className={`fixed inset-y-0 left-0 z-[110] w-[280px] transform transition-transform duration-500 ease-in-out md:relative md:translate-x-0 md:w-72 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>
      
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        <Header 
          onOpenNotifications={() => setIsNotificationsOpen(true)} 
          onOpenAI={() => setIsAIPanelOpen(true)}
          onOpenSearch={() => setIsCommandBarOpen(true)}
          onToggleSidebar={() => setIsSidebarOpen(true)}
        />
        
        <main 
          ref={mainRef}
          className="flex-1 overflow-y-auto p-5 md:p-10 lg:px-16 lg:py-16 relative custom-scrollbar pb-24"
        >
          <div className="max-w-[1600px] mx-auto page-enter">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              
              <Route path="/clientes" element={<Clientes />} />
              <Route path="/clientes/novo" element={<FormCliente />} />
              <Route path="/clientes/importar" element={<ImportarClientes />} />
              <Route path="/renegociacoes" element={<Renegociacoes />} />
              
              <Route path="/recebiveis" element={<Recebiveis />} />
              <Route path="/recebiveis/novo" element={<FormRecebivel />} />
              
              <Route path="/parcelas-atraso" element={<Atraso />} />
              <Route path="/historico" element={<Historico />} />
              <Route path="/relatorios" element={<Relatorios />} />
              <Route path="/faturamento-liquido" element={<FaturamentoLiquido />} />
              
              <Route path="/despesas-extras" element={<DespesasExtras />} />
              <Route path="/despesas/novo" element={<FormDespesa />} />
              
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

      {/* Floating Action Button (FAB) - Minimalista */}
      <div className="fixed bottom-8 right-8 z-50">
        <button 
          onClick={() => setIsAIPanelOpen(true)}
          className="w-14 h-14 bg-emerald-500 text-slate-950 rounded-full shadow-[0_15px_30px_-10px_rgba(16,185,129,0.5)] hover:scale-110 active:scale-95 transition-all flex items-center justify-center group border border-white/20 relative"
          aria-label="Assistente NEXO IA"
        >
          <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-10 group-hover:opacity-30"></div>
          <BrandLogo className="w-8 h-8 pointer-events-none relative z-10" />
        </button>
      </div>
    </div>
  );
};

export default App;

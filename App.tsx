
import React, { useEffect, useRef } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import NotificationPanel from './components/NotificationPanel';
import AIInsightsPanel from './components/AIInsightsPanel';
import CommandBar from './components/CommandBar';
import BottomNav from './components/BottomNav';
import Onboarding from './components/Onboarding';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import FormCliente from './pages/FormCliente';
import EditCliente from './pages/EditCliente';
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
import BoletosNF from './pages/BoletosNF';
import GerarBoleto from './pages/GerarBoleto';
import GerarNF from './pages/GerarNF';
import NotFound from './pages/NotFound';
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
    <div className="flex h-screen w-full transition-colors duration-300 overflow-hidden bg-[var(--bg-main)] text-[var(--text-main)]">
      {/* Mobile Sidebar Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-md z-[110] transition-opacity duration-500 md:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setIsSidebarOpen(false)}
      />
      
      {/* Sidebar Container */}
      <div className={`fixed inset-y-0 left-0 z-[120] transform transition-transform duration-500 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0 w-[280px]' : '-translate-x-full md:w-auto'}`}>
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
          className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 md:px-12 relative custom-scrollbar pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-12"
        >
          <div className="max-w-[1440px] mx-auto page-enter">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/clientes" element={<Clientes />} />
              <Route path="/clientes/novo" element={<FormCliente />} />
              <Route path="/clientes/editar/:id" element={<EditCliente />} />
              <Route path="/clientes/importar" element={<ImportarClientes />} />
              <Route path="/renegociacoes" element={<Renegociacoes />} />
              <Route path="/recebiveis" element={<Recebiveis />} />
              <Route path="/recebiveis/novo" element={<FormRecebivel />} />
              <Route path="/parcelas-atraso" element={<Atraso />} />
              <Route path="/boletos-nf" element={<BoletosNF />} />
              <Route path="/boletos-nf/boleto" element={<GerarBoleto />} />
              <Route path="/boletos-nf/nf" element={<GerarNF />} />
              <Route path="/historico" element={<Historico />} />
              <Route path="/relatorios" element={<Relatorios />} />
              <Route path="/faturamento-liquido" element={<FaturamentoLiquido />} />
              <Route path="/despesas-extras" element={<DespesasExtras />} />
              <Route path="/despesas/novo" element={<FormDespesa />} />
              <Route path="/cobranca-automatica" element={<Cobranca />} />
              <Route path="/sistema" element={<Sistema />} />
              <Route path="/configuracoes" element={<Configuracoes />} />
              <Route path="/tutorial" element={<Tutorial />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </main>

        <BottomNav />

        <NotificationPanel isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
        <AIInsightsPanel isOpen={isAIPanelOpen} onClose={() => setIsAIPanelOpen(false)} />
        <CommandBar isOpen={isCommandBarOpen} onClose={() => setIsCommandBarOpen(false)} />
      </div>

      <div className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-[90]">
        <button 
          onClick={() => setIsAIPanelOpen(true)}
          className="w-12 h-12 md:w-14 md:h-14 rounded-full shadow-2xl transition-all flex items-center justify-center border bg-emerald-500/20 backdrop-blur-xl border-emerald-500/30 text-emerald-400 hover:scale-110 active:scale-95"
        >
          <i className="fa-solid fa-sparkles text-lg"></i>
        </button>
      </div>
    </div>
  );
};

export default App;

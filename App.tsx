import React, { useEffect, useRef } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar.tsx';
import Header from './components/Header.tsx';
import NotificationPanel from './components/NotificationPanel.tsx';
import AIInsightsPanel from './components/AIInsightsPanel.tsx';
import CommandBar from './components/CommandBar.tsx';
import Onboarding from './components/Onboarding.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Clientes from './pages/Clientes.tsx';
import FormCliente from './pages/FormCliente.tsx';
import EditCliente from './pages/EditCliente.tsx';
import ImportarClientes from './pages/ImportarClientes.tsx';
import Recebiveis from './pages/Recebiveis.tsx';
import FormRecebivel from './pages/FormRecebivel.tsx';
import Atraso from './pages/Atraso.tsx';
import Historico from './pages/Historico.tsx';
import Relatorios from './pages/Relatorios.tsx';
import FaturamentoLiquido from './pages/FaturamentoLiquido.tsx';
import DespesasExtras from './pages/DespesasExtras.tsx';
import FormDespesa from './pages/FormDespesa.tsx';
import Cobranca from './pages/Cobranca.tsx';
import Sistema from './pages/Sistema.tsx';
import Configuracoes from './pages/Configuracoes.tsx';
import Tutorial from './pages/Tutorial.tsx';
import Renegociacoes from './pages/Renegociacoes.tsx';
import BoletosNF from './pages/BoletosNF.tsx';
import GerarBoleto from './pages/GerarBoleto.tsx';
import GerarNF from './pages/GerarNF.tsx';
import NotFound from './pages/NotFound.tsx';
import OracleIcon from './components/OracleIcon.tsx';
import { useApp } from './contexts/AppContext.tsx';

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
      {/* Overlay do Sidebar Mobile */}
      <div 
        className={`fixed inset-0 bg-black/90 backdrop-blur-md z-[110] transition-opacity duration-700 md:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setIsSidebarOpen(false)}
      />
      
      {/* Sidebar - Desktop e Mobile (Collapsible) */}
      <div className={`fixed inset-y-0 left-0 z-[120] transform transition-transform duration-700 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0 w-[280px]' : '-translate-x-full md:w-auto'}`}>
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
          className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 md:px-12 relative custom-scrollbar pb-24 md:pb-12"
        >
          <div className="max-w-7xl mx-auto page-enter">
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

        <NotificationPanel isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
        <AIInsightsPanel isOpen={isAIPanelOpen} onClose={() => setIsAIPanelOpen(false)} />
        <CommandBar isOpen={isCommandBarOpen} onClose={() => setIsCommandBarOpen(false)} />
      </div>

      {/* Botão Flutuante NEXO IA - Minimalista 'N' */}
      <div className="fixed bottom-6 right-6 z-[100]">
        <button 
          onClick={() => setIsAIPanelOpen(true)}
          className="w-14 h-14 md:w-16 md:h-16 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.6)] transition-all flex items-center justify-center border border-white/[0.04] bg-[#000000]/90 backdrop-blur-xl hover:scale-105 active:scale-95 group overflow-hidden"
        >
          <div className="absolute inset-0 bg-emerald-500/[0.03] group-hover:bg-emerald-500/[0.08] transition-colors"></div>
          <OracleIcon className="w-7 h-7 md:w-8 md:h-8 relative z-10" />
          {/* Luz Atmosférica Discreta */}
          <div className="absolute inset-0 rounded-2xl border border-white/[0.05] pointer-events-none"></div>
        </button>
      </div>
    </div>
  );
};

export default App;
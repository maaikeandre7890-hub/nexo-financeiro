
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Client, Receivable, Expense, AuditLog, AppState } from '../types';

interface AppContextType {
  state: AppState;
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'score'>) => void;
  addReceivable: (receivable: Omit<Receivable, 'id'>) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteClient: (id: string) => void;
  markAsPaid: (id: string) => void;
  logAction: (action: string, details: string, type: AuditLog['type']) => void;
  getChartData: () => { name: string; value: number }[];
  totals: {
    toReceive: number;
    overdue: number;
    monthlyRecurring: number;
    totalExpenses: number;
    netBalance: number;
    cashHealth: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('nexo_data_v3');
    if (saved) return JSON.parse(saved);
    
    // Dados Iniciais de Onboarding
    return {
      clients: [
        { id: '1', name: 'Tecnologia Avançada SA', email: 'contato@techadv.com', status: 'Ativo', monthlyValue: 15000, score: 98, createdAt: '2024-01-10' },
        { id: '2', name: 'Varejo Global Corp', email: 'financeiro@varejo.com', status: 'Ativo', monthlyValue: 5200, score: 85, createdAt: '2024-03-05' },
      ],
      receivables: [
        { id: 'R1', clientId: '1', clientName: 'Tecnologia Avançada SA', amount: 15000, dueDate: '2024-07-20', status: 'Pendente', category: 'Serviços' },
        { id: 'R2', clientId: '2', clientName: 'Varejo Global Corp', amount: 5200, dueDate: '2024-05-10', status: 'Atrasado', category: 'Vendas' },
      ],
      expenses: [
        { id: 'E1', description: 'Servidores AWS', amount: 1200, date: '2024-06-01', category: 'TI' },
        { id: 'E2', description: 'Aluguel Matriz', amount: 3500, date: '2024-06-05', category: 'Fixo' },
      ],
      logs: [{ id: 'L1', timestamp: new Date().toISOString(), action: 'Setup Concluído', details: 'Infraestrutura Nexo SaaS ativada.', type: 'success' }]
    };
  });

  useEffect(() => {
    localStorage.setItem('nexo_data_v3', JSON.stringify(state));
  }, [state]);

  const logAction = (action: string, details: string, type: AuditLog['type']) => {
    const newLog: AuditLog = { id: Math.random().toString(36).substr(2, 9), timestamp: new Date().toISOString(), action, details, type };
    setState(prev => ({ ...prev, logs: [newLog, ...prev.logs].slice(0, 100) }));
  };

  const addClient = (clientData: Omit<Client, 'id' | 'createdAt' | 'score'>) => {
    const newClient: Client = {
      ...clientData,
      id: Math.random().toString(36).substr(2, 9),
      score: Math.floor(Math.random() * (100 - 70 + 1)) + 70,
      createdAt: new Date().toISOString(),
    };
    setState(prev => ({ ...prev, clients: [newClient, ...prev.clients] }));
    logAction('Novo Cliente', `${newClient.name} cadastrado no sistema.`, 'success');
  };

  const addReceivable = (recData: Omit<Receivable, 'id'>) => {
    const newRec: Receivable = { ...recData, id: 'REC-' + Math.random().toString(36).substr(2, 6).toUpperCase() };
    setState(prev => ({ ...prev, receivables: [newRec, ...prev.receivables] }));
    logAction('Receita Lançada', `Título de R$ ${newRec.amount} para ${newRec.clientName}`, 'info');
  };

  const addExpense = (expData: Omit<Expense, 'id'>) => {
    const newExp: Expense = { ...expData, id: 'EXP-' + Math.random().toString(36).substr(2, 6).toUpperCase() };
    setState(prev => ({ ...prev, expenses: [newExp, ...prev.expenses] }));
    logAction('Despesa Registrada', `${newExp.description} - R$ ${newExp.amount}`, 'warning');
  };

  const deleteClient = (id: string) => {
    const client = state.clients.find(c => c.id === id);
    setState(prev => ({ ...prev, clients: prev.clients.filter(c => c.id !== id) }));
    if (client) logAction('Exclusão de Cliente', `Empresa ${client.name} removida.`, 'warning');
  };

  const markAsPaid = (id: string) => {
    const rec = state.receivables.find(r => r.id === id);
    if (!rec) return;
    setState(prev => ({
      ...prev,
      receivables: prev.receivables.map(r => r.id === id ? { ...r, status: 'Pago' } : r)
    }));
    logAction('Baixa de Título', `Recebimento de R$ ${rec.amount} confirmado.`, 'success');
  };

  const getChartData = () => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const currentMonth = new Date().getMonth();
    const last6 = [];
    
    for(let i = 5; i >= 0; i--) {
      const monthIdx = (currentMonth - i + 12) % 12;
      const monthName = months[monthIdx];
      
      // Soma faturas pagas no mês fictício (para demo, somamos tudo que temos)
      // Em produção real, filtraríamos pela data do recebimento
      const income = state.receivables
        .filter(r => r.status === 'Pago')
        .reduce((acc, curr) => acc + curr.amount, 0) / 6; // Simulação de distribuição
        
      last6.push({ name: monthName, value: Math.floor(income + (Math.random() * 5000)) });
    }
    return last6;
  };

  const totals = {
    toReceive: state.receivables.filter(r => r.status === 'Pendente').reduce((acc, curr) => acc + curr.amount, 0),
    overdue: state.receivables.filter(r => r.status === 'Atrasado').reduce((acc, curr) => acc + curr.amount, 0),
    monthlyRecurring: state.clients.filter(c => c.status === 'Ativo').reduce((acc, curr) => acc + curr.monthlyValue, 0),
    totalExpenses: state.expenses.reduce((acc, curr) => acc + curr.amount, 0),
    netBalance: state.receivables.filter(r => r.status === 'Pago').reduce((acc, curr) => acc + curr.amount, 0) - state.expenses.reduce((acc, curr) => acc + curr.amount, 0),
    cashHealth: state.receivables.length > 0 
      ? Math.floor((state.receivables.filter(r => r.status === 'Pago').length / state.receivables.length) * 100) 
      : 100
  };

  return (
    <AppContext.Provider value={{ state, addClient, addReceivable, addExpense, deleteClient, markAsPaid, logAction, getChartData, totals }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

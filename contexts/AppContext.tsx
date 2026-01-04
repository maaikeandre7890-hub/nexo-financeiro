
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Client, Receivable, Expense, AuditLog, AppState } from '../types';

interface AppContextType {
  state: AppState;
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'score'>) => void;
  updateClient: (id: string, data: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  renegotiateClient: (id: string, newValue: number, newInstallments: number) => void;
  addReceivable: (receivable: Omit<Receivable, 'id'>) => void;
  updateReceivable: (id: string, data: Partial<Receivable>) => void;
  deleteReceivable: (id: string) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  markAsPaid: (id: string, method?: Receivable['paymentMethod']) => void;
  logAction: (action: string, details: string, type: AuditLog['type']) => void;
  clearHistory: (pin: string) => boolean;
  getChartData: () => { name: string; value: number }[];
  completeOnboarding: (userData: { userName: string, companyName: string, businessType: string }) => void;
  formatNumber: (num: number, precision?: number) => string;
  refreshData: () => Promise<void>;
  toggleTheme: () => void;
  isRefreshing: boolean;
  totals: {
    toReceive: number;
    overdue: number;
    paid: number;
    totalExpenses: number;
    netBalance: number;
    cashHealth: number;
    monthlyRecurring: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('nexo_data_v5_prod');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...parsed, theme: parsed.theme || 'dark' };
    }
    
    return {
      onboardingCompleted: false,
      theme: 'dark',
      userName: '',
      companyName: '',
      businessType: '',
      clients: [],
      receivables: [],
      expenses: [],
      logs: [{ 
        id: 'L-INIT', 
        timestamp: new Date().toISOString(), 
        action: 'Sistema Pronto', 
        details: 'NEXO aguardando configuração inicial.', 
        type: 'info' 
      }]
    };
  });

  useEffect(() => {
    localStorage.setItem('nexo_data_v5_prod', JSON.stringify(state));
    if (state.theme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
  }, [state]);

  const formatNumber = (num: number, precision: number = 2) => {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: precision,
    }).format(num);
  };

  const logAction = (action: string, details: string, type: AuditLog['type']) => {
    const newLog: AuditLog = { 
      id: 'LOG-' + Math.random().toString(36).substr(2, 6).toUpperCase(), 
      timestamp: new Date().toISOString(), 
      action, 
      details, 
      type 
    };
    setState(prev => ({ ...prev, logs: [newLog, ...prev.logs].slice(0, 200) }));
  };

  const refreshData = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const toggleTheme = () => {
    setState(prev => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }));
  };

  const completeOnboarding = (userData: { userName: string, companyName: string, businessType: string }) => {
    setState(prev => ({
      ...prev,
      ...userData,
      onboardingCompleted: true,
      logs: [{
        id: 'L-ONB',
        timestamp: new Date().toISOString(),
        action: 'Início do Sistema',
        details: `Configurado para ${userData.companyName}.`,
        type: 'success'
      }, ...prev.logs]
    }));
  };

  const addClient = (clientData: Omit<Client, 'id' | 'createdAt' | 'score'>) => {
    const newId = 'CL-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    const newClient: Client = {
      ...clientData,
      id: newId,
      score: 100,
      createdAt: new Date().toISOString(),
    };

    const newReceivables: Receivable[] = [];
    const now = new Date();
    
    for (let i = 0; i < newClient.installments; i++) {
      const dueDate = new Date(now.getFullYear(), now.getMonth() + i, newClient.dueDay);
      newReceivables.push({
        id: `REC-${newId}-${i+1}`,
        clientId: newId,
        clientName: newClient.name,
        amount: newClient.monthlyValue,
        dueDate: dueDate.toISOString().split('T')[0],
        status: 'Pendente',
        category: 'Mensalidade'
      });
    }

    setState(prev => ({ 
      ...prev, 
      clients: [newClient, ...prev.clients],
      receivables: [...newReceivables, ...prev.receivables]
    }));

    logAction('Cliente Cadastrado', `${newClient.name} - Plano de ${newClient.installments} meses.`, 'success');
  };

  const updateClient = (id: string, data: Partial<Client>) => {
    setState(prev => {
      const updatedClients = prev.clients.map(c => c.id === id ? { ...c, ...data } : c);
      const updatedRecs = prev.receivables.map(r => r.clientId === id ? { ...r, clientName: data.name || r.clientName } : r);
      return { ...prev, clients: updatedClients, receivables: updatedRecs };
    });
    logAction('Cliente Atualizado', `Dados de ${id} modificados.`, 'info');
  };

  const renegotiateClient = (id: string, newValue: number, newInstallments: number) => {
    setState(prev => {
      const client = prev.clients.find(c => c.id === id);
      if (!client) return prev;

      const updatedClients = prev.clients.map(c => 
        c.id === id ? { ...c, monthlyValue: newValue, installments: newInstallments, status: 'Em negociação' as const } : c
      );

      // Remove parcelas pendentes e atrasadas futuras
      const preservedRecs = prev.receivables.filter(r => 
        r.clientId !== id || r.status === 'Pago'
      );

      // Gera novas parcelas a partir de agora com categoria "Renegociação"
      const newRecs: Receivable[] = [];
      const now = new Date();
      for (let i = 0; i < newInstallments; i++) {
        const dueDate = new Date(now.getFullYear(), now.getMonth() + i, client.dueDay);
        const dateStr = dueDate.toISOString().split('T')[0];
        
        newRecs.push({
          id: `REC-REN-${id}-${i+1}-${Math.random().toString(36).substr(2, 4)}`,
          clientId: id,
          clientName: client.name,
          amount: newValue,
          dueDate: dateStr,
          status: 'Pendente',
          category: 'Renegociação'
        });
      }

      return { 
        ...prev, 
        clients: updatedClients, 
        receivables: [...preservedRecs, ...newRecs] 
      };
    });
    logAction('Renegociação', `Contrato ID:${id} renegociado para R$ ${newValue}/mês.`, 'warning');
  };

  const deleteClient = (id: string) => {
    setState(prev => ({ 
      ...prev, 
      clients: prev.clients.filter(c => c.id !== id),
      receivables: prev.receivables.filter(r => r.clientId !== id)
    }));
  };

  const addReceivable = (recData: Omit<Receivable, 'id'>) => {
    const newRec: Receivable = { ...recData, id: 'REC-' + Math.random().toString(36).substr(2, 6).toUpperCase() };
    setState(prev => ({ ...prev, receivables: [newRec, ...prev.receivables] }));
  };

  const updateReceivable = (id: string, data: Partial<Receivable>) => {
    setState(prev => ({
      ...prev,
      receivables: prev.receivables.map(r => r.id === id ? { ...r, ...data } : r)
    }));
  };

  const deleteReceivable = (id: string) => {
    setState(prev => ({ ...prev, receivables: prev.receivables.filter(r => r.id !== id) }));
  };

  const markAsPaid = (id: string, method: Receivable['paymentMethod'] = 'PIX') => {
    setState(prev => ({
      ...prev,
      receivables: prev.receivables.map(r => r.id === id ? { 
        ...r, 
        status: 'Pago', 
        paymentMethod: method,
        paidAt: new Date().toISOString()
      } : r)
    }));
    logAction('Recebimento', `Título liquidado via ${method}.`, 'success');
  };

  const addExpense = (expData: Omit<Expense, 'id'>) => {
    const newExp: Expense = { ...expData, id: 'EXP-' + Math.random().toString(36).substr(2, 6).toUpperCase() };
    setState(prev => ({ ...prev, expenses: [newExp, ...prev.expenses] }));
  };

  const deleteExpense = (id: string) => {
    setState(prev => ({ ...prev, expenses: prev.expenses.filter(e => e.id !== id) }));
  };

  const clearHistory = (pin: string) => {
    if (pin === '123456') {
      setState(prev => ({ ...prev, logs: [] }));
      return true;
    }
    return false;
  };

  const totals = useMemo(() => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    // Dinheiro que entrou (QUALQUER título pago)
    const paid = state.receivables.filter(r => r.status === 'Pago').reduce((a, b) => a + b.amount, 0);
    
    // Dinheiro previsto (EXCLUI renegociações pendentes por regra de negócio)
    const toReceive = state.receivables.filter(r => 
      r.status === 'Pendente' && 
      r.dueDate.startsWith(currentMonthPrefix) &&
      r.dueDate >= today &&
      r.category !== 'Renegociação'
    ).reduce((a, b) => a + b.amount, 0);
    
    const overdue = state.receivables.filter(r => 
      (r.status === 'Atrasado' || (r.status === 'Pendente' && r.dueDate < today)) &&
      r.category !== 'Renegociação'
    ).reduce((a, b) => a + b.amount, 0);
    
    const totalExpenses = state.expenses.reduce((a, b) => a + b.amount, 0);
    const netBalance = paid - totalExpenses;
    
    const totalTitles = state.receivables.length;
    const paidTitles = state.receivables.filter(r => r.status === 'Pago').length;
    const cashHealth = totalTitles > 0 ? Math.floor((paidTitles / totalTitles) * 100) : 100;

    const monthlyRecurring = state.clients.reduce((a, b) => a + b.monthlyValue, 0);

    return { paid, toReceive, overdue, totalExpenses, netBalance, cashHealth, monthlyRecurring };
  }, [state.receivables, state.expenses, state.clients]);

  const getChartData = () => {
    const monthsNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const now = new Date();
    const data = [];
    
    for(let i = 0; i < 6; i++) {
      const targetDate = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const mIdx = targetDate.getMonth();
      const monthYearPrefix = `${targetDate.getFullYear()}-${String(mIdx + 1).padStart(2, '0')}`;
      
      const monthlyTotal = state.receivables
        .filter(r => r.dueDate.startsWith(monthYearPrefix) && r.category !== 'Renegociação')
        .reduce((sum, r) => sum + r.amount, 0);
        
      data.push({ 
        name: monthsNames[mIdx], 
        value: monthlyTotal
      });
    }
    return data;
  };

  return (
    <AppContext.Provider value={{ 
      state, addClient, updateClient, deleteClient, renegotiateClient,
      addReceivable, updateReceivable, deleteReceivable, markAsPaid, 
      addExpense, deleteExpense, logAction, clearHistory,
      getChartData, totals, completeOnboarding, formatNumber,
      refreshData, isRefreshing, toggleTheme
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp deve ser usado dentro de AppProvider');
  return context;
};

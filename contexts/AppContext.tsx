
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Client, Receivable, Expense, AuditLog, AppState } from '../types';

interface AppContextType {
  state: AppState;
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'score'>) => void;
  updateClient: (id: string, data: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  addReceivable: (receivable: Omit<Receivable, 'id'>) => void;
  deleteReceivable: (id: string) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  markAsPaid: (id: string) => void;
  logAction: (action: string, details: string, type: AuditLog['type']) => void;
  clearHistory: (pin: string) => boolean;
  getChartData: () => { name: string; value: number }[];
  completeOnboarding: (userData: { userName: string, companyName: string, businessType: string }) => void;
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
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('nexo_data_v5_prod');
    if (saved) return JSON.parse(saved);
    
    // ESTADO INICIAL ZERADO PARA NOVO USUÁRIO
    return {
      onboardingCompleted: false,
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
        details: 'NEXO aguardando configuração inicial de identidade.', 
        type: 'info' 
      }]
    };
  });

  useEffect(() => {
    localStorage.setItem('nexo_data_v5_prod', JSON.stringify(state));
  }, [state]);

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

  const completeOnboarding = (userData: { userName: string, companyName: string, businessType: string }) => {
    setState(prev => ({
      ...prev,
      ...userData,
      onboardingCompleted: true,
      logs: [{
        id: 'L-ONB',
        timestamp: new Date().toISOString(),
        action: 'Onboarding Concluído',
        details: `Ambiente configurado para ${userData.companyName}. Responsável: ${userData.userName}.`,
        type: 'success'
      }, ...prev.logs]
    }));
  };

  const addClient = (clientData: Omit<Client, 'id' | 'createdAt' | 'score'>) => {
    const newClient: Client = {
      ...clientData,
      id: 'CL-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      score: 100,
      createdAt: new Date().toISOString(),
    };
    setState(prev => ({ ...prev, clients: [newClient, ...prev.clients] }));
    logAction('Novo Cliente', `Entidade ${newClient.name} integrada à base.`, 'success');
  };

  const updateClient = (id: string, data: Partial<Client>) => {
    setState(prev => ({
      ...prev,
      clients: prev.clients.map(c => c.id === id ? { ...c, ...data } : c)
    }));
    logAction('Edição de Cliente', `Dados da entidade ID:${id} atualizados.`, 'info');
  };

  const deleteClient = (id: string) => {
    const client = state.clients.find(c => c.id === id);
    setState(prev => ({ 
      ...prev, 
      clients: prev.clients.filter(c => c.id !== id),
      receivables: prev.receivables.filter(r => r.clientId !== id)
    }));
    if (client) logAction('Exclusão Crítica', `Cliente ${client.name} e faturas relacionadas removidos.`, 'warning');
  };

  const addReceivable = (recData: Omit<Receivable, 'id'>) => {
    const newRec: Receivable = { ...recData, id: 'REC-' + Math.random().toString(36).substr(2, 6).toUpperCase() };
    setState(prev => ({ ...prev, receivables: [newRec, ...prev.receivables] }));
    logAction('Receita Registrada', `Lançamento de R$ ${newRec.amount.toLocaleString()} para ${newRec.clientName}.`, 'success');
  };

  const deleteReceivable = (id: string) => {
    const rec = state.receivables.find(r => r.id === id);
    setState(prev => ({ ...prev, receivables: prev.receivables.filter(r => r.id !== id) }));
    if (rec) logAction('Exclusão de Receita', `Título R$ ${rec.amount} removido do fluxo.`, 'warning');
  };

  const markAsPaid = (id: string) => {
    const rec = state.receivables.find(r => r.id === id);
    if (!rec) return;
    setState(prev => ({
      ...prev,
      receivables: prev.receivables.map(r => r.id === id ? { ...r, status: 'Pago' } : r)
    }));
    logAction('Baixa de Título', `Recebimento de R$ ${rec.amount} confirmado e liquidado.`, 'success');
  };

  const addExpense = (expData: Omit<Expense, 'id'>) => {
    const newExp: Expense = { ...expData, id: 'EXP-' + Math.random().toString(36).substr(2, 6).toUpperCase() };
    setState(prev => ({ ...prev, expenses: [newExp, ...prev.expenses] }));
    logAction('Nova Despesa', `Saída de R$ ${newExp.amount} registrada: ${newExp.description}.`, 'warning');
  };

  const deleteExpense = (id: string) => {
    const exp = state.expenses.find(e => e.id === id);
    setState(prev => ({ ...prev, expenses: prev.expenses.filter(e => e.id !== id) }));
    if (exp) logAction('Exclusão de Despesa', `Gasto de R$ ${exp.amount} removido.`, 'info');
  };

  const clearHistory = (pin: string) => {
    if (pin === '123456') {
      setState(prev => ({ ...prev, logs: [{ id: 'L-ROOT', timestamp: new Date().toISOString(), action: 'Limpeza de Auditoria', details: 'Histórico resetado via PIN de administrador.', type: 'warning' }] }));
      return true;
    }
    return false;
  };

  const totals = useMemo(() => {
    const paid = state.receivables.filter(r => r.status === 'Pago').reduce((a, b) => a + b.amount, 0);
    const toReceive = state.receivables.filter(r => r.status === 'Pendente').reduce((a, b) => a + b.amount, 0);
    const overdue = state.receivables.filter(r => r.status === 'Atrasado').reduce((a, b) => a + b.amount, 0);
    const totalExpenses = state.expenses.reduce((a, b) => a + b.amount, 0);
    const netBalance = paid - totalExpenses;
    
    const totalTitles = state.receivables.length;
    const paidTitles = state.receivables.filter(r => r.status === 'Pago').length;
    const cashHealth = totalTitles > 0 ? Math.floor((paidTitles / totalTitles) * 100) : 0;

    const monthlyRecurring = state.clients.filter(c => c.status === 'Ativo').reduce((a, b) => a + b.monthlyValue, 0);

    return { paid, toReceive, overdue, totalExpenses, netBalance, cashHealth, monthlyRecurring };
  }, [state.receivables, state.expenses, state.clients]);

  const getChartData = () => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const currentMonth = new Date().getMonth();
    const data = [];
    
    for(let i = 5; i >= 0; i--) {
      const mIdx = (currentMonth - i + 12) % 12;
      const baseValue = totals.paid > 0 ? totals.paid / 4 : 0; 
      data.push({ 
        name: months[mIdx], 
        value: baseValue > 0 ? Math.floor(baseValue + (Math.random() * baseValue * 0.1)) : 0
      });
    }
    return data;
  };

  return (
    <AppContext.Provider value={{ 
      state, addClient, updateClient, deleteClient, 
      addReceivable, deleteReceivable, markAsPaid, 
      addExpense, deleteExpense, logAction, clearHistory,
      getChartData, totals, completeOnboarding
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

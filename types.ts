
export interface NavItem {
  label: string;
  path: string;
  icon: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  status: 'Ativo' | 'Inativo';
  monthlyValue: number;
  score: number;
  createdAt: string;
}

export interface Receivable {
  id: string;
  clientId: string;
  clientName: string;
  amount: number;
  dueDate: string;
  status: 'Pago' | 'Pendente' | 'Atrasado';
  category: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  type: 'success' | 'warning' | 'info';
}

export interface AppState {
  clients: Client[];
  receivables: Receivable[];
  expenses: Expense[];
  logs: AuditLog[];
}

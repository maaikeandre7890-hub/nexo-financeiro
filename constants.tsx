
import { NavItem } from './types';

export const COLORS = {
  background: '#020608',
  sidebar: '#000000',
  card: 'rgba(2, 12, 16, 0.7)',
  primary: '#10b981',
  primaryDark: '#059669',
  secondary: '#3b82f6',
  warning: '#f59e0b',
  danger: '#ef4444',
  textMain: '#F8FAFC',
  textMuted: '#94A3B8',
  border: 'rgba(255, 255, 255, 0.04)'
};

export const NAVIGATION: NavItem[] = [
  { label: 'Painel Geral', path: '/dashboard', icon: 'fa-chart-pie' },
  { label: 'Meus Clientes', path: '/clientes', icon: 'fa-users' },
  { label: 'Renegociações', path: '/renegociacoes', icon: 'fa-handshake-angle' },
  { label: 'Contas a Receber', path: '/recebiveis', icon: 'fa-file-invoice-dollar' },
  { label: 'Contas em Atraso', path: '/parcelas-atraso', icon: 'fa-triangle-exclamation' },
  { label: 'Histórico de Ações', path: '/historico', icon: 'fa-clock-rotate-left' },
  { label: '🧾 Boletos & NF', path: '/boletos-nf', icon: 'fa-file-invoice' },
  { label: 'Relatórios', path: '/relatorios', icon: 'fa-file-contract' },
  { label: 'Lucro do Mês', path: '/faturamento-liquido', icon: 'fa-scale-balanced' },
  { label: 'Minhas Despesas', path: '/despesas-extras', icon: 'fa-receipt' },
  { label: 'Cobrar Clientes', path: '/cobranca-automatica', icon: 'fa-robot' },
  { label: 'Status do App', path: '/sistema', icon: 'fa-microchip' },
  { label: 'Configurações', path: '/configuracoes', icon: 'fa-gear' },
  { label: 'Manual de Uso', path: '/tutorial', icon: 'fa-book-open' },
];

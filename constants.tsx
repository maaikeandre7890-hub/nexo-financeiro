
import { NavItem } from './types';

export const COLORS = {
  background: '#071821',
  sidebar: '#051118',
  card: 'rgba(17, 37, 50, 0.6)',
  primary: '#10b981',
  primaryDark: '#059669',
  secondary: '#3b82f6',
  warning: '#f59e0b',
  danger: '#ef4444',
  textMain: '#F8FAFC',
  textMuted: '#94A3B8',
  border: 'rgba(255, 255, 255, 0.08)'
};

export const NAVIGATION: NavItem[] = [
  { label: 'Painel Geral', path: '/dashboard', icon: 'fa-chart-pie' },
  { label: 'Gestão de Clientes', path: '/clientes', icon: 'fa-users' },
  { label: 'Fluxo de Recebíveis', path: '/recebiveis', icon: 'fa-arrow-up-to-line' },
  { label: 'Parcelas em Atraso', path: '/parcelas-atraso', icon: 'fa-triangle-exclamation' },
  { label: 'Registro de Auditoria', path: '/historico', icon: 'fa-clock-rotate-left' },
  { label: 'Relatórios Gerenciais', path: '/relatorios', icon: 'fa-file-invoice-dollar' },
  { label: 'Faturamento Líquido', path: '/faturamento-liquido', icon: 'fa-scale-balanced' },
  { label: 'Gestão de Despesas', path: '/despesas-extras', icon: 'fa-receipt' },
  { label: 'Cobrança Inteligente', path: '/cobranca-automatica', icon: 'fa-robot' },
  { label: 'Status do Sistema', path: '/sistema', icon: 'fa-microchip' },
  { label: 'Configurações', path: '/configuracoes', icon: 'fa-gear' },
  { label: 'Guia de Uso', path: '/tutorial', icon: 'fa-book-open' },
];

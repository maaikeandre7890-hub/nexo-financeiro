
import { NavItem } from './types';

export const COLORS = {
  background: '#0B1C26',
  sidebar: '#07131A',
  card: '#112532',
  primary: '#10b981',
  primaryDark: '#059669',
  secondary: '#3b82f6',
  warning: '#f59e0b',
  danger: '#ef4444',
  textMain: '#F8FAFC',
  textMuted: '#94A3B8',
  border: 'rgba(255, 255, 255, 0.06)'
};

export const NAVIGATION: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: 'fa-chart-pie' },
  { label: 'Clientes', path: '/clientes', icon: 'fa-users' },
  { label: 'Recebíveis', path: '/recebiveis', icon: 'fa-arrow-up-to-line' },
  { label: 'Parcelas em Atraso', path: '/parcelas-atraso', icon: 'fa-triangle-exclamation' },
  { label: 'Histórico', path: '/historico', icon: 'fa-clock-rotate-left' },
  { label: 'Relatórios', path: '/relatorios', icon: 'fa-file-invoice-dollar' },
  { label: 'Faturamento Líquido', path: '/faturamento-liquido', icon: 'fa-scale-balanced' },
  { label: 'Despesas Extras', path: '/despesas-extras', icon: 'fa-receipt' },
  { label: 'Cobrança Automática', path: '/cobranca-automatica', icon: 'fa-robot' },
  { label: 'Sistema', path: '/sistema', icon: 'fa-microchip' },
  { label: 'Configurações', path: '/configuracoes', icon: 'fa-gear' },
  { label: 'Tutorial', path: '/tutorial', icon: 'fa-book-open' },
];

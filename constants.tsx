
import { NavItem } from './types';

export const COLORS = {
  background: '#000000',
  card: '#080808',
  primary: '#10b981',
  primaryDark: '#059669',
  secondary: '#3b82f6',
  warning: '#f59e0b',
  danger: '#f43f5e',
  textMuted: '#71717a'
};

export const NAVIGATION: NavItem[] = [
  { label: 'Visão Geral', path: '/dashboard', icon: 'fa-chart-pie' },
  { label: 'Entradas / Receitas', path: '/recebiveis', icon: 'fa-arrow-up-to-line' },
  { label: 'Saídas / Despesas', path: '/despesas', icon: 'fa-arrow-down-from-line' },
  { label: 'Base de Clientes', path: '/clientes', icon: 'fa-users' },
  { label: 'Resultado (DRE)', path: '/relatorios', icon: 'fa-file-invoice-dollar' },
  { label: 'Configurações', path: '/configuracoes', icon: 'fa-gear' },
];

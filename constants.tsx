
import { NavItem } from './types';

export const COLORS = {
  background: '#020617',
  card: '#0f172a',
  primary: '#10b981',
  primaryDark: '#059669',
  secondary: '#3b82f6',
  warning: '#f59e0b',
  danger: '#f43f5e',
  textMuted: '#94a3b8'
};

export const NAVIGATION: NavItem[] = [
  { label: 'Painel Geral', path: '/dashboard', icon: 'fa-grid-2' },
  { label: 'Carteira de Clientes', path: '/clientes', icon: 'fa-address-book' },
  { label: 'Fluxo de Recebíveis', path: '/recebiveis', icon: 'fa-vault' },
  { label: 'Alertas de Atraso', path: '/parcelas-atraso', icon: 'fa-alarm-exclamation' },
  { label: 'Histórico Global', path: '/historico', icon: 'fa-rectangles-mixed' },
  { label: 'Relatórios & DRE', path: '/relatorios', icon: 'fa-chart-mixed' },
  { label: 'Faturamento & Notas', path: '/faturamento', icon: 'fa-file-invoice-dollar' },
  { label: 'Controle de Despesas', path: '/despesas', icon: 'fa-minus-circle' },
  { label: 'Configurações', path: '/configuracoes', icon: 'fa-sliders' },
  { label: 'Central de Ajuda', path: '/tutorial', icon: 'fa-circle-info' },
];

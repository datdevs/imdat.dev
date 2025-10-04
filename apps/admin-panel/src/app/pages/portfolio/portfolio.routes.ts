import { MenuItem } from '../../app.routes';

export const portfolioRoutes: MenuItem[] = [
  {
    path: '',
    loadComponent: async () => (await import('./portfolio')).Portfolio,
  },
  {
    path: 'view/:id',
    loadComponent: async () => (await import('./portfolio')).Portfolio,
  },
  {
    path: 'create',
    loadComponent: async () => (await import('./portfolio')).Portfolio,
  },
  {
    path: 'edit/:id',
    loadComponent: async () => (await import('./portfolio')).Portfolio,
  },
];

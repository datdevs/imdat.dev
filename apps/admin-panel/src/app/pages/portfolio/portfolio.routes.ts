import { MenuItem } from '../../app.routes';
import { portfolioEditGuard } from './guards';

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
    canActivate: [portfolioEditGuard],
  },
];

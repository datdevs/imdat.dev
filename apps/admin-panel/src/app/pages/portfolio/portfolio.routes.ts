import { MenuItem } from '../../app.routes';

export const portfolioRoutes: MenuItem[] = [
  {
    path: '',
    loadComponent: async () => (await import('./portfolio.component')).PortfolioComponent,
  },
  {
    path: 'view/:id',
    loadComponent: async () => (await import('./portfolio.component')).PortfolioComponent,
  },
  {
    path: 'create',
    loadComponent: async () => (await import('./portfolio.component')).PortfolioComponent,
  },
  {
    path: 'edit/:id',
    loadComponent: async () => (await import('./portfolio.component')).PortfolioComponent,
  },
];

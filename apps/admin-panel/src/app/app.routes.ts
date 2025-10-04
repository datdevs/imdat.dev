import { AuthGuard, AuthPipe, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { Route } from '@angular/router';

import { MainComponent } from './layouts/main/main.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/login']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['/']);

export interface MenuItem extends Route {
  children?: MenuItem[];
  data?: {
    allowCreate?: boolean;
    authGuardPipe?: () => AuthPipe;
    icon?: string;
    isShowInMenu?: boolean;
    mainMenu?: boolean;
    sideNavPosition?: number;
  };
}

export const appRoutes: MenuItem[] = [
  {
    path: '',
    component: MainComponent,
    canActivate: [AuthGuard],
    data: {
      authGuardPipe: redirectUnauthorizedToLogin,
      mainMenu: true,
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        title: 'Dashboard',
        data: {
          icon: 'chart-pie',
          isShowInMenu: true,
          sideNavPosition: 1,
        },
        loadComponent: async () => (await import('./pages/dashboard/dashboard.component')).DashboardComponent,
      },
      {
        path: 'portfolio',
        title: 'Portfolio',
        data: {
          allowCreate: true,
          icon: 'briefcase-business',
          isShowInMenu: true,
          sideNavPosition: 2,
        },
        loadChildren: async () => (await import('./pages/portfolio/portfolio.routes')).portfolioRoutes,
      },
      {
        path: 'users',
        title: 'Users',
        data: {
          icon: 'users',
          isShowInMenu: true,
          sideNavPosition: 2,
        },
        loadComponent: async () => (await import('./pages/dashboard/dashboard.component')).DashboardComponent,
      },
      // {
      //   loadComponent: () => import('./pages/profile/profile.component').then((m) => m.ProfileComponent),
      //   path: 'profile',
      //   title: 'Profile',
      // },
    ],
  },
  {
    path: 'login',
    title: 'Login',
    canActivate: [AuthGuard],
    data: {
      authGuardPipe: redirectLoggedInToHome,
    },
    loadComponent: async () => (await import('./pages/login/login.component')).LoginComponent,
  },
  {
    path: '404',
    title: 'Page Not Found',
    component: NotFoundComponent,
  },
  {
    path: '**',
    redirectTo: '404',
  },
];

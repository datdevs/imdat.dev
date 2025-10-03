import { AuthGuard, AuthPipe, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { Route } from '@angular/router';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/login']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['/']);

export interface MenuItem extends Route {
  children?: MenuItem[];
  data?: {
    authGuardPipe?: () => AuthPipe;
    icon?: string;
    isShowInMenu?: boolean;
    mainMenu?: boolean;
    sideNavPosition?: number;
  };
}

export const appRoutes: MenuItem[] = [
  {
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        data: {
          icon: 'chart-pie',
          isShowInMenu: true,
          sideNavPosition: 1,
        },
        loadComponent: () => import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
        path: 'dashboard',
        title: 'Dashboard',
      },
      {
        data: {
          icon: 'briefcase-business',
          isShowInMenu: true,
          sideNavPosition: 2,
        },
        loadComponent: () => import('./pages/portfolio/portfolio.component').then((m) => m.PortfolioComponent),
        path: 'portfolio',
        title: 'Portfolio',
      },
      {
        data: {
          icon: 'users',
          isShowInMenu: true,
          sideNavPosition: 2,
        },
        loadComponent: () => import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
        path: 'users',
        title: 'Users',
      },
      // {
      //   loadComponent: () => import('./pages/profile/profile.component').then((m) => m.ProfileComponent),
      //   path: 'profile',
      //   title: 'Profile',
      // },
    ],
    data: {
      authGuardPipe: redirectUnauthorizedToLogin,
      mainMenu: true,
    },
    loadComponent: () => import('./layouts/main/main.component').then((m) => m.MainComponent),
    path: '',
  },
  {
    canActivate: [AuthGuard],
    data: {
      authGuardPipe: redirectLoggedInToHome,
    },
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent),
    path: 'login',
    title: 'Login',
  },
  {
    loadComponent: () => import('./pages/not-found/not-found.component').then((m) => m.NotFoundComponent),
    path: '404',
    title: 'Page Not Found',
  },
  {
    path: '**',
    redirectTo: '404',
  },
];

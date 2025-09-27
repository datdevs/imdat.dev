import { AuthGuard, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { Route } from '@angular/router';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/login']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['/']);

export const appRoutes: Route[] = [
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
          icon: 'space_dashboard',
          mainMenu: true,
        },
        loadComponent: () => import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
        path: 'dashboard',
        title: 'Dashboard',
      },
      {
        data: {
          icon: 'folder_special',
          mainMenu: true,
        },
        loadComponent: () => import('./pages/portfolio/portfolio.component').then((m) => m.PortfolioComponent),
        path: 'portfolio',
        title: 'Portfolio',
      },
      {
        data: {
          icon: 'group',
          mainMenu: true,
        },
        loadComponent: () => import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
        path: 'users',
        title: 'Users',
      },
      {
        data: {
          icon: 'engineering',
          mainMenu: true,
        },
        loadComponent: () => import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
        path: 'employees',
        title: 'Employees',
      },
      // {
      //   loadComponent: () => import('./pages/profile/profile.component').then((m) => m.ProfileComponent),
      //   path: 'profile',
      //   title: 'Profile',
      // },
    ],
    data: {
      authGuardPipe: redirectUnauthorizedToLogin,
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

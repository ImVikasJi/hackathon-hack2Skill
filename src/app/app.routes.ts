import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/landing/landing').then((m) => m.Landing),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'signup',
    loadComponent: () => import('./features/auth/signup/signup').then((m) => m.Signup),
  },
  {
    path: 'verify-email',
    loadComponent: () => import('./features/auth/verify/verify').then((m) => m.Verify),
  },
  {
    path: 'discover',
    loadComponent: () => import('./features/discover/discover').then((m) => m.Discover),
    canActivate: [authGuard],
  },
  {
    path: 'history',
    loadComponent: () => import('./features/history/history').then((m) => m.History),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '' },
];

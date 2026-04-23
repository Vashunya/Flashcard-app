import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard],
  },
  {
    path: 'decks',
    loadComponent: () => import('./components/deck-list/deck-list.component').then(m => m.DeckListComponent),
    canActivate: [authGuard],
  },
  {
    path: 'decks/new',
    loadComponent: () => import('./components/deck-form/deck-form.component').then(m => m.DeckFormComponent),
    canActivate: [authGuard],
  },
  {
    path: 'decks/:id/edit',
    loadComponent: () => import('./components/deck-form/deck-form.component').then(m => m.DeckFormComponent),
    canActivate: [authGuard],
  },
  {
    path: 'decks/:id/study',
    loadComponent: () => import('./components/study/study.component').then(m => m.StudyComponent),
    canActivate: [authGuard],
  },
  {
    path: 'decks/:id',
    loadComponent: () => import('./components/deck-detail/deck-detail.component').then(m => m.DeckDetailComponent),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '/dashboard' },
];
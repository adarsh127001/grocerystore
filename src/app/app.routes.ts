import { Routes } from '@angular/router';
import { INVENTORY_ROUTES } from './inventory/inventory.routes';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./home/home.component').then(c => c.HomeComponent) },
  { path: 'login', loadComponent: () => import('./auth/login/login.component').then(c => c.LoginComponent) },
  { path: 'register', loadComponent: () => import('./auth/register/register.component').then(c => c.RegisterComponent) },
  { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then(c => c.DashboardComponent) },
  { path: 'inventory', children: INVENTORY_ROUTES },
  // These are placeholder routes that we'll implement later
  { path: 'shipments', loadComponent: () => import('./dashboard/dashboard.component').then(c => c.DashboardComponent) },
  { path: 'tasks', loadComponent: () => import('./dashboard/dashboard.component').then(c => c.DashboardComponent) },
  { path: 'blogs', loadComponent: () => import('./dashboard/dashboard.component').then(c => c.DashboardComponent) },
  { path: '**', redirectTo: '/dashboard' }
];
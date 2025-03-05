import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./home/home.component').then(c => c.HomeComponent) },
  { path: 'login', loadComponent: () => import('./auth/login/login.component').then(c => c.LoginComponent) },
  { path: 'register', loadComponent: () => import('./auth/register/register.component').then(c => c.RegisterComponent) },
  { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then(c => c.DashboardComponent) },
  { path: 'food-safety-blogs', loadComponent: () => import('./food-safety-blogs/food-safety-blogs.component').then(c => c.FoodSafetyBlogsComponent) },
  { path: 'food-safety-blogs/:id', loadComponent: () => import('./food-safety-blogs/blog-detail/blog-detail.component').then(c => c.BlogDetailComponent) },
  { path: 'stock-management', loadComponent: () => import('./stock-management/stock-management.component').then(c => c.StockManagementComponent) },
  { path: 'shipment-tracking', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'shipments', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'tasks', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'blogs', redirectTo: '/food-safety-blogs', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }
];
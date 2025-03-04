import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./home/home.component').then(c => c.HomeComponent) },
  { path: 'login', loadComponent: () => import('./auth/login/login.component').then(c => c.LoginComponent) },
  { path: 'register', loadComponent: () => import('./auth/register/register.component').then(c => c.RegisterComponent) },
  { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then(c => c.DashboardComponent) },
  
  // Main navigation items
  // { path: 'stocks', loadComponent: () => import('./inventory/stocks/stocks.component').then(c => c.StocksComponent) },
  // { path: 'shipment-tracking', loadComponent: () => import('./shipment-tracking/shipment-tracking.component').then(c => c.ShipmentTrackingComponent) },
  // { path: 'reports-analytics', loadComponent: () => import('./reports-analytics/reports-analytics.component').then(c => c.ReportsAnalyticsComponent) },
  // { path: 'customer-management', loadComponent: () => import('./customer-management/customer-management.component').then(c => c.CustomerManagementComponent) },
  { path: 'food-safety-blogs', loadComponent: () => import('./food-safety-blogs/food-safety-blogs.component').then(c => c.FoodSafetyBlogsComponent) },
  { path: 'food-safety-blogs/:id', loadComponent: () => import('./food-safety-blogs/blog-detail/blog-detail.component').then(c => c.BlogDetailComponent) },
  
  // Legacy routes - keep for backward compatibility

  { path: 'shipments', redirectTo: '/shipment-tracking', pathMatch: 'full' },
  { path: 'tasks', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'blogs', redirectTo: '/food-safety-blogs', pathMatch: 'full' },
  
  // Fallback route
  { path: '**', redirectTo: '/dashboard' }
];
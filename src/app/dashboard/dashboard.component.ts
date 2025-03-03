import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  template: `
    <div class="dashboard-container">
      <mat-toolbar color="primary">
        <span>Grocery Store Management System</span>
        <span class="spacer"></span>
        <span>Welcome, {{getCurrentUser()}}</span>
        <button mat-icon-button (click)="logout()">
          <mat-icon>logout</mat-icon>
        </button>
      </mat-toolbar>
      
      <div class="content">
        <h1>Dashboard</h1>
        <p>Welcome to the Grocery Store Management System!</p>
        
        <div class="card-container">
          <mat-card>
            <mat-card-header>
              <mat-card-title>Inventory Management</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>Manage your store's inventory items</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-button>OPEN</button>
            </mat-card-actions>
          </mat-card>
          
          <mat-card>
            <mat-card-header>
              <mat-card-title>Order Tracking</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>View and manage customer orders</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-button>OPEN</button>
            </mat-card-actions>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .spacer {
      flex: 1 1 auto;
    }
    .content {
      padding: 20px;
    }
    .card-container {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      margin-top: 20px;
    }
    mat-card {
      width: 300px;
    }
  `]
})
export class DashboardComponent {
  
  constructor(private router: Router) {}
  
  getCurrentUser(): string {
    return sessionStorage.getItem('currentUser') || 'User';
  }
  
  logout(): void {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}
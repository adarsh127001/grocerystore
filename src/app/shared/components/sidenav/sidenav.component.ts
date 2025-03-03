import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav mode="side" opened>
        <div class="logo">
          <span>Grocery Store</span>
        </div>
        <mat-nav-list>
          <a mat-list-item routerLink="/dashboard" routerLinkActive="active">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Dashboard</span>
          </a>
          <a mat-list-item routerLink="/inventory" routerLinkActive="active">
            <mat-icon matListItemIcon>inventory_2</mat-icon>
            <span matListItemTitle>Inventory</span>
          </a>
          <a mat-list-item routerLink="/orders" routerLinkActive="active">
            <mat-icon matListItemIcon>shopping_cart</mat-icon>
            <span matListItemTitle>Orders</span>
          </a>
          <a mat-list-item routerLink="/suppliers" routerLinkActive="active">
            <mat-icon matListItemIcon>local_shipping</mat-icon>
            <span matListItemTitle>Suppliers</span>
          </a>
          <a mat-list-item routerLink="/reports" routerLinkActive="active">
            <mat-icon matListItemIcon>bar_chart</mat-icon>
            <span matListItemTitle>Reports</span>
          </a>
        </mat-nav-list>
        <div class="footer-nav">
          <mat-nav-list>
            <a mat-list-item (click)="logout()">
              <mat-icon matListItemIcon>logout</mat-icon>
              <span matListItemTitle>Logout</span>
            </a>
          </mat-nav-list>
        </div>
      </mat-sidenav>
      
      <mat-sidenav-content>
        <ng-content></ng-content>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100vh;
    }
    mat-sidenav {
      width: 240px;
      background-color: #fff;
      border-right: 1px solid #eee;
    }
    .logo {
      display: flex;
      align-items: center;
      padding: 16px;
      font-size: 20px;
      font-weight: 500;
      color: #1976d2;
      border-bottom: 1px solid #eee;
    }
    .active {
      background-color: rgba(25, 118, 210, 0.1);
      color: #1976d2;
    }
    .footer-nav {
      position: absolute;
      bottom: 0;
      width: 100%;
      border-top: 1px solid #eee;
    }
  `]
})
export class SidenavComponent {
  constructor(private router: Router) {}
  
  logout() {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}
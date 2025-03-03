import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div style="padding: 20px; text-align: center;">
      <h1>Grocery Store Management</h1>
      <p>Welcome to our management system</p>
      <a routerLink="/login">Login</a>
    </div>
  `,
  styles: []
})
export class HomeComponent {}
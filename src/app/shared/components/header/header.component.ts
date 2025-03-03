import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="header">
      <h1 class="title">{{title}}</h1>
      <div class="actions">
        <button mat-icon-button>
          <mat-icon>notifications</mat-icon>
        </button>
        <button mat-icon-button>
          <mat-icon>account_circle</mat-icon>
        </button>
        <button mat-icon-button>
          <mat-icon>settings</mat-icon>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .title {
      margin: 0;
      font-size: 24px;
      font-weight: 500;
    }
    .actions {
      display: flex;
      gap: 8px;
    }
  `]
})
export class HeaderComponent {
  @Input() title: string = 'Dashboard';
}
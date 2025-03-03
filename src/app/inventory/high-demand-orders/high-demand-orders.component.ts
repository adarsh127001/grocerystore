import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-high-demand-orders',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="high-demand-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>High Demand Items</mat-card-title>
          <mat-card-subtitle>Items with high turnover rate</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="highDemandItems" class="high-demand-table">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Name</th>
              <td mat-cell *matCellDef="let item">{{item.name}}</td>
            </ng-container>
            
            <ng-container matColumnDef="category">
              <th mat-header-cell *matHeaderCellDef>Category</th>
              <td mat-cell *matCellDef="let item">{{item.category}}</td>
            </ng-container>
            
            <ng-container matColumnDef="demand">
              <th mat-header-cell *matHeaderCellDef>Weekly Demand</th>
              <td mat-cell *matCellDef="let item">{{calculateDemand(item)}} units</td>
            </ng-container>
            
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Current Status</th>
              <td mat-cell *matCellDef="let item">
                <span [ngClass]="getStatusClass(item.status)">{{item.status}}</span>
              </td>
            </ng-container>
            
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let item">
                <button mat-button color="primary">Reorder</button>
              </td>
            </ng-container>
            
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .high-demand-container {
      padding: 16px;
    }
    .high-demand-table {
      width: 100%;
    }
    .status-in-stock {
      color: #4caf50;
      font-weight: bold;
    }
    .status-low-stock {
      color: #ff9800;
      font-weight: bold;
    }
    .status-out-of-stock {
      color: #f44336;
      font-weight: bold;
    }
  `]
})
export class HighDemandOrdersComponent {
  @Input() inventoryData: any[] = [];
  displayedColumns: string[] = ['name', 'category', 'demand', 'status', 'actions'];
  
  get highDemandItems() {
    return this.inventoryData
      .filter(item => this.calculateDemand(item) > 20)
      .sort((a, b) => this.calculateDemand(b) - this.calculateDemand(a));
  }
  
  calculateDemand(item: any): number {
    return Math.floor(30 * Math.random() + 10);
  }
  
  getStatusClass(status: string): string {
    switch(status) {
      case 'In Stock': return 'status-in-stock';
      case 'Low Stock': return 'status-low-stock';
      case 'Out of Stock': return 'status-out-of-stock';
      default: return '';
    }
  }
}
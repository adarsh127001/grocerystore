import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  price: number;
  expiryDate: string | Date;
  supplier: string;
  status: string;
}

@Component({
  selector: 'app-stock-overview',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './stock-overview.component.html',
  styleUrl: './stock-overview.component.css'
})
export class StockOverviewComponent implements OnChanges {
  @Input() inventoryData: InventoryItem[] = [];
  
  displayedColumns: string[] = ['name', 'category', 'quantity', 'price', 'expiryDate', 'supplier', 'status', 'actions'];
  
  totalItems: number = 0;
  lowStockItems: number = 0;
  outOfStockItems: number = 0;
  expiringItems: number = 0;
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['inventoryData'] && this.inventoryData) {
      this.calculateMetrics();
    }
  }
  
  calculateMetrics(): void {
    this.totalItems = this.inventoryData.length;
    
    this.lowStockItems = this.inventoryData.filter(
      item => item.status === 'Low Stock'
    ).length;
    
    this.outOfStockItems = this.inventoryData.filter(
      item => item.status === 'Out of Stock'
    ).length;
    
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    
    this.expiringItems = this.inventoryData.filter(item => {
      const expDate = new Date(item.expiryDate);
      return expDate <= sevenDaysFromNow;
    }).length;
  }
  
  deleteItem(id: number): void {
    this.inventoryData = this.inventoryData.filter(item => item.id !== id);
    this.calculateMetrics();
  }
  
  getStatusClass(status: string): string {
    switch(status) {
      case 'In Stock':
        return 'status-in-stock';
      case 'Low Stock':
        return 'status-low-stock';
      case 'Out of Stock':
        return 'status-out-of-stock';
      default:
        return '';
    }
  }
}
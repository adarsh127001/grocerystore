import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { TaskModalComponent, TaskData } from '../task-modal/task-modal.component';

export interface HighDemandOrder {
  id?: string;
  consumer: string;
  product: string;
  supplier: string;
  dateOfEntry: string;
  quantity: number;
  price: number;
  sellingPrice: number;
  cashier: string;
  status: string;
}

@Component({
  selector: 'app-high-demand-orders',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './high-demand-orders.component.html',
  styleUrls: ['./high-demand-orders.component.css']
})
export class HighDemandOrdersComponent implements OnInit {
  displayedColumns: string[] = ['consumer', 'product', 'supplier', 'dateOfEntry', 'quantity', 'price', 'sellingPrice', 'cashier', 'status', 'action'];
  dataSource: HighDemandOrder[] = [];
  
  // Pagination properties
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 50];
  pageIndex = 0;
  totalItems = 0;
  
  constructor(
    private http: HttpClient,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadHighDemandOrders();
  }

  loadHighDemandOrders(): void {
    this.http.get<any>('assets/data/stats.json').subscribe({
      next: (data) => {
        if (data && data.stockInventoryList) {
          // Filter for high-demand orders (for example, quantity > 100)
          let highDemandOrders = data.stockInventoryList.filter((order: any) => 
            order.quantity > 100
          );
          
          // If not enough high-demand orders, use all orders
          if (highDemandOrders.length < 5) {
            highDemandOrders = data.stockInventoryList;
          }
          
          // Map the data to our interface
          const mappedData: HighDemandOrder[] = highDemandOrders.map((order: any, index: number) => ({
            id: `${index}`,
            consumer: order.customentName || order.consumer,
            product: order.product,
            supplier: order.supplier,
            dateOfEntry: order.dateOfEntry || new Date().toISOString(),
            quantity: order.quantity,
            price: order.price,
            sellingPrice: order.sellingPrice,
            cashier: order.cashier,
            status: order.status
          }));
          
          this.dataSource = mappedData;
          this.totalItems = this.dataSource.length;
          console.log('Loaded data from stats.json:', this.dataSource);
        }
      },
      error: (error) => {
        console.error('Error loading high-demand orders:', error);
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  getCurrentPageData(): HighDemandOrder[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.dataSource.slice(startIndex, startIndex + this.pageSize);
  }

  openCreateTaskModal(): void {
    const dialogRef = this.dialog.open(TaskModalComponent, {
      width: '500px',
      data: { isEdit: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Modal result:', result);
      if (result) {
        if (result.isTaskAssignment) {
          console.log('Adding new task assignment');
          this.addNewTaskAssignment(result);
        } else if (result.isNewStock) {
          console.log('Adding new stock');
          this.addNewStock(result);
        }
      }
    });
  }

  addNewTaskAssignment(taskData: any): void {
    console.log('Task data received:', taskData);
    
    const newOrder: HighDemandOrder = {
      id: `new-${Date.now()}`,
      consumer: taskData.assignee,
      product: taskData.taskType,
      supplier: 'New Task Assignment',
      dateOfEntry: taskData.dueDate ? new Date(taskData.dueDate).toISOString() : new Date().toISOString(),
      quantity: 500, // Default high quantity for high-demand
      price: 100,
      sellingPrice: 120,
      cashier: taskData.assignee,
      status: 'pending'
    };

    console.log('New order created:', newOrder);

    // Add to the beginning of the dataSource
    this.dataSource = [newOrder, ...this.dataSource];
    this.totalItems = this.dataSource.length;
    
    // Reset to first page to show the new entry
    this.pageIndex = 0;
    
    console.log('Data source updated, new length:', this.dataSource.length);
  }

  addNewStock(stockData: any): void {
    console.log('Stock data received:', stockData);
    
    const sellingPriceValue = typeof stockData.sellingPrice === 'string' 
      ? (stockData.sellingPrice === 'Premium' ? stockData.price * 1.5 : 
         stockData.sellingPrice === 'Discount' ? stockData.price * 0.8 : 
         stockData.price * 1.2) // Standard
      : stockData.sellingPrice;
    
    const newOrder: HighDemandOrder = {
      id: `new-${Date.now()}`,
      consumer: 'New Stock Entry',
      product: stockData.productType,
      supplier: stockData.supplier,
      dateOfEntry: new Date().toISOString(),
      quantity: stockData.quantity,
      price: stockData.price,
      sellingPrice: sellingPriceValue,
      cashier: 'System',
      status: 'pending'
    };

    console.log('New stock order created:', newOrder);

    // Add to the beginning of the dataSource
    this.dataSource = [newOrder, ...this.dataSource];
    this.totalItems = this.dataSource.length;
    
    // Reset to first page to show the new entry
    this.pageIndex = 0;
    
    console.log('Data source updated, new length:', this.dataSource.length);
  }

  openEditTaskModal(order: HighDemandOrder): void {
    const dialogRef = this.dialog.open(TaskModalComponent, {
      width: '500px',
      data: {
        isEdit: true,
        id: order.id,
        taskType: order.product,
        assignee: order.cashier,
        priorityLevel: 'Normal',
        dueDate: new Date(order.dateOfEntry),
        location: '',
        productType: order.product,
        supplier: order.supplier,
        quantity: order.quantity,
        price: order.price,
        sellingPrice: order.sellingPrice.toString()
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateOrder(order.id!, result);
      }
    });
  }

  updateOrder(orderId: string, updatedData: any): void {
    const index = this.dataSource.findIndex(order => order.id === orderId);
    
    if (index !== -1) {
      if (updatedData.isTaskAssignment) {
        this.dataSource[index] = {
          ...this.dataSource[index],
          consumer: updatedData.assignee,
          product: updatedData.taskType,
          dateOfEntry: updatedData.dueDate ? updatedData.dueDate.toISOString() : this.dataSource[index].dateOfEntry,
          cashier: updatedData.assignee
        };
      } else if (updatedData.isNewStock) {
        const sellingPrice = typeof updatedData.sellingPrice === 'string' 
          ? (updatedData.sellingPrice === 'Premium' ? updatedData.price * 1.5 : 
             updatedData.sellingPrice === 'Discount' ? updatedData.price * 0.8 : 
             updatedData.price * 1.2) // Standard
          : updatedData.sellingPrice;
          
        this.dataSource[index] = {
          ...this.dataSource[index],
          product: updatedData.productType,
          supplier: updatedData.supplier,
          quantity: updatedData.quantity,
          price: updatedData.price,
          sellingPrice: sellingPrice
        };
      }
      
      // Create a new array reference to trigger change detection
      this.dataSource = [...this.dataSource];
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';

export interface HighDemandOrder {
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
    MatSortModule
  ],
  templateUrl: './high-demand-orders.component.html',
  styleUrls: ['./high-demand-orders.component.css']
})
export class HighDemandOrdersComponent implements OnInit {
  displayedColumns: string[] = ['consumer', 'product', 'supplier', 'dateOfEntry', 'quantity', 'price', 'sellingPrice', 'cashier', 'status'];
  dataSource: HighDemandOrder[] = [];
  
  // Pagination properties
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 50];
  pageIndex = 0;
  totalItems = 0;
  
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadHighDemandOrders();
  }

  loadHighDemandOrders(): void {
    this.http.get<any>('assets/data/db.json').subscribe({
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
          
          // Duplicate the data to have more entries for pagination
          const duplicatedData: HighDemandOrder[] = [];
          for (let i = 0; i < 3; i++) {
            highDemandOrders.forEach((order: any) => {
              duplicatedData.push({
                consumer: order.customentName || order.consumer,
                product: order.product,
                supplier: order.supplier,
                dateOfEntry: order.dateOfEntry,
                quantity: order.quantity,
                price: order.price,
                sellingPrice: order.sellingPrice,
                cashier: order.cashier,
                status: order.status
              });
            });
          }
          
          this.dataSource = duplicatedData;
          this.totalItems = this.dataSource.length;
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
}

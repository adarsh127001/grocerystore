import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { SidebarComponent } from '../shared/components/sidebar/sidebar.component';
import { HeaderComponent } from '../shared/components/header/header.component';
import { ChartComponent } from '../shared/components/chart/chart.component';
import { StockOverviewComponent } from './stock-overview/stock-overview.component';
import { HighDemandOrdersComponent } from './high-demand-orders/high-demand-orders.component';

interface SummaryData {
  title: string;
  units: number;
  status: number;
}

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTabsModule,
    MatIconModule,
    MatButtonToggleModule,
    HeaderComponent,
    ChartComponent,
    StockOverviewComponent,
    HighDemandOrdersComponent
  ],
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
  inventory: any[] = [];
  chartData: any[] = [];
  
  summaryData: SummaryData[] = [
    { title: 'Orders', units: 1854, status: 12.5 },
    { title: 'Profit/Loss', units: 5483, status: -2.7 },
    { title: 'Sales', units: 9382, status: 8.2 },
    { title: 'Customers', units: 3463, status: 5.1 }
  ];
  
  constructor(private http: HttpClient) {}
  
  ngOnInit() {
    this.loadInventoryData();
    this.loadChartData();
  }
  
  loadInventoryData() {
    this.http.get<{inventory: any[]}>('assets/data/inventory.json')
      .subscribe(data => {
        this.inventory = data.inventory;
      });
  }
  
  loadChartData() {
    this.chartData = [
      { date: '2025-02-25', value: 35 },
      { date: '2025-02-26', value: 42 },
      { date: '2025-02-27', value: 38 },
      { date: '2025-02-28', value: 45 },
      { date: '2025-03-01', value: 55 },
      { date: '2025-03-02', value: 60 },
      { date: '2025-03-03', value: 52 },
      { date: '2025-03-04', value: 48 }
    ];
  }
  
  tabChanged(event: any) {
    console.log('Tab changed to:', event.index);
  }
}
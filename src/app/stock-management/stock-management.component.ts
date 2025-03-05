import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { StockChartComponent, StockChartData } from '../shared/components/stock-chart/stock-chart.component';
import { HighDemandOrdersComponent } from '../shared/components/high-demand-orders/high-demand-orders.component';

interface StockSummaryItem {
  title: string;
  units: number;
  status: number;
  icon: string;
  statusColor: string;
  statusText: string;
}

@Component({
  selector: 'app-stock-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatCardModule,
    MatIconModule,
    StockChartComponent,
    HighDemandOrdersComponent
  ],
  templateUrl: './stock-management.component.html',
  styleUrls: ['./stock-management.component.css']
})
export class StockManagementComponent implements OnInit {
  summaryItems: StockSummaryItem[] = [];
  chartData: StockChartData[] = [];
  allChartData: { [key: string]: StockChartData[] } = {
    overview: [],
    highDemand: [],
    returns: [],
    outOfStock: []
  };
  selectedRange: 'weekly' | 'monthly' | 'yearly' = 'monthly';
  activeTabIndex = 0;
  chartTitle: string = 'Total Orders';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadStockData();
  }

  loadStockData() {
    this.http.get<any>('assets/data/stock.json').subscribe({
      next: (data) => {
        this.processSummaryData(data.stockInventorySummary);
        this.processAllChartData(data.stockInventoryOrdersChartData);
        this.chartData = [...this.allChartData['overview']];
      },
      error: (error) => {
        this.http.get<any>('assets/data/db.json').subscribe({
          next: (data) => {
            this.processSummaryData(data.stockInventorySummary);
            this.processAllChartData(data.stockInventoryOrdersChartData);
            this.chartData = [...this.allChartData['overview']];
          },
          error: (fallbackError) => {
          }
        });
      }
    });
  }

  processSummaryData(summaryData: any[]) {
    const iconMap: { [key: string]: string } = {
      'Orders': 'shopping_cart',
      'Profit/Loss': 'trending_up',
      'Sales': 'point_of_sale',
      'Customers': 'group'
    };

    this.summaryItems = summaryData.map(item => {
      const title = item.title === 'Customenrs' ? 'Customers' : item.title;
      const status = item.status;
      let statusText = '';
      
      if (title === 'Profit/Loss') {
        statusText = status >= 0 ? 'Profit' : 'Loss';
      } else {
        statusText = status >= 0 ? 'Increase' : 'Decrease';
      }
      
      return {
        title: title,
        units: item.units,
        status: Math.abs(status),
        icon: iconMap[title] || 'info',
        statusColor: status >= 0 ? '#4caf50' : '#f44336',
        statusText: statusText
      };
    });
  }

  processAllChartData(chartData: any[]) {
    const sortedData = [...chartData].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    this.allChartData['overview'] = sortedData;
    
    this.allChartData['highDemand'] = sortedData.map(item => ({
      ...item,
      numOfAvailableStock: Math.round(item.numOfAvailableStock * 1.5),
      numOfUnvailableStock: Math.round(item.numOfUnvailableStock * 0.7)
    }));
    
    this.allChartData['returns'] = sortedData.map(item => ({
      ...item,
      numOfAvailableStock: Math.round(item.numOfAvailableStock * 0.6),
      numOfUnvailableStock: Math.round(item.numOfUnvailableStock * 1.8)
    }));
    
    this.allChartData['outOfStock'] = sortedData.map(item => ({
      ...item,
      numOfAvailableStock: Math.round(item.numOfAvailableStock * 0.3),
      numOfUnvailableStock: Math.round(item.numOfUnvailableStock * 2.2)
    }));
  }

  onTabChange(index: number) {
    this.activeTabIndex = index;
  }

  onRangeChange(range: 'weekly' | 'monthly' | 'yearly'): void {
    this.selectedRange = range;
  }
}

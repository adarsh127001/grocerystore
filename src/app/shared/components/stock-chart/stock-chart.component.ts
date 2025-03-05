import { Component, Input, OnChanges, SimpleChanges, AfterViewInit, ElementRef, Inject, PLATFORM_ID, Output, EventEmitter } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';

export interface StockChartData {
  date: string;
  numOfAvailableStock: number;
  numOfUnvailableStock: number;
}

@Component({
  selector: 'app-stock-chart',
  standalone: true,
  imports: [
    CommonModule, 
    MatButtonToggleModule, 
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatMenuModule
  ],
  templateUrl: './stock-chart.component.html',
  styleUrls: ['./stock-chart.component.css']
})
export class StockChartComponent implements OnChanges, AfterViewInit {
  @Input() title: string = 'Total Orders';
  @Input() data: StockChartData[] = [];
  @Input() selectedRange: 'weekly' | 'monthly' | 'yearly' = 'monthly';
  @Input() legendLabels: string[] = ['Available', 'Out Of Stock'];
  @Output() rangeChange = new EventEmitter<'weekly' | 'monthly' | 'yearly'>();

  processedData: any[] = [];
  barWidth: number = 16;
  yAxisTicks: { y: number; value: number }[] = [];
  chartWidth: number = 600;
  chartHeight: number = 240;
  chartTop: number = 30;
  private isBrowser: boolean;
  
  showSortDropdown = false;
  
  constructor(
    private elementRef: ElementRef,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  
  ngAfterViewInit() {
    if (this.isBrowser) {
      this.updateChartWidth();
      window.addEventListener('resize', () => {
        this.updateChartWidth();
        this.processData();
      });
    }
  }
  
  updateChartWidth() {
    if (this.isBrowser) {
      const containerWidth = this.elementRef.nativeElement.querySelector('.chart-container')?.clientWidth;
      if (containerWidth) {
        this.chartWidth = containerWidth;
        this.processData();
      }
    }
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.data = [...this.data];
      if (this.isBrowser) {
        setTimeout(() => this.processData(), 0);
      } else {
        this.processData();
      }
    } else if (changes['selectedRange'] && this.data) {
      if (this.isBrowser) {
        setTimeout(() => this.processData(), 0);
      } else {
        this.processData();
      }
    }
  }

  toggleSortDropdown(): void {
    this.showSortDropdown = !this.showSortDropdown;
  }

  selectRange(range: 'weekly' | 'monthly' | 'yearly'): void {
    this.selectedRange = range;
    this.rangeChange.emit(range);
    this.showSortDropdown = false;
    this.processData();
  }

  updateChartRange(range: 'weekly' | 'monthly' | 'yearly'): void {
    this.selectedRange = range;
    this.processData();
  }

  processData(): void {
    if (!this.data || this.data.length === 0) {
      this.processedData = [];
      return;
    }

    const sortedData = [...this.data].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    const groupedData = this.groupDataByRange(sortedData, this.selectedRange);
    
    const maxAvailable = Math.max(...groupedData.map(item => item.availableStock), 1);
    const maxUnavailable = Math.max(...groupedData.map(item => item.unavailableStock), 1);
    const minAvailable = Math.min(...groupedData.map(item => item.availableStock), 0);
    const minUnavailable = Math.min(...groupedData.map(item => item.unavailableStock), 0);
    
    const maxValue = Math.max(maxAvailable, maxUnavailable);
    const minValue = Math.min(minAvailable, minUnavailable, 0);
    
    const valueRange = maxValue - minValue;
    const magnitude = Math.pow(10, Math.floor(Math.log10(valueRange)));
    const normalizedRange = valueRange / magnitude;
    const niceMax = Math.ceil(normalizedRange) * magnitude;
    const effectiveMax = Math.max(maxValue, niceMax);
    
    this.yAxisTicks = [];
    for (let i = 0; i <= 5; i++) {
      const value = Math.round(minValue + (effectiveMax - minValue) * (i / 5));
      const y = this.chartTop + this.chartHeight - (i / 5) * this.chartHeight;
      this.yAxisTicks.push({ y, value });
    }
    
    const xPadding = 40;
    const chartContentWidth = this.chartWidth - xPadding - 20;
    const xStep = chartContentWidth / (Math.max(groupedData.length - 1, 1));
    
    this.processedData = groupedData.map((item, index) => {
      const x = xPadding + index * xStep;
      
      const availableY = this.chartTop + this.chartHeight - 
                     ((item.availableStock - minValue) / (effectiveMax - minValue)) * this.chartHeight;
      const unavailableY = this.chartTop + this.chartHeight - 
                       ((item.unavailableStock - minValue) / (effectiveMax - minValue)) * this.chartHeight;
      const highY = this.chartTop + this.chartHeight - 
                   ((Math.max(item.availableStock, item.unavailableStock) - minValue) / (effectiveMax - minValue)) * this.chartHeight;
      const lowY = this.chartTop + this.chartHeight - 
                  ((Math.min(item.availableStock * 0.85, item.unavailableStock * 0.85) - minValue) / (effectiveMax - minValue)) * this.chartHeight;
      
      const barHeight = this.chartHeight - (availableY - this.chartTop);
      
      return {
        label: item.label,
        availableStock: item.availableStock,
        unavailableStock: item.unavailableStock,
        x,
        availableY,
        unavailableY,
        highY,
        lowY,
        barHeight
      };
    });
  }

  groupDataByRange(data: StockChartData[], range: 'weekly' | 'monthly' | 'yearly'): any[] {
    const result: any[] = [];
    const groupMap = new Map();

    data.forEach(item => {
      const date = new Date(item.date);
      let groupKey: string;
      let label: string;

      switch (range) {
        case 'weekly':
          const weekNumber = this.getWeekNumber(date);
          groupKey = `${date.getFullYear()}-W${weekNumber}`;
          label = `W${weekNumber}`;
          break;
        case 'monthly':
          groupKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
          label = date.toLocaleString('default', { month: 'short' });
          break;
        case 'yearly':
          groupKey = `${date.getFullYear()}`;
          label = date.getFullYear().toString();
          break;
      }

      if (!groupMap.has(groupKey)) {
        groupMap.set(groupKey, {
          label,
          availableStock: 0,
          unavailableStock: 0,
          minStock: Infinity,
          maxStock: -Infinity,
          count: 0
        });
      }

      const group = groupMap.get(groupKey);
      group.availableStock += item.numOfAvailableStock || 0;
      group.unavailableStock += item.numOfUnvailableStock || 0;
      group.minStock = Math.min(group.minStock, item.numOfAvailableStock || 0);
      group.maxStock = Math.max(group.maxStock, item.numOfAvailableStock || 0);
      group.count += 1;
    });

    groupMap.forEach((value, key) => {
      result.push({
        key,
        label: value.label,
        availableStock: Math.round(value.availableStock),
        unavailableStock: Math.round(value.unavailableStock),
        minStock: value.minStock === Infinity ? 0 : value.minStock,
        maxStock: value.maxStock === -Infinity ? 0 : value.maxStock
      });
    });

    return result.sort((a, b) => a.key.localeCompare(b.key));
  }

  getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }
}

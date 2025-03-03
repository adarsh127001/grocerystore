import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';

interface ChartData {
  date: string;
  numOfActiveOrders: number;
  numOfInactiveOrders: number;
}

@Component({
  selector: 'app-ssr-chart',
  standalone: true,
  imports: [CommonModule, MatButtonToggleModule, MatCardModule],
  template: `
    <mat-card class="chart-card">
      <mat-card-header>
        <mat-card-title>{{title}}</mat-card-title>
        <div class="chart-actions">
          <mat-button-toggle-group #timeRange="matButtonToggleGroup" [value]="selectedRange" (change)="updateChartRange($event.value)">
            <mat-button-toggle value="weekly">Weekly</mat-button-toggle>
            <mat-button-toggle value="monthly">Monthly</mat-button-toggle>
            <mat-button-toggle value="yearly">Yearly</mat-button-toggle>
          </mat-button-toggle-group>
        </div>
      </mat-card-header>
      <mat-card-content>
        <div class="chart-container">
          <svg width="100%" height="300">
            <g *ngFor="let item of processedData; let i = index">
              <rect 
                [attr.x]="i * barWidth + '%'" 
                [attr.y]="(100 - item.activeHeight) + '%'" 
                [attr.width]="barWidth * 0.8 + '%'" 
                [attr.height]="item.activeHeight + '%'" 
                fill="#1976d2">
              </rect>
              
              <circle 
                [attr.cx]="(i * barWidth + barWidth/2) + '%'" 
                [attr.cy]="(100 - item.inactiveHeight) + '%'" 
                r="4" 
                fill="#9c27b0">
              </circle>
              
              <line 
                *ngIf="i < processedData.length - 1"
                [attr.x1]="(i * barWidth + barWidth/2) + '%'" 
                [attr.y1]="(100 - item.inactiveHeight) + '%'" 
                [attr.x2]="((i+1) * barWidth + barWidth/2) + '%'" 
                [attr.y2]="(100 - processedData[i+1].inactiveHeight) + '%'" 
                stroke="#9c27b0" 
                stroke-width="2">
              </line>
              
              <text 
                [attr.x]="(i * barWidth + barWidth/2) + '%'" 
                [attr.y]="98 + '%'" 
                text-anchor="middle" 
                font-size="12" 
                fill="#666">
                {{item.label}}
              </text>
            </g>
            
            <g>
              <rect x="70%" y="5%" width="10" height="10" fill="#1976d2"></rect>
              <text x="72%" y="6%" dy="0.5em" font-size="12" fill="#333">Active Orders</text>
              <circle cx="70%" cy="8%" r="4" fill="#9c27b0"></circle>
              <text x="72%" y="8%" dy="0.5em" font-size="12" fill="#333">Inactive Orders</text>
            </g>
          </svg>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .chart-card {
      margin-bottom: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    mat-card-header {
      display: flex;
      justify-content: space-between;
      padding: 16px;
    }
    
    .chart-actions {
      margin-left: auto;
    }
    
    mat-card-content {
      padding: 0 16px 16px;
    }
    
    .chart-container {
      width: 100%;
      height: 300px;
      background-color: #fafafa;
      border: 1px solid #eee;
      border-radius: 4px;
    }
  `]
})
export class SsrChartComponent implements OnChanges {
  @Input() title: string = 'Orders Analysis';
  @Input() data: ChartData[] = [];
  @Input() selectedRange: 'weekly' | 'monthly' | 'yearly' = 'monthly';

  processedData: any[] = [];
  barWidth: number = 8;
  
  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['data'] || changes['selectedRange']) && this.data) {
      this.processData();
    }
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
    
    const maxActive = Math.max(...groupedData.map(item => item.activeOrders), 1);
    const maxInactive = Math.max(...groupedData.map(item => item.inactiveOrders), 1);
    const maxValue = Math.max(maxActive, maxInactive);
    
    this.barWidth = 100 / Math.max(groupedData.length, 1);
    
    this.processedData = groupedData.map(item => ({
      label: item.label,
      activeOrders: item.activeOrders,
      inactiveOrders: item.inactiveOrders,
      activeHeight: (item.activeOrders / maxValue) * 80,
      inactiveHeight: (item.inactiveOrders / maxValue) * 80
    }));
  }

  groupDataByRange(data: ChartData[], range: 'weekly' | 'monthly' | 'yearly'): any[] {
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
          activeOrders: 0,
          inactiveOrders: 0,
          count: 0
        });
      }

      const group = groupMap.get(groupKey);
      group.activeOrders += item.numOfActiveOrders || 0;
      group.inactiveOrders += item.numOfInactiveOrders || 0;
      group.count += 1;
    });

    groupMap.forEach((value, key) => {
      result.push({
        key,
        label: value.label,
        activeOrders: Math.round(value.activeOrders),
        inactiveOrders: Math.round(value.inactiveOrders)
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
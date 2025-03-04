import { Component, Input, OnChanges, SimpleChanges, AfterViewInit, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

interface ChartData {
  date: string;
  numOfActiveOrders: number;
  numOfInactiveOrders: number;
}

@Component({
  selector: 'app-ssr-chart',
  standalone: true,
  imports: [
    CommonModule, 
    MatButtonToggleModule, 
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule
  ],
  template: `
    <mat-card class="chart-card">
      <mat-card-header>
        <mat-card-title>{{title}}</mat-card-title>
        <div class="chart-actions">
          <mat-form-field appearance="outline" class="sort-select">
            <mat-label>Sort by</mat-label>
            <mat-select [value]="selectedRange" (selectionChange)="updateChartRange($event.value)">
              <mat-option value="weekly">Weekly</mat-option>
              <mat-option value="monthly">Monthly</mat-option>
              <mat-option value="yearly">Yearly</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
      </mat-card-header>
      <mat-card-content>
        <div class="chart-container" #chartContainer>
          <svg width="100%" height="300">
            <!-- Y-axis and grid lines -->
            <g class="y-axis">
              <line x1="40" y1="30" x2="40" y2="270" stroke="#ccc" stroke-width="1" />
              
              <ng-container *ngFor="let tick of yAxisTicks">
                <line 
                  [attr.x1]="38" 
                  [attr.y1]="tick.y" 
                  [attr.x2]="chartWidth - 20" 
                  [attr.y2]="tick.y" 
                  stroke="#eee" 
                  stroke-width="1" 
                  stroke-dasharray="3,3" />
                <text 
                  x="35" 
                  [attr.y]="tick.y + 4" 
                  text-anchor="end" 
                  font-size="10" 
                  fill="#666">
                  {{tick.value}}
                </text>
              </ng-container>
            </g>
            
            <!-- X-axis -->
            <line [attr.x1]="40" y1="270" [attr.x2]="chartWidth - 20" y2="270" stroke="#ccc" stroke-width="1" />
            
            <!-- Line graph -->
            <g *ngFor="let item of processedData; let i = index">
              <circle 
                [attr.cx]="item.x" 
                [attr.cy]="item.inactiveY" 
                r="4" 
                fill="#9c27b0">
              </circle>
              
              <line 
                *ngIf="i < processedData.length - 1"
                [attr.x1]="item.x" 
                [attr.y1]="item.inactiveY" 
                [attr.x2]="processedData[i+1].x" 
                [attr.y2]="processedData[i+1].inactiveY" 
                stroke="#9c27b0" 
                stroke-width="2">
              </line>
            </g>

            <!-- Chart area with candlestick representation -->
            <g *ngFor="let item of processedData; let i = index">
              <!-- Candlestick representation -->
              <line 
                [attr.x1]="item.x" 
                [attr.y1]="item.highY" 
                [attr.x2]="item.x" 
                [attr.y2]="item.lowY" 
                stroke="#1976d2" 
                stroke-width="2">
              </line>
              
              <rect 
                [attr.x]="item.x - barWidth/2" 
                [attr.y]="item.activeY" 
                [attr.width]="barWidth" 
                [attr.height]="item.barHeight" 
                fill="#1976d2"
                fill-opacity="0.7">
              </rect>
            </g>
            
            <!-- X-axis labels -->
            <g *ngFor="let item of processedData">
              <text 
                [attr.x]="item.x" 
                y="280" 
                text-anchor="middle" 
                font-size="10" 
                fill="#666">
                {{item.label}}
              </text>
            </g>
            
            <!-- Legend -->
            <g>
              <rect [attr.x]="chartWidth - 120" y="30" width="12" height="12" fill="#1976d2" fill-opacity="0.7"></rect>
              <text [attr.x]="chartWidth - 105" y="40" font-size="10" fill="#333">Active Orders</text>
              
              <circle [attr.cx]="chartWidth - 114" cy="60" r="4" fill="#9c27b0"></circle>
              <line [attr.x1]="chartWidth - 120" y1="60" [attr.x2]="chartWidth - 108" y2="60" stroke="#9c27b0" stroke-width="2"></line>
              <text [attr.x]="chartWidth - 105" y="63" font-size="10" fill="#333">Inactive Orders</text>
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
      align-items: center;
      padding: 16px;
    }
    
    .chart-actions {
      margin-left: auto;
    }
    
    .sort-select {
      width: 120px;
      margin-bottom: -1.25em;
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
      overflow: hidden;
    }
    
    ::ng-deep .mat-mdc-form-field-subscript-wrapper {
      display: none;
    }
  `]
})
export class SsrChartComponent implements OnChanges, AfterViewInit {
  @Input() title: string = 'Orders Analysis';
  @Input() data: ChartData[] = [];
  @Input() selectedRange: 'weekly' | 'monthly' | 'yearly' = 'monthly';

  processedData: any[] = [];
  barWidth: number = 16;
  yAxisTicks: { y: number; value: number }[] = [];
  chartWidth: number = 600;
  chartHeight: number = 240; // Height of the chart area (300 - margins)
  chartTop: number = 30;    // Top margin
  private isBrowser: boolean;
  
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
    if ((changes['data'] || changes['selectedRange']) && this.data) {
      if (this.isBrowser) {
        setTimeout(() => this.processData(), 0);
      } else {
        this.processData();
      }
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
    
    // Calculate max and min values for scaling
    const maxActive = Math.max(...groupedData.map(item => item.activeOrders), 1);
    const maxInactive = Math.max(...groupedData.map(item => item.inactiveOrders), 1);
    const minActive = Math.min(...groupedData.map(item => item.activeOrders), 0);
    const minInactive = Math.min(...groupedData.map(item => item.inactiveOrders), 0);
    
    const maxValue = Math.max(maxActive, maxInactive);
    const minValue = Math.min(minActive, minInactive, 0);
    
    // Round max value up to a nice number for y-axis
    const valueRange = maxValue - minValue;
    const magnitude = Math.pow(10, Math.floor(Math.log10(valueRange)));
    const normalizedRange = valueRange / magnitude;
    const niceMax = Math.ceil(normalizedRange) * magnitude;
    const effectiveMax = Math.max(maxValue, niceMax);
    
    // Create Y-axis ticks (5 ticks)
    this.yAxisTicks = [];
    for (let i = 0; i <= 5; i++) {
      const value = Math.round(minValue + (effectiveMax - minValue) * (i / 5));
      const y = this.chartTop + this.chartHeight - (i / 5) * this.chartHeight;
      this.yAxisTicks.push({ y, value });
    }
    
    // X-axis positioning
    const xPadding = 40; // Left padding for Y-axis
    const chartContentWidth = this.chartWidth - xPadding - 20; // 20px right padding
    const xStep = chartContentWidth / (Math.max(groupedData.length - 1, 1));
    
    this.processedData = groupedData.map((item, index) => {
      const x = xPadding + index * xStep;
      
      // Map data values to y-coordinates (invert the scale because SVG y increases downward)
      const activeY = this.chartTop + this.chartHeight - 
                     ((item.activeOrders - minValue) / (effectiveMax - minValue)) * this.chartHeight;
      const inactiveY = this.chartTop + this.chartHeight - 
                       ((item.inactiveOrders - minValue) / (effectiveMax - minValue)) * this.chartHeight;
      const highY = this.chartTop + this.chartHeight - 
                   ((Math.max(item.activeOrders, item.inactiveOrders) - minValue) / (effectiveMax - minValue)) * this.chartHeight;
      const lowY = this.chartTop + this.chartHeight - 
                  ((Math.min(item.activeOrders * 0.85, item.inactiveOrders * 0.85) - minValue) / (effectiveMax - minValue)) * this.chartHeight;
      
      // Calculate bar height (in pixels, not percentage)
      const barHeight = this.chartHeight - (activeY - this.chartTop);
      
      return {
        label: item.label,
        activeOrders: item.activeOrders,
        inactiveOrders: item.inactiveOrders,
        x,
        activeY,
        inactiveY,
        highY,
        lowY,
        barHeight
      };
    });
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
          minOrders: Infinity,
          maxOrders: -Infinity,
          count: 0
        });
      }

      const group = groupMap.get(groupKey);
      group.activeOrders += item.numOfActiveOrders || 0;
      group.inactiveOrders += item.numOfInactiveOrders || 0;
      group.minOrders = Math.min(group.minOrders, item.numOfActiveOrders || 0);
      group.maxOrders = Math.max(group.maxOrders, item.numOfActiveOrders || 0);
      group.count += 1;
    });

    groupMap.forEach((value, key) => {
      result.push({
        key,
        label: value.label,
        activeOrders: Math.round(value.activeOrders),
        inactiveOrders: Math.round(value.inactiveOrders),
        minOrders: value.minOrders === Infinity ? 0 : value.minOrders,
        maxOrders: value.maxOrders === -Infinity ? 0 : value.maxOrders
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
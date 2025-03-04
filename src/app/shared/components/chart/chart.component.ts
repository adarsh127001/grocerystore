import { Component, Input, OnChanges, SimpleChanges, AfterViewInit, ElementRef, Inject, PLATFORM_ID, Output, EventEmitter } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ChartDataItem {
  label: string;
  value: number;
  color: string;
}

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="chart-container">
      <div class="chart-header" *ngIf="showControls">
        <div class="chart-tabs" *ngIf="showTabs">
          <div class="tab-container">
            <div class="tab" [class.active]="currentTab === 'online'" (click)="onTabClick('online')">Online</div>
            <div class="tab" [class.active]="currentTab === 'offline'" (click)="onTabClick('offline')">Offline</div>
          </div>
        </div>
        
        <div class="chart-actions">
          <div class="sort-by-container" *ngIf="showSortBy">
            <span class="sort-label">Sort By</span>
            <div class="sort-select-wrapper">
              <div class="sort-value" (click)="toggleSortDropdown()">
                {{selectedRange | titlecase}}
                <mat-icon>arrow_drop_down</mat-icon>
              </div>
              <div class="sort-dropdown" *ngIf="showSortDropdown">
                <div class="sort-option" (click)="selectRange('weekly')">Weekly</div>
                <div class="sort-option" (click)="selectRange('monthly')">Monthly</div>
                <div class="sort-option" (click)="selectRange('yearly')">Yearly</div>
              </div>
            </div>
          </div>
          
          <button mat-stroked-button *ngIf="showFilter" class="filter-button">
            <mat-icon>filter_list</mat-icon>
            Filter
          </button>
        </div>
      </div>
      
      <div class="chart-content">
        <div class="donut-chart" *ngIf="chartType === 'donut'">
          <div class="donut-wrapper">
            <svg width="200" height="200" viewBox="0 0 200 200">
              <g transform="translate(100, 100)">
                <!-- Donut segments -->
                <g *ngFor="let segment of donutSegments">
                  <path 
                    [attr.d]="segment.path" 
                    [attr.fill]="segment.color"
                    stroke="#fff"
                    stroke-width="1">
                  </path>
                </g>
                
                <!-- Center circle for donut hole -->
                <circle cx="0" cy="0" r="60" fill="white"></circle>
                
                <!-- Total value in center -->
                <text x="0" y="0" text-anchor="middle" dominant-baseline="middle" font-size="24" font-weight="bold">
                  {{totalValue}}
                </text>
                <text x="0" y="20" text-anchor="middle" dominant-baseline="middle" font-size="12">
                  Total
                </text>
              </g>
            </svg>
          </div>
          
          <!-- Legend -->
          <div class="chart-legend">
            <div class="legend-item" *ngFor="let item of chartData">
              <div class="legend-color" [style.background-color]="item.color"></div>
              <div class="legend-label">{{item.label}}</div>
            </div>
          </div>
        </div>
        
        <div class="bar-chart" *ngIf="chartType === 'bar'">
          <svg width="100%" height="200">
            <!-- Y-axis -->
            <line x1="40" y1="20" x2="40" y2="170" stroke="#ccc" stroke-width="1"></line>
            
            <!-- Y-axis ticks -->
            <g *ngFor="let tick of yAxisTicks">
              <line
                [attr.x1]="38"
                [attr.y1]="tick.y"
                [attr.x2]="chartWidth - 20"
                [attr.y2]="tick.y"
                stroke="#eee"
                stroke-width="1"
                stroke-dasharray="3,3">
              </line>
              <text
                x="35"
                [attr.y]="tick.y + 4"
                text-anchor="end"
                font-size="10"
                fill="#666">
                {{tick.value}}
              </text>
            </g>
            
            <!-- X-axis -->
            <line [attr.x1]="40" y1="170" [attr.x2]="chartWidth - 20" y2="170" stroke="#ccc" stroke-width="1"></line>
            
            <!-- Bars -->
            <g *ngFor="let bar of chartBars; let i = index">
              <rect 
                [attr.x]="bar.x - bar.width/2" 
                [attr.y]="bar.y"
                [attr.width]="bar.width"
                [attr.height]="bar.height"
                [attr.fill]="bar.color || '#1976d2'">
              </rect>
              
              <text 
                [attr.x]="bar.x" 
                [attr.y]="bar.y - 5"
                text-anchor="middle"
                font-size="10"
                fill="#333">
                {{bar.value}}
              </text>
              
              <text 
                [attr.x]="bar.x" 
                y="185"
                text-anchor="middle"
                font-size="10"
                fill="#666">
                {{formatLabel(bar.label)}}
              </text>
            </g>
          </svg>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chart-container {
      width: 100%;
      background-color: #fff;
      border-radius: 4px;
      min-height: 300px;
    }
    
    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }
    
    .chart-tabs {
      flex: 1;
    }
    
    .tab-container {
      display: flex;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .tab {
      padding: 8px 16px;
      cursor: pointer;
      position: relative;
      color: #666;
    }
    
    .tab.active {
      color: #1976d2;
    }
    
    .tab.active::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: #1976d2;
    }
    
    .chart-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .sort-by-container {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .sort-label {
      color: #666;
      font-size: 14px;
    }
    
    .sort-select-wrapper {
      position: relative;
    }
    
    .sort-value {
      display: flex;
      align-items: center;
      padding: 4px 8px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      cursor: pointer;
      min-width: 100px;
      font-weight: 500;
    }
    
    .sort-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
      background-color: white;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      z-index: 10;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    
    .sort-option {
      padding: 8px;
      cursor: pointer;
    }
    
    .sort-option:hover {
      background-color: #f5f5f5;
    }
    
    .filter-button {
      height: 36px;
    }
    
    .chart-content {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .donut-chart {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
    }
    
    .donut-wrapper {
      display: flex;
      justify-content: center;
      margin: 20px 0;
    }
    
    .chart-legend {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      margin-top: 15px;
      gap: 15px;
    }
    
    .legend-item {
      display: flex;
      align-items: center;
      gap: 5px;
    }
    
    .legend-color {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }
    
    .legend-label {
      font-size: 12px;
      color: #333;
    }
    
    .bar-chart {
      width: 100%;
      height: 200px;
      margin-top: 20px;
    }
    
    ::ng-deep .mat-mdc-tab-header {
      --mdc-tab-indicator-active-indicator-color: #1976d2;
      --mat-tab-header-active-label-text-color: #1976d2;
      --mat-tab-header-active-ripple-color: rgba(25, 118, 210, 0.1);
      --mat-tab-header-inactive-ripple-color: rgba(0, 0, 0, 0.04);
      --mat-tab-header-active-focus-label-text-color: #1976d2;
      --mat-tab-header-active-hover-label-text-color: #1976d2;
      --mat-tab-header-active-focus-indicator-color: #1976d2;
      --mat-tab-header-active-hover-indicator-color: #1976d2;
    }
    
    ::ng-deep .mat-mdc-form-field-subscript-wrapper {
      display: none;
    }
  `]
})
export class ChartComponent implements OnChanges, AfterViewInit {
  @Input() chartData: ChartDataItem[] = [];
  @Input() chartType: 'bar' | 'donut' = 'bar';
  @Input() selectedRange: 'weekly' | 'monthly' | 'yearly' = 'monthly';
  @Input() showControls: boolean = true;
  @Input() showSortBy: boolean = true;
  @Input() showFilter: boolean = false;
  @Input() showTabs: boolean = false;
  @Input() currentTab: 'online' | 'offline' = 'online';
  
  @Output() rangeChange = new EventEmitter<'weekly' | 'monthly' | 'yearly'>();
  @Output() tabChange = new EventEmitter<'online' | 'offline'>();
  
  chartBars: any[] = [];
  chartWidth: number = 800;
  yAxisTicks: { y: number; value: number }[] = [];
  donutSegments: any[] = [];
  totalValue: number = 0;
  private isBrowser: boolean;
  
  // Add new property for dropdown state
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
        this.processChartData();
      });
    }
  }
  
  updateChartWidth() {
    if (this.isBrowser) {
      const containerWidth = this.elementRef.nativeElement.querySelector('.chart-container')?.clientWidth;
      if (containerWidth) {
        this.chartWidth = containerWidth;
        this.processChartData();
      }
    }
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['chartData'] || changes['chartType'] || changes['selectedRange'] || changes['currentTab']) && this.chartData) {
      this.processChartData();
    }
  }
  
  onRangeChange(range: 'weekly' | 'monthly' | 'yearly'): void {
    this.selectedRange = range;
    this.rangeChange.emit(range);
  }
  
  onTabChange(event: any): void {
    this.currentTab = event.index === 0 ? 'online' : 'offline';
    this.tabChange.emit(this.currentTab);
  }
  
  processChartData(): void {
    if (!this.chartData || this.chartData.length === 0) {
      this.chartBars = [];
      this.donutSegments = [];
      this.totalValue = 0;
      return;
    }
    
    if (this.chartType === 'bar') {
      this.processBarChartData();
    } else if (this.chartType === 'donut') {
      this.processDonutChartData();
    }
  }
  
  processBarChartData(): void {
    const values = this.chartData.map(item => item.value);
    const maxValue = Math.max(...values);
    const minValue = Math.min(0, ...values);
    
    // Round max value up to a nice number for y-axis
    const valueRange = maxValue - minValue;
    const magnitude = Math.pow(10, Math.floor(Math.log10(valueRange)));
    const normalizedRange = valueRange / magnitude;
    const niceMax = Math.ceil(normalizedRange) * magnitude;
    const effectiveMax = Math.max(maxValue, niceMax);
    
    // Create Y-axis ticks (5 ticks)
    this.yAxisTicks = [];
    const chartHeight = 150; // 170 - 20
    for (let i = 0; i <= 4; i++) {
      const value = Math.round(minValue + (effectiveMax - minValue) * (i / 4));
      const y = 170 - (i / 4) * chartHeight;
      this.yAxisTicks.push({ y, value });
    }
    
    // X-axis positioning
    const xPadding = 40; 
    const chartContentWidth = this.chartWidth - xPadding - 20; // 20px right padding
    const barSpacing = chartContentWidth / (Math.max(this.chartData.length, 1));
    const barWidth = Math.min(barSpacing * 0.6, 40); // Limit bar width
    
    this.chartBars = this.chartData.map((item, index) => {
      const x = xPadding + (index + 0.5) * barSpacing;
      const normalizedValue = (item.value - minValue) / (effectiveMax - minValue);
      const height = normalizedValue * chartHeight;
      const y = 170 - height;
      
      return {
        label: item.label,
        value: item.value,
        color: item.color,
        x,
        y,
        width: barWidth,
        height
      };
    });
  }
  
  processDonutChartData(): void {
    // Ensure we have data
    if (!this.chartData || this.chartData.length === 0) {
      this.donutSegments = [];
      this.totalValue = 0;
      return;
    }
    
    // Calculate total value
    this.totalValue = this.chartData.reduce((sum, item) => sum + item.value, 0);
    
    // If total is 0, set a default value to avoid empty chart
    if (this.totalValue === 0) {
      this.totalValue = 72; // Use the value from the image
    }
    
    let startAngle = -Math.PI / 2; // Start from the top
    this.donutSegments = this.chartData.map(item => {
      // If total is 0, use equal segments
      const percentage = this.totalValue === 0 ? 1 / this.chartData.length : item.value / this.totalValue;
      const angle = percentage * 2 * Math.PI;
      const endAngle = startAngle + angle;
      
      // Calculate SVG path for arc
      const x1 = 80 * Math.cos(startAngle);
      const y1 = 80 * Math.sin(startAngle);
      const x2 = 80 * Math.cos(endAngle);
      const y2 = 80 * Math.sin(endAngle);
      
      const largeArcFlag = angle > Math.PI ? 1 : 0;
      
      const path = `M ${x1} ${y1} A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2} L 0 0 Z`;
      
      const segment = {
        value: item.value,
        percentage: Math.round(percentage * 100),
        color: item.color,
        path,
        startAngle,
        endAngle
      };
      
      startAngle = endAngle;
      return segment;
    });
  }
  
  formatLabel(label: string): string {
    return label;
  }
  
  onTabClick(tab: 'online' | 'offline'): void {
    this.currentTab = tab;
    this.tabChange.emit(tab);
  }
  
  toggleSortDropdown(): void {
    this.showSortDropdown = !this.showSortDropdown;
  }
  
  selectRange(range: 'weekly' | 'monthly' | 'yearly'): void {
    this.selectedRange = range;
    this.rangeChange.emit(range);
    this.showSortDropdown = false;
  }
}
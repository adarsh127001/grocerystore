import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container">
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
            fill="#1976d2">
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
            {{formatLabel(bar.date)}}
          </text>
        </g>
      </svg>
    </div>
  `,
  styles: [`
    .chart-container {
      width: 100%;
      height: 200px;
      margin-top: 20px;
      background-color: #fafafa;
      border: 1px solid #eee;
      border-radius: 4px;
    }
  `]
})
export class ChartComponent implements OnChanges {
  @Input() chartData: {date: string, value: number}[] = [];
  @Input() chartType: string = 'daily';
  
  chartBars: any[] = [];
  chartWidth: number = 800;
  yAxisTicks: { y: number; value: number }[] = [];
  
  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['chartData'] || changes['chartType']) && this.chartData) {
      this.processChartData();
    }
  }
  
  processChartData(): void {
    if (!this.chartData || this.chartData.length === 0) {
      this.chartBars = [];
      return;
    }
    
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
    const xPadding = 40; // Left padding for Y-axis
    const chartContentWidth = this.chartWidth - xPadding - 20; // 20px right padding
    const barSpacing = chartContentWidth / (Math.max(this.chartData.length, 1));
    const barWidth = Math.min(barSpacing * 0.6, 40); // Limit bar width
    
    this.chartBars = this.chartData.map((item, index) => {
      const x = xPadding + (index + 0.5) * barSpacing;
      const normalizedValue = (item.value - minValue) / (effectiveMax - minValue);
      const height = normalizedValue * chartHeight;
      const y = 170 - height;
      
      return {
        date: item.date,
        value: item.value,
        x,
        y,
        width: barWidth,
        height
      };
    });
  }
  
  formatLabel(dateStr: string): string {
    const date = new Date(dateStr);
    
    switch (this.chartType) {
      case 'daily':
        return date.getDate().toString();
      case 'weekly':
        return `W${this.getWeekNumber(date)}`;
      case 'monthly':
        return date.toLocaleString('default', { month: 'short' });
      case 'yearly':
        return date.getFullYear().toString();
      default:
        return date.getDate().toString();
    }
  }
  
  getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }
}
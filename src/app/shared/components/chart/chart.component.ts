import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="chart-container">
    <svg width="100%" height="200">
      <g *ngFor="let bar of chartBars; let i = index">
        <rect [attr.x]="i * barWidth + '%'" y="0" 
              [attr.height]="bar.height + '%'" 
              [attr.width]="barWidth - 1 + '%'" 
              [attr.fill]="'#1976d2'">
        </rect>
        <text [attr.x]="i * barWidth + barWidth/2 + '%'" 
              [attr.y]="100 - bar.height + '%'" 
              text-anchor="middle" 
              [attr.fill]="'#333'" 
              font-size="12">
          {{bar.value}}
        </text>
        <text [attr.x]="i * barWidth + barWidth/2 + '%'" 
              y="95%" 
              text-anchor="middle" 
              [attr.fill]="'#666'" 
              font-size="10">
          {{formatLabel(bar.date)}}
        </text>
      </g>
    </svg>
  </div>`,
  styles: [`
    .chart-container {
      width: 100%;
      height: 200px;
      margin-top: 20px;
    }
  `]
})
export class ChartComponent implements OnChanges {
  @Input() chartData: {date: string, value: number}[] = [];
  @Input() chartType: string = 'daily';
  
  chartBars: {date: string, value: number, height: number}[] = [];
  barWidth: number = 10;
  
  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['chartData'] || changes['chartType']) && this.chartData) {
      this.processChartData();
    }
  }
  
  processChartData(): void {
    const maxValue = Math.max(...this.chartData.map(item => item.value));
    
    this.chartBars = this.chartData.map(item => ({
      date: item.date,
      value: item.value,
      height: (item.value / maxValue) * 80
    }));
    
    this.barWidth = 100 / this.chartData.length;
  }
  
  formatLabel(dateStr: string): string {
    const date = new Date(dateStr);
    
    switch (this.chartType) {
      case 'daily':
        return date.getDate().toString();
      case 'weekly':
        return `W${Math.ceil(date.getDate() / 7)}`;
      case 'monthly':
        return date.toLocaleString('default', { month: 'short' });
      case 'yearly':
        return date.getFullYear().toString();
      default:
        return date.getDate().toString();
    }
  }
}
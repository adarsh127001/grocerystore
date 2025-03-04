import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-shipment-stats',
  templateUrl: './shipment-stats.component.html',
  styleUrls: ['./shipment-stats.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDividerModule,
    MatProgressBarModule,
    HttpClientModule
  ]
})
export class ShipmentStatsComponent implements OnInit {
  shipments: any[] = [];
  chart: any;
  selectedDateRange: string = 'week';
  
  // Pre-calculated values
  totalShipments: number = 0;
  averagePerDay: string = '0';
  onTimePercentage: number = 0;
  recentShipments: any[] = [];

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      Chart.register(...registerables);
    }
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.http.get<any[]>('assets/data/shipments.json').subscribe({
      next: (data) => {
        this.shipments = data;
        console.log('Shipment data loaded successfully');
        
        // Calculate values for the template
        this.calculateStats();
        
        if (isPlatformBrowser(this.platformId)) {
          setTimeout(() => {
            this.createChart();
          }, 0);
        }
      },
      error: (error) => {
        console.error('Error loading shipment data:', error);
      }
    });
  }

  calculateStats(): void {
    // Calculate total shipments
    this.totalShipments = 0;
    for (const shipment of this.shipments) {
      this.totalShipments += shipment.count;
    }
    
    // Calculate average per day
    if (this.shipments.length > 0) {
      const average = this.totalShipments / this.shipments.length;
      this.averagePerDay = average.toFixed(1);
    } else {
      this.averagePerDay = '0';
    }
    
    // Calculate on-time percentage
    let totalOnTime = 0;
    for (const shipment of this.shipments) {
      totalOnTime += shipment.onTimePercentage || 0;
    }
    this.onTimePercentage = this.shipments.length > 0 
      ? Math.round(totalOnTime / this.shipments.length) 
      : 0;
    
    // Get recent shipments
    this.recentShipments = this.shipments.slice(0, 5);
  }

  createChart(): void {
    try {
      const canvas = document.getElementById('shipmentsChart') as HTMLCanvasElement;
      if (!canvas) {
        console.error('Canvas element not found');
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('Canvas context not available');
        return;
      }

      // Prepare data for chart
      const labels = this.shipments.map(shipment => shipment.date);
      const data = this.shipments.map(shipment => shipment.count);
      
      // Create chart
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Shipments',
            data: data,
            fill: false,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    } catch (error) {
      console.error('Error creating chart:', error);
    }
  }

  onDateRangeChange(): void {
    // In a real app, you would filter data based on the selected range
    console.log('Date range changed to:', this.selectedDateRange);
    
    // Re-create chart with filtered data
    if (this.chart) {
      this.chart.destroy();
    }
    
    // Recalculate stats
    this.calculateStats();
    
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.createChart();
      }, 0);
    }
  }
}
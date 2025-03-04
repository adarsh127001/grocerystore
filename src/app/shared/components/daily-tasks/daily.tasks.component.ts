import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-daily-tasks',
  templateUrl: './daily.tasks.component.html',
  styleUrls: ['./daily.tasks.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressBarModule,
    HttpClientModule
  ]
})
export class DailyTasksComponent implements OnInit {
  tasks: any[] = [];
  chart: any;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Register Chart.js components if in browser
    if (isPlatformBrowser(this.platformId)) {
      Chart.register(...registerables);
    }
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.http.get<any[]>('assets/data/tasks.json').subscribe({
      next: (data) => {
        this.tasks = data;
        console.log('Task data loaded successfully');
        
        // Only create chart in browser environment
        if (isPlatformBrowser(this.platformId)) {
          setTimeout(() => {
            this.createChart();
          }, 0);
        }
      },
      error: (error) => {
        console.error('Error loading task data:', error);
      }
    });
  }

  createChart(): void {
    try {
      const canvas = document.getElementById('tasksChart') as HTMLCanvasElement;
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
      const labels = this.tasks.map(task => task.name);
      const data = this.tasks.map(task => task.progress);
      
      // Create chart
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Task Progress',
            data: data,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              max: 100
            }
          }
        }
      });
    } catch (error) {
      console.error('Error creating chart:', error);
    }
  }
}
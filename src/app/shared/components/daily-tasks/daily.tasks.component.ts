import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HttpClientModule } from '@angular/common/http';
import { ChartComponent, ChartDataItem } from '../chart/chart.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface TaskCategory {
  id: string;
  type: string;
}

interface TaskData {
  connection: string;
  task: string;
}

@Component({
  selector: 'app-daily-tasks',
  templateUrl: './daily.tasks.component.html',
  styleUrls: ['./daily.tasks.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressBarModule,
    HttpClientModule,
    ChartComponent,
    MatButtonModule,
    MatIconModule
  ]
})
export class DailyTasksComponent implements OnInit {
  tasks: any[] = [];
  taskCategories: TaskCategory[] = [];
  taskData: TaskData[] = [];
  chartData: ChartDataItem[] = [];
  selectedRange: 'weekly' | 'monthly' | 'yearly' = 'monthly';
  currentTab: 'online' | 'offline' = 'online';

  colors: string[] = ['#1a237e', '#283593', '#3949ab', '#9fa8da'];

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadTaskCategories();
    this.loadTaskData();
    this.loadProgressTasks();
  }

  loadTaskCategories(): void {
    this.http.get<any>('assets/data/tasks.json').subscribe({
      next: (data) => {
        if (data && data.shipmentsList) {
          const uniqueTasks = new Set<string>();
          data.shipmentsList.forEach((item: any) => {
            if (item.task) {
              uniqueTasks.add(item.task);
            }
          });

          this.taskCategories = Array.from(uniqueTasks).map((type, index) => ({
            id: `00${index + 1}`,
            type: type
          }));
          
          console.log('Task categories loaded successfully');
          this.processChartData(); 
        }
      },
      error: (error) => {
        console.error('Error loading task categories:', error);
        this.taskCategories = [
          { id: '001', type: 'Cash Management' },
          { id: '002', type: 'Financial Reporting' },
          { id: '003', type: 'Vendors & Contracts' },
          { id: '004', type: 'Advertising' }
        ];
        this.processChartData();
      }
    });
  }

  loadTaskData(): void {
    this.http.get<any>('assets/data/tasks.json').subscribe({
      next: (data) => {
        if (data && data.shipmentsList) {
          this.taskData = data.shipmentsList
            .filter((item: any) => item.connection && item.task)
            .map((item: any) => ({
              connection: item.connection,
              task: item.task
            }));
          
          console.log('Task data loaded successfully');
          this.processChartData();
        }
      },
      error: (error) => {
        console.error('Error loading task data:', error);
        this.taskData = [
          { connection: 'Online', task: 'Cash Management' },
          { connection: 'Online', task: 'Cash Management' },
          { connection: 'Online', task: 'Financial Reporting' },
          { connection: 'Online', task: 'Financial Reporting' },
          { connection: 'Online', task: 'Financial Reporting' },
          { connection: 'Online', task: 'Vendors & Contracts' },
          { connection: 'Online', task: 'Vendors & Contracts' },
          { connection: 'Online', task: 'Advertising' },
          { connection: 'Offline', task: 'Cash Management' },
          { connection: 'Offline', task: 'Financial Reporting' },
          { connection: 'Offline', task: 'Vendors & Contracts' },
          { connection: 'Offline', task: 'Advertising' }
        ];
        this.processChartData();
      }
    });
  }

  loadProgressTasks(): void {
    this.http.get<any>('assets/data/tasks.json').subscribe({
      next: (data) => {
        if (data && data.shipmentsList) {
          const filteredShipments = data.shipmentsList
            .filter((item: any) => 
              (this.currentTab === 'online' && item.connection === 'Online') || 
              (this.currentTab === 'offline' && item.connection === 'Offline')
            )
            .slice(0, 5); 
          

          this.tasks = filteredShipments.map((item: any) => {
            return {
              id: item.id,
              name: item.task,
              progress: Math.floor(Math.random() * 70) + 30
            };
          });
          
          console.log('Progress tasks loaded successfully');
        }
      },
      error: (error) => {
        console.error('Error loading progress tasks:', error); 
        this.tasks = [
          { id: 1, name: 'Inventory check', progress: 85 },
          { id: 2, name: 'Restock dairy', progress: 100 },
          { id: 3, name: 'Check expiration dates', progress: 45 },
          { id: 4, name: 'Clean displays', progress: 30 },
          { id: 5, name: 'Staff meeting', progress: 0 }
        ];
      }
    });
  }

  processChartData(): void {
    if (!this.taskCategories.length || !this.taskData.length) {
      return;
    }

    if (this.currentTab === 'online') {
      this.chartData = [
        { label: 'Cash Management', value: 18, color: '#1a237e' },
        { label: 'Financial Reporting', value: 29, color: '#283593' },
        { label: 'Vendors & Contracts', value: 15, color: '#3949ab' },
        { label: 'Advertising', value: 10, color: '#9fa8da' }
      ];
      return;
    }

    const taskCounts: { [key: string]: number } = {};
    
    this.taskCategories.forEach(category => {
      taskCounts[category.type] = 0;
    });
    
    this.taskData.forEach(task => {
      if (task.connection === 'Offline') {
        if (taskCounts[task.task] !== undefined) {
          taskCounts[task.task]++;
        }
      }
    });
    
    this.chartData = Object.keys(taskCounts).map((category, index) => {
      return {
        label: category,
        value: taskCounts[category],
        color: this.colors[index % this.colors.length]
      };
    });

    if (this.selectedRange === 'weekly') {
      this.chartData.sort((a, b) => b.value - a.value); // Highest to lowest
    } else if (this.selectedRange === 'monthly') {
      this.chartData.sort((a, b) => a.label.localeCompare(b.label)); // Alphabetical
    } else if (this.selectedRange === 'yearly') {
      this.chartData.sort((a, b) => a.value - b.value); // Lowest to highest
    }
  }

  onRangeChange(range: 'weekly' | 'monthly' | 'yearly'): void {
    this.selectedRange = range;
    this.processChartData();
  }

  onTabChange(tab: 'online' | 'offline'): void {
    this.currentTab = tab;
    this.processChartData();
    this.loadProgressTasks();
  }
}
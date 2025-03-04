import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { SsrChartComponent } from '../shared/components/ssr-chart/ssr-chart.component';
import { DataService } from '../services/data.service';
// Import the main blog component instead of the preview component
import { FoodSafetyBlogsComponent } from '../food-safety-blogs/food-safety-blogs.component';
// Import the DailyTasksComponent
import { DailyTasksComponent } from '../shared/components/daily-tasks/daily.tasks.component';
// Import the ShipmentStatisticsComponent
import { ShipmentStatisticsComponent } from '../shared/components/shipment-statistics/shipment-statistics.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    MatDividerModule,
    SsrChartComponent,
    FoodSafetyBlogsComponent, // Use the main component instead
    DailyTasksComponent, // Add the DailyTasksComponent to imports
    ShipmentStatisticsComponent // Add the ShipmentStatisticsComponent to imports
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  currentUser: string = 'Manager';
  today: Date = new Date();
  private isBrowser: boolean;
  
  orderAnalysisData: any[] = [];
  selectedRange: 'weekly' | 'monthly' | 'yearly' = 'monthly';
  
  constructor(
    private router: Router,
    private dataService: DataService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
  
  ngOnInit() {
    if (this.isBrowser) {
      const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
      const username = sessionStorage.getItem('currentUser');
      
      if (!isLoggedIn) {
        this.router.navigate(['/login']);
      } else if (username) {
        this.currentUser = username;
      }
    }
    
    this.loadOrderAnalysisData();
  }
  
  loadOrderAnalysisData() {
    this.dataService.getOrdersAnalysisData().subscribe({
      next: (data) => {
        if (data && data.stockInventoryAnalysisChartData) {
          this.orderAnalysisData = data.stockInventoryAnalysisChartData;
        }
      },
      error: (err) => {
        console.error('Error loading order analysis data:', err);
        this.orderAnalysisData = this.dataService.getMockOrdersData().stockInventoryAnalysisChartData;
      }
    });
  }
  
  logout() {
    if (this.isBrowser) {
      sessionStorage.removeItem('isLoggedIn');
      sessionStorage.removeItem('currentUser');
    }
    
    this.router.navigate(['/login']);
  }
}
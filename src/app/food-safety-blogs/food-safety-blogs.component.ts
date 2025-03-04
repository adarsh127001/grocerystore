import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../core/services/auth.service';

interface Blog {
  id: string;
  title: string;
  image: string;
  type: string;
  descriptiton: string;
  publishedDate: string;
  blogInfo?: {
    carouselImage?: string[];
    postBy?: string;
    desc?: string;
  };
}

@Component({
  selector: 'app-food-safety-blogs',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule, 
    MatChipsModule,
    MatProgressSpinnerModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatMenuModule,
    MatDividerModule,
    MatTooltipModule
  ],
  templateUrl: './food-safety-blogs.component.html',
  styleUrls: ['./food-safety-blogs.component.css']
})
export class FoodSafetyBlogsComponent implements OnInit {
  @Input() previewMode: boolean = false;
  @Input() limit: number = 5;
  
  blogs: Blog[] = [];
  filteredBlogs: Blog[] = [];
  isLoading = true;
  selectedYear: string = '';
  availableYears: string[] = [];
  currentUser: string = 'Manager';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user || 'Manager';
    });
    
    this.loadBlogs();
  }

  loadBlogs(): void {
    setTimeout(() => {
      this.blogs = this.getMockBlogs();
      
      if (this.previewMode && this.limit) {
        this.blogs = this.blogs.slice(0, this.limit);
      }
      
      this.extractAvailableYears();
      this.filterBlogsByYear(this.selectedYear);
      this.isLoading = false;
    }, 1000);
  }

  extractAvailableYears(): void {
    const yearsSet = new Set<string>();
    
    this.blogs.forEach(blog => {
      if (blog.publishedDate) {
        try {
          const year = new Date(blog.publishedDate).getFullYear().toString();
          if (!isNaN(parseInt(year))) {
            yearsSet.add(year);
          }
        } catch (e) {
          // Skip invalid dates
        }
      }
    });
    
    this.availableYears = Array.from(yearsSet).sort((a, b) => parseInt(b) - parseInt(a));
    
    if (this.availableYears.length === 0) {
      this.availableYears = [new Date().getFullYear().toString()];
    }
  }

  filterBlogsByYear(year: string): void {
    this.selectedYear = year;
    this.filteredBlogs = this.blogs.filter(blog => {
      if (!blog.publishedDate) return false;
      try {
        const blogDate = new Date(blog.publishedDate);
        return blogDate.getFullYear().toString() === year;
      } catch (e) {
        return false;
      }
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch (e) {
      return '';
    }
  }

  navigateToBlogDetail(blogId: string): void {
    this.router.navigate(['/food-safety-blogs', blogId]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getMockBlogs(): Blog[] {
    return [
      {
        id: "1",
        title: "Food Grocery Logistics – Frequency of Shoppers",
        image: "assets/images/blog/food-safety-1.jpg",
        type: "Safety",
        descriptiton: "Most Americans go grocery shopping at least once or twice a week. In addition to visiting a grocery store, many consumers also shop at specialty food stores.",
        publishedDate: "2023-12-24",
        blogInfo: {
          postBy: "John Smith",
          desc: "Food safety is paramount in grocery store operations. This blog explores the essential practices that stores must implement to protect customers and comply with health regulations. From proper temperature control to handling procedures, we cover it all."
        }
      },
      {
        id: "2",
        title: "Different Types of Consumer Goods in the US",
        image: "assets/images/blog/food-expiration.jpg",
        type: "Education",
        descriptiton: "An overview of the main categories of consumer goods in the US: durable, non-durable and services. Understanding these categories helps retailers better serve their customers.",
        publishedDate: "2023-02-21",
        blogInfo: {
          postBy: "Sarah Johnson",
          desc: "Food expiration dates can be confusing for both consumers and retailers. This guide explains the differences between various date labels and provides best practices for inventory management to reduce waste while maintaining safety standards."
        }
      },
      {
        id: "3",
        title: "Inventory Turnover Ratios",
        image: "assets/images/blog/cross-contamination.jpg",
        type: "Safety",
        descriptiton: "Most Americans go grocery shopping at least once or twice a week. In addition to visiting a grocery store, many consumers also shop at specialty food stores.",
        publishedDate: "2023-01-04",
        blogInfo: {
          postBy: "Michael Chen",
          desc: "Cross-contamination is a serious risk in grocery stores that can lead to foodborne illness. This blog discusses effective strategies for preventing cross-contamination, including proper storage practices, handling procedures, and staff training recommendations."
        }
      },
      {
        id: "4",
        title: "Grocery Ecommerce Platforms",
        image: "assets/images/blog/haccp.jpg",
        type: "Compliance",
        descriptiton: "Warehouse management is usually clubbed together with logistics, but it is broad enough to be considered a separate category. Learn about the latest platforms.",
        publishedDate: "2022-09-12",
        blogInfo: {
          postBy: "Lisa Rodriguez",
          desc: "HACCP is a systematic preventive approach to food safety. This comprehensive guide walks through the process of implementing HACCP in retail food operations, helping stores identify, evaluate, and control food safety hazards throughout their operations."
        }
      }
    ];
  }
}
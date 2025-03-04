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
    this.http.get<Blog[]>('assets/data/blogs.json').subscribe({
      next: (blogs) => {
        this.blogs = blogs;
        
        if (this.previewMode && this.limit) {
          this.blogs = this.blogs.slice(0, this.limit);
        }
        
        this.extractAvailableYears();
        this.filterBlogsByYear(this.selectedYear);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading blog data:', error);
        this.isLoading = false;
      }
    });
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
}
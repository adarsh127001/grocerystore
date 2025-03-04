import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.css']
})
export class BlogDetailComponent implements OnInit {
  blog: any = null;
  isLoading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const blogId = this.route.snapshot.paramMap.get('id');
    if (blogId) {
      this.http.get<any>('assets/data/db.json').subscribe({
        next: (data) => {
          const blogs = data.blogs || [];
          this.blog = blogs.find((blog: any) => blog.id === blogId);
          
          if (!this.blog) {
            // If blog not found in db.json, check mock data
            const mockBlogs = this.getMockBlogs();
            this.blog = mockBlogs.find(blog => blog.id === blogId);
          }
          
          this.isLoading = false;
          if (!this.blog) {
            this.error = true;
          }
        },
        error: (error) => {
          console.error('Error fetching blog details:', error);
          this.isLoading = false;
          this.error = true;
        }
      });
    } else {
      this.isLoading = false;
      this.error = true;
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
  }

  private getMockBlogs(): any[] {
    return [
      {
        id: "001",
        title: "Food Grocery Logistics - Frequency of Shoppers",
        image: "grocery-logistics.jpg",
        type: "Logistics",
        descriptiton: "Most Americans go grocery shopping at least once or twice a week. In addition to visiting a grocery store, many consumers also order groceries online.",
        publishedDate: "2023-12-04T00:00:00",
        blogInfo: {
          postBy: "Sarah Johnson",
          desc: "Grocery shopping habits have evolved significantly over the past decade. While traditional in-store shopping remains popular, online grocery services have seen exponential growth, especially after the pandemic. This article explores the frequency patterns of modern grocery shoppers and how retailers are adapting to these changing behaviors."
        }
      },
      // Add more mock blogs as needed
    ];
  }
}
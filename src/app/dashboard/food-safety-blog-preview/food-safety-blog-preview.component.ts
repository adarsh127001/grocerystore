import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-food-safety-blog-preview',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterModule],
  templateUrl: './food-safety-blog-preview.component.html',
  styleUrls: ['./food-safety-blog-preview.component.css']
})
export class FoodSafetyBlogPreviewComponent implements OnInit {
  blogs: any[] = [];
  isLoading = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getBlogs().subscribe({
      next: (data) => {
        // Get the two most recent blogs for preview
        this.blogs = data.slice(0, 2);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching blog data:', error);
        this.isLoading = false;
      }
    });
  }

  getBlogs(): Observable<any[]> {
    return this.http.get<any>('assets/data/db.json').pipe(
      map(data => {
        const blogs = data.blogs || [];
        
        // Add mock data if the blogs array is empty or has only one entry
        if (blogs.length === 0 || blogs.length === 1) {
          blogs.push(
            {
              id: "002",
              title: "FDA reviews popular Ice-cream brand",
              image: "ice-cream.jpg",
              type: "Food Safety",
              descriptiton: "Known for its rich flavors and high-quality ingredients, Häagen-Dazs has passed FDA inspection with flying colors.",
              publishedDate: "2023-11-24T00:00:00",
              blogInfo: {
                carouselImage: ["ice-cream1.jpg", "ice-cream2.jpg", "ice-cream3.jpg"],
                postBy: "Sarah Johnson",
                desc: "The FDA has completed its annual review of popular ice cream brands, with Häagen-Dazs receiving top marks for quality and safety standards."
              }
            },
            {
              id: "003",
              title: "Cost-effective Buyings",
              image: "grocery-store.jpg",
              type: "Shopping Tips",
              descriptiton: "Brand loyalty significantly benefits retailers by boosting sales. Not only do existing customers spend more, but they also refer new customers.",
              publishedDate: "2024-09-05T00:00:00",
              blogInfo: {
                carouselImage: ["grocery1.jpg", "grocery2.jpg", "grocery3.jpg"],
                postBy: "Michael Chen",
                desc: "In today's competitive retail environment, building brand loyalty is more important than ever."
              }
            }
          );
        }
        
        return blogs;
      }),
      catchError(error => {
        console.error('Error loading blog data', error);
        return of([]);
      })
    );
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
}
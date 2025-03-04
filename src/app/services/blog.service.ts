import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private blogsUrl = 'assets/data/db.json';
  private blogsCache = new BehaviorSubject<any[]>([]);
  private isLoading = false;

  constructor(private http: HttpClient) {}

  getBlogs(): Observable<any[]> {
    // Return cached data if available
    if (this.blogsCache.value.length > 0) {
      return of(this.blogsCache.value);
    }

    // Prevent multiple simultaneous requests
    if (this.isLoading) {
      return this.blogsCache.asObservable();
    }

    this.isLoading = true;

    // Fetch data from JSON file
    return this.http.get<any>(this.blogsUrl).pipe(
      tap(data => {
        console.log('Blog data loaded successfully');
        // Extract blogs array from the response
        const blogs = data.blogs || [];
        
        // Add some mock data if the blogs array is empty
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
                desc: "The FDA has completed its annual review of popular ice cream brands, with Häagen-Dazs receiving top marks for quality and safety standards. The inspection, which took place over three months, evaluated everything from ingredient sourcing to manufacturing processes."
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
                desc: "In today's competitive retail environment, building brand loyalty is more important than ever. Studies show that loyal customers spend 67% more than new ones, and are 50% more likely to try new products from their preferred brands."
              }
            }
          );
        }
        
        this.blogsCache.next(blogs);
        this.isLoading = false;
      }),
      catchError(error => {
        console.error('Error loading blog data', error);
        this.isLoading = false;
        return of([]);
      })
    );
  }

  getBlogById(id: string): Observable<any> {
    return this.getBlogs().pipe(
      map(blogs => blogs.find(blog => blog.id === id)),
      catchError(error => {
        console.error(`Error fetching blog with id ${id}:`, error);
        return of(null);
      })
    );
  }
} 
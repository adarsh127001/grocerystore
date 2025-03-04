import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';

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
  selector: 'app-blog-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.css']
})
export class BlogDetailComponent implements OnInit {
  blog: Blog | null = null;
  
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}
  
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadBlog(id);
    }
  }
  
  loadBlog(id: string): void {
    // For now, use mock data
    const mockBlogs: Blog[] = [
        {
            id: "1",
            title: "Essential Food Safety Practices for Grocery Stores",
            image: "assets/images/blog/food-safety-1.jpg",
            type: "Safety",
            descriptiton: "Learn about the critical food safety practices that every grocery store should implement to ensure customer safety and compliance with regulations.",
            publishedDate: "2023-05-15",
            blogInfo: {
              postBy: "John Smith",
              desc: "Food safety is paramount in grocery store operations. This blog explores the essential practices that stores must implement to protect customers and comply with health regulations. From proper temperature control to handling procedures, we cover it all."
            }
          },
          {
            id: "2",
            title: "Understanding Food Expiration Dates",
            image: "assets/images/blog/food-expiration.jpg",
            type: "Education",
            descriptiton: "A comprehensive guide to understanding food expiration dates, sell-by dates, and best-by dates to reduce waste and ensure food safety.",
            publishedDate: "2023-07-22",
            blogInfo: {
              postBy: "Sarah Johnson",
              desc: "Food expiration dates can be confusing for both consumers and retailers. This guide explains the differences between various date labels and provides best practices for inventory management to reduce waste while maintaining safety standards."
            }
          },
          {
            id: "3",
            title: "Preventing Cross-Contamination in Grocery Stores",
            image: "assets/images/blog/cross-contamination.jpg",
            type: "Safety",
            descriptiton: "Strategies and best practices to prevent cross-contamination between different food products in grocery store environments.",
            publishedDate: "2023-09-10",
            blogInfo: {
              postBy: "Michael Chen",
              desc: "Cross-contamination is a serious risk in grocery stores that can lead to foodborne illness. This blog discusses effective strategies for preventing cross-contamination, including proper storage practices, handling procedures, and staff training recommendations."
            }
          },
          {
            id: "4",
            title: "Implementing HACCP in Retail Food Operations",
            image: "assets/images/blog/haccp.jpg",
            type: "Compliance",
            descriptiton: "A step-by-step guide to implementing Hazard Analysis Critical Control Point (HACCP) systems in retail food operations.",
            publishedDate: "2024-01-05",
            blogInfo: {
              postBy: "Lisa Rodriguez",
              desc: "HACCP is a systematic preventive approach to food safety. This comprehensive guide walks through the process of implementing HACCP in retail food operations, helping stores identify, evaluate, and control food safety hazards throughout their operations."
            }
          },
          {
            id: "5",
            title: "Food Safety Training for Grocery Store Employees",
            image: "assets/images/blog/training.jpg",
            type: "Training",
            descriptiton: "Essential food safety training topics and approaches for grocery store employees at all levels.",
            publishedDate: "2024-03-18",
            blogInfo: {
              postBy: "David Wilson",
              desc: "Well-trained employees are the first line of defense in food safety. This blog outlines essential training topics for grocery store staff, from basic hygiene practices to advanced food safety protocols, with practical tips for implementing effective training programs."
            }
          }
    ];
    
    this.blog = mockBlogs.find(blog => blog.id === id) || null;
    
    if (!this.blog) {
      console.error(`Blog with ID ${id} not found`);
    }
  }
  
  formatDate(dateString: string): string {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (e) {
      console.warn('Invalid date format:', dateString);
      return '';
    }
  }
  
  getAuthor(): string {
    return this.blog?.blogInfo?.postBy || 'Unknown Author';
  }
  
  getDescription(): string {
    return this.blog?.blogInfo?.desc || this.blog?.descriptiton || 'No description available';
  }
  
  hasCarouselImages(): boolean {
    return !!this.blog?.blogInfo?.carouselImage && this.blog.blogInfo.carouselImage.length > 0;
  }
  
  getCarouselImages(): string[] {
    return this.blog?.blogInfo?.carouselImage || [];
  }
}
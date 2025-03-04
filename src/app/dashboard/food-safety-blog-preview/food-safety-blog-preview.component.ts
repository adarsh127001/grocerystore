import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

interface Blog {
  id: string;
  title: string;
  image: string;
  type: string;
  descriptiton: string;
  publishedDate: string;
}

@Component({
  selector: 'app-food-safety-blog-preview',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterModule],
  templateUrl: './food-safety-blog-preview.component.html',
  styleUrls: ['./food-safety-blog-preview.component.css']
})
export class FoodSafetyBlogPreviewComponent implements OnInit {
  blogs: Blog[] = [
    {
      id: "1",
      title: "Essential Food Safety Practices for Grocery Stores",
      image: "assets/images/blog/food-safety-1.jpg",
      type: "Safety",
      descriptiton: "Learn about the critical food safety practices that every grocery store should implement to ensure customer safety and compliance with regulations.",
      publishedDate: "2023-05-15"
    },
    {
      id: "2",
      title: "Understanding Food Expiration Dates",
      image: "assets/images/blog/food-expiration.jpg",
      type: "Education",
      descriptiton: "A comprehensive guide to understanding food expiration dates, sell-by dates, and best-by dates to reduce waste and ensure food safety.",
      publishedDate: "2023-07-22"
    }
  ];

  constructor() {}

  ngOnInit(): void {
    // Using hardcoded data, no need to fetch
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
}
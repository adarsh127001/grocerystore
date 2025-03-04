import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Blog {
  id: string;
  title: string;
  image: string;
  type: string;
  descriptiton: string; // Note: keeping the typo as it's in your db.json
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
    RouterModule
  ],
  templateUrl: './food-safety-blogs.component.html',
  styleUrls: ['./food-safety-blogs.component.css']
})
export class FoodSafetyBlogsComponent implements OnInit {
  blogs: Blog[] = [];
  filteredBlogs: Blog[] = [];
  isLoading = true;
  selectedYear: string = '2025'; // Default selected year
  availableYears: string[] = ['2025', '2024', '2023', '2022', '2021', '2020'];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.http.get<any>('assets/data/db.json').subscribe({
      next: (data) => {
        let blogs = data.blogs || [];
        
        // Add mock data if the blogs array is empty or has only a few entries
        if (blogs.length < 4) {
          blogs = this.getMockBlogs();
        }
        
        this.blogs = blogs;
        this.filterBlogsByYear(this.selectedYear);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching blog data:', error);
        this.blogs = this.getMockBlogs();
        this.filterBlogsByYear(this.selectedYear);
        this.isLoading = false;
      }
    });
  }

  filterBlogsByYear(year: string): void {
    this.selectedYear = year;
    this.filteredBlogs = this.blogs.filter(blog => {
      const blogDate = new Date(blog.publishedDate);
      return blogDate.getFullYear().toString() === year;
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  private getMockBlogs(): Blog[] {
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
      {
        id: "002",
        title: "Different Types of Consumer Goods in the US",
        image: "consumer-goods.jpg",
        type: "Market Analysis",
        descriptiton: "An overview of the main categories of consumer goods in the US: durable, non-durable and services. Understanding these categories helps retailers optimize their inventory.",
        publishedDate: "2023-02-15T00:00:00",
        blogInfo: {
          postBy: "Michael Chen",
          desc: "Consumer goods in the United States are typically classified into three main categories: durable goods, non-durable goods, and services. Durable goods are products that have a significant lifespan, such as appliances and furniture. Non-durable goods are consumed quickly, like food and cleaning supplies. Services represent intangible offerings that fulfill consumer needs without transferring ownership of physical items."
        }
      },
      {
        id: "003",
        title: "Inventory Turnover Ratios",
        image: "inventory-turnover.jpg",
        type: "Inventory Management",
        descriptiton: "Most Americans go grocery shopping at least once or twice a week. In addition to visiting a grocery store, many consumers also order groceries online.",
        publishedDate: "2022-11-04T00:00:00",
        blogInfo: {
          postBy: "David Wilson",
          desc: "Inventory turnover ratio is a critical metric for grocery retailers, measuring how quickly inventory is sold and replaced. A higher ratio generally indicates efficient inventory management, while a lower ratio might suggest overstocking or obsolescence issues. This article examines industry benchmarks and strategies for optimizing inventory turnover in the grocery sector."
        }
      },
      {
        id: "004",
        title: "Grocery Ecommerce Platforms",
        image: "ecommerce-platforms.jpg",
        type: "Technology",
        descriptiton: "Warehouse management is usually clubbed together with logistics, but it is broad enough to be considered its own category. This article explores the best ecommerce platforms for grocery businesses.",
        publishedDate: "2022-09-12T00:00:00",
        blogInfo: {
          postBy: "Jennifer Lopez",
          desc: "The rise of grocery ecommerce has led to the development of specialized platforms designed to address the unique challenges of online food retail. These platforms integrate features like temperature-sensitive delivery scheduling, real-time inventory management, and personalized shopping experiences. This article compares leading grocery ecommerce solutions and their key differentiators."
        }
      },
      {
        id: "005",
        title: "FDA reviews popular Ice-cream brand",
        image: "ice-cream.jpg",
        type: "Food Safety",
        descriptiton: "Known for its rich flavors and high-quality ingredients, Häagen-Dazs has passed FDA inspection with flying colors.",
        publishedDate: "2023-11-24T00:00:00",
        blogInfo: {
          postBy: "Emily Parker",
          desc: "The FDA has completed its annual review of popular ice cream brands, with Häagen-Dazs receiving top marks for quality and safety standards. The inspection, which took place over three months, evaluated everything from ingredient sourcing to manufacturing processes."
        }
      },
      {
        id: "006",
        title: "Cost-effective Buyings",
        image: "grocery-store.jpg",
        type: "Shopping Tips",
        descriptiton: "Brand loyalty significantly benefits retailers by boosting sales. Not only do existing customers spend more, but they also refer new customers.",
        publishedDate: "2024-09-05T00:00:00",
        blogInfo: {
          postBy: "Robert Brown",
          desc: "In today's competitive retail environment, building brand loyalty is more important than ever. Studies show that loyal customers spend 67% more than new ones, and are 50% more likely to try new products from their preferred brands."
        }
      }
    ];
  }
}
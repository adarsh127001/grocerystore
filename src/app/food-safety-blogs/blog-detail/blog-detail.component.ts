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
    this.http.get<Blog[]>('assets/data/blogs.json').subscribe({
      next: (blogs) => {
        this.blog = blogs.find(blog => blog.id === id) || null;
        
        if (!this.blog) {
          console.error(`Blog with ID ${id} not found`);
        }
      },
      error: (error) => {
        console.error('Error loading blog data:', error);
      }
    });
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
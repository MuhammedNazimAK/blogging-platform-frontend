import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../core/services/blog.service';
import { BlogPost } from 'src/app/models/blog-post.model';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-listing.component.html',
  styleUrls: ['./blog-listing.component.css']
})
export class BlogListComponent implements OnInit {
  blogPosts: BlogPost[] = [];
  loading = true;
  loadingTimeout: any;

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.loadBlogPosts();
  }

  loadBlogPosts(): void {
    this.loading = true;
    
    this.loadingTimeout = setTimeout(() => {
      this.blogService.getBlogPosts().subscribe({
        next: (posts) => {
          this.blogPosts = posts;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading blog posts', error);
          this.loading = false;
        }
      });
    }, 1000);
  }

  getReadTime(content: string): number {
    // Average reading speed: 200 words per minute
    const words = content.split(' ').length;
    return Math.max(1, Math.ceil(words / 200)); // Ensure minimum 1 minute
  }

  // Get unique users from blog posts for the sidebar
  getUniqueUsers() {
    const uniqueUsers = new Map();
    
    this.blogPosts.forEach(post => {
      if (post.user && !uniqueUsers.has(post.user.id)) {
        uniqueUsers.set(post.user.id, post.user);
      }
    });
    
    // Return array of unique users (limit to 5)
    return Array.from(uniqueUsers.values()).slice(0, 5);
  }

  getUserPostCount(userId: string): number {
    return this.blogPosts.filter(post => post.user?.id === userId).length;
  }

  openBlogDetail(post: BlogPost): void {

    console.log('Opening blog detail for:', post.id);

  }

  ngOnDestroy() {
    // Clear timeout if component is destroyed
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
    }
  }
}
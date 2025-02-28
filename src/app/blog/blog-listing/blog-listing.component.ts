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
  featuredPost: BlogPost | null = null;
  loading = true;
  selectedCategory: string = 'All';
  categories = ['All', 'Technology', 'Design', 'Writing', 'Productivity'];
  searchTerm: string = '';

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.loadBlogPosts();
  }

  loadBlogPosts(): void {
    this.loading = true;
    this.blogService.getBlogPosts().subscribe({
      next: (posts) => {
        if (posts.length > 0) {
          // Set the first post as featured (or you could have a field in your model to determine this)
          this.featuredPost = posts[0];
          // Remove featured post from regular list
          this.blogPosts = posts.slice(1);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading blog posts', error);
        this.loading = false;
      }
    });
  }

  searchPosts(): void {
    if (!this.searchTerm.trim()) {
      this.loadBlogPosts();
      return;
    }
    
    this.blogService.searchBlogPosts(this.searchTerm).subscribe({
      next: (posts) => {
        this.blogPosts = posts;
        // Reset featured post if doing a search
        this.featuredPost = null;
      },
      error: (error) => {
        console.error('Error searching posts', error);
      }
    });
  }

  getReadTime(content: string): number {
    // Average reading speed: 200 words per minute
    const words = content.split(' ').length;
    return Math.ceil(words / 200);
  }
}
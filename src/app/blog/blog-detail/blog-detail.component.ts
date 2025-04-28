import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../core/services/blog.service';
import { AuthService } from '../../core/services/auth.service';
import { BlogPost } from 'src/app/models/blog-post.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.css']
})

export class BlogDetailComponent implements OnInit {
  blogPost: BlogPost | null = null;
  loading = true;
  commentForm: FormGroup;
  submittingComment = false;
  userLiked = false;
  userBookmarked = false;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService,
    private authService: AuthService,
    private fb: FormBuilder
  ) { 
    this.commentForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadBlogPost(id);
      } else {
        this.router.navigate(['/blog']);
      }
    });
  }

  loadBlogPost(id: string): void {
    this.loading = true;
    this.blogService.getBlogPostById(id).subscribe({
      next: (post) => {
        this.blogPost = post;
        this.loading = false;
        this.checkUserInteractions();
      },
      error: (error) => {
        console.error('Error loading blog post', error);
        this.loading = false;
        this.router.navigate(['/blog']);
      }
    });
  }

  checkUserInteractions(): void {
    if (!this.blogPost || !this.authService.isLoggedIn()) return;
        
    // Check if user liked the post
    this.blogService.checkUserLiked(this.blogPost.id!).subscribe({
      next: (liked) => this.userLiked = liked,
      error: (error) => console.error('Error checking like status', error)
    });
    
    // Check if user bookmarked the post
    this.blogService.checkUserBookmarked(this.blogPost.id!).subscribe({
      next: (bookmarked) => this.userBookmarked = bookmarked,
      error: (error) => console.error('Error checking bookmark status', error)
    });
  }

  submitComment(): void {
    if (!this.commentForm.valid || !this.blogPost || !this.authService.isLoggedIn()) {
      return;
    }
    
    this.submittingComment = true;
    const comment = {
      content: this.commentForm.value.content,
      blogPostId: this.blogPost.id,
    };
    
    this.blogService.addComment(comment).subscribe({
      next: (newComment) => {
        // Add comment to the list if it's not already updated by the backend response
        if (this.blogPost?.comments) {
          this.blogPost.comments.push(newComment);
        }
        
        // Increment comment count
        if (this.blogPost && this.blogPost.commentCount !== undefined) {
          this.blogPost.commentCount++;
        }
        
        this.commentForm.reset();
        this.submittingComment = false;
      },
      error: (error) => {
        console.error('Error submitting comment', error);
        this.submittingComment = false;
      }
    });
  }

  toggleLike(): void {
    if (!this.blogPost || !this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    
    if (this.userLiked) {
      // Unlike
      this.blogService.unlikePost(this.blogPost.id!).subscribe({
        next: () => {
          this.userLiked = false;
          // Update like count if you're tracking it
        },
        error: (error) => console.error('Error unliking post', error)
      });
    } else {
      // Like
      this.blogService.likePost(this.blogPost.id!).subscribe({
        next: () => {
          this.userLiked = true;
          // Update like count if you're tracking it
        },
        error: (error) => console.error('Error liking post', error)
      });
    }
  }
  
  toggleBookmark(): void {
    if (!this.blogPost || !this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    
    if (this.userBookmarked) {
      // Remove bookmark
      this.blogService.removeBookmark(this.blogPost.id!).subscribe({
        next: () => {
          this.userBookmarked = false;
        },
        error: (error) => console.error('Error removing bookmark', error)
      });
    } else {
      // Add bookmark
      this.blogService.addBookmark(this.blogPost.id!).subscribe({
        next: () => {
          this.userBookmarked = true;
        },
        error: (error) => console.error('Error adding bookmark', error)
      });
    }
  }

  getReadTime(content: string): number {
    // Average reading speed: 200 words per minute
    const words = content.split(' ').length;
    return Math.ceil(words / 200);
  }

  followAuthor(): void {
    // Implementation for following author
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    
    // Call your service to follow author
  }

shareToSocial(platform: 'twitter' | 'facebook' | 'linkedin'): void {
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(this.blogPost?.title ?? 'Untitled Blog Post');
  let shareUrl = '';
  
  switch(platform) {
    case 'twitter':
      shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
      break;
    case 'facebook':
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
      break;
    case 'linkedin':
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
      break;
  }
  
  window.open(shareUrl, '_blank');
}

copyLink(): void {
  navigator.clipboard.writeText(window.location.href)
    .then(() => {
      // You could add a toast notification here
      console.log('Link copied to clipboard');
    })
    .catch(err => {
      console.error('Could not copy text: ', err);
    });
  }
}
// blog-success-modal.component.ts
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BlogPost } from '../../models/blog-post.model';

@Component({
  selector: 'app-blog-success-modal',
  templateUrl: './blog-success-modal.component.html',
  styleUrls: ['./blog-success-modal.component.css']
})
export class BlogSuccessModalComponent implements OnInit {
  @Input() blogPost!: BlogPost;
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() editPost = new EventEmitter<void>();
  @Output() createNewPost = new EventEmitter<void>();
  
  showConfetti = false;
  copyLinkText = 'Copy Link';
  
  constructor(private router: Router) {}
  
  ngOnInit(): void {
    if (this.isOpen) {
      this.triggerConfetti();
    }
    
    // Auto-redirect after 5 seconds
    if (this.isOpen) {
      setTimeout(() => {
        this.viewFullPost();
      }, 5000);
    }
  }
  
  viewFullPost(): void {
    this.router.navigate(['/blog', this.blogPost.slug]);
    this.closeModal.emit();
  }
  
  handleEditPost(): void {
    this.editPost.emit();
    this.closeModal.emit();
  }
  
  copyLink(): void {
    const url = window.location.origin + '/blog/' + this.blogPost.slug;
    navigator.clipboard.writeText(url)
      .then(() => {
        this.copyLinkText = 'Copied!';
        setTimeout(() => {
          this.copyLinkText = 'Copy Link';
        }, 2000);
      })
      .catch(err => {
        console.error('Could not copy text: ', err);
      });
  }
  
  shareToSocial(platform: 'twitter' | 'facebook' | 'linkedin'): void {
    const url = encodeURIComponent(window.location.origin + '/blog/' + this.blogPost.slug);
    const title = encodeURIComponent(this.blogPost.title);
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

  // Add this method to the blog-success-modal.component.ts

private createConfetti(): void {
  const container = document.querySelector('.confetti-container');
  if (!container) return;
  
  const colors = ['#1E88E5', '#43A047', '#E53935', '#FDD835', '#8E24AA', '#00ACC1'];
  const shapes = ['square', 'circle', 'triangle'];
  
  // Clear any existing confetti
  container.innerHTML = '';
  
  // Create confetti pieces
  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    
    confetti.className = `confetti ${shape}`;
    confetti.style.backgroundColor = color;
    confetti.style.borderBottomColor = color; // For triangles
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.top = '-10px';
    
    // Random animation duration between 2-5s
    const duration = (Math.random() * 3) + 2;
    confetti.style.animationDuration = `${duration}s`;
    
    // Random delay so they don't all start at once
    const delay = Math.random() * 0.5;
    confetti.style.animationDelay = `${delay}s`;
    
    container.appendChild(confetti);
  }
}

// Update the triggerConfetti method
triggerConfetti(): void {
  this.showConfetti = true;
  setTimeout(() => {
    this.createConfetti();
  }, 100);
  
  setTimeout(() => {
    this.showConfetti = false;
  }, 3000);
}
}
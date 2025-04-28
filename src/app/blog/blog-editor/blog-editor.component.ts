import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BlogService } from 'src/app/core/services/blog.service';
import { BlogPost } from '../../models/blog-post.model';

@Component({
  selector: 'app-blog-editor',
  templateUrl: './blog-editor.component.html',
  styleUrls: ['./blog-editor.component.css']
})
export class BlogEditorComponent implements OnInit {
  blogForm!: FormGroup;
  isSubmitting = false;
  showSuccessModal = false;
  publishedBlog!: BlogPost;
  
  constructor(
    private fb: FormBuilder,
    private blogService: BlogService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.initForm();
  }
  
  initForm(): void {
    this.blogForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      content: ['', [Validators.required, Validators.minLength(100)]],
      excerpt: [''],
      featuredImage: [''],
    });
  }
  
  handlePublish(): void {
    if (this.blogForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.blogForm.controls).forEach(key => {
        this.blogForm.controls[key].markAsTouched();
      });
      return;
    }
    
    this.isSubmitting = true;
    
    // Create a slug from the title
    const blogData = this.blogForm.value;
    blogData.slug = this.createSlug(blogData.title);
    
    this.blogService.createBlog(blogData).subscribe(
      (response) => {
        this.isSubmitting = false;
        this.publishedBlog = response;
        this.showSuccessModal = true;
      },
      (error) => {
        this.isSubmitting = false;
        // Handle error (could add a toast notification service here)
        console.error('Failed to publish blog', error);
      }
    );
  }
  
  createSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim();
  }
  
  resetForm(): void {
    this.blogForm.reset();
    this.initForm();
  }
  
  handleEditPost(): void {
    // If you want to implement editing of the just-published post
    // You could redirect to edit mode or implement inline editing
    console.log('Edit post clicked');
  }
  
  handleCreateNew(): void {
    this.resetForm();
    this.showSuccessModal = false;
  }
}
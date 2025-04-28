import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { finalize, catchError, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { throwError, Subscription, Subject } from 'rxjs';

interface BlogPost {
  title: string;
  content: string;
  imageUrl?: string;
}

interface Draft {
  title: string;
  content: string;
  lastSaved: string; 
}

@Component({
  selector: 'app-blog-write',
  templateUrl: './blog-write.component.html',
  styleUrls: ['./blog-write.component.css'],
})

export class BlogWriteComponent implements OnInit, OnDestroy {

  title: string = '';
  content: string = '';
  selectedFile: File | null = null;

  imageUrl: string | null = null;
  
  uploadError: string | null = null;
  
  isPublishing: boolean = false;
  isSaving: boolean = false;
  
  // Auto-save functionality
  private autoSaveInterval: any;
  private unsavedChanges: boolean = false;
  private draftKey: string = 'blog_draft';
  private lastSavedDraft: string = '';

  private previousBlobUrl: string | null = null;
  
  // For cleanup
  private subscriptions: Subscription[] = [];
  
  private maxFileSize: number = 5 * 1024 * 1024; // 5MB

  private draftChanges = new Subject<Draft>();
  
  constructor(
    private http: HttpClient,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {}
  
  ngOnInit(): void {
    // Load draft from local storage
    this.loadDraft();
    
    // Set up auto-save
    this.draftChanges.pipe(
      debounceTime(3000), // Save after 3 seconds of inactivity
      distinctUntilChanged((prev, curr) => prev.title === curr.title && prev.content === curr.content), 
      map(draft => {
        localStorage.setItem(this.draftKey, JSON.stringify(draft));
        console.log('Draft saved to local storage', new Date());
      })
    ).subscribe();
    
    // Set up beforeunload event to warn about unsaved changes
    window.addEventListener('beforeunload', this.beforeUnloadHandler.bind(this));
  }
  
  ngOnDestroy(): void {

    if (this.imageUrl) {
      URL.revokeObjectURL(this.imageUrl);
    }

    if (this.previousBlobUrl) {
      URL.revokeObjectURL(this.previousBlobUrl);
    }

    // Clean up subscriptions and intervals
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }
    
    this.subscriptions.forEach(sub => sub.unsubscribe());
    window.removeEventListener('beforeunload', this.beforeUnloadHandler.bind(this));
    
    // Save draft on component destroy
    if (this.unsavedChanges) {
      this.saveDraftToLocalStorage();
    }
  }
  
  private beforeUnloadHandler(e: BeforeUnloadEvent): string | undefined {
    if (this.unsavedChanges) {
      const message = 'You have unsaved changes. Are you sure you want to leave?';
      e.returnValue = message;
      return message;
    }
    return undefined;
  }
  
  formatFileSize(bytes: number): string {
    if (bytes < 1024) {
      return bytes + ' bytes';
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + ' KB';
    } else {
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
  }
  
  onFileSelected(event: any) {
    const file = event.target.files[0] as File;

    this.uploadError = null; // Clear previous error immediately
    
    // Validate file size
    if (file && file.size > this.maxFileSize) {
      this.uploadError = `File is too large. Maximum size is ${this.formatFileSize(this.maxFileSize)}`;
      return;
    }
    
    // Validate file type
    if (file && !file.type.startsWith('image/')) {
      this.uploadError = 'Only image files are allowed';
      return;
    }
    
    this.selectedFile = file;
    this.previousBlobUrl = this.imageUrl;
    this.imageUrl = file ? URL.createObjectURL(file) : null;

    this.unsavedChanges = true;

    //Force update the view
    this.cdRef.detectChanges();
  }
  
  removeSelectedFile(): void {
    this.selectedFile = null;
    this.unsavedChanges = true;
  }
  
  // Draft handling methods
  saveDraftToLocalStorage(): void {
    const draft = {
      title: this.title,
      content: this.content,
      lastSaved: new Date().toISOString()
    };
    
    const draftString = JSON.stringify(draft);
    if (draftString !== this.lastSavedDraft) {
      localStorage.setItem(this.draftKey, draftString);
      this.lastSavedDraft = draftString;
      console.log('Draft saved to local storage', new Date());
    }
  }
  
  loadDraft(): void {
    const savedDraft = localStorage.getItem(this.draftKey);
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        this.title = draft.title || '';
        this.content = draft.content || '';
        this.lastSavedDraft = savedDraft;
        
      } catch (error) {
        console.error('Error loading draft', error);
      }
    }
  }
  
  saveDraft(): void {
    this.isSaving = true;
    this.saveDraftToLocalStorage();
    
    // Simulate a delay to show saving state
    setTimeout(() => {
      this.isSaving = false;
      this.unsavedChanges = false;
    }, 500);
  }
  
  clearDraft(): void {
    localStorage.removeItem(this.draftKey);
    this.title = '';
    this.content = '';
    this.selectedFile = null;
    this.lastSavedDraft = '';
    this.unsavedChanges = false;
  }
  
  publishBlog(): void { 
    
    this.isPublishing = true;
    const formData = new FormData();
    formData.append('title', this.title.trim());
    formData.append('content', this.content.trim());

    console.log("form data", formData);

    const authToken = sessionStorage.getItem('token');

    console.log('token', authToken);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    
    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }
    
    const sub = this.http.post<any>('http://localhost:5000/blogs', formData, {
      headers: headers,
      withCredentials: true,
    })
    .pipe(
      catchError(error => this.handleError(error)),
      finalize(() => {
        this.isPublishing = false;
        this.cdRef.detectChanges();
      })
    )
    .subscribe({
      next: (response: any) => {
        console.log('Blog post created successfully', response);

        this.clearDraft();
        
        this.router.navigate(['/']);
      },

        error: (error) => {
          console.error('Publishing failed:', error);
          this.uploadError = 'Failed to publish blog. Please try again.';
          this.cdRef.detectChanges();
      }
      
  });
    
    this.subscriptions.push(sub);
  }
  
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 0) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      } else if (error.status === 413) {
        errorMessage = 'The uploaded file is too large.';
      } else if (error.status === 401) {
        errorMessage = 'You need to be logged in to publish a blog post.';
      } else if (error.status === 403) {
        errorMessage = 'You do not have permission to publish a blog post.';
      } else if (error.status === 422) {
        errorMessage = 'The form contains invalid data. Please check your inputs.';
      } else {
        errorMessage = `Server returned code ${error.status}, message: ${error.message}`;
      }
    }
    
    this.uploadError = errorMessage;
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
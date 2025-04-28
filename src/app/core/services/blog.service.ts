import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BlogPost } from 'src/app/models/blog-post.model';


@Injectable({
  providedIn: 'root',
})

export class BlogService {
  private baseUrl = 'http://localhost:5000/blogs';
  private likeUrl = 'http://localhost:5000/likes';
  private bookmarkUrl = 'http://localhost:5000/bookmarks'

  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  constructor(private http: HttpClient) {}

  getBlogPosts(): Observable<BlogPost[]> {
    return this.http.get<BlogPost[]>(this.baseUrl);
  }

  getBlogPostById(id: string): Observable<BlogPost> {
    return this.http.get<BlogPost>(`${this.baseUrl}/${id}`);
  }

  searchBlogPosts(searchTerm: string): Observable<BlogPost[]> {
    return this.http.get<BlogPost[]>(`${this.baseUrl}/`, {
      params: { q: searchTerm },
    });
  }

  checkUserLiked(blogPostId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.likeUrl}/${blogPostId}/likes/check`, { headers: this.getAuthHeaders() });
  }
  
  likePost(blogPostId: string): Observable<void> {
    return this.http.post<void>(`${this.likeUrl}/${blogPostId}/likes`, {}, { headers: this.getAuthHeaders() });
  }
  
  unlikePost(blogPostId: string): Observable<void> {
    return this.http.delete<void>(`${this.likeUrl}/${blogPostId}/likes`, { headers: this.getAuthHeaders() });
  }
  
  checkUserBookmarked(blogPostId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.bookmarkUrl}/${blogPostId}/bookmarks/check`, { headers: this.getAuthHeaders() });
  }
  
  addBookmark(blogPostId: string): Observable<void> {
    return this.http.post<void>(`${this.bookmarkUrl}/${blogPostId}/bookmarks`, { blogPostId }, { headers: this.getAuthHeaders() });
  }
  
  removeBookmark(blogPostId: string): Observable<void> {
    return this.http.delete<void>(`${this.bookmarkUrl}/${blogPostId}/bookmarks`, { headers: this.getAuthHeaders() });
  }

  addComment(comment: { content: string; blogPostId: string; }): Observable<Comment> {
    return this.http.post<Comment>(`${this.baseUrl}/${comment.blogPostId}/comments`, comment);
  }

  createBlog(blog: BlogPost): Observable<BlogPost> {
    return this.http.post<BlogPost>(this.baseUrl, blog);
  }

}

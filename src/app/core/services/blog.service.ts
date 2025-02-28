import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BlogPost } from 'src/app/models/blog-post.model';


@Injectable({
  providedIn: 'root',
})

export class BlogService {
  private baseUrl = 'http://localhost:5000/blogs';

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

  checkUserLiked(blogPostId: string, userId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/${blogPostId}/likes/check`, {
      params: { userId },
    });
  }

  likePost(blogPostId: string, userId: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${blogPostId}/likes`, { userId });
  }

  unlikePost(blogPostId: string, userId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${blogPostId}/likes`, {
      params: { userId },
    });
  }

  checkUserBookmarked(blogPostId: string, userId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/${blogPostId}/bookmarks/check`, {
      params: { userId },
    });
  }

  addBookmark(blogPostId: string, userId: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${blogPostId}/bookmarks`, { userId });
  }

  removeBookmark(blogPostId: string, userId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${blogPostId}/bookmarks`, {
      params: { userId },
    });
  }

  addComment(comment: { content: string; blogPostId: string; userId: string }): Observable<Comment> {
    return this.http.post<Comment>(`${this.baseUrl}/${comment.blogPostId}/comments`, comment);
  }

}

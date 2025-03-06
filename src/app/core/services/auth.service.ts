import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, catchError, throwError, switchMap } from 'rxjs';
import { Router } from '@angular/router';

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role?: string; // Made optional since it appears in one interface but not the other
  };
}

export interface SignupResponse {
  id: string;
  name: string;
  email: string;
}

export interface AuthModalState {
  isOpen: boolean;
  mode: 'login' | 'signup' | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/auth';
  
  // BehaviorSubjects to track authentication state and modal state
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.checkInitialLoginState());
  private authModalStateSubject = new BehaviorSubject<AuthModalState>({ isOpen: false, mode: null });
  private currentUserSubject = new BehaviorSubject<any>(this.getCurrentUserFromStorage());
  
  // Public observables that components can subscribe to
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();
  public authModalState$ = this.authModalStateSubject.asObservable();
  public currentUser$ = this.currentUserSubject.asObservable();
  
  constructor(
    private http: HttpClient,
    private router: Router
  ) {}
  
  // Check if user is already logged in when service initializes
  private checkInitialLoginState(): boolean {
    return !!sessionStorage.getItem('token');
  }
  
  // Retrieve stored user data
  private getCurrentUserFromStorage(): any {
    const userJson = sessionStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
  }
  
  // Modal control methods
  public openAuthModal(mode: 'login' | 'signup'): void {
    this.authModalStateSubject.next({ isOpen: true, mode });
  }
  
  public closeAuthModal(): void {
    this.authModalStateSubject.next({ isOpen: false, mode: null });
  }
  
  public getAuthModalState(): AuthModalState {
    return this.authModalStateSubject.getValue();
  }
  
  // Authentication methods
  public login(credentials: { email: string, password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          this.handleAuthSuccess(response);
        }),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }
  
  public signup(userData: { name: string, email: string, password: string }): Observable<LoginResponse> {
    // First sign up the user
    return this.http.post<SignupResponse>(`${this.apiUrl}/signup`, userData)
      .pipe(
        // After successful signup, automatically log in
        switchMap(() => {
          // Use the credentials just provided for signup
          const loginCredentials = {
            email: userData.email,
            password: userData.password
          };
          
          // Call login endpoint
          return this.login(loginCredentials);
        }),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }
  
  private handleAuthSuccess(response: LoginResponse): void {
    // Store token and user info
    sessionStorage.setItem('token', response.token);
    sessionStorage.setItem('currentUser', JSON.stringify(response.user));
    
    // Update subjects
    this.isLoggedInSubject.next(true);
    this.currentUserSubject.next(response.user);
    
    // Close modal and navigate to home page
    this.closeAuthModal();
    this.router.navigate(['/']);
  }
  
  public logout(): void {
    // Clear storage
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('currentUser');
    
    // Update subjects
    this.isLoggedInSubject.next(false);
    this.currentUserSubject.next(null);
    
    // Navigate to home
    this.router.navigate(['']);
  }
  
  public isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }
  
  public getToken(): string | null {
    return sessionStorage.getItem('token');
  }
  
  public getCurrentUser(): any {
    return this.currentUserSubject.value;
  }
}
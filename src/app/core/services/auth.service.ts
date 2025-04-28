import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, catchError, throwError, switchMap } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
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
  private readonly STORAGE_TOKEN_KEY = 'token';
  private readonly STORAGE_USER_KEY = 'currentUser';
  
  // BehaviorSubjects to track authentication state and modal state
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  private authModalStateSubject = new BehaviorSubject<AuthModalState>({ isOpen: false, mode: null });
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  
  // Public observables that components can subscribe to
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();
  public authModalState$ = this.authModalStateSubject.asObservable();
  public currentUser$ = this.currentUserSubject.asObservable();
  
  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Refresh the authentication state when the service initializes
    this.refreshAuthState();
  }
  
  // Check if user has a valid token
  private hasValidToken(): boolean {
    const token = sessionStorage.getItem(this.STORAGE_TOKEN_KEY);
    if (!token) return false;
    
    // Basic token expiry check
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch (e) {
      return false;
    }
  }
  
  private getUserFromStorage(): User | null {
    const userJson = sessionStorage.getItem(this.STORAGE_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }
  
  // Refresh authentication state (useful for app initialization or after storage changes)
  private refreshAuthState(): void {
    const isLoggedIn = this.hasValidToken();
    this.isLoggedInSubject.next(isLoggedIn);
    
    if (isLoggedIn) {
      this.currentUserSubject.next(this.getUserFromStorage());
    } else {
      // Clear any invalid state
      sessionStorage.removeItem(this.STORAGE_TOKEN_KEY);
      sessionStorage.removeItem(this.STORAGE_USER_KEY);
      this.currentUserSubject.next(null);
    }
  }
  
  // Modal control methods
  public openAuthModal(mode: 'login' | 'signup'): void {
    this.authModalStateSubject.next({ isOpen: true, mode });
  }
  
  public closeAuthModal(): void {
    this.authModalStateSubject.next({ isOpen: false, mode: null });
  }
  
  // Authentication methods
  public login(credentials: { email: string, password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => this.handleAuthSuccess(response)),
        catchError(error => throwError(() => error))
      );
  }
  
  public signup(userData: { name: string, email: string, password: string }): Observable<LoginResponse> {
    return this.http.post<SignupResponse>(`${this.apiUrl}/signup`, userData)
      .pipe(
        switchMap(() => this.login({
          email: userData.email,
          password: userData.password
        })),
        catchError(error => throwError(() => error))
      );
  }
  
  private handleAuthSuccess(response: LoginResponse): void {

    sessionStorage.setItem(this.STORAGE_TOKEN_KEY, response.token);
    sessionStorage.setItem(this.STORAGE_USER_KEY, JSON.stringify(response.user));
    
    // Update subjects
    this.isLoggedInSubject.next(true);
    this.currentUserSubject.next(response.user);
    
    this.closeAuthModal();
    this.router.navigate(['/']);
  }
  
  public logout(): void {

    sessionStorage.removeItem(this.STORAGE_TOKEN_KEY);
    sessionStorage.removeItem(this.STORAGE_USER_KEY);
    
    // Update subjects
    this.isLoggedInSubject.next(false);
    this.currentUserSubject.next(null);
    
    this.router.navigate(['/']);
  }
  
  // Utility methods
  public isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }
  
  public getToken(): string | null {
    return sessionStorage.getItem(this.STORAGE_TOKEN_KEY);
  }
  
  public getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
  
  public getUserId(): string | null {
    const user = this.getCurrentUser();
    return user ? user.id : null;
  }
}
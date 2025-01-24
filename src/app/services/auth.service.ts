import { HttpClient } from '@angular/common/http'; 
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';

  constructor(private http: HttpClient) { }

  login(credentials: { email: string, password: string }) {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  signup(data: { name: string, email: string, password: string }) {
    return this.http.post(`${this.apiUrl}/signup`, data);
  }
}

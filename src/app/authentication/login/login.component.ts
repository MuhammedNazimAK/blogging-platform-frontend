import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, LoginResponse } from 'src/app/core/services/auth.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  credentials = { email: '', password: '' };
  isLoading = false;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private NotificationService: NotificationService
  ) {}

  login() {
    this.isLoading = true;
    this.authService.login(this.credentials).subscribe({
      next: (response: LoginResponse) => {
        sessionStorage.setItem('token', response.token);
        this.router.navigate(['/home']);
      },
      error: (error) => {

        this.NotificationService.showError(
          error.error.message || 'Login failed. Please try again.', 
        ); 
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}

import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthModalService } from 'src/app/core/services/auth-modal.service';
import { AuthService, LoginResponse } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @Output() switchToSignup = new EventEmitter<void>();
  
  credentials = { email: '', password: '' };
  isLoading = false;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private authModalService: AuthModalService
  ) {}

  login() {
    this.isLoading = true;
    this.authService.login(this.credentials).subscribe({
      next: (response: LoginResponse) => {
        sessionStorage.setItem('token', response.token);

        this.authModalService.closeModal();

        this.router.navigate(['/blogs']);
      },
      error: (error) => {
        console.error(error.error.message || 'Login failed. Please try again.');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  emitSwitchToSignup(): void {
    this.switchToSignup.emit();
  }
}
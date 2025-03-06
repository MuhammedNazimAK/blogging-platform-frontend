import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { AuthModalService } from 'src/app/core/services/auth-modal.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  @Output() switchToLogin = new EventEmitter<void>();
  
  user = { name: '', email: '', password: '' };
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private authModalService: AuthModalService
  ) {}

  signup() {
    this.isLoading = true;
    this.authService.signup(this.user).subscribe({
      next: (response) => {
        // After successful signup, immediately log the user in
        this.loginAfterSignup();
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Signup failed: ' + error.error.message);
      }
    });
  }

  loginAfterSignup() {
    // Use the credentials from the signup form to automatically log in
    const credentials = {
      email: this.user.email,
      password: this.user.password
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        // Store token
        sessionStorage.setItem('token', response.token);
        
        this.authModalService.closeModal();
        
        this.router.navigate(['/blogs']);
        
        this.isLoading = false;
      },
      error: (error) => {
        // If auto-login fails, switch to login modal as fallback
        this.isLoading = false;
        this.emitSwitchToLogin();
        console.error('Auto-login failed: ' + error.error.message);
      }
    });
  }

  emitSwitchToLogin(): void {
    this.switchToLogin.emit();
  }
}
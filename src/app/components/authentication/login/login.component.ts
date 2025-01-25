import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  email!: '';
  password!: '';

  constructor (private authService: AuthService) {}

  login() {
    
    this.authService.login({ email: this.email, password: this.password}).subscribe({
      next: (response) => console.log('Login successfull:', response),
      error: (err) => console.log('Login error', err),
    });
  }
}

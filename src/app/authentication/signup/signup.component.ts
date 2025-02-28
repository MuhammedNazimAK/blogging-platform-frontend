import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent {
  user = { name: '', email: '', password: '' };

  constructor(private authService: AuthService) {}

  signup() {
    this.authService.signup(this.user).subscribe(
      (response) => {
        alert('Signup successful!');
      },
      (error) => {
        alert('Signup failed: ' + error.error.message);
      }
    );
  }
}

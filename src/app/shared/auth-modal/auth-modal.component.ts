import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.css'],
})

export class AuthModalComponent implements OnInit {
  authForm: FormGroup;
  isSubmitting = false;

  constructor(public authService: AuthService, private fb: FormBuilder) {
    this.authForm = this.fb.group({
      name: ['', []],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.authService.authModalState$.subscribe((state) => {
      if (state.mode === 'signup') {
        this.authForm.get('name')?.setValidators([Validators.required]);
      } else {
        this.authForm.get('name')?.clearValidators();
      }
      this.authForm.get('name')?.updateValueAndValidity();
      this.authForm.reset();
    });
  }

  switchMode(mode: 'login' | 'signup'): void {
    this.authService.openAuthModal(mode);
  }

  submitForm(): void {
    if (this.authForm.invalid) return;

    this.isSubmitting = true;
    const formData = this.authForm.value;

    const authState = this.authService.getAuthModalState();

    if (authState.mode === 'login') {
      this.authService.login(formData).subscribe(
        () => {
          this.isSubmitting = false;
        },
        (error) => {
          this.isSubmitting = false;
          // Handle error
        }
      );
    } else {
      this.authService.signup(formData).subscribe(
        () => {
          this.isSubmitting = false;
        },
        (error) => {
          this.isSubmitting = false;
          // Handle error
        }
      );
    }
  }
}

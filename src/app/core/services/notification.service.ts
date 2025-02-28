// src/app/services/notification.service.ts
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar'; 

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  showError(message: string, action = 'Close', duration = 5000): void {
    this.snackBar.open(message, action, { duration, panelClass: ['error-snackbar'] });
  }

  showSuccess(message: string, action = 'Close', duration = 3000): void {
    this.snackBar.open(message, action, { duration, panelClass: ['success-snackbar'] });
  }

  // Add more methods for info, warning, etc. as needed
}

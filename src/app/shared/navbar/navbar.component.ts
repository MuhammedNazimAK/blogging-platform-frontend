// navbar.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isDropdownOpen = false;
  isMobileMenuOpen = false;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    // Initialize any required data
  }

  // Toggle user dropdown menu
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // Close dropdown when clicking outside
  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  // Toggle mobile menu
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  obscureEmail(email: string | undefined): string {
    if (!email) return '';
    
    const parts = email.split('@');
    if (parts.length !== 2) return email;
    
    const username = parts[0];
    const domain = parts[1];
    
    // Calculate how many characters to show (roughly half)
    const visibleLength = Math.ceil(username.length / 2);
    
    // Create the obscured username
    const visiblePart = username.substring(0, visibleLength);
    const hiddenPart = '*'.repeat(username.length - visibleLength);
    
    return `${visiblePart}${hiddenPart}@${domain}`;
  }

  openLoginModal(): void {
    this.authService.openAuthModal('login');
  }

  logout(): void {
    this.authService.logout();
    this.closeDropdown();
  }
}
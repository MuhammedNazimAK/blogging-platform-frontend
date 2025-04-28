import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap, tap, catchError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isDropdownOpen = false;
  isMobileMenuOpen = false;

  searchControl = new FormControl('');
  searchResults: any[] = [];
  isLoadingSearch = false;

  constructor(
    public authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(

      debounceTime(300),
      distinctUntilChanged(), // only fire if value changed
      tap(() => this.isLoadingSearch = true),
      switchMap(query => {

        if (!query?.trim()) {
          // if empty, reset results
          this.searchResults = [];
          this.isLoadingSearch = false;
          return of([]);
        }

        return this.http.get<any[]>(`http://localhost:5000/search?q=${query}`).pipe(
          catchError(() => {
            this.isLoadingSearch = false;
            return of([]);
          })
        );
      }),

      tap(() => this.isLoadingSearch = false)
    ).subscribe(results => {
      this.searchResults = results;
    });
  }


  // Toggle user dropdown menu
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

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

  goToBlog(blogId: string) {
    this.router.navigate(['/blogs', blogId]);
    this.searchResults = [];
    this.searchControl.setValue('');
  }

  logout(): void {
    this.authService.logout();
    this.closeDropdown();
  }
}
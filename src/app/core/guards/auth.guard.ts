import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})

export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const requiresAuth = next.data?.['requiresAuth'] === true;
    const redirectPath = next.data?.['authGuardRedirect'];
    const isLoggedIn = this.authService.isLoggedIn();

    // Case 1: Route requires auth and user is logged in -> Allow
    if (requiresAuth && isLoggedIn) {
      return true;
    }

    // Case 2: Route requires auth but user is not logged in
    // Don't redirect, just return false to stay on current page and show login modal
    if (requiresAuth && !isLoggedIn) {
      return this.router.createUrlTree(['']);
    }

    // Case 3: Home route with redirect for logged-in users (like the landing page)
    if (!requiresAuth && isLoggedIn && redirectPath) {
      return this.router.createUrlTree([redirectPath]);
    }

    // Case 4: Public route and user is not logged in -> Allow
    return true;
  }
}
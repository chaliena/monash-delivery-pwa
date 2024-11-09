import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';  // Import your AuthService

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthenticationService, private router: Router) {}

  canActivate(): boolean {
    if (!this.authService.isAuthenticated()) {
      console.log('User is not authenticated, redirecting to login...');
      this.router.navigate(['/32510799/Chaliena/api/v1/login']);
      return false;
    }
    console.log('User is authenticated, access granted.');
    return true;
  }
}

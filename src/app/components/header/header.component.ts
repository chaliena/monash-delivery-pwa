import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(
    public authService: AuthenticationService, // Inject AuthService to check user status
    private router: Router
  ) { }

  // Method to handle logout
  onLogout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/32510799/Chaliena/api/v1']); // Redirect to login page
    });
  }
}
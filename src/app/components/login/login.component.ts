import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service'; // Use AuthService

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  passwordVisible: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthenticationService // Inject AuthService
  ) { }

  ngOnInit(): void {
    // Initialize the login form
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  // Toggle password visibility
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    passwordInput.type = this.passwordVisible ? 'text' : 'password';
  }

  // Handle form submission
  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      // Use the login method from AuthService
      this.authService.login(username, password).subscribe({
        next: (user) => {
          console.log('Login successful', user);
          // Navigate to the dashboard or another protected route
          this.router.navigate(['/32510799/Chaliena/api/v1']);
        },
        error: (err) => {
          console.error('Login failed', err);
          // Display error message to the user
          alert(err.error.status || 'Login failed');
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service'; // Import AuthService

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthenticationService // Use AuthService instead of DatabaseService
  ) { }

  ngOnInit(): void {
    // Initialize the signup form with validators
    this.signupForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]{6,}$')]], // At least 6 alphanumeric characters
      password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(10)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(10)]]
    }, { validator: this.passwordsMatchValidator });
  }

  // Custom validator to check if password and confirmPassword match
  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  // Submit the signup form
  onSubmit(): void {
    if (this.signupForm.valid) {
      const { username, password, confirmPassword } = this.signupForm.value;

      // Call the signup method from AuthService
      this.authService.signup(username, password, confirmPassword).subscribe({
        next: (response: any) => {
          console.log('Signup successful', response);
          // Redirect to login or another page
          this.router.navigate(['/32510799/Chaliena/api/v1/login']); // Redirect to login page
        },
        error: (err) => {
          console.error('Signup failed', err);
          alert(err.error.status || 'Signup failed');
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }
}

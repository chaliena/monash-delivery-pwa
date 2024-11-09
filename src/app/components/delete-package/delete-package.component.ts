import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DatabaseService } from '../../services/database.service';
import { Package } from '../../models/package'; // Assuming you have a Package model

@Component({
  selector: 'app-delete-package',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './delete-package.component.html',
  styleUrls: ['./delete-package.component.css']
})
export class DeletePackageComponent implements OnInit {
  packages: Package[] = [];
  selectedPackageId: string = '';
  confirmationMessage: boolean = false;
  errorMessage: boolean = false;

  constructor(private db: DatabaseService, private router: Router) {}

  ngOnInit(): void {
    this.fetchPackages();
  }

  fetchPackages(): void {
    this.db.getPackages().subscribe({
      next: (packages) => {
        this.packages = packages;
      },
      error: (error) => {
        console.error('Error fetching packages:', error);
        this.errorMessage = true;
      }
    });
  }

  deletePackage(form: NgForm): void {
    if (form.valid && this.selectedPackageId) {
      this.db.deletePackage(this.selectedPackageId).subscribe({
        next: () => {
          this.confirmationMessage = true;
          this.errorMessage = false;
          form.reset(); // Reset the form after successful submission
          this.fadeOutMessage('confirmationMessage'); // Fade out confirmation message
          setTimeout(() => this.router.navigate(['/32510799/Chaliena/api/v1/packages']), 2000); // Redirect to packages list after 2 seconds
        },
        error: (error) => {
          console.error('Error deleting package:', error);
          if (error.status === 400) {
            // Navigate to Invalid Data component if the status code is 400
            this.router.navigate(['32510799/Chaliena/api/v1/invalid-data']);
        }
          this.errorMessage = true;
          this.confirmationMessage = false; // Hide confirmation message on error
          this.fadeOutMessage('errorMessage'); // Fade out error message
        }
      });
    }
  }

  private fadeOutMessage(messageType: 'confirmationMessage' | 'errorMessage'): void {
    setTimeout(() => {
      if (messageType === 'confirmationMessage') {
        this.confirmationMessage = false;
      } else {
        this.errorMessage = false;
      }
    }, 3000); // Fade out after 3 seconds
  }
}

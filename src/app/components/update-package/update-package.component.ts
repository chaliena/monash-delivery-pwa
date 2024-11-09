import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DatabaseService } from '../../services/database.service';
import { Router } from '@angular/router';
import { Package } from '../../models/package'; // Import the Package model

@Component({
  selector: 'app-update-package',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './update-package.component.html',
  styleUrls: ['./update-package.component.css']
})
export class UpdatePackageComponent implements OnInit {
  package: Package = new Package(); // Initialize package object
  packageOptions: Package[] = []; // Array to hold package options

  constructor(private db: DatabaseService, private router: Router) { }

  ngOnInit(): void {
    this.fetchPackages(); // Fetch all packages on component initialization
  }

  fetchPackages() {
    // Fetch all packages from the database
    this.db.getPackages().subscribe({
      next: (packagesData) => {
        this.packageOptions = packagesData; // Set package options for the dropdown
      },
      error: (error) => {
        console.error('Error fetching packages:', error);
      }
    });
  }

  onPackageSelect(event: Event) {
    const selectedPackageId = (event.target as HTMLSelectElement).value;
    const selectedPackage = this.packageOptions.find(pkg => pkg.id === selectedPackageId);
    if (selectedPackage) {
      this.package = { ...selectedPackage }; // Populate the package details based on selection
    }
  }

  updatePackage(packageForm: NgForm) {
    console.log('Update Package button clicked'); // Log when button is clicked
    if (packageForm.valid) {
        const updatedPackage = {
            package_id: this.package.id, // Ensure this is the correct property for the package ID
            package_destination: this.package.destination
        };
        console.log('Updated package data:', updatedPackage); // Log the updated package data
        this.db.updatePackage(updatedPackage).subscribe({
            next: (response) => {
                console.log('Package updated:', response);
                packageForm.reset(); // Reset the form after successful submission
                this.router.navigate(['32510799/Chaliena/api/v1/packages']); // Redirect to package list
            },
            error: (error) => {
                console.error('Error updating package:', error);
                if (error.status === 400) {
                  // Navigate to Invalid Data component if the status code is 400
                  this.router.navigate(['32510799/Chaliena/api/v1/invalid-data']);
              }
            },
            complete: () => {
                console.log('Package update complete');
            }
        });
    } else {
        console.warn('Form is not valid');
    }
}

}

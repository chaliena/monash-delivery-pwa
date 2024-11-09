import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Driver } from '../../models/driver';
import { DatabaseService } from '../../services/database.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-add-package',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-package.component.html',
  styleUrls: ['./add-package.component.css']
})
export class AddPackageComponent implements OnInit {
  // Package model (you may need to create this model)
  package: any = {}; // Update with your package structure
  driverOptions: Driver[] = []; // Array to hold driver options

  constructor(private db: DatabaseService, private router: Router) { }

  ngOnInit(): void {
    this.fetchDrivers();
  }

  fetchDrivers() {
    this.db.getDrivers().subscribe({
      next: (drivers) => {
        this.driverOptions = drivers;
      },
      error: (error) => {
        console.error('Error fetching drivers:', error);
      }
    });
  }

  addPackage(packageForm: NgForm) {
    
    if (packageForm.valid) {
      this.db.createPackage(this.package).subscribe({
        next: (response) => {
          console.log('Package added:', response);
          packageForm.reset(); // Reset the form after successful submission
          this.router.navigate(['/32510799/Chaliena/api/v1/packages']); // Adjust to redirect after adding package
        },
        error: (error) => {
          console.error('Error adding package:', error);
          if (error.status === 400) {
            // Navigate to Invalid Data component if the status code is 400
            this.router.navigate(['32510799/Chaliena/api/v1/invalid-data']);
        }
        },
        complete: () => {
          console.log('Package addition complete');
        }
      });
    } else {
      console.warn('Form is not valid');
    }
  }
}

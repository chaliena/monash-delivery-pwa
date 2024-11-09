import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Driver } from '../../models/driver'; // Import the Driver model
import { CommonModule } from '@angular/common';
import { DatabaseService } from '../../services/database.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-driver',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './update-driver.component.html',
  styleUrls: ['./update-driver.component.css']
})
export class UpdateDriverComponent implements OnInit {
  driver: Driver = new Driver(); // Initialize driver object
  driverOptions: Driver[] = []; // Array to hold driver options

  constructor(private db: DatabaseService, private router: Router) { }

  ngOnInit(): void {
    this.fetchDrivers(); // Fetch all drivers on component initialization
  }

  fetchDrivers() {
    // Fetch all drivers from the database
    this.db.getDrivers().subscribe({
      next: (driversData) => {
        this.driverOptions = driversData; // Set driver options for the dropdown
      },
      error: (error) => {
        console.error('Error fetching drivers:', error);
      }
    });
  }

  onDriverSelect(event: Event) {
    const selectedDriverId = (event.target as HTMLSelectElement).value;
    const selectedDriver = this.driverOptions.find(driver => driver.id === selectedDriverId);
    if (selectedDriver) {
      this.driver = { ...selectedDriver }; // Populate the driver details based on selection
    }
  }

  updateDriver(driverForm: NgForm) {
    if (driverForm.valid) {
      // Create an updated driver object that contains the necessary fields
      const updatedDriver = {
        id: this.driver.id,
        driver_licence: this.driver.licenceNumber,
        driver_department: this.driver.department,
        isActive: this.driver.isActive // Include the active status if needed
      };

      this.db.updateDriver(updatedDriver).subscribe({
        next: (response) => {
          console.log('Driver updated:', response);
          driverForm.reset(); // Reset the form after successful submission
          this.router.navigate(['32510799/Chaliena/api/v1/drivers']); // Redirect to driver list
        },
        error: (error) => {
          console.error('Error updating driver:', error);
          if (error.status === 400) {
            // Navigate to Invalid Data component if the status code is 400
            this.router.navigate(['32510799/Chaliena/api/v1/invalid-data']);
        }
        },
        complete: () => {
          console.log('Driver update complete');
        }
      });
    } else {
      console.warn('Form is not valid');
    }
  }
}

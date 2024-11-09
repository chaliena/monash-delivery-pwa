import { Component, OnInit, Inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import { Driver } from '../../models/driver';
import { DatabaseService } from '../../services/database.service';
import { CommonModule } from '@angular/common';
import { UpdateDriver } from '../../models/update-driver';
import { DepartmentNamePipe } from '../../pipes/department-name.pipe';
import { isPlatformBrowser } from '@angular/common'; // Import the function to check platform
import $ from 'jquery'; // Ensure proper import of jQuery
import { UppercasePipe } from '../../pipes/uppercase.pipe'; // Adjust the path as necessary
import { KgToGPipe } from '../../pipes/kg-to-g.pipe'; // Adjust the path as necessary

declare global {
  interface JQuery {
    modal(action?: string): JQuery; // Add modal method
  }
}

@Component({
  selector: 'app-list-drivers',
  standalone: true,
  imports: [CommonModule, DepartmentNamePipe, UppercasePipe, KgToGPipe],
  templateUrl: './list-drivers.component.html',
  styleUrls: ['./list-drivers.component.css']
})
export class ListDriversComponent implements OnInit {
  drivers: Driver[] = [];
  selectedDriver: Driver | null = null;
  driverPackages: any[] = [];  // Holds the list of packages for the selected driver
  driverToDeleteId: string | null = null;
  isBrowser: boolean;

  constructor(
    private db: DatabaseService, 
    @Inject(PLATFORM_ID) private platformId: any, 
    private renderer: Renderer2
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    this.fetchDrivers();
  }

  // Fetch all drivers
  fetchDrivers() {
    console.log("Fetching drivers from angular..");
    this.db.getDrivers().subscribe({
      next: (data: Driver[]) => {
        this.drivers = data;
      },
      error: (err) => {
        console.error('Error fetching drivers:', err);
      }
    });
  }

  // Toggle the selected driver and fetch their packages
  togglePackages(driver: Driver) {
    if (this.selectedDriver === driver) {
      this.selectedDriver = null; // Collapse the table if the same driver is selected
      this.driverPackages = [];   // Clear packages
    } else {
      this.selectedDriver = driver; // Set the new selected driver
      this.fetchDriverPackages(driver._id); // Fetch packages for the selected driver
    }
  }

  // Fetch the packages for the selected driver
  fetchDriverPackages(driverId: string) {
    // Use the getAllPackages method to get all packages and filter by driverId
    this.db.getPackages().subscribe({
      next: (packages: any[]) => {
        // Filter the packages to only include those assigned to the selected driver
        this.driverPackages = packages.filter(pkg => pkg.driverId === driverId);

        // If no packages are found, show an empty array
        if (this.driverPackages.length === 0) {
          console.log('No packages found for the selected driver.');
        }
      },
      error: (err) => {
        console.error('Error fetching packages:', err);
        this.driverPackages = []; // Clear packages on error
      }
    });
  }

}

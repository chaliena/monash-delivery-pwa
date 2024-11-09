import { Component, OnInit, Inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import { Package } from '../../models/package';
import { Driver } from '../../models/driver';
import { DatabaseService } from '../../services/database.service';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import $ from 'jquery';
import { KgToGPipe } from '../../pipes/kg-to-g.pipe';

declare global {
  interface JQuery {
    modal(action?: string): JQuery;
  }
}

@Component({
  selector: 'app-list-packages',
  standalone: true,
  imports: [CommonModule, KgToGPipe],
  templateUrl: './list-packages.component.html',
  styleUrls: ['./list-packages.component.css']
})
export class ListPackagesComponent implements OnInit {
  packages: Package[] = [];
  drivers: Driver[] = [];
  selectedPackage: Package | null = null;
  selectedDriver: Driver | null = null;
  packageToDeleteId: string | null = null;
  isBrowser: boolean;

  constructor(private db: DatabaseService, @Inject(PLATFORM_ID) private platformId: any, private renderer: Renderer2) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    this.fetchPackages();
    this.fetchDrivers();
  }

  fetchPackages() {
    this.db.getPackages().subscribe({
      next: (data: Package[]) => {
        this.packages = data;
      },
      error: (err) => {
        console.error('Error fetching packages:', err);
      }
    });
  }

  fetchDrivers() {
    this.db.getDrivers().subscribe({
      next: (data: Driver[]) => {
        this.drivers = data;
      },
      error: (err) => {
        console.error('Error fetching drivers:', err);
      }
    });
  }

  showDriverDetails(packageItem: Package) {
    if (this.selectedPackage === packageItem) {
      this.selectedPackage = null;
      this.selectedDriver = null;
    } else {
      this.selectedPackage = packageItem;
      this.findDriverForPackage(packageItem.driverId);
    }
  }

  findDriverForPackage(driverId: string) {
    this.selectedDriver = this.drivers.find(driver => driver._id === driverId) || null;
    if (!this.selectedDriver) {
      console.error('Driver not found for ID:', driverId);
    }
  }
}
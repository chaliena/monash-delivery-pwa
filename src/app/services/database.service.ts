import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Driver } from '../models/driver'; // Ensure this path is correct
import { CommonModule } from '@angular/common';
import { UpdateDriver } from '../models/update-driver';
import { UpdatePackage } from '../models/update-package';
import { Package } from '../models/package';

const API_URL = 'http://localhost:8080/32510799/Chaliena/api/v1';

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
  withCredentials: true // Add withCredentials to ensure cookies are sent
};

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private apiUrl = 'http://localhost:8080/32510799/Chaliena/api/v1/drivers/add';

  constructor(private http: HttpClient) { }

  // Create a new driver
  createDriver(driver: Driver): Observable<any> {
    return this.http.post(this.apiUrl, {
      driver_name: driver.name,          // Ensure keys match API expectations
      driver_department: driver.department,
      driver_licence: driver.licenceNumber,
      driver_isActive: driver.isActive ? 'on' : 'off' // Convert boolean to string if needed
    }, { withCredentials: true }); // Include withCredentials
  }

  getStatistics(): Observable<any> {
    return this.http.get<any>(`${API_URL}/stats`, { withCredentials: true }); // Include withCredentials
  }

  // Get all drivers
  getDrivers(): Observable<Driver[]> {
    console.log("Its getting the drivers.");
    return this.http.get<Driver[]>(`${API_URL}/drivers/`, { withCredentials: true }); // Include withCredentials
  }

  // Delete a driver by ID
  deleteDriver(id: string): Observable<void> {
    return this.http.delete<void>(`${API_URL}/drivers/delete/${id}`, { ...httpOptions, withCredentials: true }); // Include withCredentials
  }

  // Update a driver's information
  updateDriver(updatedDriver: UpdateDriver): Observable<any> {
    return this.http.put(`${API_URL}/drivers/update`, updatedDriver, { withCredentials: true }); // Include withCredentials
  }

  // Get the total count of drivers
  getDriverCount(): Observable<number> {
    return this.http.get<number>(`${API_URL}/drivers/count`, { withCredentials: true }); // Include withCredentials
  }

  // Create a new package
  createPackage(packagee: any): Observable<any> {
    return this.http.post<any>(`${API_URL}/packages/add`, {
      title: packagee.title,                // Ensure keys match API expectations
      weight: packagee.weight,
      destination: packagee.destination,
      description: packagee.description,
      isAllocated: packagee.isAllocated ? 'on' : 'off', // Convert boolean to string if needed
      driverId: packagee.driverId           // Ensure the driver ID matches your API
    }, { withCredentials: true }); // Include withCredentials
  }

  // Get all packages
  getPackages(): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/packages`, { withCredentials: true }); // Include withCredentials
  }

  // Delete a package by ID
  deletePackage(id: string): Observable<void> {
    return this.http.delete<void>(`${API_URL}/packages/delete/${id}`, { ...httpOptions, withCredentials: true }); // Include withCredentials
  }

  // Update package information
  updatePackage(updatedPackage: UpdatePackage): Observable<any> {
    return this.http.put(`${API_URL}/packages/update`, updatedPackage, { withCredentials: true }); // Include withCredentials
  }

  // Get the total count of packages
  getPackageCount(): Observable<number> {
    return this.http.get<number>(`${API_URL}/packages/count`, { withCredentials: true }); // Include withCredentials
  }
}

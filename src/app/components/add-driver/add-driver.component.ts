import { FormsModule, NgForm } from '@angular/forms';

import { Component } from '@angular/core';
import { Driver } from '../../models/driver';
import { DatabaseService } from '../../services/database.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-driver',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-driver.component.html',
  styleUrls: ['./add-driver.component.css']
})
export class AddDriverComponent {
  driver: Driver = new Driver()
  constructor(private db: DatabaseService, private router: Router) { }

  addDriver(driverForm: NgForm) {
    if (driverForm.valid) {
        this.db.createDriver(this.driver).subscribe({
            next: (response) => {
                console.log('Driver added:', response);
                driverForm.reset(); // Reset the form after successful submission
                this.router.navigate(['32510799/Chaliena/api/v1/drivers']); // Redirect to the desired page (e.g., driver list)
            },
            error: (error) => {
                console.error('Error adding driver:', error);
                if (error.status === 400) {
                  // Navigate to Invalid Data component if the status code is 400
                  this.router.navigate(['32510799/Chaliena/api/v1/invalid-data']);
              }
            },
            complete: () => {
                console.log('Driver addition complete');
            }
        });

        
    } else {
        console.warn('Form is not valid');
    }
}

  
}

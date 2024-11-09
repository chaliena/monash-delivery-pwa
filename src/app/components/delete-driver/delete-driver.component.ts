import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DatabaseService } from '../../services/database.service';
import { Driver } from '../../models/driver'; // Assuming you have a Driver model

@Component({
  selector: 'app-delete-driver',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './delete-driver.component.html',
  styleUrls: ['./delete-driver.component.css']
})
export class DeleteDriverComponent implements OnInit {
  drivers: Driver[] = [];
  selectedDriverId: string = '';
  confirmationMessage: boolean = false;
  errorMessage: boolean = false;

  constructor(private db: DatabaseService, private router: Router) {}

  ngOnInit(): void {
    this.fetchDrivers();
  }

  fetchDrivers(): void {
    this.db.getDrivers().subscribe({
      next: (drivers) => {
        this.drivers = drivers;
      },
      error: (error) => {
        console.error('Error fetching drivers:', error);
        this.errorMessage = true;
      }
    });
  }

  deleteDriver(form: NgForm): void {
    if (form.valid && this.selectedDriverId) {
      this.db.deleteDriver(this.selectedDriverId).subscribe({
        next: () => {
          this.confirmationMessage = true;
          this.errorMessage = false;
          form.reset(); // Reset the form after successful submission
          this.fadeOutMessage('confirmationMessage'); // Fade out confirmation message
          setTimeout(() => this.router.navigate(['/32510799/Chaliena/api/v1/drivers']), 2000); // Redirect to drivers list after 2 seconds
        },
        error: (error) => {
          console.error('Error deleting driver:', error);
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

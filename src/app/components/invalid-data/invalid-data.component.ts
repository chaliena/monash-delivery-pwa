import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-invalid-data',
  templateUrl: './invalid-data.component.html',
  imports: [CommonModule],
  styleUrls: ['./invalid-data.component.css']
})

export class InvalidDataComponent {
  goBack(): void {
    window.history.back();
  }
}
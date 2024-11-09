import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'] // Corrected from styleUrl to styleUrls
})
export class StatisticsComponent implements OnInit {
  statistics: any = {};

  constructor(private db: DatabaseService) {}

  ngOnInit(): void {
    this.fetchStatistics();
  }

  fetchStatistics(): void {
    this.db.getStatistics().subscribe({
      next: (data) => {
        this.statistics = data;
        console.log('Statistics:', this.statistics); // Log the fetched statistics for debugging
      },
      error: (error) => {
        console.error('Error fetching statistics:', error);
      }
    });
  }
}

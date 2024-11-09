import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';  // Import the standalone component
import { InvalidDataComponent } from './components/invalid-data/invalid-data.component'; // Import InvalidDataComponent
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HomeComponent } from "./components/home/home.component"; 
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from "./components/footer/footer.component";
import { ListDriversComponent } from "./components/list-drivers/list-drivers.component";
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AddDriverComponent } from './components/add-driver/add-driver.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [AddDriverComponent,FormsModule,HttpClientModule, HeaderComponent, FooterComponent, PageNotFoundComponent, InvalidDataComponent, RouterOutlet, CommonModule, HomeComponent, ListDriversComponent] // Add the standalone component to imports
 // Add the standalone component to imports
  // Add the standalone component to imports
})
export class AppComponent implements OnInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    this.setFavicon('favicon.ico'); // Use the correct path
  }

  setFavicon(icon: string) {
    if (isPlatformBrowser(this.platformId)) {
      const link: HTMLLinkElement = document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/x-icon';
      link.href = icon;
      document.head.appendChild(link);
    }
  }
}

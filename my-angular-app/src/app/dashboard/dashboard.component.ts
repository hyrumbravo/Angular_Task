import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common'; // ✅ Import NgIf
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [NgIf], // ✅ Add NgIf to imports
})
export class DashboardComponent implements OnInit {
  user: any = {};  // Store user data fetched from API
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Fetch user data when the component initializes
    this.authService.getUserData().subscribe({
      next: (data) => {
        this.user = data;  // Assign the fetched user data to the 'user' object
      },
      error: (error) => {
        this.errorMessage = 'Failed to fetch user data';  // Show an error message
      },
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

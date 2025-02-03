import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000'; // Your backend URL

  constructor(private http: HttpClient) {}

  // Login method
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  // Get token from local storage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Fetch user data (secured route)
  getUserData(): Observable<any> {
    const token = this.getToken();
    const headers = {
      Authorization: `Bearer ${token}`, // Include token in the Authorization header
    };
    return this.http.get(`${this.apiUrl}/users`, { headers });
  }

  // Save JWT token in local storage
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Logout function to remove token
  logout(): void {
    localStorage.removeItem('token');
  }
}

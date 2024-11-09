import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient) {
    // Check if localStorage is available
    const currentUser = this.isBrowser() ? JSON.parse(localStorage.getItem('currentUser') || '{}') : null;
    this.currentUserSubject = new BehaviorSubject<any>(currentUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  // Utility method to check if we are running in the browser
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    return this.http.post<any>('http://localhost:8080/32510799/Chaliena/api/v1/login', { username, password }, { withCredentials: true })
      .pipe(map(response => {
        if (this.isBrowser()) {
          // Store user details in localStorage after successful login
          console.log('User login successful, storing in localStorage:', response.user);
          localStorage.setItem('currentUser', JSON.stringify(response.user));
        }
        this.currentUserSubject.next(response.user); // Use the user object from the server
        return response;
      }));
  }
  
  

  signup(username: string, password: string, confirmPassword: string): Observable<any> {
    const signupData = { username, password, confirmPassword };
    return this.http.post<any>('http://localhost:8080/32510799/Chaliena/api/v1/signup', signupData)
      .pipe(map(user => {
        return user; // Handle signup response here
      }));
  }

  logout() {
    if (this.isBrowser()) {
      // Remove user from local storage to log them out
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
    return this.http.post('http://localhost:8080/32510799/Chaliena/api/v1/logout', {}, { withCredentials: true });
  }

  isAuthenticated(): boolean {
    const currentUser = this.currentUserValue;  // Get the current user from BehaviorSubject
    console.log('Checking authentication status:', currentUser);
    return !!currentUser && !!currentUser.username;  // Ensure currentUser and username exist
  }
  
}
